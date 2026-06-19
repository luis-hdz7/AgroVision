import { FieldReport, FieldReportAlert, FieldReportEvidence, FieldReportRecommendation, FieldReportAction, FieldReportSeverity } from '../types/fieldReportTypes';

export interface BuildFieldReportInput {
  fieldId: string;
  fieldName: string;
  cropName: string;
  incidentDescription: string;
  location: string;
  severity: FieldReportSeverity;
  alerts?: Partial<FieldReportAlert>[];
  evidence?: Partial<FieldReportEvidence>[];
  recommendations?: Partial<FieldReportRecommendation>[];
  actionsTaken?: Partial<FieldReportAction>[];
  createdAt?: string;
  updatedAt?: string;
}

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const nowIso = () => new Date().toISOString();

export function buildFieldReport(data: BuildFieldReportInput): FieldReport {
  return {
    fieldId: data.fieldId,
    fieldName: data.fieldName,
    cropName: data.cropName,
    incidentDescription: data.incidentDescription,
    location: data.location,
    severity: data.severity,
    alerts: data.alerts?.map((alert) => ({
      id: alert.id ?? createId('alert'),
      title: alert.title ?? 'Alerta generada',
      description: alert.description ?? 'Descripción no disponible',
      severity: alert.severity ?? data.severity,
      detectedAt: alert.detectedAt ?? nowIso(),
    })),
    evidence: data.evidence?.map((evidence) => ({
      id: evidence.id ?? createId('evidence'),
      type: evidence.type ?? 'note',
      source: evidence.source ?? 'manual',
      description: evidence.description ?? 'Evidencia registrada',
      url: evidence.url,
      capturedAt: evidence.capturedAt ?? nowIso(),
    })),
    recommendations: data.recommendations?.map((recommendation) => ({
      id: recommendation.id ?? createId('recommendation'),
      summary: recommendation.summary ?? 'Recomendación generada',
      details: recommendation.details,
      recommendedAt: recommendation.recommendedAt ?? nowIso(),
      dueDate: recommendation.dueDate,
    })),
    actionsTaken: data.actionsTaken?.map((action) => ({
      id: action.id ?? createId('action'),
      summary: action.summary ?? 'Acción registrada',
      details: action.details,
      takenAt: action.takenAt ?? nowIso(),
      performedBy: action.performedBy,
    })),
    createdAt: data.createdAt ?? nowIso(),
    updatedAt: data.updatedAt,
  };
}
