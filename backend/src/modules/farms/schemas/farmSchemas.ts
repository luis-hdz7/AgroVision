/** Validación HTTP del módulo Farms, alineada con el modelo Prisma Farm. */
import { z } from "zod";
import {
  decimalAreaSchema,
  nonEmptyStringSchema,
  postgresIdParamSchema,
  postgresIdSchema,
} from "../../../shared/validation/registrationSchemas";

export const createFarmSchema = z.object({
  ownerId: postgresIdSchema,
  name: nonEmptyStringSchema,
  location: nonEmptyStringSchema,
  totalAreaSquareMeters: decimalAreaSchema,
}).strict();

export const updateFarmSchema = z.object({
  name: nonEmptyStringSchema.optional(),
  location: nonEmptyStringSchema.optional(),
  totalAreaSquareMeters: decimalAreaSchema.optional(),
}).strict().refine(
  (input) => Object.keys(input).length > 0,
  { message: "At least one farm field is required." },
);

export const farmIdParamSchema = z.object({
  id: postgresIdParamSchema,
}).strict();
