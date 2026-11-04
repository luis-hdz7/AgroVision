/**
 * Cliente POST para solicitudes de demostración.
 * Recibe el formulario, controla cancelación/timeout y devuelve solo un ID confirmado.
 */
import { API_ENDPOINTS } from '../../../shared/api/endpoints';
import type {
  DemoRequestConfirmation,
  DemoRequestInput,
} from '../types/demoRequest.types';

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_POSTGRES_INT = 2_147_483_647;

interface SubmitDemoRequestOptions {
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
}

function isConfirmation(value: unknown): value is {
  success: true;
  data: DemoRequestConfirmation;
} {
  if (typeof value !== 'object' || value === null) return false;
  const response = value as Record<string, unknown>;
  if (response.success !== true || typeof response.data !== 'object' || response.data === null) {
    return false;
  }
  const id = (response.data as Record<string, unknown>).id;
  return typeof id === 'number'
    && Number.isInteger(id)
    && id >= 1
    && id <= MAX_POSTGRES_INT;
}

export async function submitDemoRequest(
  input: DemoRequestInput,
  options: SubmitDemoRequestOptions = {},
): Promise<DemoRequestConfirmation> {
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(options.signal?.reason);
  const timeout = setTimeout(
    () => controller.abort(new DOMException('Tiempo de espera agotado.', 'TimeoutError')),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  if (options.signal?.aborted) abortFromCaller();
  else options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
    const response = await fetch(API_ENDPOINTS.demoRequests, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        organization: input.organization,
        message: input.message,
        consent: input.consent,
      }),
      signal: controller.signal,
    });

    if (response.status !== 201) throw new Error('Respuesta HTTP no confirmada.');

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new Error('La respuesta no contiene JSON válido.');
    }

    if (!isConfirmation(body)) throw new Error('Confirmación inválida.');
    return { id: body.data.id };
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

// Límite: confirma la respuesta recibida; un fallo de red no demuestra que la BD no escribió.
