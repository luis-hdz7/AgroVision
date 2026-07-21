import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { RiskService } from "../services/riskService";

/**
 * Obtiene el resumen ejecutivo de riesgo para una parcela.
 */

export const getRiskByField = async(req: Request, res: Response): Promise<void> => {
    try {
        //obtiene el parametro enviado en la url
        const {fieldId} = req.params;


        //valida que el cliente haya enviado el identificador del campo
        if (!fieldId) {
            res.status(400).json(fail(`Missing required route parameter: ${fieldId}`));
            return;
        }
        // Valida que fieldId sea un string.
        if (typeof fieldId !== "string") {
            res.status(400).json(fail("Invalid fieldId parameter"));
            return;
        }

        //solicita el resumen de riesgo de la parcela
        const risk = RiskService.getRiskByField(fieldId);

        res.status(200).json(ok(risk, "Risk assessment retrieved successfully"));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};