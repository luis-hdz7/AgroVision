/**
 * Errores esperados de los registros agrícolas.
 * Traduce fallos de dominio y errores Prisma conocidos sin exponer detalles internos.
 */
import { Prisma } from "../../generated/prisma/client";

export class RegistrationError extends Error {
  public constructor(
    public readonly status: number,
    public readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = "RegistrationError";
  }
}

export function classifyRegistrationError(
  error: unknown,
  notFoundMessage: string,
  fallbackMessage: string,
): { status: number; message: string } {
  if (error instanceof RegistrationError) {
    return { status: error.status, message: error.publicMessage };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") return { status: 404, message: notFoundMessage };
    if (error.code === "P2003") return { status: 400, message: "La referencia indicada no existe." };
    if (error.code === "P2002") return { status: 409, message: "El registro entra en conflicto con uno existente." };
    if (error.code === "P2034") return { status: 409, message: "La actualización tuvo un conflicto de concurrencia." };
    if (["P1001", "P1002", "P1008", "P1017"].includes(error.code)) {
      return { status: 503, message: "La base de datos no está disponible." };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return { status: 503, message: "La base de datos no está disponible." };
  }

  return { status: 500, message: fallbackMessage };
}

// Límite: solo clasifica errores conocidos; los demás permanecen como fallos internos 500.
