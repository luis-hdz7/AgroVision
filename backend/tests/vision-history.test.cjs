const assert = require('node:assert/strict');
const { after, afterEach, before, beforeEach, test } = require('node:test');

process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:1/test';

const prisma = require('../dist/shared/database/prisma.js').default;
const app = require('../dist/app.js').default;
const { Prisma } = require('../dist/generated/prisma/client.js');
const { VisionService } = require('../dist/modules/vision/services/visionService.js');

const originalFindMany = prisma.visionAnalysisRecord.findMany;
const originalFindFirst = prisma.visionAnalysisRecord.findFirst;
const originalCreate = prisma.visionAnalysisRecord.create;
const originalUpdate = prisma.visionAnalysisRecord.update;
const originalDelete = prisma.visionAnalysisRecord.delete;
const originalExecuteRaw = prisma.$executeRaw;
const originalAnalyzeImage = VisionService.analyzeImage;

const ids = {
  newest: '00000000-0000-4000-8000-000000000005',
  tiedHigh: '00000000-0000-4000-8000-000000000004',
  tiedLow: '00000000-0000-4000-8000-000000000003',
  unassigned: '00000000-0000-4000-8000-000000000002',
  otherField: '00000000-0000-4000-8000-000000000001',
};

function result(overrides = {}) {
  return {
    inspectionId: ids.newest,
    fieldId: 'field-001',
    zoneId: 'zone-a',
    cropType: 'ORANGE',
    prediction: 'VISUAL_ANOMALY',
    detectedClass: 'leaf_spot',
    confidence: 0.91,
    modelId: 'vision-orange',
    modelVersion: '1.2.3',
    architecture: 'efficientnet_b0',
    topClasses: [{ className: 'leaf_spot', score: 0.91 }],
    inferenceMs: 12.5,
    visualMetrics: {
      greenCoveragePercentage: null,
      dryAreaPercentage: null,
      chlorosisSuspected: null,
      leafSpotSuspected: true,
      stressPatternDetected: null,
    },
    explanation: 'Resultado histórico de prueba.',
    recommendedAction: 'Inspeccionar la zona.',
    evidence: [{
      source: 'VISION', metric: 'classification', status: 'WARNING',
      explanation: 'Clasificación persistida.',
    }],
    createdAt: '2026-10-20T12:00:00.000Z',
    ...overrides,
  };
}

function row(overrides = {}) {
  const stored = result(overrides.result || {});
  return {
    inspectionId: stored.inspectionId,
    fieldId: stored.fieldId,
    zoneId: stored.zoneId,
    cropType: stored.cropType,
    result: stored,
    createdAt: new Date(stored.createdAt),
    ...overrides,
    result: stored,
  };
}

const records = [
  row(),
  row({ result: {
    inspectionId: ids.tiedHigh, cropType: 'CORN', detectedClass: 'healthy',
    prediction: 'HEALTHY', createdAt: '2026-10-19T12:00:00.000Z',
  } }),
  row({ result: {
    inspectionId: ids.tiedLow, cropType: 'CORN', detectedClass: 'dry_area',
    prediction: 'DRY_AREA', createdAt: '2026-10-19T12:00:00.000Z',
  } }),
  row({ result: {
    inspectionId: ids.unassigned, cropType: 'CORN', zoneId: null,
    createdAt: '2026-10-18T12:00:00.000Z',
  } }),
  row({ result: {
    inspectionId: ids.otherField, fieldId: 'field-002', cropType: 'CORN',
    createdAt: '2026-10-21T12:00:00.000Z',
  } }),
];

let server;
let baseUrl;
let databaseFailure;
let sideEffects;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  databaseFailure = null;
  sideEffects = 0;
  prisma.visionAnalysisRecord.findMany = async (args) => {
    if (databaseFailure) throw databaseFailure;
    return records.filter((item) => matches(item, args.where))
      .sort((left, right) => right.createdAt - left.createdAt
        || right.inspectionId.localeCompare(left.inspectionId))
      .slice(0, args.take);
  };
  prisma.visionAnalysisRecord.findFirst = async (args) => {
    if (databaseFailure) throw databaseFailure;
    return records.find((item) => matches(item, args.where)) || null;
  };
  prisma.visionAnalysisRecord.create = async () => { sideEffects += 1; };
  prisma.visionAnalysisRecord.update = async () => { sideEffects += 1; };
  prisma.visionAnalysisRecord.delete = async () => { sideEffects += 1; };
  prisma.$executeRaw = async () => { sideEffects += 1; };
  VisionService.analyzeImage = async () => { sideEffects += 1; };
});

afterEach(() => {
  prisma.visionAnalysisRecord.findMany = originalFindMany;
  prisma.visionAnalysisRecord.findFirst = originalFindFirst;
  prisma.visionAnalysisRecord.create = originalCreate;
  prisma.visionAnalysisRecord.update = originalUpdate;
  prisma.visionAnalysisRecord.delete = originalDelete;
  prisma.$executeRaw = originalExecuteRaw;
  VisionService.analyzeImage = originalAnalyzeImage;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
});

test('Vision history: filtra identidad, cultivo y zona sin efectos secundarios', async () => {
  const all = await get('/api/vision/analyses?fieldId=field-001');
  assert.equal(all.response.status, 200);
  assert.equal(all.response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(all.body.data.items.map((item) => item.inspectionId), [
    ids.newest, ids.tiedHigh, ids.tiedLow, ids.unassigned,
  ]);
  assert.equal('architecture' in all.body.data.items[0], false);
  assert.equal(all.body.data.items[0].hasImage, false);
  assert.equal('content' in all.body.data.items[0], false);

  const crop = await get('/api/vision/analyses?fieldId=field-001&cropType=CORN');
  assert.equal(crop.body.data.items.length, 3);
  const zone = await get('/api/vision/analyses?fieldId=field-001&zoneId=zone-a');
  assert.equal(zone.body.data.items.length, 3);
  const unassigned = await get('/api/vision/analyses?fieldId=field-001&unassignedOnly=true');
  assert.deepEqual(unassigned.body.data.items.map((item) => item.inspectionId), [ids.unassigned]);
  const missing = await get('/api/vision/analyses?fieldId=field-009');
  assert.deepEqual(missing.body.data, { items: [], nextCursor: null });
  assert.equal(sideEffects, 0);
});

test('Vision history: pagina por fecha e ID sin duplicar y vincula el cursor a filtros', async () => {
  const first = await get('/api/vision/analyses?fieldId=field-001&cropType=CORN&limit=1');
  assert.equal(first.response.status, 200);
  assert.equal(first.body.data.items[0].inspectionId, ids.tiedHigh);
  assert.ok(first.body.data.nextCursor);

  const second = await get(`/api/vision/analyses?fieldId=field-001&cropType=CORN&limit=1&cursor=${first.body.data.nextCursor}`);
  assert.equal(second.body.data.items[0].inspectionId, ids.tiedLow);
  const third = await get(`/api/vision/analyses?fieldId=field-001&cropType=CORN&limit=1&cursor=${second.body.data.nextCursor}`);
  assert.equal(third.body.data.items[0].inspectionId, ids.unassigned);
  assert.equal(third.body.data.nextCursor, null);

  const wrongFilters = await get(`/api/vision/analyses?fieldId=field-002&cropType=CORN&limit=1&cursor=${first.body.data.nextCursor}`);
  assert.equal(wrongFilters.response.status, 400);
  const malformed = await get('/api/vision/analyses?fieldId=field-001&cursor=not-a-cursor');
  assert.equal(malformed.response.status, 400);
});

test('Vision history: rechaza queries ambiguas, desconocidas y límites inválidos', async () => {
  const paths = [
    '/api/vision/analyses',
    '/api/vision/analyses?fieldId=field-001&fieldId=field-002',
    '/api/vision/analyses?fieldId=field-001&unknown=x',
    '/api/vision/analyses?fieldId=field-001&zoneId=zone-a&unassignedOnly=true',
    '/api/vision/analyses?fieldId=field-001&limit=0',
    '/api/vision/analyses?fieldId=field-001&limit=01',
    '/api/vision/analyses?fieldId=field-001&limit=101',
    '/api/vision/analyses?fieldId=field-001&cropType=UNKNOWN',
  ];
  for (const path of paths) {
    const { response } = await get(path);
    assert.equal(response.status, 400, path);
  }
});

test('Vision history: detalle conserva contrato completo, null y metadatos originales', async () => {
  const { response, body } = await get(`/api/vision/analyses/${ids.newest}?fieldId=field-001`);
  assert.equal(response.status, 200);
  assert.equal(body.data.inspectionId, ids.newest);
  assert.equal(body.data.modelVersion, '1.2.3');
  assert.equal(body.data.createdAt, '2026-10-20T12:00:00.000Z');
  assert.equal(body.data.visualMetrics.greenCoveragePercentage, null);
  assert.equal(body.data.evidence[0].value, undefined);
  assert.equal(sideEffects, 0);
});

test('Vision history: detalle invalida UUID/query y oculta registros de otro fieldId', async () => {
  assert.equal((await get('/api/vision/analyses/no-uuid?fieldId=field-001')).response.status, 400);
  assert.equal((await get(`/api/vision/analyses/${ids.newest}`)).response.status, 400);
  assert.equal((await get(`/api/vision/analyses/${ids.newest}?fieldId=field-002`)).response.status, 404);
  assert.equal((await get(`/api/vision/analyses/${ids.newest}?fieldId=field-001&extra=1`)).response.status, 400);
});

test('Vision history: contrato corrupto o incoherente produce 500, nunca éxito parcial', async () => {
  const original = records[0].result;
  records[0].result = { ...original, confidence: 2 };
  let response = await get('/api/vision/analyses?fieldId=field-001&limit=1');
  assert.equal(response.response.status, 500);
  assert.equal(response.body.data, null);
  assert.equal(JSON.stringify(response.body).includes('confidence'), false);

  records[0].result = { ...original, fieldId: 'field-099' };
  response = await get(`/api/vision/analyses/${ids.newest}?fieldId=field-001`);
  assert.equal(response.response.status, 500);
  records[0].result = original;
});

test('Vision history: distingue indisponibilidad 503 de error inesperado 500', async () => {
  databaseFailure = new Prisma.PrismaClientKnownRequestError('private connection detail', {
    code: 'P1001', clientVersion: '7.10.0',
  });
  let response = await get('/api/vision/analyses?fieldId=field-001');
  assert.equal(response.response.status, 503);
  assert.equal(JSON.stringify(response.body).includes('private connection detail'), false);

  databaseFailure = new Error('private internal detail');
  response = await get('/api/vision/analyses?fieldId=field-001');
  assert.equal(response.response.status, 500);
  assert.equal(JSON.stringify(response.body).includes('private internal detail'), false);
});

test('Vision history: el POST existente conserva su validación', async () => {
  const response = await fetch(`${baseUrl}/api/vision/analyze`, { method: 'POST' });
  assert.equal(response.status, 400);
});

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return { response, body: await response.json() };
}

function matches(item, where) {
  if (!where) return true;
  if (where.AND && !where.AND.every((part) => matches(item, part))) return false;
  if (where.OR && !where.OR.some((part) => matches(item, part))) return false;
  if (where.fieldId !== undefined && item.fieldId !== where.fieldId) return false;
  if (where.cropType !== undefined && item.cropType !== where.cropType) return false;
  if (where.zoneId !== undefined && item.zoneId !== where.zoneId) return false;
  if (where.inspectionId !== undefined) {
    if (typeof where.inspectionId === 'string' && item.inspectionId !== where.inspectionId) return false;
    if (where.inspectionId.lt && !(item.inspectionId < where.inspectionId.lt)) return false;
  }
  if (where.createdAt !== undefined) {
    if (where.createdAt instanceof Date && item.createdAt.getTime() !== where.createdAt.getTime()) return false;
    if (where.createdAt.lt && !(item.createdAt < where.createdAt.lt)) return false;
  }
  return true;
}
