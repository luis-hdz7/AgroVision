import { Request, Response } from "express";
import { ZodError } from "zod";
import { FieldService } from "../services/fieldService";
import {
  createFieldSchema,
  updateFieldSchema,
  fieldIdParamSchema,
  farmIdParamSchema,
} from "../schemas/fieldSchemas";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { classifyRegistrationError } from "../../../shared/errors/registrationErrors";

function respondError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json(fail("Parámetros o datos de parcela inválidos."));
    return;
  }

  const result = classifyRegistrationError(
    error,
    "Parcela no encontrada.",
    "No fue posible procesar la solicitud de parcela.",
  );
  res.status(result.status).json(fail(result.message));
}

export class FieldController {

  private fieldService = new FieldService();

  public getFields = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const fields = await this.fieldService.getFields();

      res
        .status(200)
        .json(ok(fields, "Fields loaded successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public getFieldById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = fieldIdParamSchema.parse(req.params);

      const field = await this.fieldService.getFieldById(id);

      res
        .status(200)
        .json(ok(field, "Field loaded successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public getFieldsByFarmId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { farmId } = farmIdParamSchema.parse(req.params);

      const fields =
        await this.fieldService.getFieldsByFarmId(farmId);

      res
        .status(200)
        .json(ok(fields, "Fields loaded successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public createField = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = createFieldSchema.parse(req.body);

      const field = await this.fieldService.createField(input);

      res
        .status(201)
        .json(ok(field, "Field created successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };

  public updateField = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = fieldIdParamSchema.parse(req.params);

      const input = updateFieldSchema.parse(req.body);

      const field =
        await this.fieldService.updateField(id, input);

      res
        .status(200)
        .json(ok(field, "Field updated successfully"));
    } catch (error: unknown) {
      respondError(res, error);
    }
  };
}
