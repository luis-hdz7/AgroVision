/**
 * Integración de lectura de parcelas contra TEST_DATABASE_URL.
 * Crea fixtures propios, consulta HTTP y contrasta con un cliente Prisma independiente.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

test('Fields GET: lectura real, filtros y colección vacía', {
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
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const created = { fieldIds: [], farmIds: [], userId: null };
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const base = `http://127.0.0.1:${server.address().port}/api/fields`;
  const get = async path => {
    const response = await fetch(base + path);
    return { status: response.status, body: await response.json() };
  };

  try {
    const user = await prisma.user.create({
      data: {
        fullName: 'Usuario de lectura',
        email: `fields-read-${suffix}@example.test`,
        passwordHash: 'integration-only',
        role: 'ADMIN',
      },
    });
    created.userId = user.id;
    const farm = await prisma.farm.create({
      data: {
        ownerId: user.id, name: `Finca lectura ${suffix}`,
        location: 'Integración', totalAreaSquareMeters: 300.25,
      },
    });
    const emptyFarm = await prisma.farm.create({
      data: {
        ownerId: user.id, name: `Finca vacía ${suffix}`,
        location: 'Integración', totalAreaSquareMeters: 100,
      },
    });
    created.farmIds.push(farm.id, emptyFarm.id);
    const first = await prisma.field.create({
      data: {
        farmId: farm.id, name: `Parcela A ${suffix}`, areaSquareMeters: 80.5,
        soilType: 'LOAMY', irrigationType: 'DRIP', status: 'NORMAL',
      },
    });
    const second = await prisma.field.create({
      data: {
        farmId: farm.id, name: `Parcela B ${suffix}`, areaSquareMeters: 90.75,
        soilType: 'CLAY', irrigationType: 'SPRINKLER', status: 'NORMAL',
      },
    });
    created.fieldIds.push(first.id, second.id);

    let result = await get('');
    assert.equal(result.status, 200);
    const ids = result.body.data.map(field => field.id);
    assert.ok(created.fieldIds.every(id => ids.includes(id)));
    assert.ok(ids.every((id, index) => index === 0 || ids[index - 1] < id));

    result = await get(`/${first.id}`);
    assert.equal(result.status, 200);
    assert.equal(result.body.data.name, first.name);
    assert.equal(result.body.data.areaSquareMeters, 80.5);
    assert.equal(result.body.data.createdAt, first.createdAt.toISOString());

    result = await get(`/farm/${farm.id}`);
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.data.map(field => field.id), created.fieldIds);
    assert.ok(result.body.data.every(field => field.farmId === farm.id));

    result = await get(`/farm/${emptyFarm.id}`);
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.data, []);

    const persisted = await independent.field.findMany({
      where: { id: { in: created.fieldIds } }, orderBy: { id: 'asc' },
    });
    assert.deepEqual(persisted.map(field => field.id), created.fieldIds);
    assert.equal(persisted[0].name, first.name);
    assert.equal(Number(persisted[0].areaSquareMeters), 80.5);
    assert.equal(await independent.field.count({ where: { farmId: farm.id } }), 2);
  } finally {
    const cleanup = [];
    for (const id of created.fieldIds.reverse()) {
      cleanup.push(await Promise.allSettled([independent.field.delete({ where: { id } })]));
    }
    for (const id of created.farmIds.reverse()) {
      cleanup.push(await Promise.allSettled([independent.farm.delete({ where: { id } })]));
    }
    if (created.userId) {
      cleanup.push(await Promise.allSettled([
        independent.user.delete({ where: { id: created.userId } }),
      ]));
    }
    const resources = await Promise.allSettled([
      new Promise(resolve => server.close(resolve)),
      independent.$disconnect(),
      prisma.$disconnect(),
    ]);
    const failures = [...cleanup.flat(), ...resources]
      .filter(result => result.status === 'rejected');
    if (failures.length) {
      throw new AggregateError(
        failures.map(result => result.reason),
        `Fallaron ${failures.length} operaciones de limpieza.`,
      );
    }
  }
});

// Límite: se omite sin TEST_DATABASE_URL y nunca usa DATABASE_URL como respaldo.
