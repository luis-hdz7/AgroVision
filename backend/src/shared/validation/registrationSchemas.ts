/**
 * Validaciones compartidas para registros agrícolas.
 * Recibe valores HTTP ya deserializados y conserva los contratos numéricos existentes.
 */
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client";

export const postgresIdSchema = z.number().int().min(1).max(2147483647);

export const postgresIdParamSchema = z.string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(postgresIdSchema);

export const nonEmptyStringSchema = z.string().trim().min(1);

export const decimalAreaSchema = z.number().finite().positive().superRefine((value, context) => {
  const decimal = new Prisma.Decimal(value);

  if (decimal.greaterThan("9999999999.99")) {
    context.addIssue({ code: "custom", message: "La superficie excede Decimal(12, 2)." });
  }

  if (decimal.decimalPlaces() > 2) {
    context.addIssue({ code: "custom", message: "La superficie admite como máximo dos decimales." });
  }
});

// Integración: estos esquemas validan entradas; Prisma y PostgreSQL conservan la integridad final.
