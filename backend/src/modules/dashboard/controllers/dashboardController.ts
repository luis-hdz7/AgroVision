import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { DashboardService } from "../service/dashboardService";

export function getDashboardSummary(req: Request, res: Response): void {
    try {
        const summary = DashboardService.getDashboardSummary();
//llama al servicio
        res.status(200).json(ok(summary, "Dashboard summary loaded successfully"));
    } catch (error: unknown) {

        const message = error instanceof Error ? error.message: "Failed to load dashboard summary";

        res.status(500).json(fail(message));
    }
}