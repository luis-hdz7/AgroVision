/** Prueba HTTP aislada del registro de demos; sustituye Prisma y no accede a PostgreSQL. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/test';
const prisma = require('../src/shared/database/prisma.ts').default;
const { Prisma } = require('../src/generated/prisma/client.ts');
const { demoRequestRoutes } = require('../src/modules/demo-requests/demoRequestRoutes.ts');

test('Demo: validación estricta, persistencia y clasificación de errores', async () => {
  const original = prisma.demoRequest.create;
  const writes = [];
  let mode = 'success';
  let resolveWrite;
  let createStarted;
  let markCreateStarted;
  prisma.demoRequest.create = async args => {
    writes.push(args);
    markCreateStarted?.();
    if (mode === 'pending') return new Promise(resolve => { resolveWrite = resolve; });
    if (mode === 'unexpected') throw new Error('private database details');
    if (mode === 'unavailable') {
      throw new Prisma.PrismaClientKnownRequestError('connection unavailable', {
        code: 'P1001', clientVersion: '7.10.0',
      });
    }
    return { id: 41 };
  };

  const app = express();
  app.use(express.json());
  app.use('/api/demo-requests', demoRequestRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const url = `http://127.0.0.1:${server.address().port}/api/demo-requests`;
  const valid = {
    name: '  Productor Ejemplo  ',
    email: '  persona@example.test  ',
    message: '  Quiero conocer el monitoreo de parcelas.  ',
    consent: 'true',
  };
  const post = body => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  try {
    const invalidBodies = [
      {}, { ...valid, consent: undefined }, { ...valid, consent: false },
      { ...valid, consent: 'false' }, { ...valid, consent: true },
      { ...valid, email: 'incorrecto' }, { ...valid, name: ' ' },
      { ...valid, name: 'x'.repeat(101) },
      { ...valid, email: `${'x'.repeat(246)}@test.com` },
      { ...valid, message: 'corto' }, { ...valid, message: 'x'.repeat(2001) },
      { ...valid, organization: 12 }, { ...valid, organization: 'x'.repeat(151) },
      { ...valid, id: 1 }, { ...valid, createdAt: '2026-01-01T00:00:00Z' },
      { ...valid, consentAt: '2026-01-01T00:00:00Z' },
    ];
    for (const body of invalidBodies) assert.equal((await post(body)).status, 400);
    assert.equal(writes.length, 0, 'Las entradas inválidas no ejecutan create');

    let response = await post(valid);
    assert.equal(response.status, 201);
    let result = await response.json();
    assert.deepEqual(result.data, { id: 41 });
    assert.deepEqual(writes.at(-1).data, {
      name: 'Productor Ejemplo', email: 'persona@example.test',
      organization: null, message: 'Quiero conocer el monitoreo de parcelas.',
    });

    response = await post({ ...valid, organization: '   ' });
    assert.equal(response.status, 201);
    assert.equal(writes.at(-1).data.organization, null);

    mode = 'pending';
    createStarted = new Promise(resolve => { markCreateStarted = resolve; });
    let responseSettled = false;
    const pendingResponse = post(valid).then(value => {
      responseSettled = true;
      return value;
    });
    await createStarted;
    assert.equal(responseSettled, false, 'No confirmar antes de resolver Prisma create');
    resolveWrite({ id: 77 });
    response = await pendingResponse;
    assert.equal(response.status, 201);
    assert.deepEqual((await response.json()).data, { id: 77 });
    markCreateStarted = undefined;

    mode = 'unexpected';
    response = await post(valid);
    assert.equal(response.status, 500);
    result = await response.json();
    assert.equal(result.success, false);
    assert.ok(!JSON.stringify(result).includes('private database details'));

    mode = 'unavailable';
    response = await post(valid);
    assert.equal(response.status, 503);
    result = await response.json();
    assert.equal(result.success, false);
    assert.ok(!JSON.stringify(result).includes('connection unavailable'));
    assert.equal((await fetch(url)).status, 404, 'No exponer un listado público');
  } finally {
    prisma.demoRequest.create = original;
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
  }
});

// Límite: esta suite comprueba el contrato HTTP con Prisma sustituido, no persistencia real.
