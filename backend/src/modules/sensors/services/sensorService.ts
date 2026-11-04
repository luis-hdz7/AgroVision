import prisma from "../../../shared/database/prisma";
import type { Sensor } from "../../../generated/prisma/client";
import { RegistrationError } from "../../../shared/errors/registrationErrors";
import type { SensorResponse, CreateSensorInput, UpdateSensorInput } from "../types/sensorTypes";

function toResponse(sensor: Sensor): SensorResponse {
  return {
    id: sensor.id,
    fieldId: sensor.fieldId,
    type: sensor.type,
    name: sensor.name,
    status: sensor.status,
    installedAt: sensor.installedAt.toISOString(),
  };
}

export class SensorService {
  public async getSensors(): Promise<SensorResponse[]> {
    const sensors = await prisma.sensor.findMany({ orderBy: { id: "asc" } });
    return sensors.map(toResponse);
  }

  public async getSensorById(id: number): Promise<SensorResponse | null> {
    const sensor = await prisma.sensor.findUnique({ where: { id } });
    return sensor ? toResponse(sensor) : null;
  }

  public async getSensorsByFieldId(fieldId: number): Promise<SensorResponse[]> {
    const sensors = await prisma.sensor.findMany({
      where: { fieldId },
      orderBy: { id: "asc" },
    });
    return sensors.map(toResponse);
  }

  public async createSensor(input: CreateSensorInput): Promise<SensorResponse> {
    const field = await prisma.field.findUnique({ where: { id: input.fieldId } });
    if (!field) throw new RegistrationError(400, "La parcela indicada no existe.");

    const sensor = await prisma.sensor.create({
      data: {
        fieldId: input.fieldId,
        type: input.type,
        name: input.name,
        status: input.status,
        installedAt: new Date(input.installedAt),
      },
    });
    return toResponse(sensor);
  }

  public async updateSensor(id: number, input: UpdateSensorInput): Promise<SensorResponse> {
    const sensor = await prisma.sensor.update({
      where: { id },
      data: {
        ...(input.type !== undefined && { type: input.type }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.status !== undefined && { status: input.status }),
      },
    });
    return toResponse(sensor);
  }
}
