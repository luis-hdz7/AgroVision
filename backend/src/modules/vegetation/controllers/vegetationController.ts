import { Request, Response } from 'express';
import { vegetationIndexMock } from '../types/data/vegetationIndexMock';
import { ok, fail } from '../../../shared/responses/apiResponses';

export const getVegetationIndices = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fieldId } = req.query;

        if (!fieldId) {
            res.status(400).json(fail("Missing required query parameter: fieldId"));
            return;
        }

        // Filtramos los snapshots por el fieldId solicitado
        const records = vegetationIndexMock.filter((record: any) => record.fieldId === fieldId);

        res.status(200).json(ok(records, "Vegetation indices retrieved successfully"));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Internal server error"));
    }
};