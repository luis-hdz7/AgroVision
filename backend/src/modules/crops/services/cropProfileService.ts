/**
 * =========================================
 * Crop Profile Service
 * =========================================
 *
 * Consulta y serialización del catálogo persistido de cultivos.
 *
 * Responsabilidades:
 * - consultar los perfiles registrados en PostgreSQL;
 * - validar las listas almacenadas como JSONB;
 * - serializar las fechas para el transporte HTTP;
 * - consultar perfiles mediante su código único;
 * - utilizar GENERAL cuando el perfil solicitado no existe.
 *
 * Los errores de consulta o de estructura se propagan al controlador.
 * =========================================
 */

import prisma from "../../../shared/database/prisma";
import type { CropProfile as PersistedCropProfile, Prisma } from "../../../generated/prisma/client";
import type { CropProfileResponse, CropType } from "../types/cropProfileTypes";

/** Valida que un documento JSONB contenga exclusivamente una lista de textos. */
function readStringList(value: Prisma.JsonValue, field: string, profileId: number): string[] {
  // JSONB permite múltiples estructuras; el contrato HTTP exige arrays de strings.
  if (!Array.isArray(value)) {
    throw new Error(`El perfil ${profileId} contiene una estructura inválida en ${field}.`);
  }

  // Creamos una lista independiente y validamos cada elemento sin conversiones forzadas.
  return value.map((item) => {
    if (typeof item !== "string") {
      throw new Error(`El perfil ${profileId} contiene un elemento inválido en ${field}.`);
    }

    return item;
  });
}

/** Construye la respuesta pública con listas validadas y fecha ISO 8601. */
function toResponse(profile: PersistedCropProfile): CropProfileResponse {
  return {
    id: profile.id,
    cropType: profile.cropType,
    displayName: profile.displayName,

    // Conservamos los valores almacenados y comprobamos su estructura antes de exponerlos.
    mainRisks: readStringList(profile.mainRisks, "mainRisks", profile.id),
    preferredMetrics: readStringList(profile.preferredMetrics, "preferredMetrics", profile.id),

    // El transporte HTTP recibe una fecha independiente del objeto Date de Prisma.
    createdAt: profile.createdAt.toISOString(),
  };
}

export class CropProfileService {
  /** Obtiene los perfiles con un orden estable para los consumidores. */
  public static async getAllProfiles(): Promise<CropProfileResponse[]> {
    // Recuperamos exclusivamente los perfiles persistidos.
    const profiles = await prisma.cropProfile.findMany({ orderBy: { id: "asc" } });

    // Cada registro se valida antes de construir la respuesta pública.
    return profiles.map(toResponse);
  }

  /** Busca el tipo solicitado y, si falta, el perfil GENERAL persistido. */
  public static async getProfileByType(cropType: CropType): Promise<CropProfileResponse | null> {
    // La restricción unique permite consultar directamente por el código de cultivo.
    const profile = await prisma.cropProfile.findUnique({ where: { cropType } });

    // Devolvemos el perfil solicitado cuando está registrado.
    if (profile) return toResponse(profile);

    // Evitamos repetir la misma consulta cuando ya buscamos GENERAL.
    if (cropType === "GENERAL") return null;

    // La alternativa también debe existir como registro real en PostgreSQL.
    const general = await prisma.cropProfile.findUnique({ where: { cropType: "GENERAL" } });

    // Si ninguno existe, el controlador conserva su respuesta 404.
    return general ? toResponse(general) : null;
  }
}