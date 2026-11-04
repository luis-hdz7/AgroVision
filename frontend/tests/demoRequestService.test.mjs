/** Pruebas del cliente de demos con fetch sustituido; no comprueban el DOM. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { submitDemoRequest } from '../src/features/landing/services/demoRequestService.ts';

const input = {
  name: 'Productor Ejemplo', email: 'persona@example.test', organization: '',
  message: 'Quiero conocer AgroVision.', consent: 'true',
};
const response = (status, body) => ({ status, json: async () => body });

test('Cliente demo: solo confirma HTTP 201 con ID PostgreSQL válido', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => response(201, { success: true, data: { id: 12 } });
  assert.deepEqual(await submitDemoRequest(input), { id: 12 });

  for (const body of [
    { success: false, data: { id: 12 } }, { success: true, data: null },
    { success: true, data: {} }, { success: true, data: { id: '12' } },
    { success: true, data: { id: 0 } }, { success: true, data: { id: 2147483648 } },
  ]) {
    globalThis.fetch = async () => response(201, body);
    await assert.rejects(submitDemoRequest(input));
  }
  globalThis.fetch = async () => ({
    status: 201, json: async () => { throw new SyntaxError('bad json'); },
  });
  await assert.rejects(submitDemoRequest(input));
  for (const status of [200, 400, 500, 503]) {
    globalThis.fetch = async () => response(status, { success: true, data: { id: 12 } });
    await assert.rejects(submitDemoRequest(input));
  }
  globalThis.fetch = async () => { throw new TypeError('network failed'); };
  await assert.rejects(submitDemoRequest(input));
});

test('Cliente demo: timeout y cancelación externa alcanzan fetch', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let timeoutSignal;
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    timeoutSignal = options.signal;
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  await assert.rejects(submitDemoRequest(input, { timeoutMs: 5 }));
  assert.equal(timeoutSignal.aborted, true);

  const external = new AbortController();
  let externalSignal;
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    externalSignal = options.signal;
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  const pending = submitDemoRequest(input, { signal: external.signal, timeoutMs: 1_000 });
  external.abort(new DOMException('Navegación', 'AbortError'));
  await assert.rejects(pending, error => error?.name === 'AbortError');
  assert.equal(externalSignal.aborted, true);
});

// Integración: fetch se restaura tras cada prueba; la UI requiere verificación separada.
