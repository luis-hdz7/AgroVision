/**
 * =========================================
 * AgroVision - Fields Service
 * =========================================
 *
 * Fuente de datos:
 * Neon PostgreSQL -> Prisma -> Express.
 *
 * Responsabilidades:
 * - Obtener todas las parcelas.
 * - Obtener una parcela por ID.
 * - Consultar parcelas pertenecientes a una finca.
 * - Validar la respuesta del backend.
 *
 * No se utilizan mocks.
 */

import { apiGet } from "../../../shared/api/apiClient";
import { API_ENDPOINTS } from "../../../shared/api/endpoints";
import type { Field } from "../types/field.types.ts"

const MAX_POSTGRES_INT = 2147483647;
const MAX_DECIMAL_AREA = 9999999999.99;

function isValidId(value: unknown): value is number {
  return typeof value === "number"
    && Number.isInteger(value)
    && value >= 1
    && value <= MAX_POSTGRES_INT;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && new Date(value).toISOString() === value;
}

function isValidArea(value: unknown): value is number {
  return typeof value === "number"
    && Number.isFinite(value)
    && value > 0
    && value <= MAX_DECIMAL_AREA
    && Number(value.toFixed(2)) === value;
}

function isField(value: unknown): value is Field {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const field = value as Record<string, unknown>;

  return (
    isValidId(field.id) &&
    isValidId(field.farmId) &&
    typeof field.name === "string" &&
    field.name.trim().length > 0 &&
    isValidArea(field.areaSquareMeters) &&
    typeof field.soilType === "string" &&
    typeof field.irrigationType === "string" &&
    typeof field.status === "string" &&
    isIsoDate(field.createdAt)
  );
}

function validateFields(value: unknown): Field[] {
  if (
    !Array.isArray(value) ||
    !value.every(isField)
  ) {
    throw new Error(
      "El backend devolvió un listado de parcelas inválido."
    );
  }

  const ids = new Set(value.map((field) => field.id));
  if (ids.size !== value.length) {
    throw new Error("El backend devolvió parcelas con IDs duplicados.");
  }

  return value;
}

function validateId(id: number): void {
  if (!isValidId(id)) {
    throw new Error("El ID debe ser un entero PostgreSQL válido.");
  }
}

/**
 * GET /api/fields
 */
export async function getFields(
  signal?: AbortSignal
): Promise<Field[]> {
  const data = await apiGet<unknown>(
    API_ENDPOINTS.fields,
    signal
  );

  return validateFields(data);
}

/**
 * GET /api/fields/:id
 */
export async function getFieldById(
  id: number,
  signal?: AbortSignal
): Promise<Field> {
  validateId(id);

  const data = await apiGet<unknown>(
    `${API_ENDPOINTS.fields}/${id}`,
    signal
  );

  if (!isField(data)) {
    throw new Error("La parcela recibida es inválida.");
  }

  return data;
}

/**
 * GET /api/fields/farm/:farmId
 */
export async function getFieldsByFarmId(
  farmId: number,
  signal?: AbortSignal
): Promise<Field[]> {
  validateId(farmId);

  const data = await apiGet<unknown>(
    `${API_ENDPOINTS.fields}/farm/${farmId}`,
    signal
  );

  return validateFields(data);
}
