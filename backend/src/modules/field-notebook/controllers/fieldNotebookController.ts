import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { FieldNotebookService } from "../services/fieldNotebookService";

export class FieldNotebookController {
  public static getAllFieldNotebookEntries(req: Request, res: Response): void {
    try {
      const data = FieldNotebookService.getAllEntries();
      const message =
        data.length > 0
          ? "Field notebook entries loaded successfully"
          : "No field notebook entries found";

      res.status(200).json(ok(data.length > 0 ? data : [], message));
    } catch (error: any) {
      res
        .status(500)
        .json(fail(error?.message || "Failed to load field notebook entries"));
    }
  }

  public static getFieldNotebookEntriesByZone(
    req: Request,
    res: Response,
  ): void {
    try {
      const zoneId = Array.isArray(req.params.zoneId)
        ? req.params.zoneId[0]
        : req.params.zoneId;
      const data = FieldNotebookService.getEntriesByZone(zoneId || "");
      const message =
        data.length > 0
          ? "Field notebook entries loaded successfully"
          : "No field notebook entries found";

      res.status(200).json(ok(data.length > 0 ? data : [], message));
    } catch (error: any) {
      res
        .status(500)
        .json(
          fail(
            error?.message || "Failed to load field notebook entries by zone",
          ),
        );
    }
  }

  public static getFieldNotebookEntriesByField(
    req: Request,
    res: Response,
  ): void {
    try {
      const fieldId = Array.isArray(req.params.fieldId)
        ? req.params.fieldId[0]
        : req.params.fieldId;
      const data = FieldNotebookService.getEntriesByField(fieldId || "");
      const message =
        data.length > 0
          ? "Field notebook entries loaded successfully"
          : "No field notebook entries found";

      res.status(200).json(ok(data.length > 0 ? data : [], message));
    } catch (error: any) {
      res
        .status(500)
        .json(
          fail(
            error?.message || "Failed to load field notebook entries by field",
          ),
        );
    }
  }
}
