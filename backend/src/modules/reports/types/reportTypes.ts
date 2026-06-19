// Esta carpeta contiene los tipos de datos relacionados con los reportes generados por el sistema.
export interface ReportEvidence {
  id: string;
  type: 'image' | 'video' | 'sensor' | 'note' | 'document';
  source: string;
  description: string;
  url?: string;
  capturedAt?: string;
}


// El FieldReport representa un reporte detallado sobre el estado de un campo específico.
export interface FieldReport {
  fieldId: string;
  fieldName: string;
  cropName: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeAlerts: string[];
  recommendations: string[];
  actionsTaken: string[];
  createdAt: string;
  evidence?: ReportEvidence[];
}

// Representa el resumen de un reporte.
export interface ReportSummary {
  fieldId: string;
  fieldName: string;
  cropName: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeAlerts: number;
  recommendations: number;
  createdAt: string;
  lastEvidence?: ReportEvidence;
}
