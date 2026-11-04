import prisma from "../../../shared/database/prisma";
import type { Farm } from "../../../generated/prisma/client";
import { RegistrationError } from "../../../shared/errors/registrationErrors";
import {
  FarmOverview,
  FarmResponse,
  CreateFarmInput,
  UpdateFarmInput,
} from "../types/farmTypes";

function toResponse(farm: Farm): FarmResponse {
  return {
    id: farm.id,
    ownerId: farm.ownerId,
    name: farm.name,
    location: farm.location,
    totalAreaSquareMeters: Number(farm.totalAreaSquareMeters),
    createdAt: farm.createdAt.toISOString(),
  };
}

export class FarmService {

  public async getFarms(): Promise<FarmResponse[]> {
    const farms = await prisma.farm.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return farms.map(toResponse);
  }

  public async getFarmById(id: number): Promise<FarmResponse> {
    const farm = await prisma.farm.findUnique({
      where: {
        id,
      },
    });

    if (!farm) throw new RegistrationError(404, "Finca no encontrada.");
    return toResponse(farm);
  }

  public async createFarm(input: CreateFarmInput): Promise<FarmResponse> {
    const owner = await prisma.user.findUnique({ where: { id: input.ownerId } });
    if (!owner) throw new RegistrationError(400, "El propietario indicado no existe.");

    const farm = await prisma.farm.create({
      data: {
        ownerId: input.ownerId,
        name: input.name,
        location: input.location,
        totalAreaSquareMeters: input.totalAreaSquareMeters,
      },
    });

    return toResponse(farm);
  }

  public async updateFarm(
    id: number,
    input: UpdateFarmInput
  ): Promise<FarmResponse> {
    const farm = await prisma.farm.update({
      where: {
        id,
      },
      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),
        ...(input.location !== undefined && {
          location: input.location,
        }),
        ...(input.totalAreaSquareMeters !== undefined && {
          totalAreaSquareMeters: input.totalAreaSquareMeters,
        }),
      },
    });

    return toResponse(farm);
  }

  public async getFarmOverview(): Promise<FarmOverview> {
    const farm = await prisma.farm.findFirst({
      include: {
        fields: true,
      },
    });

    if (!farm) {
      throw new Error("No farms found");
    }

    return {
      id: farm.id.toString(),
      name: farm.name,
      location: {
        country: "Nicaragua",
        region: farm.location,
        city: null,
        latitude: null,
        longitude: null,
      },
      totalAreaSquareMeters: Number(farm.totalAreaSquareMeters),
      fieldsCount: farm.fields.length,
      activeCropCycles: 0,
      sensorsCount: 0,
      roverCount: 0,
      generalStatus: "STABLE",
      lastUpdateAt: farm.createdAt.toISOString(),
    };
  }
}
