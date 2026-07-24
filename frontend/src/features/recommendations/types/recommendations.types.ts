/**
 * =========================================
 * Recommendations Types
 * =========================================
 *
 * Tipos para las recomendaciones prescriptivas.
 *
 * Finalidad:
 * - representar recomendaciones accionables;
 * - mantener evidencia técnica visible;
 * - alinear la UI de forma coherente
 *
 * Regla:
 * Una recomendación válida debe responder:
 * - por qué se recomienda;
 * - qué acción debe ejecutarse;
 * - qué impacto se espera;
 * - qué evidencia la respalda.
*/

export type RecommendationPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

export type RecommendationStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "APPLIED"
    | "DISMISSED";

export type ExpectedImpactArea =
    | "WATER_SAVING"
    | "YIELD_PROTECTION"
    | "DISEASE_PREVENTION"
    | "COST_REDUCTION"
    | "CROP_HEALTH";


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

export interface EvidenceItem {
    readonly source: EvidenceSource;
    readonly metric: string;
    readonly value?: number | string | boolean | null;
    readonly unit?: string | null;
    readonly status: EvidenceStatus;
    readonly explanation: string;
}


export interface ExpectedImpact {
    readonly impactArea: ExpectedImpactArea;
    readonly description: string;
}

export interface Recommendation {
    readonly id: string;
    readonly fieldId: string;
    readonly zoneId?: string;
    readonly priority: RecommendationPriority;
    readonly status: RecommendationStatus;
    readonly reason: string;
    readonly suggestedAction: string;
    readonly expectedImpact: ExpectedImpact;
    readonly evidence: ReadonlyArray<EvidenceItem>;
    readonly createdAt: string;
}


export interface RecommendationsData {
    readonly recommendations: ReadonlyArray<Recommendation>;
    readonly mainRecommendation: Recommendation | null;
    readonly totalUrgent: number;
    readonly totalHighPriority: number;
    readonly generatedAt: string;
}

export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message?: string;
    readonly error?: string;
    readonly timestamp: string;
}

