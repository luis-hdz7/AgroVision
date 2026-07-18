import { RiskLevel } from "../../risk/types/riskTypes";
import { EvidenceItem } from "../../analysis/types/evidenceTypes";

export type AlertType =
  | "WATER_STRESS"
  | "FUNGAL_RISK"
  | "LOW_VIGOR"
  | "VISUAL_ANOMALY"
  | "HEAT_STRESS"
  | "SYSTEM";

export type AlertStatus = "ACTIVE" | "RESOLVED" | "IGNORED";

/*
 * Contrato prescriptivo de alerta.
 * Cada alerta debe estar respaldada por evidencia multifuente
 * proveniente del análisis de ZoneInsight.
 */
export interface AgriculturalAlert {
  id: string;
  fieldId: string;
  zoneId?: string | null;

  type: AlertType;

  severity: RiskLevel;

  title: string;
  message: string;

  evidence: EvidenceItem[];

  recommendedAction: string;

  status: AlertStatus;

  createdAt: string;
  resolvedAt?: string | null;
}
