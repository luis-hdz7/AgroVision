/**
 * =========================================
 * Reports Types
 * =========================================
 *
 * Tipos para reportes prescriptivos.
 *
 * Finalidad:
 * - representar trazabilidad técnica por zona;
 * - conectar riesgo, evidencia, alertas, recomendaciones y acciones;
 * - evitar campos incorrectos.
 *
 * Regla:
 * Un reporte prescriptivo debe explicar:
 * - qué pasa;
 * - dónde pasa;
 * - qué evidencia lo respalda;
 * - qué acciones existen;
 * - qué queda pendiente.
*/

export type CropType =
    | "RED_BEAN"
    | "CASSAVA"
    | "QUEQUISQUE"
    | "ORANGE"
    | "SORGHUM"
    | "PEANUT"
    | "GENERAL";

export type RiskLevel =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export type EvidenceSource =
    | "VISION"
    | "SATELLITE"
    | "SENSOR"
    | "WEATHER"
    | "HISTORY"
    | "MANUAL"
    | "MAPPING"
    | "SIMULATION";

export type EvidenceStatus =
    | "NORMAL"
    | "WATCH"
    | "WARNING"
    | "CRITICAL";

export type ReportActionStatus =
    | "DONE"
    | "PENDING"
    | "IN_PROGRESS"
    | "BLOCKED";

export type RecommendationPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";


export interface EvidenceItem {
    readonly source: EvidenceSource;
    readonly metric: string;
    readonly value?: number | string | boolean | null;
    readonly unit?: string | null;
    readonly status: EvidenceStatus;
    readonly explanation: string;
    readonly capturedAt?: string | null;
}

export interface ReportAlert {
    readonly id: string;
    readonly type: string;
    readonly severity: RiskLevel;
    readonly title: string;
    readonly message: string;
    readonly recommendedAction: string;
    readonly createdAt: string;
}

export interface ReportRecommendation {
    readonly id: string;
    readonly priority: RecommendationPriority;
    readonly reason: string;
    readonly suggestedAction: string;
    readonly expectedImpact: {
        readonly impactArea:
            | "WATER_SAVING"
            | "YIELD_PROTECTION"
            | "DISEASE_PREVENTION"
            | "COST_REDUCTION"
            | "CROP_HEALTH";
        readonly description: string;
    };
    readonly createdAt: string;
}

export interface ReportAction {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly status: ReportActionStatus;
    readonly responsible?: string | null;
    readonly registeredAt: string;
}

export interface PrescriptiveReport {
    readonly reportId: string;
    readonly fieldId: string;
    readonly zoneId: string;
    readonly cropType: CropType;

    readonly healthScore: number;
    readonly finalRiskLevel: RiskLevel;

    readonly mainCause: string;
    readonly summary: string;

    readonly evidence: ReadonlyArray<EvidenceItem>;
    readonly activeAlerts: ReadonlyArray<ReportAlert>;
    readonly recommendations: ReadonlyArray<ReportRecommendation>;

    readonly actionsTaken: ReadonlyArray<ReportAction>;
    readonly pendingActions: ReadonlyArray<ReportAction>;

    readonly createdAt: string;
}

export interface ReportsData {
    readonly report: PrescriptiveReport;
    readonly generatedAt: string;
}

/**
 * Contrato de respuesta API.
 * coincide con ApiResponse<T> definido en el contrato global.
 */
export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message?: string;
    readonly error?: string;
    readonly timestamp: string;
}