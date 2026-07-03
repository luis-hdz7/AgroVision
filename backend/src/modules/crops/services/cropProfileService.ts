
import { cropProfilesMock } from "../data/cropProfileMock";
import type { CropProfile, CropType } from "../types/cropProfileTypes";

export class CropProfileService {
  /**
   * Obtiene todos los perfiles técnicos de cultivo disponibles.
   *
  public static getAllProfiles(): CropProfile[] {
    return cropProfilesMock;
  }

  /**
   * Busca un perfil por su tipo de cultivo.
   * Si no se encuentra, retorna el perfil 'GENERAL' como fallback preventivo.
   */
  public static getProfileByType(cropType: CropType): CropProfile {
    const profile = cropProfilesMock.find((p) => p.cropType === cropType);
    
    if (!profile) {
      // Fallback seguro según el diseño del contrato para evitar excepciones en cascada
      return cropProfilesMock.find((p) => p.cropType === "GENERAL")!;
    }
    
    return profile;
  }
}