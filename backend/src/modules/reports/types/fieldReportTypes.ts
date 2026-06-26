export type FieldReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FieldReportEvidence {
  id: string;
  type: 'image' | 'video' | 'sensor' | 'note' | 'document';
  source: string;
  description: string;
  url?: string;
  capturedAt?: string;
}

export interface FieldReportAlert {
  id: string;
  title: string;
  description: string;
  severity: FieldReportSeverity;
  detectedAt: string;
}

export interface FieldReportRecommendation {
  id: string;
  summary: string;
  details?: string;
  recommendedAt: string;
  dueDate?: string;
}

export interface FieldReportAction {
  id: string;
  summary: string;
  details?: string;
  takenAt: string;
  performedBy?: string;
}

export interface FieldReport {
  fieldId: string;
  fieldName: string;
  cropName: string;
  incidentDescription: string; // qué pasó
  location: string; // dónde pasó
  severity: FieldReportSeverity; // qué tan grave fue
  alerts?: FieldReportAlert[];
  evidence?: FieldReportEvidence[]; // qué evidencia existe
  recommendations?: FieldReportRecommendation[]; // qué acción se recomienda
  actionsTaken?: FieldReportAction[]; // qué acción se tomó
  createdAt: string;
  updatedAt?: string;
}