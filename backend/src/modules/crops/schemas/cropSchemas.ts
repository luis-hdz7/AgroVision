/** Validación HTTP de Crop, sin alterar las rutas legacy de CropProfile. */
import { z } from "zod";
import {
  nonEmptyStringSchema,
  postgresIdParamSchema,
  postgresIdSchema,
} from "../../../shared/validation/registrationSchemas";

const cropTypeSchema = z.enum([
  "CORN", "RED_BEAN", "CASSAVA", "QUEQUISQUE",
  "ORANGE", "SORGHUM", "PEANUT", "GENERAL",
]);
const cropStatusSchema = z.enum(["ACTIVE", "HARVESTED", "INACTIVE"]);

export const createCropSchema = z.object({
  fieldId: postgresIdSchema,
  cropProfileId: postgresIdSchema,
  cropType: cropTypeSchema,
  name: nonEmptyStringSchema,
  growthStage: nonEmptyStringSchema,
  plantedAt: z.string().datetime({ offset: true }),
  status: cropStatusSchema,
}).strict();

export const updateCropSchema = z.object({
  cropProfileId: postgresIdSchema.optional(),
  cropType: cropTypeSchema.optional(),
  name: nonEmptyStringSchema.optional(),
  growthStage: nonEmptyStringSchema.optional(),
  plantedAt: z.string().datetime({ offset: true }).optional(),
  status: cropStatusSchema.optional(),
}).strict().refine(
  (input) => Object.keys(input).length > 0,
  { message: "At least one crop field is required." },
);

export const cropIdParamSchema = z.object({
  id: postgresIdParamSchema,
}).strict();

export const fieldIdParamSchema = z.object({
  fieldId: postgresIdParamSchema,
}).strict();

export const cropTypeParamSchema = z.object({
  type: nonEmptyStringSchema,
}).strict();
