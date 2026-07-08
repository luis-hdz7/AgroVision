// ================================================================
// prescriptiveReportTypes.ts
// ================================================================
// Tipos del reporte prescriptivo. Actúan como capa de ADAPTACIÓN
// sobre las fuentes reales de datos del proyecto:
//   - ZoneInsight        (Jorge — types/zoneInsightTypes.ts)
//   - AgriculturalAlert  (Jorge — alertsTypes.ts)
//   - Recommendation     (Jorge — recommendations/types/recommendationTypes.ts)
//   - Cuaderno de campo  (TODO: pendiente de confirmar ubicación/forma)
//
// Este módulo NO redefine reglas de negocio de Jorge: reutiliza sus
// tipos (RiskLevel, RecommendationPriority) y solo agrega los campos
// que el reporte necesita y que las fuentes originales no producen
// (ids de evidencia, fechas normalizadas, relatedEvidenceIds, etc).
// ================================================================

import { RiskLevel } from "../../risk/types/riskTypes";
import { RecommendationPriority } from "../../recommendations/types/recommendationTypes"; // ajustar path real

// ================================
// Evidencias
// ================================

// Forma base tomada de ZoneInsight.evidence[] (zoneInsightTypes.ts).
// ZoneInsight.evidence NO trae id ni fecha propia, así que se agregan
// aquí al construir el reporte, usando ZoneInsight.generatedAt como
// fecha de referencia.
export interface PrescriptiveEvidenceSummary {
    id: string;          // generado en buildPrescriptiveReport (ej. "ev-001")
    source: string;         // mismo valor que ZoneInsight.evidence[].type (ej. "SATELLITE", "ROVER_CAMERA")
    metric: string;       // ndvi, ndwi, temperature, etc.
    value: number | string | boolean | null;
    unit?: string | null;
    status: string;      // NORMAL | WATCH | WARNING | CRITICAL
    explanation: string;
    date: string;          // ISO — derivado de ZoneInsight.generatedAt
}

// ================================
// Recomendaciones
// ================================

// Adaptado desde Recommendation (recommendationTypes.ts).
// ASUNCIÓN PENDIENTE DE CONFIRMAR: `recommendation` concatena
// reason + suggestedAction para no perder el "por qué" en el reporte
// (importante para el pitch de Linda). Ajustar si el equipo prefiere
// usar solo suggestedAction.
export interface PrescriptiveRecommendationSummary {
    id: string;
    zoneId: string;
    recommendation: string;            // Recommendation.reason + " → " + Recommendation.suggestedAction
    priority: RecommendationPriority;   // reusa el enum real de Jorge (incluye URGENT)
    relatedEvidenceIds: string[];        // ids de PrescriptiveEvidenceSummary que la sustentan
}

// ================================
// Acciones realizadas
// ================================

// TODO: forma temporal. No se ha confirmado el tipo real del
// "cuaderno de campo" (de dónde sale actionsTaken/pendingActions).
// Se define aquí como tipo nuevo y documentado, NO como copia de
// algo existente, para no asumir una estructura de Jorge que no
// hemos visto.
export interface PrescriptiveActionLog {
    id: string;
    actionTaken: string;
    responsible: string;
    executionDate: string; // ISO
}

// ================================
// Alertas activas
// ================================

// Adaptado desde AgriculturalAlert (alertsTypes.ts).
// ASUNCIÓN PENDIENTE DE CONFIRMAR: `message` usa AgriculturalAlert.title
// (más corto, apto para listas/dashboard). Si se necesita el detalle
// completo, cambiar a `.message` o concatenar ambos.
export interface PrescriptiveAlertSummary {
    id: string;
    zoneId: string;
    severity: RiskLevel;   // mismo tipo que AgriculturalAlert.severity
    message: string;        // = AgriculturalAlert.title (a confirmar)
}

// ================================
// Acciones pendientes
// ================================

// TODO: misma situación que PrescriptiveActionLog — forma temporal
// hasta confirmar el tipo real del cuaderno de campo.
export interface PrescriptivePendingAction {
    id: string;
    description: string;
    dueDate: string | null; // ISO o null
    priority: RecommendationPriority;
}

// ================================
// Reporte Prescriptivo
// ================================

// Reporte completo. Cada campo documenta explícitamente de qué
// fuente real de Jorge se deriva, para que quede trazable en
// prescriptive-traceability-v0.md.
export interface PrescriptiveFieldReport {
    fieldId: string;          // = ZoneInsight.fieldId
    zoneId: string;            // = ZoneInsight.zoneId
    cropType: string;           // = ZoneInsight.cropType
    healthScore: number;         // = ZoneInsight.healthScore
    finalRiskLevel: RiskLevel;    // = ZoneInsight.finalRiskLevel
    mainCause: string;             // = ZoneInsight.mainCause
    evidence: PrescriptiveEvidenceSummary[];        // adaptado de ZoneInsight.evidence[]
    activeAlerts: PrescriptiveAlertSummary[];         // adaptado de AgriculturalAlert[]
    recommendations: PrescriptiveRecommendationSummary[]; // adaptado de Recommendation[]
    actionsTaken: PrescriptiveActionLog[];              // TODO: fuente pendiente (cuaderno de campo)
    pendingActions: PrescriptivePendingAction[];         // TODO: fuente pendiente (cuaderno de campo)
    createdAt: string;                                    // ISO, generado al construir el reporte
}