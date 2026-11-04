/**
 * =========================================
 * AgroVision Intelligence - API Client
 * =========================================
 *
 * Cliente HTTP reutilizable.
 *
 * Centraliza:
 * - Solicitudes al backend Express.
 * - Lectura del contrato ApiResponse<T>.
 * - Errores HTTP.
 * - Cancelación mediante AbortSignal.
 *
 * Nunca conecta directamente con PostgreSQL.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
  timestamp: string;
}

export type ApiGetErrorCode =
  | "TIMEOUT"
  | "CANCELLED"
  | "NETWORK"
  | "HTTP"
  | "INVALID_JSON"
  | "INVALID_CONTRACT";

export class ApiGetError extends Error {
  public readonly code: ApiGetErrorCode;

  public constructor(
    code: ApiGetErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ApiGetError";
    this.code = code;
  }
}

interface ApiGetOptions {
  readonly timeoutMs?: number;
}

function isApiResponse(
  value: unknown
): value is ApiResponse<unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.success === "boolean" &&
    "data" in record &&
    typeof record.message === "string" &&
    (typeof record.error === "string" || record.error === null) &&
    typeof record.timestamp === "string"
  );
}

export async function apiGet<T>(
  endpoint: string,
  signal?: AbortSignal,
  options: ApiGetOptions = {}
): Promise<T> {
  if (signal?.aborted) {
    throw new ApiGetError("CANCELLED", "La consulta fue cancelada.");
  }

  const controller = new AbortController();
  let timedOut = false;
  let cancelledExternally = false;
  const cancelFromCaller = () => {
    cancelledExternally = true;
    controller.abort(signal?.reason);
  };
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort(new DOMException("Tiempo de espera agotado.", "TimeoutError"));
  }, options.timeoutMs ?? 15_000);

  signal?.addEventListener("abort", cancelFromCaller, { once: true });

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new ApiGetError("INVALID_JSON", "La API no devolvió JSON válido.");
    }

    if (!response.ok) {
      throw new ApiGetError("HTTP", `La consulta falló con HTTP ${response.status}.`);
    }

    if (!isApiResponse(payload) || !payload.success || payload.data === null) {
      throw new ApiGetError("INVALID_CONTRACT", "La API devolvió un contrato inválido.");
    }

    return payload.data as T;
  } catch (cause: unknown) {
    if (timedOut) {
      throw new ApiGetError("TIMEOUT", "La consulta excedió el tiempo máximo de espera.");
    }
    if (cancelledExternally || signal?.aborted) {
      throw new ApiGetError("CANCELLED", "La consulta fue cancelada.");
    }
    if (cause instanceof ApiGetError) throw cause;
    throw new ApiGetError("NETWORK", "No fue posible conectar con la API.");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancelFromCaller);
  }
}
