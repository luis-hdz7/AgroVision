// ================================
// Tipos auxiliares
// ================================

// Nivel de riesgo general del reporte
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

// Nivel de prioridad para recomendaciones y acciones
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Nivel de severidad de las alertas
export type AlertLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Fuentes válidas de evidencia utilizadas por el sistema
export type EvidenceSource =
    | "SATELLITE"
    | "SIMULATION"
    | "ROVER_CAMERA"
    | "UPLOAD"
    | "HISTORICAL";

// ================================
// Evidencias
// ================================

// Representa una evidencia utilizada para justificar
// el diagnóstico realizado sobre el cultivo.
export interface PrescriptiveEvidenceSummary {

    // Identificador único de la evidencia
    id: string;

    // Fuente desde donde se obtuvo la evidencia
    source: EvidenceSource;

    // Descripción técnica de la evidencia
    description: string;

    // Fecha en formato ISO
    date: string;
}

// ================================
// Recomendaciones
// ================================

// Acción recomendada por el sistema para disminuir
// el riesgo detectado.
export interface PrescriptiveRecommendationSummary {

    // Identificador único de la recomendación
    id: string;

    // Zona donde debe aplicarse la recomendación
    zoneId: string;

    // Acción sugerida
    recommendation: string;

    // Nivel de prioridad
    priority: Priority;
}

// ================================
// Acciones realizadas
// ================================

// Registro de acciones que ya fueron ejecutadas
// como respuesta al problema detectado.
export interface PrescriptiveActionLog {

    // Identificador único del registro
    id: string;

    // Acción ejecutada
    actionTaken: string;

    // Responsable de realizar la acción
    responsible: string;

    // Fecha de ejecución en formato ISO
    executionDate: string;
}

// ================================
// Alertas activas
// ================================

// Alerta actualmente activa sobre la zona analizada.
export interface PrescriptiveAlertSummary {

    // Identificador de la alerta
    id: string;

    // Zona afectada
    zoneId: string;

    // Nivel de gravedad
    level: AlertLevel;

    // Descripción de la alerta
    message: string;
}

// ================================
// Acciones pendientes
// ================================

// Acciones que todavía deben ejecutarse.
export interface PrescriptivePendingAction {

    // Identificador único
    id: string;

    // Descripción de la tarea pendiente
    description: string;

    // Fecha límite (ISO) o null si aún no existe
    dueDate: string | null;

    // Prioridad de ejecución
    priority: Priority;
}

// ================================
// Reporte Prescriptivo
// ================================

// Reporte completo generado por el sistema para
// apoyar la toma de decisiones agrícolas.
export interface PrescriptiveFieldReport {

    // Identificador del campo agrícola
    fieldId: string;

    // Identificador de la zona analizada
    zoneId: string;

    // Tipo de cultivo
    cropType: string;

    // Puntaje de salud del cultivo (0 - 100)
    healthScore: number;

    // Nivel de riesgo final calculado
    finalRiskLevel: RiskLevel;

    // Principal causa identificada
    mainCause: string;

    // Evidencias utilizadas para generar el reporte
    evidence: PrescriptiveEvidenceSummary[];

    // Alertas activas relacionadas con la zona
    activeAlerts: PrescriptiveAlertSummary[];

    // Recomendaciones generadas automáticamente
    recommendations: PrescriptiveRecommendationSummary[];

    // Acciones que ya fueron ejecutadas
    actionsTaken: PrescriptiveActionLog[];

    // Acciones pendientes de ejecutar
    pendingActions: PrescriptivePendingAction[];

    // Fecha de creación del reporte (formato ISO)
    createdAt: string;
}