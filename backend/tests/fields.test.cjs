/**
 * Prueba aislada de las rutas de parcelas con Prisma sustituido.
 * Recibe solicitudes HTTP y verifica relaciones, superficies, PATCH y errores.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
const prisma = require('../src/shared/database/prisma.ts').default;
const { Prisma } = require('../src/generated/prisma/client.ts');
const router = require('../src/modules/fields/routes/fieldRoutes.ts').default;

test('Fields: registro, consultas, PATCH y errores', async () => {
  const row = { id: 8, farmId: 7, name: 'Parcela A', areaSquareMeters: 80.5, soilType: 'LOAMY', irrigationType: 'DRIP', status: 'NORMAL', createdAt: new Date('2026-10-08T00:00:00Z') };
  const secondRow = { ...row, id: 9, farmId: 10, name: 'Parcela B' };
  let failure = null;
  const writes = [];
  const reads = [];
  const originals = {
    farmFindUnique: prisma.farm.findUnique,
    fieldFindMany: prisma.field.findMany,
    fieldFindUnique: prisma.field.findUnique,
    fieldCreate: prisma.field.create,
    fieldUpdate: prisma.field.update,
  };
  prisma.farm.findUnique = async ({ where }) => {
    if (failure) throw failure;
    return where.id === 99 ? null : { id: where.id };
  };
  prisma.field.findMany = async (args = {}) => {
    if (failure) throw failure;
    reads.push(args);
    if (args.where?.farmId === 99) return [];
    if (args.where?.farmId === 7) return [row];
    return [row, secondRow];
  };
  prisma.field.findUnique = async ({ where }) => {
    if (failure) throw failure;
    return where.id === 99 ? null : row;
  };
  prisma.field.create = async ({ data }) => {
    if (failure) throw failure;
    writes.push(data); return { ...row, ...data };
  };
  prisma.field.update = async ({ where, data }) => {
    if (failure) throw failure;
    if (where.id === 99) throw new Prisma.PrismaClientKnownRequestError('missing', { code: 'P2025', clientVersion: '7.10.0' });
    writes.push(data); return { ...row, ...data };
  };

  const app = express(); app.use(express.json()); app.use('/api/fields', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api/fields`;
  const request = async (path = '', method = 'GET', body) => {
    const response = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, ...(body !== undefined && { body: JSON.stringify(body) }) });
    return { status: response.status, body: await response.json() };
  };

  try {
    const input = { farmId: 7, name: 'Parcela A', areaSquareMeters: 80.5, soilType: 'LOAMY', irrigationType: 'DRIP', status: 'NORMAL' };
    let result = await request();
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.data.map(field => field.id), [8, 9]);
    assert.equal(result.body.data[0].areaSquareMeters, 80.5);
    assert.equal(result.body.data[0].createdAt, row.createdAt.toISOString());
    assert.deepEqual(reads.at(-1), { orderBy: { id: 'asc' } });
    result = await request('/8');
    assert.equal(result.status, 200);
    assert.equal(result.body.data.id, 8);
    result = await request('/farm/7');
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.data.map(field => field.id), [8]);
    assert.deepEqual(reads.at(-1), { where: { farmId: 7 }, orderBy: { id: 'asc' } });
    for (const path of ['/0', '/01', '/1.2', '/2147483648', '/farm/0', '/farm/abc']) {
      assert.equal((await request(path)).status, 400, path);
    }
    result = await request('', 'POST', input);
    assert.equal(result.status, 201); assert.equal(result.body.data.farmId, 7);
    assert.equal((await request('', 'POST', { ...input, farmId: 99 })).status, 400);
    assert.deepEqual((await request('/farm/99')).body.data, []);
    result = await request('/8', 'PATCH', { status: 'WATER_STRESS' });
    assert.equal(result.status, 200); assert.equal(result.body.data.name, row.name);
    assert.deepEqual(writes.at(-1), { status: 'WATER_STRESS' });
    assert.equal((await request('/99')).status, 404);
    assert.equal((await request('/99', 'PATCH', { name: 'X' })).status, 404);
    for (const body of [{ ...input, farmId: '7' }, { ...input, areaSquareMeters: 1.999 }, { ...input, areaSquareMeters: 10000000000 }, { ...input, extra: 1 }]) {
      assert.equal((await request('', 'POST', body)).status, 400);
    }
    failure = new Prisma.PrismaClientKnownRequestError('unavailable', { code: 'P1001', clientVersion: '7.10.0' });
    assert.equal((await request('/farm/7')).status, 503);
    failure = new Error('private database details');
    result = await request('/8'); assert.equal(result.status, 500);
    assert.ok(!JSON.stringify(result.body).includes('private database details'));
  } finally {
    await new Promise(resolve => server.close(resolve));
    prisma.farm.findUnique = originals.farmFindUnique;
    prisma.field.findMany = originals.fieldFindMany;
    prisma.field.findUnique = originals.fieldFindUnique;
    prisma.field.create = originals.fieldCreate;
    prisma.field.update = originals.fieldUpdate;
    await prisma.$disconnect();
  }
});

// Integración y límite: no accede a PostgreSQL; la persistencia real se prueba por separado.
