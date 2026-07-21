import { zoneInsightMock } from "../../analysis/data/zoneInsightMock";
import { alertsMock } from "../../alerts/data/alertsMock";
import { recommendationsMock } from "../../recommendations/data/recommendationsMock";
import { getPrescriptiveReportByZone } from "../../reports/services/prescriptiveReportService";
import { DashboardSummary } from "../types/dashboardTypes";

export class DashboardService {
    public static getDashboardSummary(): DashboardSummary {
        const insight = zoneInsightMock.find(zone => zone.zoneId === "zone-03");
        const alert = alertsMock.find(alert => alert.zoneId === "zone-03");
        const recommendation = recommendationsMock.find(recommendation => recommendation.zoneId === "zone-03");
        const report = getPrescriptiveReportByZone("zone-03");
        const prescriptiveSummary = `Main cause: ${report?.mainCause}.` + `${report?.recommendations.length ?? 0} recommendation(s) generated`;

        if (!insight || !alert || !recommendation || !report) {
            throw new Error("Dashboard summary data is incomplete.");
        }

        return {
            fieldId: insight.fieldId,
            criticalZoneId: insight.zoneId,
            dominantRiskLevel: insight.finalRiskLevel,
            healthScore: insight.healthScore,
            mainCause: insight.mainCause,
            prescriptiveSummary,
            mainAlert: alert,
            mainRecommendation: recommendation,
            evidence: insight.evidence,
            generatedAt: insight.generatedAt
        }
    }
}