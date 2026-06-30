import { zoneInsightMock } from "../data/zoneInsightMock";

/**
 * Servicio para gestionar las consultas de análisis por zona
 * Abastece los datos estructurados
 */

export const getZoneAnalysisById = async (zoneId: string): Promise<any | null> => {
    const analysis = zoneInsightMock.find((zone:any) => zone.zoneId === zoneId);

    if (!analysis) {
        return null;
    }
    return analysis;
}