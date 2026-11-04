/**
 * =========================================
 * AgroVision Crop Catalog Seed
 * =========================================
 *
 * Inicialización del catálogo de cultivos utilizado por la aplicación.
 *
 * Responsabilidades:
 * - mantener los códigos definidos por el contrato CropType;
 * - crear únicamente los perfiles que todavía no existen;
 * - conservar los IDs, las relaciones y la configuración existentes;
 * - confirmar la carga completa dentro de una transacción.
 *
 * Las reglas agronómicas y las plantillas conservan su configuración
 * almacenada. Los perfiles nuevos utilizan los valores del esquema.
 * =========================================
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import type { CropType } from "../src/modules/crops/types/cropProfileTypes";

// Utilizamos la misma variable de conexión configurada para el backend.
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida. Configúrala en backend/.env.");
}

// Este proceso administra su cliente y libera la conexión al finalizar.
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prismaClient = new PrismaClient({ adapter });

// Record exige que el catálogo incluya todos los códigos del contrato CropType.
const CROP_PROFILE_NAMES: Readonly<Record<CropType, string>> = {
  CORN: "Maíz",
  RED_BEAN: "Frijol rojo",
  CASSAVA: "Yuca",
  QUEQUISQUE: "Quequisque",
  ORANGE: "Naranjo",
  SORGHUM: "Sorgo",
  PEANUT: "Maní",
  GENERAL: "Cultivo genérico",
};

/** Comprueba el catálogo existente y crea los perfiles que falten. */
async function populateCropCatalog(prisma: Prisma.TransactionClient): Promise<number> {
  const cropTypes = Object.keys(CROP_PROFILE_NAMES);
  const recognizedTypes = new Set(cropTypes);

  // Revisamos todos los códigos antes de realizar la primera escritura.
  const existingProfiles = await prisma.cropProfile.findMany({
    select: { id: true, cropType: true },
  });

  // Los códigos ajenos al contrato requieren revisar sus relaciones existentes.
  const unexpectedProfiles = existingProfiles.filter(
    (profile) => !recognizedTypes.has(profile.cropType),
  );

  if (unexpectedProfiles.length > 0) {
    const details = unexpectedProfiles
      .map((profile) => `${profile.id}:${profile.cropType}`)
      .join(", ");

    throw new Error(
      `Se encontraron perfiles con códigos ajenos al catálogo: ${details}. Revisa sus relaciones antes de homologarlos.`,
    );
  }

  for (const [cropType, displayName] of Object.entries(CROP_PROFILE_NAMES)) {
    // El código único identifica el perfil sin depender de IDs fijos ni posiciones.
    await prisma.cropProfile.upsert({
      where: { cropType },

      // Conservamos el nombre, las reglas, las listas y las plantillas existentes.
      update: {},

      // Los campos JSONB nuevos reciben los valores predeterminados del esquema.
      create: { cropType, displayName },
    });
  }

  // Contamos los perfiles del catálogo después de completar las operaciones.
  return prisma.cropProfile.count({
    where: { cropType: { in: cropTypes } },
  });
}

/** Confirma el catálogo completo o revierte la carga ante cualquier error. */
async function main(): Promise<void> {
  console.log("Verificando el catálogo de cultivos de AgroVision...");

  const count = await prismaClient.$transaction(populateCropCatalog, {
    maxWait: 10_000,
    timeout: 60_000,
  });

  // Informamos el resultado después de confirmar la transacción.
  console.log(`Catálogo verificado correctamente: ${count} perfiles.`);
}

main()
  .catch((error: unknown) => {
    // Una carga fallida termina con código de error para poder detectarse.
    console.error(
      "Error preparando el catálogo:",
      error instanceof Error ? error.message : "Error desconocido",
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    // Liberamos la conexión tanto si la carga termina correctamente como si falla.
    await prismaClient.$disconnect();
  });