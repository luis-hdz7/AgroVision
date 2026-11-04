/** Coordinación aislada del consumidor Vision de Dashboard, sin React ni navegador. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DashboardVisionEvidenceController,
} from '../src/features/dashboard/hooks/useDashboardVisionEvidence.ts';
import {
  publishVisionAnalysisConfirmed,
} from '../src/features/vision-ai/services/visionAnalysisEvents.ts';

const item = (fieldId, inspectionId) => ({
  inspectionId,
  fieldId,
  zoneId: 'zone-03',
  cropType: 'ORANGE',
  prediction: 'HEALTHY',
  detectedClass: 'healthy',
  confidence: 0.95,
  modelId: 'orange-model',
  modelVersion: '1.0.0',
  hasImage: true,
  createdAt: '2026-11-04T01:19:38.294Z',
});

const event = fieldId => ({
  inspectionId: '00000000-0000-4000-8000-000000000099',
  fieldId,
  cropType: 'ORANGE',
  zoneId: 'zone-03',
  createdAt: '2026-11-04T01:20:00.000Z',
});

test('Dashboard Vision: consulta al montar y refresca solo por su parcela', async () => {
  const states = [];
  const calls = [];
  const controller = new DashboardVisionEvidenceController(
    state => states.push(state),
    async fieldId => {
      calls.push(fieldId);
      return { items: [item(fieldId, `00000000-0000-4000-8000-00000000000${calls.length}`)], nextCursor: null };
    },
  );
  controller.mount('field-001');
  await settle();
  assert.deepEqual(calls, ['field-001']);
  assert.equal(states.at(-1).status, 'READY');

  publishVisionAnalysisConfirmed(event('field-002'));
  await settle();
  assert.deepEqual(calls, ['field-001']);

  publishVisionAnalysisConfirmed(event('field-001'));
  await settle();
  assert.deepEqual(calls, ['field-001', 'field-001']);
  controller.dispose();
});

test('Dashboard Vision: descarta respuesta tardía al cambiar de parcela', async () => {
  const states = [];
  const pending = new Map();
  const controller = new DashboardVisionEvidenceController(
    state => states.push(state),
    fieldId => new Promise(resolve => pending.set(fieldId, resolve)),
  );
  controller.mount('field-001');
  controller.setFieldId('field-002');
  pending.get('field-002')({ items: [item('field-002', '00000000-0000-4000-8000-000000000002')], nextCursor: null });
  await settle();
  pending.get('field-001')({ items: [item('field-001', '00000000-0000-4000-8000-000000000001')], nextCursor: null });
  await settle();
  assert.equal(states.at(-1).items[0].fieldId, 'field-002');
  controller.dispose();
});

test('Dashboard Vision: desmontado deja de escuchar y separa vacío de error', async () => {
  const states = [];
  let calls = 0;
  const controller = new DashboardVisionEvidenceController(
    state => states.push(state),
    async () => {
      calls += 1;
      if (calls === 1) return { items: [], nextCursor: null };
      throw new Error('fallo controlado');
    },
  );
  controller.mount('field-001');
  await settle();
  assert.equal(states.at(-1).status, 'EMPTY');
  await controller.refresh();
  assert.equal(states.at(-1).status, 'ERROR');
  assert.equal(states.at(-1).error, 'fallo controlado');
  controller.dispose();
  publishVisionAnalysisConfirmed(event('field-001'));
  await settle();
  assert.equal(calls, 2);
});

test('Dashboard Vision: sin parcela no consulta ni inventa registros', async () => {
  const states = [];
  let calls = 0;
  const controller = new DashboardVisionEvidenceController(
    state => states.push(state),
    async () => { calls += 1; return { items: [], nextCursor: null }; },
  );
  controller.mount(null);
  await settle();
  assert.equal(calls, 0);
  assert.equal(states.at(-1).status, 'SELECT_FIELD');
  controller.dispose();
});

function settle() {
  return new Promise(resolve => setTimeout(resolve, 0));
}
