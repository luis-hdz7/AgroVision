import { EvidenceItem } from "../../analysis/services/evidenceFusionService";
export type RecommendationPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

/*
    * Área donde se espera un beneficio.
*/
export type ExpectedImpactArea =
    | "WATER_SAVING"
    | "YIELD_PROTECTION"
    | "DISEASE_PREVENTION"
    | "COST_REDUCTION"
    | "CROP_HEALTH";

/*
    * Impacto esperado al aplicar la recomendación.
*/
export interface ExpectedImpact {
    impactArea: ExpectedImpactArea;
    description: string;
}

/*
    * Recomendación prescriptiva basada en evidencia.
    * Debe responder:
    * - ¿Por qué actuar?
    * - ¿Qué hacer?
    * - ¿Qué beneficio se espera?
*/
export interface Recommendation {
    id: string;
    fieldId: string;
    zoneId?: string | null;
    priority: RecommendationPriority;
    reason: string;
    suggestedAction: string;
    expectedImpact: ExpectedImpact;
    evidence: EvidenceItem[];
    createdAt: string;
}

//*Ediciones de este archivo
// @luis-hdz7 el 29/6/2026 (creación y primera edición)