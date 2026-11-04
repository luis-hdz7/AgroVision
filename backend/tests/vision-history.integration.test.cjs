const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  test('Vision history integration: requiere PostgreSQL aislado', {
    skip: 'TEST_DATABASE_URL no está configurada; DATABASE_URL no se usa como fallback.',
  }, () => {});
} else {
  process.env.DATABASE_URL = testDatabaseUrl;

  test('Vision history integration: filtros, cursor, detalle e inmutabilidad', async () => {
    const { PrismaClient } = require('../dist/generated/prisma/client.js');
    const { PrismaPg } = require('@prisma/adapter-pg');
    const app = require('../dist/app.js').default;
    const sharedPrisma = require('../dist/shared/database/prisma.js').default;
    const verifier = new PrismaClient({
      adapter: new PrismaPg({ connectionString: testDatabaseUrl }),
    });
    const fieldId = `field-${Math.floor(Math.random() * 900000) + 100000}`;
    const otherFieldId = `field-${Math.floor(Math.random() * 900000) + 1100000}`;
    const fixtureIds = Array.from({ length: 7 }, () => randomUUID());
    const [orangeId, tiedA, tiedB, nullZoneId, oldId, otherFieldRecordId, corruptId] = fixtureIds;
    const sharedDate = '2026-10-22T12:00:00.000Z';
    const archivedPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 7, 8, 9]);
    let server;
    const cleanupErrors = [];
    const fixtures = [
      makeRecord(orangeId, fieldId, 'zone-a', 'ORANGE', '2026-10-23T12:00:00.000Z'),
      makeRecord(tiedA, fieldId, 'zone-a', 'CORN', sharedDate),
      makeRecord(tiedB, fieldId, 'zone-a', 'CORN', sharedDate),
      makeRecord(nullZoneId, fieldId, null, 'CORN', '2026-10-21T12:00:00.000Z'),
      makeRecord(oldId, fieldId, 'zone-b', 'CORN', '2026-10-20T12:00:00.000Z'),
      makeRecord(otherFieldRecordId, otherFieldId, 'zone-a', 'CORN', '2026-10-24T12:00:00.000Z'),
    ];

    try {
      await verifier.visionAnalysisRecord.createMany({ data: fixtures });
      await verifier.visionAnalysisImage.create({
        data: {
          inspectionId: orangeId,
          content: new Uint8Array(archivedPng),
          mimeType: 'image/png',
          sizeBytes: archivedPng.length,
        },
      });
      const before = await readFixtures(verifier, fixtureIds.slice(0, 6));
      server = app.listen(0, '127.0.0.1');
      await new Promise((resolve) => server.once('listening', resolve));
      const baseUrl = `http://127.0.0.1:${server.address().port}`;

      const all = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}`);
      assert.equal(all.response.status, 200);
      assert.equal(all.body.data.items.length, 5);
      assert.equal(all.body.data.items.some((item) => item.fieldId === otherFieldId), false);
      assert.equal(all.body.data.items.find((item) => item.inspectionId === orangeId).hasImage, true);
      assert.equal(all.body.data.items.find((item) => item.inspectionId === oldId).hasImage, false);

      const crop = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}&cropType=ORANGE`);
      assert.deepEqual(crop.body.data.items.map((item) => item.inspectionId), [orangeId]);
      const zone = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}&zoneId=zone-b`);
      assert.deepEqual(zone.body.data.items.map((item) => item.inspectionId), [oldId]);
      const unassigned = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}&unassignedOnly=true`);
      assert.deepEqual(unassigned.body.data.items.map((item) => item.inspectionId), [nullZoneId]);

      const expectedTieOrder = [tiedA, tiedB].sort().reverse();
      const tiedItems = all.body.data.items.filter((item) => item.createdAt === sharedDate);
      assert.deepEqual(tiedItems.map((item) => item.inspectionId), expectedTieOrder);

      const pagedIds = [];
      let cursor = null;
      do {
        const suffix = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
        const page = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}&limit=2${suffix}`);
        assert.equal(page.response.status, 200);
        pagedIds.push(...page.body.data.items.map((item) => item.inspectionId));
        cursor = page.body.data.nextCursor;
      } while (cursor);
      assert.deepEqual(pagedIds, all.body.data.items.map((item) => item.inspectionId));

      const latest = await get(baseUrl, `/api/vision/analyses?fieldId=${fieldId}&limit=1`);
      assert.equal(latest.body.data.items[0].inspectionId, orangeId);
      const detail = await get(baseUrl, `/api/vision/analyses/${orangeId}?fieldId=${fieldId}`);
      assert.deepEqual(detail.body.data, fixtures[0].result);
      const hidden = await get(baseUrl, `/api/vision/analyses/${orangeId}?fieldId=${otherFieldId}`);
      assert.equal(hidden.response.status, 404);
      const image = await fetch(`${baseUrl}/api/vision/analyses/${orangeId}/image?fieldId=${fieldId}`);
      assert.equal(image.status, 200);
      assert.equal(image.headers.get('content-type'), 'image/png');
      assert.equal(image.headers.get('x-content-type-options'), 'nosniff');
      assert.deepEqual(Buffer.from(await image.arrayBuffer()), archivedPng);
      const oldImage = await fetch(`${baseUrl}/api/vision/analyses/${oldId}/image?fieldId=${fieldId}`);
      assert.equal(oldImage.status, 404);

      const after = await readFixtures(verifier, fixtureIds.slice(0, 6));
      assert.deepEqual(after, before);

      const corrupt = makeRecord(corruptId, fieldId, 'zone-corrupt', 'CORN', '2026-10-25T12:00:00.000Z');
      corrupt.result = { inspectionId: corruptId, invalid: true };
      await verifier.visionAnalysisRecord.create({ data: corrupt });
      const corruptResponse = await get(baseUrl, `/api/vision/analyses/${corruptId}?fieldId=${fieldId}`);
      assert.equal(corruptResponse.response.status, 500);
      assert.equal(corruptResponse.body.data, null);
    } finally {
      if (server) {
        try { await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
        catch (error) { cleanupErrors.push(error); }
      }
      try {
        await verifier.visionAnalysisRecord.deleteMany({ where: { inspectionId: { in: fixtureIds } } });
      } catch (error) { cleanupErrors.push(error); }
      try { await verifier.$disconnect(); } catch (error) { cleanupErrors.push(error); }
      try { await sharedPrisma.$disconnect(); } catch (error) { cleanupErrors.push(error); }
      assert.deepEqual(cleanupErrors, [], 'Falló la limpieza de fixtures o clientes.');
    }
  });
}

function makeRecord(inspectionId, fieldId, zoneId, cropType, createdAt) {
  const result = {
    inspectionId, fieldId, zoneId, cropType,
    prediction: 'HEALTHY', detectedClass: 'healthy', confidence: 0.95,
    modelId: `fixture-${cropType.toLowerCase()}`, modelVersion: 'test-1.0.0',
    architecture: 'fixture-network',
    topClasses: [{ className: 'healthy', score: 0.95 }], inferenceMs: 5,
    visualMetrics: {
      greenCoveragePercentage: null, dryAreaPercentage: null,
      chlorosisSuspected: null, leafSpotSuspected: null, stressPatternDetected: null,
    },
    explanation: 'Contrato ficticio para integración.',
    recommendedAction: 'Sin acción; fixture de prueba.',
    evidence: [{
      source: 'VISION', metric: 'fixture', value: null, unit: null,
      status: 'NORMAL', explanation: 'Evidencia ficticia de integración.',
    }],
    createdAt,
  };
  return {
    inspectionId, fieldId, zoneId, cropType,
    imageFileName: `${inspectionId}.jpg`, imageSha256: '0'.repeat(64),
    result, createdAt: new Date(createdAt),
  };
}

async function get(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`);
  return { response, body: await response.json() };
}

async function readFixtures(client, ids) {
  return client.visionAnalysisRecord.findMany({
    where: { inspectionId: { in: ids } }, orderBy: { inspectionId: 'asc' },
  });
}
