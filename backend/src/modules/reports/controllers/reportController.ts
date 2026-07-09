import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { getPrescriptiveReportByZone } from "../services/prescriptiveReportService";

export function getPrescriptiveReport(req: Request, res: Response): void {
  const zoneId = Array.isArray(req.params.zoneId)
    ? req.params.zoneId[0]
    : req.params.zoneId;

  const report = getPrescriptiveReportByZone(zoneId);

  if (!report) {
    res
      .status(404)
      .json(fail<null>(`No prescriptive report found for zone ${zoneId}`)); //esto es un error 404, no se encontro el reporte
    return;
  }

  res //res es la respuesta que se envia al cliente, en este caso es un objeto JSON con el reporte prescriptivo y un mensaje de exito
    .status(200)
    .json(
      ok(report, `Prescriptive report for zone ${zoneId} loaded successfully`),
    );
}


