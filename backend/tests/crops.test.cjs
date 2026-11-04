const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
// Este test sustituye todas las consultas antes de atender peticiones.
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
const prisma = require('../src/shared/database/prisma.ts').default;
const { Prisma } = require('../src/generated/prisma/client.ts');
const router = require('../src/modules/crops/routes/cropRoutes.ts').default;

test('Crops: rutas HTTP, consultas Prisma, validación y errores', async () => {
  const row = { id: 1, fieldId: 2, cropProfileId: 3, cropType: 'ORANGE', name: 'Naranjo', growthStage: 'VEGETATIVE', plantedAt: new Date('2026-10-08T00:00:00Z'), status: 'ACTIVE' };
  const input = { ...row, plantedAt: row.plantedAt.toISOString() };
  delete input.id;
  const calls = [];
  let failure = null;
  const originals = {};
  const originalTransaction = prisma.$transaction;
  for (const method of ['findMany', 'findUnique', 'create', 'update']) {
    originals[method] = prisma.crop[method];
    prisma.crop[method] = async args => {
      calls.push({ method, args });
      if (failure) throw failure;
      if (method === 'findMany') return args.where?.fieldId === 99 ? [] : [row];
      if (method === 'findUnique') return args.where.id === 99 ? null : row;
      if (method === 'update' && args.where.id === 99) throw new Prisma.PrismaClientKnownRequestError('missing', { code: 'P2025', clientVersion: '7.10.0' });
      return { ...row, ...args.data };
    };
  }
  const originalFieldFindUnique = prisma.field.findUnique;
  prisma.field.findUnique = async ({ where }) => {
    if (failure) throw failure;
    return where.id === 98 ? null : { id: where.id };
  };
  const originalProfiles = prisma.cropProfile.findMany;
  const originalProfileFindUnique = prisma.cropProfile.findUnique;
  prisma.cropProfile.findMany = async () => [];
  prisma.cropProfile.findUnique = async ({ where }) => {
    if (failure) throw failure;
    if (where.id === 999) return null;
    return { id: where.id, cropType: where.id === 4 ? 'CORN' : 'ORANGE' };
  };
  prisma.$transaction = async (operation, options) => {
    assert.deepEqual(options, { isolationLevel: 'Serializable' });
    return operation(prisma);
  };
  const app = express();
  app.use(express.json());
  app.use('/api/crops', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api/crops`;
  async function request(path, method = 'GET', body) {
    const response = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, ...(body !== undefined && { body: JSON.stringify(body) }) });
    return { status: response.status, body: await response.json() };
  }
  try {
    let result = await request('/cycles');
    assert.equal(result.status, 200);
    assert.equal(result.body.data[0].plantedAt, row.plantedAt.toISOString());
    assert.deepEqual(calls.at(-1), { method: 'findMany', args: { orderBy: { id: 'asc' } } });
    result = await request('/cycles/1'); assert.equal(result.body.data.id, 1);
    assert.deepEqual(calls.at(-1), { method: 'findUnique', args: { where: { id: 1 } } });
    result = await request('/field/2'); assert.equal(result.status, 200);
    assert.deepEqual(calls.at(-1).args, { where: { fieldId: 2 }, orderBy: { id: 'asc' } });
    result = await request('/field/99'); assert.deepEqual(result.body.data, []);
    assert.equal((await request('/cycles/99')).status, 404);
    result = await request('/cycles', 'POST', input); assert.equal(result.status, 201);
    assert.equal(calls.at(-1).method, 'create');
    assert.ok(calls.at(-1).args.data.plantedAt instanceof Date);
    assert.equal((await request('/cycles', 'POST', { ...input, fieldId: 98 })).status, 400);
    assert.equal((await request('/cycles', 'POST', { ...input, cropProfileId: 999 })).status, 400);
    assert.equal((await request('/cycles', 'POST', { ...input, cropProfileId: 4 })).status, 422);
    result = await request('/cycles/1', 'PATCH', { name: 'Nuevo nombre' });
    assert.equal(result.status, 200); assert.equal(result.body.data.name, 'Nuevo nombre');
    assert.deepEqual(calls.at(-1), { method: 'update', args: { where: { id: 1 }, data: { name: 'Nuevo nombre' } } });
    let updatesBefore = calls.filter(call => call.method === 'update').length;
    assert.equal((await request('/cycles/1', 'PATCH', { cropType: 'CORN' })).status, 422);
    assert.equal((await request('/cycles/1', 'PATCH', { cropProfileId: 4 })).status, 422);
    assert.equal(calls.filter(call => call.method === 'update').length, updatesBefore);
    result = await request('/cycles/1', 'PATCH', { cropType: 'CORN', cropProfileId: 4 });
    assert.equal(result.status, 200);
    assert.equal(result.body.data.cropType, 'CORN');
    await request('/cycles/1', 'PATCH', { plantedAt: input.plantedAt });
    assert.ok(calls.at(-1).args.data.plantedAt instanceof Date);
    assert.equal((await request('/cycles/99', 'PATCH', { status: 'INACTIVE' })).status, 404);
    const before = calls.length;
    for (const path of ['/cycles/0', '/cycles/-1', '/cycles/1.2', '/cycles/2147483648', '/cycles/abc', '/field/abc']) assert.equal((await request(path)).status, 400, path);
    for (const body of [{}, { ...input, fieldId: true }, { ...input, fieldId: '2' }, { ...input, plantedAt: 'invalid' }, { ...input, status: 'UNKNOWN' }, { ...input, name: ' ' }, { ...input, extra: 1 }]) assert.equal((await request('/cycles', 'POST', body)).status, 400);
    for (const body of [{}, { fieldId: 3 }, { status: 'UNKNOWN' }]) assert.equal((await request('/cycles/1', 'PATCH', body)).status, 400);
    assert.equal(calls.length, before, 'Entradas inválidas no deben consultar Prisma');
    failure = new Prisma.PrismaClientKnownRequestError('foreign key', { code: 'P2003', clientVersion: '7.10.0' });
    assert.equal((await request('/cycles', 'POST', input)).status, 400);
    assert.equal((await request('/cycles/1', 'PATCH', { cropProfileId: 999 })).status, 400);
    failure = new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '7.10.0' });
    assert.equal((await request('/cycles', 'POST', input)).status, 409);
    failure = new Prisma.PrismaClientKnownRequestError('write conflict', { code: 'P2034', clientVersion: '7.10.0' });
    assert.equal((await request('/cycles/1', 'PATCH', { name: 'X' })).status, 409);
    failure = new Error('private connection details');
    for (const [path, method, body] of [['/cycles', 'GET'], ['/cycles/1', 'GET'], ['/field/2', 'GET'], ['/cycles', 'POST', input], ['/cycles/1', 'PATCH', { name: 'X' }]]) {
      result = await request(path, method, body);
      assert.equal(result.status, 500);
      assert.equal(result.body.success, false);
      assert.ok(!JSON.stringify(result.body).includes('private connection details'));
    }
    assert.equal((await request('/')).status, 200, 'La ruta legacy de perfiles sigue disponible');
  } finally {
    await new Promise(resolve => server.close(resolve));
    for (const [method, original] of Object.entries(originals)) prisma.crop[method] = original;
    prisma.field.findUnique = originalFieldFindUnique;
    prisma.cropProfile.findMany = originalProfiles;
    prisma.cropProfile.findUnique = originalProfileFindUnique;
    prisma.$transaction = originalTransaction;
    await prisma.$disconnect();
  }
});
