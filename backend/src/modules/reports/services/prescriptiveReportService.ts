import { zoneInsightMock } from "../../analysis/data/zoneInsightMock";
import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { alertsMock } from "../../alerts/data/alertsMock";
import { AgriculturalAlert } from "../../alerts/types/alertsTypes";
import { recommendationsMock } from "../../recommendations/data/recommendationsMock";
import { Recommendation, RecommendationPriority } from "../../recommendations/types/recommendationTypes";
import { RiskLevel } from "../../risk/types/riskTypes";
import { FieldNotebookService } from "../../field-notebook/services/fieldNotebookService";
import {
  PrescriptiveActionLog,
  PrescriptiveAlertSummary,
  PrescriptiveEvidenceSummary,
  PrescriptiveFieldReport,
  PrescriptivePendingAction,
  PrescriptiveRecommendationSummary,
} from "../types/prescriptiveReportTypes";

function toRiskLevel(severity: AgriculturalAlert["severity"]): RiskLevel {
  return severity === "CRITICAL" ? "HIGH" : (severity as RiskLevel);
}

function adaptEvidence(insight: ZoneInsight): PrescriptiveEvidenceSummary[] {
  return insight.evidence.map((item, index) => ({
    id: `ev-${String(index + 1).padStart(3, "0")}`,
    type: item.source,
    value: item.value,
    description: item.explanation,
    date: insight.generatedAt,
  }));
}

function adaptAlerts(alerts: AgriculturalAlert[]): PrescriptiveAlertSummary[] {
  return alerts.map((alert) => ({
    id: alert.id,
    zoneId: alert.zoneId ?? "",
    severity: toRiskLevel(alert.severity),
    message: alert.title,
  }));
}

function adaptRecommendations(
  recommendations: Recommendation[],
  evidenceIds: Map<string, string>
): PrescriptiveRecommendationSummary[] {
  return recommendations.map((recommendation) => {
    const relatedEvidenceIds = recommendation.evidence
      .map((item) => evidenceIds.get(`${item.source}:${item.value}:${item.explanation}`) ?? evidenceIds.get(`${item.explanation}`))
      .filter((id): id is string => Boolean(id));

    return {
      id: recommendation.id,
      zoneId: recommendation.zoneId ?? "",
      recommendation: `${recommendation.reason} → ${recommendation.suggestedAction}`,
      priority: recommendation.priority as RecommendationPriority,
      relatedEvidenceIds,
    };
  });
}

function adaptActionsTaken(zoneEntries: ReturnType<typeof FieldNotebookService.getEntriesByZone>): PrescriptiveActionLog[] {
  return zoneEntries
    .filter((entry) => entry.actionTaken && !/pendiente/i.test(entry.actionTaken))
    .map((entry) => ({
      id: entry.id,
      actionTaken: entry.actionTaken,
      responsible: entry.responsibleUser,
      executionDate: entry.createdAt,
    }));
}

function adaptPendingActions(zoneEntries: ReturnType<typeof FieldNotebookService.getEntriesByZone>): PrescriptivePendingAction[] {
  return zoneEntries
    .filter((entry) => /pendiente/i.test(entry.actionTaken) || /pendiente/i.test(entry.description))
    .map((entry) => ({
      id: entry.id,
      description: entry.actionTaken || entry.description,
      dueDate: entry.createdAt,
      priority: "HIGH",
    }));
}

export function getPrescriptiveReportByZone(zoneId: string): PrescriptiveFieldReport | null {
  const insight = zoneInsightMock.find((item) => item.zoneId === zoneId);

  if (!insight) {
    return null;
  }

  const alerts = alertsMock.filter((alert) => alert.zoneId === zoneId);
  const recommendations = recommendationsMock.filter((recommendation) => recommendation.zoneId === zoneId);
  const zoneEntries = FieldNotebookService.getEntriesByZone(zoneId);

  const evidence = adaptEvidence(insight);
  const evidenceLookup = new Map<string, string>();

  evidence.forEach((item) => {
    evidenceLookup.set(`${item.type}:${item.value}:${item.description}`, item.id);
    evidenceLookup.set(item.description, item.id);
  });

  return {
    fieldId: insight.fieldId,
    zoneId: insight.zoneId,
    cropType: insight.cropType,
    healthScore: insight.healthScore,
    finalRiskLevel: (insight.finalRiskLevel === "CRITICAL" ? "HIGH" : insight.finalRiskLevel) as RiskLevel,
    mainCause: insight.mainCause,
    evidence,
    activeAlerts: adaptAlerts(alerts),
    recommendations: adaptRecommendations(recommendations, evidenceLookup),
    actionsTaken: adaptActionsTaken(zoneEntries),
    pendingActions: adaptPendingActions(zoneEntries),
    createdAt: insight.generatedAt,
  };
}
