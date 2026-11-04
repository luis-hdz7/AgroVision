/**
 * Pruebas aisladas de apiGet con fetch sustituido.
 * Verifican contrato, timeout, cancelación y liberación entre peticiones.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiGetError, apiGet } from '../src/shared/api/apiClient.ts';

const envelope = data => ({
  success: true, data, message: 'ok', error: null,
  timestamp: '2026-11-03T00:00:00.000Z',
});
const response = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test('apiGet: valida respuestas y no convierte errores en datos', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  globalThis.fetch = async () => response(200, envelope({ id: 1 }));
  assert.deepEqual(await apiGet('/api/value'), { id: 1 });
  globalThis.fetch = async () => response(200, envelope([]));
  assert.deepEqual(await apiGet('/api/value'), []);

  const invalidPayloads = [
    { ...envelope([]), success: false },
    envelope(null),
    { success: true, data: [] },
    null,
  ];
  for (const payload of invalidPayloads) {
    globalThis.fetch = async () => response(200, payload);
    await assert.rejects(apiGet('/api/value'), error => (
      error instanceof ApiGetError && error.code === 'INVALID_CONTRACT'
    ));
  }

  globalThis.fetch = async () => ({
    ok: true, status: 200,
    json: async () => { throw new SyntaxError('html or invalid json'); },
  });
  await assert.rejects(apiGet('/api/value'), error => error.code === 'INVALID_JSON');

  for (const status of [400, 404, 500, 503]) {
    globalThis.fetch = async () => response(status, envelope(null));
    await assert.rejects(apiGet('/api/value'), error => error.code === 'HTTP');
  }
  globalThis.fetch = async () => { throw new TypeError('network details'); };
  await assert.rejects(apiGet('/api/value'), error => error.code === 'NETWORK');
});

test('apiGet: cancelación y timeout alcanzan fetch y no contaminan consultas posteriores', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  let fetchCalls = 0;
  const alreadyAborted = new AbortController();
  alreadyAborted.abort();
  globalThis.fetch = async () => { fetchCalls += 1; };
  await assert.rejects(
    apiGet('/api/value', alreadyAborted.signal),
    error => error.code === 'CANCELLED',
  );
  assert.equal(fetchCalls, 0);

  const external = new AbortController();
  let receivedSignal;
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    receivedSignal = options.signal;
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  const cancelled = apiGet('/api/value', external.signal);
  external.abort(new DOMException('navigation', 'AbortError'));
  await assert.rejects(cancelled, error => error.code === 'CANCELLED');
  assert.equal(receivedSignal.aborted, true);

  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  await assert.rejects(
    apiGet('/api/value', undefined, { timeoutMs: 5 }),
    error => error.code === 'TIMEOUT',
  );

  globalThis.fetch = async (_url, options) => ({
    ok: true, status: 200,
    json: () => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    }),
  });
  await assert.rejects(
    apiGet('/api/value', undefined, { timeoutMs: 5 }),
    error => error.code === 'TIMEOUT',
  );

  globalThis.fetch = async () => response(200, envelope(['vigente']));
  assert.deepEqual(await apiGet('/api/value'), ['vigente']);
});

// Límite: no realiza red real; cada fetch sustituido respeta la señal recibida.
