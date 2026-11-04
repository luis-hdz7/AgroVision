/** Pruebas aisladas del cliente GET de historial Vision, sin red ni PostgreSQL. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ApiGetError } from '../src/shared/api/apiClient.ts';
import {
  analyzeVisionImage,
  getVisionAnalysisDetail,
  getVisionAnalysisImageUrl,
  getVisionHistory,
} from '../src/features/vision-ai/services/visionAIService.ts';
import {
  subscribeToVisionAnalysisConfirmed,
} from '../src/features/vision-ai/services/visionAnalysisEvents.ts';

const inspectionId = '93ae7c8e-57f6-4b5a-a408-647147d79ebb';
const envelope = data => ({
  success: true, data, message: 'ok', error: null,
  timestamp: '2026-11-04T01:20:00.000Z',
});
const response = (status, data) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

const historyItem = {
  inspectionId,
  fieldId: 'field-001',
  zoneId: 'zone-03',
  cropType: 'ORANGE',
  prediction: 'VISUAL_ANOMALY',
  detectedClass: 'melanose',
  confidence: 0.91,
  modelId: 'orange-model',
  modelVersion: 'orange-1.0.0',
  hasImage: true,
  createdAt: '2026-11-04T01:19:38.294Z',
};

const detail = {
  ...historyItem,
  architecture: 'efficientnet_b0',
  topClasses: [{ className: 'melanose', score: 0.91 }],
  inferenceMs: 25.5,
  visualMetrics: {
    greenCoveragePercentage: null,
    dryAreaPercentage: null,
    chlorosisSuspected: null,
    leafSpotSuspected: true,
    stressPatternDetected: null,
  },
  explanation: 'Resultado histórico.',
  recommendedAction: 'Revisar la zona.',
  evidence: [{
    source: 'VISION', metric: 'classification', status: 'WARNING',
    explanation: 'Evidencia histórica con propiedades opcionales omitidas.',
  }],
};
const confirmedPostDetail = {
  ...detail,
  evidence: detail.evidence.map(evidence => ({ ...evidence, value: null, unit: null })),
};

test('Vision history client: construye filtros de zona, sin zona y cursor opaco', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const urls = [];
  globalThis.fetch = async url => {
    urls.push(String(url));
    return response(200, envelope({ items: [historyItem], nextCursor: 'opaque_A-1' }));
  };

  await getVisionHistory({
    fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03', limit: 20,
  });
  await getVisionHistory({
    fieldId: 'field-001', cropType: 'ORANGE', zoneId: null,
    cursor: 'opaque_A-1', limit: 20,
  });

  const first = new URL(urls[0], 'http://local');
  assert.equal(first.searchParams.get('fieldId'), 'field-001');
  assert.equal(first.searchParams.get('cropType'), 'ORANGE');
  assert.equal(first.searchParams.get('zoneId'), 'zone-03');
  assert.equal(first.searchParams.has('unassignedOnly'), false);

  const second = new URL(urls[1], 'http://local');
  assert.equal(second.searchParams.get('unassignedOnly'), 'true');
  assert.equal(second.searchParams.has('zoneId'), false);
  assert.equal(second.searchParams.get('cursor'), 'opaque_A-1');
});

test('Vision history client: acepta lista vacía y rechaza páginas inválidas', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  globalThis.fetch = async () => response(200, envelope({ items: [], nextCursor: null }));
  assert.deepEqual(await getVisionHistory({
    fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03',
  }), { items: [], nextCursor: null });

  for (const invalid of [
    { items: [{ ...historyItem, confidence: 2 }], nextCursor: null },
    { items: [{ ...historyItem, hasImage: 'yes' }], nextCursor: null },
    { items: [historyItem], nextCursor: '' },
    { items: 'not-an-array', nextCursor: null },
  ]) {
    globalThis.fetch = async () => response(200, envelope(invalid));
    await assert.rejects(
      getVisionHistory({ fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03' }),
      error => error.name === 'VisionRequestError',
    );
  }
});

test('Vision history client: construye URL binaria con identidad y parcela codificadas', () => {
  assert.equal(
    getVisionAnalysisImageUrl(inspectionId, 'field/001'),
    `/api/vision/analyses/${inspectionId}/image?fieldId=field%2F001`,
  );
});

test('Vision POST: publica exactamente una confirmación con el contexto validado', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const events = [];
  const unsubscribe = subscribeToVisionAnalysisConfirmed(event => events.push(event));
  t.after(unsubscribe);
  globalThis.fetch = async () => response(200, envelope(confirmedPostDetail));

  await analyzeVisionImage({
    cropType: 'ORANGE', fieldId: 'field-001', zoneId: 'zone-03',
    imageFileName: 'orange.png',
    imageFile: new File([new Uint8Array([1, 2, 3])], 'orange.png', { type: 'image/png' }),
  });

  assert.deepEqual(events, [{
    inspectionId, fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03',
    createdAt: detail.createdAt,
  }]);
});

test('Vision: POST rechazado y lecturas GET no publican confirmaciones', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const events = [];
  const unsubscribe = subscribeToVisionAnalysisConfirmed(event => events.push(event));
  t.after(unsubscribe);

  globalThis.fetch = async () => response(503, envelope(null));
  await assert.rejects(analyzeVisionImage({
    cropType: 'ORANGE', fieldId: 'field-001', zoneId: 'zone-03',
    imageFileName: 'orange.png',
    imageFile: new File([new Uint8Array([1])], 'orange.png', { type: 'image/png' }),
  }));

  globalThis.fetch = async () => response(200, envelope({
    ...confirmedPostDetail,
    inspectionId: 'invalid-id',
  }));
  await assert.rejects(analyzeVisionImage({
    cropType: 'ORANGE', fieldId: 'field-001', zoneId: 'zone-03',
    imageFileName: 'orange.png',
    imageFile: new File([new Uint8Array([1])], 'orange.png', { type: 'image/png' }),
  }));

  globalThis.fetch = async () => response(200, envelope({ items: [historyItem], nextCursor: null }));
  await getVisionHistory({ fieldId: 'field-001', limit: 4 });
  globalThis.fetch = async () => response(200, envelope(detail));
  await getVisionAnalysisDetail(inspectionId, 'field-001');
  assert.deepEqual(events, []);
});

test('Vision history client: valida detalle, contexto y conserva metadatos y null', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let requestedUrl;
  globalThis.fetch = async url => {
    requestedUrl = String(url);
    return response(200, envelope(detail));
  };

  const result = await getVisionAnalysisDetail(inspectionId, 'field-001');
  assert.equal(requestedUrl, `/api/vision/analyses/${inspectionId}?fieldId=field-001`);
  assert.equal(result.source, 'BACKEND');
  assert.equal(result.inspection.createdAt, detail.createdAt);
  assert.equal(result.inspection.modelVersion, 'orange-1.0.0');
  assert.equal(result.inspection.visualMetrics.greenCoveragePercentage, null);
  assert.equal(result.inspection.evidence[0].value, undefined);

  globalThis.fetch = async () => response(200, envelope({ ...detail, fieldId: 'field-002' }));
  await assert.rejects(
    getVisionAnalysisDetail(inspectionId, 'field-001'),
    error => error.name === 'VisionRequestError',
  );
  globalThis.fetch = async () => response(200, envelope({ ...detail, architecture: null }));
  await assert.rejects(
    getVisionAnalysisDetail(inspectionId, 'field-001'),
    error => error.name === 'VisionRequestError',
  );
});

test('Vision history client: propaga HTTP y cancelación sin convertirlos en vacío', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  globalThis.fetch = async () => response(503, envelope(null));
  await assert.rejects(
    getVisionHistory({ fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03' }),
    error => error instanceof ApiGetError && error.code === 'HTTP',
  );

  const controller = new AbortController();
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  const pending = getVisionHistory(
    { fieldId: 'field-001', cropType: 'ORANGE', zoneId: 'zone-03' },
    controller.signal,
  );
  controller.abort(new DOMException('context changed', 'AbortError'));
  await assert.rejects(
    pending,
    error => error instanceof ApiGetError && error.code === 'CANCELLED',
  );
});

// Las transiciones React se comprueban en navegador: el proyecto no incluye jsdom ni un runner de componentes.
