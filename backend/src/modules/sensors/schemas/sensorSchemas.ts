/** Validación HTTP de Sensor, alineada con el enum SensorStatus de Prisma. */
import { z } from "zod";
import {
  nonEmptyStringSchema,
  postgresIdParamSchema,
  postgresIdSchema,
} from "../../../shared/validation/registrationSchemas";
const sensorStatusSchema = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);

export const createSensorSchema = z.object({
  fieldId: postgresIdSchema,
  type: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  status: sensorStatusSchema,
  installedAt: z.string().datetime({ offset: true }),
}).strict();

export const updateSensorSchema = z.object({
  type: nonEmptyStringSchema.optional(),
  name: nonEmptyStringSchema.optional(),
  status: sensorStatusSchema.optional(),
}).strict().refine(
  (input) => Object.keys(input).length > 0,
  { message: "At least one sensor field is required." },
);

export const sensorIdParamSchema = z.object({
  id: postgresIdParamSchema,
}).strict();

export const fieldIdParamSchema = z.object({
  fieldId: postgresIdParamSchema,
}).strict();
