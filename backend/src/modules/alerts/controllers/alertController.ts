import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { AlertService } from "../services/alertService";
// import { alertsMock } from "../data/alertsMock";

//modificado por leo
export class AlertController {

    /**
     * Obtiene todas las alertas agrícolas registradas.
     *
     * Endpoint:
     * GET /api/alerts
     */


    public static getAlerts(req: Request, res: Response): void {
        try {
            const alerts = AlertService.getAllAlerts();
            res.status(200).json(ok(alerts, "Agricultural alerts loaded successfully"));
        } catch (error: any) {
            res.status(500).json(fail(error?.message || "Failed to load agricultural alerts"));
        }
    }
    //antiguo codigo que ya no necesitamos
    // static getAlerts(
    //     req: Request,
    //     res: Response
    // ): void {

    //     res.status(200).json({
    //         success: true,
    //         count: alertsMock.length,
    //         data: alertsMock
    //     });
    // }
}