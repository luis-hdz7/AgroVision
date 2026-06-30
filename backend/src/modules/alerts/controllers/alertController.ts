import { Request, Response } from "express";
import { alertsMock } from "../data/alertsMock";

export class AlertController {

    static getAlerts(
        req: Request,
        res: Response
    ): void {

        res.status(200).json({
            success: true,
            count: alertsMock.length,
            data: alertsMock
        });
    }
}