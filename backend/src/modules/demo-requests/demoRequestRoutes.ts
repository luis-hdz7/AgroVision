import { Router } from "express";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client";
import prisma from "../../shared/database/prisma";
import { ok, fail } from "../../shared/responses/apiResponses";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal("true"),
}).strict();

function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  return error instanceof Prisma.PrismaClientKnownRequestError
    && ["P1001", "P1002", "P1008", "P1017"].includes(error.code);
}

export const demoRequestRoutes = Router();

demoRequestRoutes.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(fail("Revisa los datos e incluye la autorización de contacto."));
    return;
  }
  try {
    const { consent: _consent, ...data } = parsed.data;
    const request = await prisma.demoRequest.create({
      data: { ...data, organization: data.organization || null },
      select: { id: true },
    });
    res.status(201).json(ok({ id: request.id }, "Solicitud recibida."));
  } catch (error: unknown) {
    if (isDatabaseUnavailable(error)) {
      res.status(503).json(fail("La base de datos no está disponible. Inténtalo más tarde."));
      return;
    }
    res.status(500).json(fail("No fue posible procesar la solicitud."));
  }
});
