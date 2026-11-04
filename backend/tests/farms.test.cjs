/**
 * Prueba aislada de las rutas de fincas con Prisma sustituido.
 * Recibe solicitudes HTTP y verifica validación, relaciones y clasificación de errores.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
const prisma = require('../src/shared/database/prisma.ts').default;
const { Prisma } = require('../src/generated/prisma/client.ts');
const router = require('../src/modules/farms/routs/farmRoutes.ts').default;

test('Farms: registro, lectura, PATCH y errores', async () => {
  const row = { id: 7, ownerId: 2, name: 'Finca norte', location: 'León', totalAreaSquareMeters: 150.25, createdAt: new Date('2026-10-08T00:00:00Z') };
  const calls = [];
  let failure = null;
  const originals = {
    userFindUnique: prisma.user.findUnique,
    farmFindMany: prisma.farm.findMany,
    farmFindUnique: prisma.farm.findUnique,
    farmCreate: prisma.farm.create,
    farmUpdate: prisma.farm.update,
  };
  prisma.user.findUnique = async ({ where }) => {
    if (failure) throw failure;
    return where.id === 99 ? null : { id: where.id };
  };
  prisma.farm.findMany = async () => [row];
  prisma.farm.findUnique = async ({ where }) => {
    if (failure) throw failure;
    return where.id === 99 ? null : row;
  };
  prisma.farm.create = async ({ data }) => {
    if (failure) throw failure;
    calls.push({ method: 'create', data });
    return { ...row, ...data };
  };
  prisma.farm.update = async ({ where, data }) => {
    if (failure) throw failure;
    if (where.id === 99) throw new Prisma.PrismaClientKnownRequestError('missing', { code: 'P2025', clientVersion: '7.10.0' });
    calls.push({ method: 'update', data });
    return { ...row, ...data };
  };

  const app = express(); app.use(express.json()); app.use('/api/farms', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api/farms`;
  const request = async (path = '', method = 'GET', body) => {
    const response = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, ...(body !== undefined && { body: JSON.stringify(body) }) });
    return { status: response.status, body: await response.json() };
  };

  try {
    const input = { ownerId: 2, name: ' Finca norte ', location: ' León ', totalAreaSquareMeters: 150.25 };
    let result = await request('', 'POST', input);
    assert.equal(result.status, 201); assert.equal(result.body.data.id, 7);
    result = await request('/7'); assert.equal(result.status, 200); assert.equal(result.body.data.ownerId, 2);
    assert.equal((await request('', 'POST', { ...input, ownerId: 99 })).status, 400);
    result = await request('/7', 'PATCH', { name: 'Nueva finca' });
    assert.equal(result.status, 200); assert.equal(result.body.data.location, row.location);
    assert.deepEqual(calls.at(-1).data, { name: 'Nueva finca' });
    assert.equal((await request('/99')).status, 404);
    assert.equal((await request('/99', 'PATCH', { name: 'X' })).status, 404);
    for (const body of [{ ...input, ownerId: '2' }, { ...input, ownerId: true }, { ...input, totalAreaSquareMeters: 1.001 }, { ...input, totalAreaSquareMeters: 10000000000 }, { ...input, extra: 1 }]) {
      assert.equal((await request('', 'POST', body)).status, 400);
    }
    for (const path of ['/0', '/01', '/2147483648']) assert.equal((await request(path)).status, 400);
    failure = new Prisma.PrismaClientKnownRequestError('unavailable', { code: 'P1001', clientVersion: '7.10.0' });
    assert.equal((await request('/7')).status, 503);
    failure = new Error('private database details');
    result = await request('/7'); assert.equal(result.status, 500);
    assert.ok(!JSON.stringify(result.body).includes('private database details'));
  } finally {
    await new Promise(resolve => server.close(resolve));
    prisma.user.findUnique = originals.userFindUnique;
    prisma.farm.findMany = originals.farmFindMany;
    prisma.farm.findUnique = originals.farmFindUnique;
    prisma.farm.create = originals.farmCreate;
    prisma.farm.update = originals.farmUpdate;
    await prisma.$disconnect();
  }
});

// Integración y límite: no accede a PostgreSQL; la persistencia real se prueba por separado.
