/**
 * Integración de registros agrícolas contra PostgreSQL aislado.
 * Usa exclusivamente TEST_DATABASE_URL y comprueba escrituras HTTP con una segunda sesión Prisma.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

test('Registros: persistencia y relaciones en PostgreSQL aislado', {
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
  const created = {};
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = async (path, method = 'GET', body) => {
    const response = await fetch(base + path, {
      method,
      headers: { 'content-type': 'application/json' },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
    return { status: response.status, body: await response.json() };
  };

  try {
    const user = await prisma.user.create({
      data: {
        fullName: 'Usuario de integración',
        email: `registrations-${suffix}@example.test`,
        passwordHash: 'integration-only',
        role: 'ADMIN',
      },
    });
    created.userId = user.id;
    let orangeProfile = await prisma.cropProfile.findUnique({ where: { cropType: 'ORANGE' } });
    if (!orangeProfile) {
      orangeProfile = await prisma.cropProfile.create({
        data: {
          cropType: 'ORANGE', displayName: 'Naranja de integración',
          analysisFocus: [], mainRisks: [], riskRules: {},
          preferredMetrics: [], recommendationTemplates: {},
        },
      });
      created.profileIds = [orangeProfile.id];
    }
    let cornProfile = await prisma.cropProfile.findUnique({ where: { cropType: 'CORN' } });
    if (!cornProfile) {
      cornProfile = await prisma.cropProfile.create({
        data: {
          cropType: 'CORN', displayName: 'Maíz de integración',
          analysisFocus: [], mainRisks: [], riskRules: {},
          preferredMetrics: [], recommendationTemplates: {},
        },
      });
      created.profileIds = [...(created.profileIds ?? []), cornProfile.id];
    }

    let result = await request('/farms', 'POST', {
      ownerId: user.id, name: `Finca ${suffix}`, location: 'Integración',
      totalAreaSquareMeters: 100.25,
    });
    assert.equal(result.status, 201); created.farmId = result.body.data.id;
    result = await request('/fields', 'POST', {
      farmId: created.farmId, name: `Parcela ${suffix}`, areaSquareMeters: 50.5,
      soilType: 'LOAMY', irrigationType: 'DRIP', status: 'NORMAL',
    });
    assert.equal(result.status, 201); created.fieldId = result.body.data.id;
    result = await request('/crops/cycles', 'POST', {
      fieldId: created.fieldId, cropProfileId: orangeProfile.id, cropType: 'ORANGE',
      name: `Cultivo ${suffix}`, growthStage: 'VEGETATIVE',
      plantedAt: '2026-10-08T00:00:00.000Z', status: 'ACTIVE',
    });
    assert.equal(result.status, 201); created.cropId = result.body.data.id;
    result = await request('/sensors', 'POST', {
      fieldId: created.fieldId, type: 'SOIL_MOISTURE', name: `Sensor ${suffix}`,
      status: 'ACTIVE', installedAt: '2026-10-08T00:00:00.000Z',
    });
    assert.equal(result.status, 201); created.sensorId = result.body.data.id;

    const countBefore = await independent.crop.count({ where: { fieldId: created.fieldId } });
    result = await request('/crops/cycles', 'POST', {
      fieldId: created.fieldId, cropProfileId: cornProfile.id, cropType: 'ORANGE',
      name: 'Incompatible', growthStage: 'VEGETATIVE',
      plantedAt: '2026-10-08T00:00:00.000Z', status: 'ACTIVE',
    });
    assert.equal(result.status, 422);
    assert.equal(await independent.crop.count({ where: { fieldId: created.fieldId } }), countBefore);

    result = await request(`/crops/cycles/${created.cropId}`, 'PATCH', { name: 'Cultivo actualizado' });
    assert.equal(result.status, 200);
    result = await request(`/crops/cycles/${created.cropId}`, 'PATCH', { cropType: 'CORN' });
    assert.equal(result.status, 422);

    const [farm, field, crop, sensor] = await Promise.all([
      independent.farm.findUnique({ where: { id: created.farmId } }),
      independent.field.findUnique({ where: { id: created.fieldId } }),
      independent.crop.findUnique({ where: { id: created.cropId } }),
      independent.sensor.findUnique({ where: { id: created.sensorId } }),
    ]);
    assert.equal(farm.ownerId, user.id);
    assert.equal(field.farmId, farm.id);
    assert.equal(crop.fieldId, field.id);
    assert.equal(crop.cropProfileId, orangeProfile.id);
    assert.equal(crop.cropType, 'ORANGE');
    assert.equal(crop.name, 'Cultivo actualizado');
    assert.equal(sensor.fieldId, field.id);

    assert.equal((await request(`/farms/${farm.id}`)).body.data.id, farm.id);
    assert.equal((await request(`/fields/${field.id}`)).body.data.id, field.id);
    assert.equal((await request(`/crops/cycles/${crop.id}`)).body.data.id, crop.id);
    assert.equal((await request(`/sensors/${sensor.id}`)).body.data.id, sensor.id);
  } finally {
    if (created.sensorId) await independent.sensor.delete({ where: { id: created.sensorId } });
    if (created.cropId) await independent.crop.delete({ where: { id: created.cropId } });
    if (created.fieldId) await independent.field.delete({ where: { id: created.fieldId } });
    if (created.farmId) await independent.farm.delete({ where: { id: created.farmId } });
    if (created.profileIds) await independent.cropProfile.deleteMany({ where: { id: { in: created.profileIds } } });
    if (created.userId) await independent.user.delete({ where: { id: created.userId } });
    await new Promise(resolve => server.close(resolve));
    await independent.$disconnect();
    await prisma.$disconnect();
  }
});

// Integración: requiere migraciones locales aplicadas previamente; nunca usa DATABASE_URL como respaldo.
