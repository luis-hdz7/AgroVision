import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { getPrescriptiveReportByZone } from "../services/prescriptiveReportService";

export function getPrescriptiveReport(req: Request, res: Response): void {
  const zoneId = Array.isArray(req.params.zoneId) ? req.params.zoneId[0] : req.params.zoneId;

  const report = getPrescriptiveReportByZone(zoneId);

  if (!report) {
    res.status(404).json(fail<null>(`No prescriptive report found for zone ${zoneId}`));
    return;
  }

  res.status(200).json(ok(report, `Prescriptive report for zone ${zoneId} loaded successfully`));
}
