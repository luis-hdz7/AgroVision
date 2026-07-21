import { AgriculturalAlert } from "../../alerts/types/alertsTypes";
import { Recommendation } from "../../recommendations/types/recommendationTypes";
import { EvidenceItem } from "../../analysis/types/evidenceTypes";
import { RiskLevel } from "../../risk/types/riskTypes";

export interface DashboardSummary {
    readonly fieldId: string;
    readonly criticalZoneId: string;
    readonly dominantRiskLevel: RiskLevel;
    readonly healthScore: number;
    readonly mainCause: string;
    readonly prescriptiveSummary: string;
    readonly mainAlert: AgriculturalAlert;
    readonly mainRecommendation: Recommendation;
    readonly evidence: EvidenceItem[];
    readonly generatedAt: string;
}