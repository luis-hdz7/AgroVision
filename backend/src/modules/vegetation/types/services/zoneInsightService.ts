import { zoneInsightMock } from "../../../analisys/data/zoneInsightMock";
import { ZoneInsight } from "../../../analisys/types/zoneInsightTypes";

export class ZoneInsightService {
    /**
     * Obtiene todos los insights de zonas procesados.
     */
    public static getAllInsights(): ZoneInsight[] {
        return zoneInsightMock;
    }

    /**
     * Busca el análisis específico de una zona (zone-01, zone-02, etc.).
     */
    public static getInsightByZone(zoneId: string): ZoneInsight | undefined {
        return zoneInsightMock.find((insight) => insight.zoneId === zoneId);
    }

    /**
     * Filtra los insights basados en el nivel de riesgo crítico (LOW, MEDIUM, HIGH).
     */
    public static getInsightsByRisk(riskLevel: "LOW" | "MEDIUM" | "HIGH"): ZoneInsight[] {
        return zoneInsightMock.filter((insight) => insight.finalRiksLevel === riskLevel);
    }
}