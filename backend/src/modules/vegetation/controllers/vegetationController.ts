import { Request, Response } from 'express';
import { ok, fail } from '../../../shared/responses/apiResponses';
import { VegetationService } from '../types/services/vegetationService';


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

        // Filtramos los snapshots por el fieldId solicitado al campo indicado
        const records = VegetationService.getHistoryByField(fieldId as string);
//devuelve la info con el formato de ApiResponse
        res.status(200).json(ok(records, "Vegetation indices retrieved successfully"));
    } catch (error: any) { //error inesperado
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};