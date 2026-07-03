/**
 * =========================================
 * Crop Profiles Service
 * =========================================
 *
 * Servicio frontend para perfiles de cultivo.
 *
 * Finalidad:
 * - ocultar a CropsPage el origen de los datos;
 * - preparar conexión futura con GET /api/crops/profiles;
 * - mantener mock fallback sin acoplarlo a la UI.
 */

import { API_ENDPOINTS } from "../../../shared/api/endpoints";
import type { CropProfile, CropType } from "../types/cropProfile.types";
import { cropProfilesMock } from "./cropProfilesMock";

// Endpoint oficial para backend.
export const CROP_PROFILES_ENDPOINT = API_ENDPOINTS.cropProfiles;

/**
 * Obtiene todos los perfiles de cultivo.
 *
 * Por ahora usa mock fallback.
 * Luego se reemplaza por fetch(CROP_PROFILES_ENDPOINT).
 */
export async function getCropProfiles(): Promise<ReadonlyArray<CropProfile>> {
  return cropProfilesMock.map(adaptCropProfile);
}


/**
 * Obtiene un perfil específico por cropType.
*/
export async function getCropProfileByCropType(cropType: CropType): Promise<CropProfile | null> {
  const profiles = await getCropProfiles();

  return profiles.find((profile) => profile.cropType === cropType) ?? null;
}

/**
 * Adapter local.
 *
 * Protege a la UI de mutaciones accidentales y normaliza arrays.
 */
function adaptCropProfile(profile: CropProfile): CropProfile {
  return {
    ...profile,
    analysisFocus: [...profile.analysisFocus],
    mainRisks: [...profile.mainRisks],
    preferredMetrics: [...profile.preferredMetrics],
    recommendationTemplates: {
      ...profile.recommendationTemplates,
    },
    riskRules: {
      ...profile.riskRules,
    },
  };
}

/**
 * CropsPage no consumirá cropProfilesMock directo.
 * La pantalla queda preparada para backend. 
*/