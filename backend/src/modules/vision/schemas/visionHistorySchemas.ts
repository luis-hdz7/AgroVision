/**
 * Validación de entradas HTTP, cursores y documentos JSON del historial Vision.
 * Evita consultar con filtros ambiguos y valida en ejecución cada resultado persistido.
 */

import { z } from "zod";

const cropTypeSchema = z.enum([
  "CORN",
  "RED_BEAN",
  "CASSAVA",
  "QUEQUISQUE",
  "ORANGE",
  "SORGHUM",
  "PEANUT",
  "GENERAL",
]);

const fieldIdSchema = z.string().trim().min(1).max(100).superRefine((value, context) => {
  const match = /^(?:field-)?(\d+)$/.exec(value);
  if (!match) {
    context.addIssue({ code: "custom", message: "fieldId no tiene un formato válido." });
    return;
  }

  const numericId = BigInt(match[1]);
  if (numericId < 1n || numericId > 2_147_483_647n) {
    context.addIssue({ code: "custom", message: "fieldId está fuera del rango permitido." });
  }
});

const zoneIdSchema = z.string().trim().min(1).max(100);
const limitSchema = z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().int().min(1).max(100));

export const visionHistoryQuerySchema = z.object({
  fieldId: fieldIdSchema,
  cropType: cropTypeSchema.optional(),
  zoneId: zoneIdSchema.optional(),
  unassignedOnly: z.literal("true").optional(),
  limit: limitSchema.optional(),
  cursor: z.string().min(1).max(2048).optional(),
}).strict().superRefine((value, context) => {
  if (value.zoneId !== undefined && value.unassignedOnly !== undefined) {
    context.addIssue({ code: "custom", message: "zoneId y unassignedOnly no son compatibles." });
  }
}).transform((value) => ({
  ...value,
  unassignedOnly: value.unassignedOnly === "true",
  limit: value.limit ?? 20,
}));

export const visionHistoryDetailParamsSchema = z.object({
  inspectionId: z.string().uuid(),
}).strict();

export const visionHistoryDetailQuerySchema = z.object({
  fieldId: fieldIdSchema,
}).strict();

const nonBlankStringSchema = z.string().min(1).refine((value) => value.trim().length > 0);
const nullablePercentageSchema = z.number().finite().min(0).max(100).nullable();

export const visionAnalyzeResponseRecordSchema = z.object({
  inspectionId: z.string().uuid(),
  fieldId: nonBlankStringSchema.max(100),
  zoneId: nonBlankStringSchema.max(100).nullable(),
  cropType: cropTypeSchema,
  prediction: z.enum([
    "HEALTHY",
    "VISUAL_ANOMALY",
    "WATER_STRESS",
    "CHLOROSIS",
    "DRY_AREA",
    "LEAF_SPOT",
    "UNKNOWN",
  ]),
  detectedClass: nonBlankStringSchema,
  confidence: z.number().finite().min(0).max(1),
  modelId: nonBlankStringSchema,
  modelVersion: nonBlankStringSchema,
  architecture: nonBlankStringSchema,
  topClasses: z.array(z.object({
    className: nonBlankStringSchema,
    score: z.number().finite().min(0).max(1),
  }).strict()).min(1).max(3),
  inferenceMs: z.number().finite().nonnegative(),
  visualMetrics: z.object({
    greenCoveragePercentage: nullablePercentageSchema,
    dryAreaPercentage: nullablePercentageSchema,
    chlorosisSuspected: z.boolean().nullable(),
    leafSpotSuspected: z.boolean().nullable(),
    stressPatternDetected: z.boolean().nullable(),
  }).strict(),
  explanation: nonBlankStringSchema,
  recommendedAction: nonBlankStringSchema,
  evidence: z.array(z.object({
    source: z.enum([
      "SENSOR", "WEATHER", "SATELLITE", "VISION", "HISTORY",
      "MAPPING", "SIMULATION", "ROVER_CAMERA", "UPLOAD",
    ]),
    metric: nonBlankStringSchema,
    value: z.union([z.number().finite(), z.string(), z.boolean(), z.null()]).optional(),
    unit: z.string().nullable().optional(),
    status: z.enum(["NORMAL", "WATCH", "WARNING", "CRITICAL"]),
    explanation: nonBlankStringSchema,
  }).strict()).min(1),
  createdAt: z.string().datetime({ offset: true }),
}).strict();

export const visionHistoryCursorSchema = z.object({
  version: z.literal(1),
  createdAt: z.string().datetime({ offset: true }),
  inspectionId: z.string().uuid(),
  filters: z.object({
    fieldId: fieldIdSchema,
    cropType: cropTypeSchema.nullable(),
    zoneId: zoneIdSchema.nullable(),
    unassignedOnly: z.boolean(),
  }).strict(),
}).strict();

/** El servicio usa estos esquemas antes y después de acceder a PostgreSQL. */
