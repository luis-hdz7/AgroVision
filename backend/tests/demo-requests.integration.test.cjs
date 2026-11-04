/**
 * Integración real del registro de demos contra TEST_DATABASE_URL.
 * Envía HTTP, relee con un cliente independiente y limpia solo los IDs creados.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

test('Demo requests: persistencia confirmada en PostgreSQL aislado', {
  skip: testDatabaseUrl ? false : 'TEST_DATABASE_URL no está configurada',
}, async () => {
  process.env.DATABASE_URL = testDatabaseUrl;
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { PrismaClient } = require('../src/generated/prisma/client.ts');
  const prisma = require('../src/shared/database/prisma.ts').default;
  const app = require('../src/app.ts').default;
  const independent = new PrismaClient({
    adapter: new PrismaPg({ connectionString: testDatabaseUrl }),
  });
  const createdIds = [];
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const url = `http://127.0.0.1:${server.address().port}/api/demo-requests`;
  const post = body => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  try {
    const valid = {
      name: '  Productor de integración  ',
      email: `demo-${suffix}@example.test`,
      organization: '  Finca de integración  ',
      message: '  Solicitud ficticia para verificar persistencia real.  ',
      consent: 'true',
    };
    let response = await post(valid);
    assert.equal(response.status, 201);
    let body = await response.json();
    assert.equal(body.success, true);
    assert.ok(Number.isInteger(body.data.id) && body.data.id > 0);
    createdIds.push(body.data.id);

    const persisted = await independent.demoRequest.findUnique({
      where: { id: body.data.id },
    });
    assert.equal(persisted.name, 'Productor de integración');
    assert.equal(persisted.email, valid.email);
    assert.equal(persisted.organization, 'Finca de integración');
    assert.equal(persisted.message, 'Solicitud ficticia para verificar persistencia real.');
    assert.ok(persisted.createdAt instanceof Date && !Number.isNaN(persisted.createdAt.valueOf()));
    assert.ok(persisted.consentAt instanceof Date && !Number.isNaN(persisted.consentAt.valueOf()));

    const rejectedEmail = `rejected-${suffix}@example.test`;
    response = await post({ ...valid, email: rejectedEmail, consent: undefined });
    assert.equal(response.status, 400);
    assert.equal(await independent.demoRequest.count({ where: { email: rejectedEmail } }), 0);

    response = await post({
      ...valid,
      email: `empty-organization-${suffix}@example.test`,
      organization: '   ',
    });
    assert.equal(response.status, 201);
    body = await response.json();
    createdIds.push(body.data.id);
    const emptyOrganization = await independent.demoRequest.findUnique({
      where: { id: body.data.id },
    });
    assert.equal(emptyOrganization.organization, null);
    assert.equal((await fetch(url)).status, 404, 'La API no debe exponer un listado');
  } finally {
    const cleanupResults = [];
    for (const id of createdIds.reverse()) {
      cleanupResults.push(await Promise.allSettled([
        independent.demoRequest.delete({ where: { id } }),
      ]));
    }
    const resourceResults = await Promise.allSettled([
      new Promise(resolve => server.close(resolve)),
      independent.$disconnect(),
      prisma.$disconnect(),
    ]);
    const cleanupFailures = [...cleanupResults.flat(), ...resourceResults]
      .filter(result => result.status === 'rejected');
    if (cleanupFailures.length) {
      throw new AggregateError(
        cleanupFailures.map(result => result.reason),
        `Fallaron ${cleanupFailures.length} operaciones de limpieza de integración.`,
      );
    }
  }
});

// Límite: se omite sin TEST_DATABASE_URL y nunca usa DATABASE_URL como alternativa.
