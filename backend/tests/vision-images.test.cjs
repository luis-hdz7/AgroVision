/** Pruebas aisladas del archivo binario Vision; no conectan con PostgreSQL. */
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const http = require('node:http');
const { after, afterEach, before, beforeEach, test } = require('node:test');

process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:1/test';

const prisma = require('../dist/shared/database/prisma.js').default;
const app = require('../dist/app.js').default;

const originalFetch = globalThis.fetch;
const originalFindField = prisma.field.findUnique;
const originalCreate = prisma.visionAnalysisRecord.create;
const originalFindFirst = prisma.visionAnalysisRecord.findFirst;

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const aiPayload = {
  prediction: 'VISUAL_ANOMALY', detectedClass: 'common_rust', confidence: 0.91,
  modelId: 'agrovision-efficientnet-b0-corn', modelVersion: 'corn-1.0.0',
  architecture: 'efficientnet_b0', cropType: 'CORN',
  topClasses: [{ className: 'common_rust', score: 0.91 }], inferenceMs: 12.5,
  metrics: ['model_softmax'],
  visualMetrics: {
    greenCoveragePercentage: null, dryAreaPercentage: null,
    chlorosisSuspected: null, leafSpotSuspected: true, stressPatternDetected: null,
  },
  evidence: [{
    metric: 'model_classification', value: 'common_rust', unit: null,
    explanation: 'Clasificación neuronal.',
  }],
  explanation: 'Patrón compatible con roya.', recommendation: 'Inspeccionar la zona.',
};

let server;
let baseUrl;
let capturedCreate;
let writes;
let aiCalls;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  capturedCreate = null;
  writes = 0;
  aiCalls = 0;
  prisma.field.findUnique = async () => ({ id: 2, crops: [{ id: 2 }] });
  prisma.visionAnalysisRecord.create = async args => {
    writes += 1;
    capturedCreate = args;
    return args.data;
  };
  prisma.visionAnalysisRecord.findFirst = async () => null;
  globalThis.fetch = async () => {
    aiCalls += 1;
    return new Response(JSON.stringify(aiPayload), {
      status: 200, headers: { 'content-type': 'application/json' },
    });
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  prisma.field.findUnique = originalFindField;
  prisma.visionAnalysisRecord.create = originalCreate;
  prisma.visionAnalysisRecord.findFirst = originalFindFirst;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});

test('Vision image: POST confirma análisis e imagen exacta en una escritura anidada', async () => {
  const response = await postMultipart('/api/vision/analyze', png);
  assert.equal(response.status, 200);
  assert.equal(aiCalls, 1);
  assert.equal(writes, 1);
  assert.ok(capturedCreate.data.image.create);
  assert.deepEqual(Buffer.from(capturedCreate.data.image.create.content), png);
  assert.equal(capturedCreate.data.image.create.mimeType, 'image/png');
  assert.equal(capturedCreate.data.image.create.sizeBytes, png.byteLength);
  assert.equal(
    capturedCreate.data.imageSha256,
    createHash('sha256').update(png).digest('hex'),
  );
});

test('Vision image: fallo de la escritura atómica impide responder éxito', async () => {
  prisma.visionAnalysisRecord.create = async () => {
    writes += 1;
    throw new Error('simulated atomic rollback');
  };
  const response = await postMultipart('/api/vision/analyze', png);
  assert.equal(response.status, 503);
  assert.equal(writes, 1);
  assert.equal(response.json.data, null);
});

test('Vision image: no confía en el MIME cuando la firma binaria es inválida', async () => {
  const response = await postMultipart('/api/vision/analyze', Buffer.from('not-a-png'));
  assert.equal(response.status, 415);
  assert.equal(aiCalls, 0);
  assert.equal(writes, 0);
});

test('Vision image: GET entrega bytes exactos, MIME, longitud y nosniff sin IA ni escrituras', async () => {
  const id = '00000000-0000-4000-8000-000000000099';
  prisma.visionAnalysisRecord.findFirst = async args => {
    assert.deepEqual(args.where, { inspectionId: id, fieldId: 'field-001' });
    return {
      inspectionId: id,
      image: { content: new Uint8Array(png), mimeType: 'image/png', sizeBytes: png.length },
    };
  };
  const response = await request('GET', `/api/vision/analyses/${id}/image?fieldId=field-001`);
  assert.equal(response.status, 200);
  assert.equal(response.headers['content-type'], 'image/png');
  assert.equal(response.headers['content-length'], String(png.length));
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.deepEqual(response.body, png);
  assert.equal(aiCalls, 0);
  assert.equal(writes, 0);
});

test('Vision image: identidad/contexto incorrectos e históricos sin foto no filtran datos', async () => {
  const id = '00000000-0000-4000-8000-000000000099';
  prisma.visionAnalysisRecord.findFirst = async () => null;
  assert.equal((await request('GET', `/api/vision/analyses/${id}/image?fieldId=field-999`)).status, 404);
  prisma.visionAnalysisRecord.findFirst = async () => ({ inspectionId: id, image: null });
  assert.equal((await request('GET', `/api/vision/analyses/${id}/image?fieldId=field-001`)).status, 404);
  assert.equal((await request('GET', `/api/vision/analyses/${id}/image`)).status, 400);
  assert.equal((await request('GET', '/api/vision/analyses/not-a-uuid/image?fieldId=field-001')).status, 400);
});

async function postMultipart(path, image) {
  const boundary = '----agrovision-test-boundary';
  const chunks = [];
  const field = (name, value) => chunks.push(Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
  ));
  field('cropType', 'CORN');
  field('fieldId', 'field-002');
  field('zoneId', 'zone-04');
  field('imageFileName', 'captura.png');
  chunks.push(Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="captura.png"\r\nContent-Type: image/png\r\n\r\n`,
  ));
  chunks.push(image, Buffer.from(`\r\n--${boundary}--\r\n`));
  const body = Buffer.concat(chunks);
  return request('POST', path, body, {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(body.length),
  });
}

function request(method, path, body, headers = {}) {
  const target = new URL(path, baseUrl);
  return new Promise((resolve, reject) => {
    const req = http.request(target, { method, headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks);
        let json = null;
        if ((res.headers['content-type'] || '').includes('application/json')) {
          json = JSON.parse(responseBody.toString('utf8'));
        }
        resolve({ status: res.statusCode, headers: res.headers, body: responseBody, json });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
