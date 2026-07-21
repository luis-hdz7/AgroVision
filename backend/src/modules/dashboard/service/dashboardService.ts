import { zoneInsightMock } from "../../analysis/data/zoneInsightMock";
import { alertsMock } from "../../alerts/data/alertsMock";
import { recommendationsMock } from "../../recommendations/data/recommendationsMock";
import { getPrescriptiveReportByZone } from "../../reports/services/prescriptiveReportService";
import { DashboardSummary } from "../types/dashboardTypes";
import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { RiskLevel } from "../../risk/types/riskTypes";
import { AgriculturalAlert } from "../../alerts/types/alertsTypes";
import {Recommendation,RecommendationPriority} from "../../recommendations/types/recommendationTypes";

export class DashboardService {
    private static getRecommendationPriority(priority: RecommendationPriority): number {
        const priorities: Record<RecommendationPriority, number> = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            URGENT: 4
        };
        return priorities[priority];
    }
    private static getRiskPriority(riskLevel: RiskLevel): number {
        const priorities: Record<RiskLevel, number> = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            CRITICAL: 4
        };
        return priorities[riskLevel];
    }
    private static getCriticalEvidenceCount(insight: ZoneInsight): number {
        return insight.evidence.filter(evidence => evidence.status === "CRITICAL").length;
    }

    private static getCriticalZone(): ZoneInsight {
        return [...zoneInsightMock].sort((a, b) => {
            //*Prioridad del riesgo
            const riskDifference =this.getRiskPriority(b.finalRiskLevel) -this.getRiskPriority(a.finalRiskLevel);
            if (riskDifference !== 0) {
                return riskDifference;
            }
            //*Menor healthScore = mayor prioridad
            if (a.healthScore !== b.healthScore) {
                return a.healthScore - b.healthScore;
            }
            //* Más evidencia crítica
            const criticalEvidenceDifference =
                this.getCriticalEvidenceCount(b) -
                this.getCriticalEvidenceCount(a);
            return criticalEvidenceDifference;
        })[0];
    }

    private static getMainAlert(zoneId: string): AgriculturalAlert {
        const alerts = alertsMock.filter(alert =>
            alert.zoneId === zoneId &&
            alert.status === "ACTIVE"
        );
        return alerts.sort((a, b) =>
            this.getRiskPriority(b.severity) -this.getRiskPriority(a.severity)
        )[0];
    }

    private static getMainRecommendation(zoneId: string): Recommendation {
        const recommendations = recommendationsMock.filter(
            recommendation =>recommendation.zoneId === zoneId
        );
        return recommendations.sort((a, b) =>
            this.getRecommendationPriority(b.priority) -
            this.getRecommendationPriority(a.priority)
        )[0];
    }
    public static getDashboardSummary(): DashboardSummary {
        const insight = this.getCriticalZone();
        const alert = this.getMainAlert(insight.zoneId);
        const recommendation = this.getMainRecommendation(insight.zoneId);
        const report = getPrescriptiveReportByZone(insight.zoneId);
        if (!alert || !recommendation || !report) {
            throw new Error("Dashboard summary data is incomplete.");
        }
        const criticalEvidenceCount =this.getCriticalEvidenceCount(insight);
        const prescriptiveSummary =`${report.mainCause} ` +`${criticalEvidenceCount} critical evidence source(s) support this assessment. ` +
            `Recommended action: ${insight.recommendedAction}`;
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
        };
    }
}