import { Request, Response } from 'express';
import { ok, fail } from '../../../shared/responses/apiResponses';
import { VegetationService } from '../types/services/vegetationService';
import { promises } from 'node:dns';


/**
 * Obtener los índices de vegetación de una parcela específica. :v
 *
 * Endpoint:
 * GET /api/vegetation/indices?fieldId=field-001
 */

export const getVegetationIndices = async (req: Request, res: Response): Promise<void> => {
     // Obtiene el parámetro enviado por query.
    try {
        const { fieldId } = req.query;
// Valida que el cliente haya enviado el fieldId.

        if (!fieldId) {
            res.status(400).json(fail("Missing required query parameter: fieldId"));
            return;
        }

        // Filtramos por el fieldId solicitado al campo indicado
        const records = VegetationService.getHistoryByField(fieldId as string);
//devuelve la info con el formato de ApiResponse
        res.status(200).json(ok(records, "Vegetation indices retrieved successfully"));
    } catch (error: any) { //error inesperado
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};
// Obtiene las snapshots
export const getAllSnapshots = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = VegetationService.getAllSnapshots();

        res.status(200).json(ok(data, "Vegetation snapshots retrieved successfully"));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};

export const getVegetationHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const {fieldId} = req.params;
        if (!fieldId) {
            res.status(400).json(fail("Field ID is required."));
            return;
        }
        const data = VegetationService.getHistoryByField(fieldId as string);
        res.status(200).json(ok(data, `Vegetation history for field ${fieldId} retrieved successfully`));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};
