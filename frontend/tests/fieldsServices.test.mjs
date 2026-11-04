/**
 * Pruebas aisladas de FieldsServices sobre apiGet y fetch sustituido.
 * Verifican DTO, IDs, colecciones y rutas sin acceder al backend real.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getFieldById,
  getFields,
  getFieldsByFarmId,
} from '../src/features/fields/services/fieldsServices.ts';

const field = {
  id: 8, farmId: 7, name: 'Parcela A', areaSquareMeters: 80.5,
  soilType: 'LOAMY', irrigationType: 'DRIP', status: 'NORMAL',
  createdAt: '2026-10-08T00:00:00.000Z',
};
const envelope = data => ({
  success: true, data, message: 'ok', error: null,
  timestamp: '2026-11-03T00:00:00.000Z',
});
const ok = data => ({ ok: true, status: 200, json: async () => envelope(data) });

test('FieldsServices: acepta DTO válidos y utiliza las tres rutas existentes', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const urls = [];
  globalThis.fetch = async url => {
    urls.push(url);
    if (url.endsWith('/8')) return ok(field);
    if (url.endsWith('/farm/7')) return ok([field]);
    return ok([field]);
  };

  assert.deepEqual(await getFields(), [field]);
  assert.deepEqual(await getFieldById(8), field);
  assert.deepEqual(await getFieldsByFarmId(7), [field]);
  assert.deepEqual(urls, ['/api/fields', '/api/fields/8', '/api/fields/farm/7']);
  globalThis.fetch = async () => ok([]);
  assert.deepEqual(await getFields(), []);
});

test('FieldsServices: rechaza IDs, filas y colecciones ambiguas', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return ok(field); };
  for (const id of [0, -1, 1.2, NaN, Infinity, 2147483648]) {
    await assert.rejects(getFieldById(id));
    await assert.rejects(getFieldsByFarmId(id));
  }
  assert.equal(calls, 0, 'Los IDs inválidos se rechazan antes de fetch');

  const invalidFields = [
    { ...field, id: 2147483648 },
    { ...field, farmId: 0 },
    { ...field, name: '   ' },
    { ...field, areaSquareMeters: 0 },
    { ...field, areaSquareMeters: 1.001 },
    { ...field, areaSquareMeters: Infinity },
    { ...field, createdAt: 'not-a-date' },
    { ...field, createdAt: '2026-02-30T00:00:00.000Z' },
    { ...field, id: '8' },
  ];
  for (const invalid of invalidFields) {
    globalThis.fetch = async () => ok([invalid]);
    await assert.rejects(getFields());
  }
  globalThis.fetch = async () => ok([field, { ...field }]);
  await assert.rejects(getFields(), /duplicados/);
  globalThis.fetch = async () => ok({ ...field, areaSquareMeters: -1 });
  await assert.rejects(getFieldById(8));
});

test('FieldsServices: propaga HTTP y cancelación sin devolver listas vacías', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => ({
    ok: false, status: 503, json: async () => envelope(null),
  });
  await assert.rejects(getFields(), error => error.code === 'HTTP');

  const controller = new AbortController();
  controller.abort();
  let called = false;
  globalThis.fetch = async () => { called = true; return ok([]); };
  await assert.rejects(getFields(controller.signal), error => error.code === 'CANCELLED');
  assert.equal(called, false);
});

// Integración: valida el cliente; PostgreSQL y React Context se comprueban por separado.
