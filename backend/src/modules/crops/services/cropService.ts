import prisma from "../../../shared/database/prisma";
import type { Crop as PersistedCrop } from "../../../generated/prisma/client";
import { RegistrationError } from "../../../shared/errors/registrationErrors";
import type { CropResponse, CreateCropInput, UpdateCropInput } from "../types/cropTypes";

function toResponse(crop: PersistedCrop): CropResponse {
  return { ...crop, plantedAt: crop.plantedAt.toISOString() };
}

export class CropService {
  public async getCrops(): Promise<CropResponse[]> {
    const crops = await prisma.crop.findMany({ orderBy: { id: "asc" } });
    return crops.map(toResponse);
  }

  public async getCropById(id: number): Promise<CropResponse | null> {
    const crop = await prisma.crop.findUnique({ where: { id } });
    return crop ? toResponse(crop) : null;
  }

  public async getCropsByFieldId(fieldId: number): Promise<CropResponse[]> {
    const crops = await prisma.crop.findMany({
      where: { fieldId },
      orderBy: { id: "asc" },
    });
    return crops.map(toResponse);
  }

  public async createCrop(input: CreateCropInput): Promise<CropResponse> {
    const [field, profile] = await Promise.all([
      prisma.field.findUnique({ where: { id: input.fieldId } }),
      prisma.cropProfile.findUnique({ where: { id: input.cropProfileId } }),
    ]);

    if (!field) throw new RegistrationError(400, "La parcela indicada no existe.");
    if (!profile) throw new RegistrationError(400, "El perfil de cultivo indicado no existe.");
    if (profile.cropType !== input.cropType) {
      throw new RegistrationError(422, "El tipo de cultivo no coincide con el perfil indicado.");
    }

    const crop = await prisma.crop.create({
      data: { ...input, plantedAt: new Date(input.plantedAt) },
    });
    return toResponse(crop);
  }

  public async updateCrop(id: number, input: UpdateCropInput): Promise<CropResponse> {
    const crop = await prisma.$transaction(async (transaction) => {
      const current = await transaction.crop.findUnique({ where: { id } });
      if (!current) throw new RegistrationError(404, "Cultivo no encontrado.");

      const resultingProfileId = input.cropProfileId ?? current.cropProfileId;
      const resultingCropType = input.cropType ?? current.cropType;
      const profile = await transaction.cropProfile.findUnique({
        where: { id: resultingProfileId },
      });

      if (!profile) throw new RegistrationError(400, "El perfil de cultivo indicado no existe.");
      if (profile.cropType !== resultingCropType) {
        throw new RegistrationError(422, "El tipo de cultivo no coincide con el perfil indicado.");
      }

      return transaction.crop.update({
        where: { id },
        data: {
          ...input,
          ...(input.plantedAt !== undefined && { plantedAt: new Date(input.plantedAt) }),
        },
      });
    }, { isolationLevel: "Serializable" });

    return toResponse(crop);
  }
}
