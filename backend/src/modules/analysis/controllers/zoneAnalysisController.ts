import { Request, Response } from "express";
import { getZoneInsightByzoneId } from "../../analysis/services/zoneInsightMockService";
import { ok, fail } from "../../../shared/responses/apiResponses";

export const getZoneAnalysis = async (req: Request, res: Response): Promise<void> => {
    try {
        const { zoneId } = req.params;
        if (typeof zoneId !== "string") {
            res.status(400).json(fail("Invalid zone"));
            return;
        }

        // Busca en el mock del lunes por el zoneId
        const zoneData = getZoneInsightByzoneId(zoneId);
        if (!zoneData) {
            res.status(404).json(fail(`Zone analysis for ID ${zoneId} not found`));
            return;
        }
        res.status(200).json(ok(zoneData, "Zone analysis retrieved successfully"));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};