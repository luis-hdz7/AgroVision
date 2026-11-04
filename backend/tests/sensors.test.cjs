const assert = require('node:assert/strict');
const { test } = require('node:test');
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
const prisma = require('../src/shared/database/prisma.ts').default;
const { Prisma } = require('../src/generated/prisma/client.ts');
// Usamos la app real para comprobar también el registro /api/sensors.
const app = require('../src/app.ts').default;

test('Sensors: cinco rutas, persistencia, validación y errores', async () => {
  const row = { id: 1, fieldId: 2, type: 'SOIL_MOISTURE', name: 'Sensor norte', status: 'ACTIVE', installedAt: new Date('2026-10-08T00:00:00Z') };
  const input = { ...row, installedAt: row.installedAt.toISOString() }; delete input.id;
  const calls = []; let failure = null; const originals = {};
  const originalFieldFindUnique = prisma.field.findUnique;
  prisma.field.findUnique = async ({where}) => {
    if (failure) throw failure;
    return where.id === 99 ? null : {id:where.id};
  };
  for (const method of ['findMany', 'findUnique', 'create', 'update']) {
    originals[method] = prisma.sensor[method];
    prisma.sensor[method] = async args => {
      calls.push({ method, args });
      if (failure) throw failure;
      if (method === 'findMany') return args.where?.fieldId === 99 ? [] : [row];
      if (method === 'findUnique') return args.where.id === 99 ? null : row;
      if (method === 'update' && args.where.id === 99) throw new Prisma.PrismaClientKnownRequestError('missing', {code:'P2025',clientVersion:'7.10.0'});
      return { ...row, ...args.data };
    };
  }
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {server.once('listening',resolve);server.once('error',reject);});
  const base = `http://127.0.0.1:${server.address().port}/api/sensors`;
  async function request(path='',method='GET',body) {
    const r=await fetch(base+path,{method,headers:{'content-type':'application/json'},...(body!==undefined&&{body:JSON.stringify(body)})});
    return {status:r.status,body:await r.json()};
  }
  try {
    let result=await request(); assert.equal(result.status,200);assert.equal(result.body.data[0].installedAt,input.installedAt);
    assert.deepEqual(calls.at(-1),{method:'findMany',args:{orderBy:{id:'asc'}}});
    result=await request('/1');assert.equal(result.status,200);assert.equal(result.body.data.id,1);
    assert.deepEqual(calls.at(-1),{method:'findUnique',args:{where:{id:1}}});
    result=await request('/field/2');assert.equal(result.status,200);
    assert.deepEqual(calls.at(-1),{method:'findMany',args:{where:{fieldId:2},orderBy:{id:'asc'}}});
    assert.deepEqual((await request('/field/99')).body.data,[]);
    assert.equal((await request('/99')).status,404);
    result=await request('','POST',input);assert.equal(result.status,201);assert.equal(result.body.success,true);
    assert.equal(calls.at(-1).method,'create');assert.ok(calls.at(-1).args.data.installedAt instanceof Date);
    assert.equal((await request('','POST',{...input,fieldId:99})).status,400);
    result=await request('/1','PATCH',{status:'MAINTENANCE'});assert.equal(result.status,200);assert.equal(result.body.data.status,'MAINTENANCE');
    assert.deepEqual(calls.at(-1),{method:'update',args:{where:{id:1},data:{status:'MAINTENANCE'}}});
    for (const patch of [{name:'Nuevo nombre'},{type:'TEMPERATURE'},{status:'INACTIVE'}]) {
      result=await request('/1','PATCH',patch);assert.equal(result.status,200);assert.deepEqual(calls.at(-1).args.data,patch);
    }
    assert.equal((await request('/99','PATCH',{name:'X'})).status,404);
    const before=calls.length;
    for(const path of ['/0','/-1','/1.2','/abc','/2147483648','/field/0','/field/abc']) assert.equal((await request(path)).status,400,path);
    for(const body of [{},{...input,fieldId:true},{...input,fieldId:'2'},{...input,name:' '},{...input,type:''},{...input,status:'BAD'},{...input,installedAt:'invalid'},{...input,extra:1}]) assert.equal((await request('','POST',body)).status,400);
    for(const body of [{},{fieldId:3},{installedAt:input.installedAt},{status:'BAD'},{name:null}]) assert.equal((await request('/1','PATCH',body)).status,400);
    assert.equal(calls.length,before,'No consultar Prisma con entradas inválidas');
    failure=new Prisma.PrismaClientKnownRequestError('foreign key',{code:'P2003',clientVersion:'7.10.0'});
    assert.equal((await request('','POST',input)).status,400);
    failure=new Prisma.PrismaClientKnownRequestError('duplicate',{code:'P2002',clientVersion:'7.10.0'});
    assert.equal((await request('','POST',input)).status,409);
    failure=new Error('private connection details');
    for(const [path,method,body] of [['','GET'],['/1','GET'],['/field/2','GET'],['','POST',input],['/1','PATCH',{name:'X'}]]) {
      result=await request(path,method,body);assert.equal(result.status,500);assert.equal(result.body.success,false);assert.ok(!JSON.stringify(result.body).includes('private connection details'));
    }
  } finally {
    await new Promise(resolve=>server.close(resolve));
    for(const [method,original] of Object.entries(originals)) prisma.sensor[method]=original;
    prisma.field.findUnique=originalFieldFindUnique;
    await prisma.$disconnect();
  }
});
