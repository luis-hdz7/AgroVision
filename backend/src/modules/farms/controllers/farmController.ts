import { Request, Response } from "express";
import { ZodError } from "zod";
import { FarmService } from "../service/farmService";
import {
  createFarmSchema,
  updateFarmSchema,
  farmIdParamSchema,
} from "../schemas/farmSchemas";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { classifyRegistrationError } from "../../../shared/errors/registrationErrors";

function respondError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json(fail("Parámetros o datos de finca inválidos."));
    return;
  }

  const result = classifyRegistrationError(
    error,
    "Finca no encontrada.",
    "No fue posible procesar la solicitud de finca.",
  );
  res.status(result.status).json(fail(result.message));
}

export class FarmController {
  private farmService = new FarmService();

  public getFarms = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const farms = await this.farmService.getFarms();

      res
        .status(200)
        .json(ok(farms, "Farms loaded successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public getFarmById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = farmIdParamSchema.parse(req.params);

      const farm = await this.farmService.getFarmById(id);

      res
        .status(200)
        .json(ok(farm, "Farm loaded successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public createFarm = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = createFarmSchema.parse(req.body);

      const farm = await this.farmService.createFarm(input);

      res
        .status(201)
        .json(ok(farm, "Farm created successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public updateFarm = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = farmIdParamSchema.parse(req.params);
      const input = updateFarmSchema.parse(req.body);

      const farm = await this.farmService.updateFarm(id, input);

      res
        .status(200)
        .json(ok(farm, "Farm updated successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public getFarmOverview = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const overview = await this.farmService.getFarmOverview();

      res
        .status(200)
        .json(ok(
          overview,
          "Farm overview loaded successfully"
        ));
    } catch (error) {
      res
        .status(500)
        .json(fail("Failed to load farm overview"));
    }
  };
}
