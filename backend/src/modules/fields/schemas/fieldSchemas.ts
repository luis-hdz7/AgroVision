/** Validación HTTP del módulo Fields, alineada con el modelo Prisma Field. */
import { z } from "zod";
import {
  decimalAreaSchema,
  nonEmptyStringSchema,
  postgresIdParamSchema,
  postgresIdSchema,
} from "../../../shared/validation/registrationSchemas";

export const createFieldSchema = z.object({
  farmId: postgresIdSchema,
  name: nonEmptyStringSchema,
  areaSquareMeters: decimalAreaSchema,
  soilType: nonEmptyStringSchema,
  irrigationType: nonEmptyStringSchema,
  status: nonEmptyStringSchema,
}).strict();

export const updateFieldSchema = z.object({
  name: nonEmptyStringSchema.optional(),
  areaSquareMeters: decimalAreaSchema.optional(),
  soilType: nonEmptyStringSchema.optional(),
  irrigationType: nonEmptyStringSchema.optional(),
  status: nonEmptyStringSchema.optional(),
}).strict().refine(
  (input) => Object.keys(input).length > 0,
  { message: "At least one field value is required." },
);

export const fieldIdParamSchema = z.object({
  id: postgresIdParamSchema,
}).strict();

export const farmIdParamSchema = z.object({
  farmId: postgresIdParamSchema,
}).strict();
