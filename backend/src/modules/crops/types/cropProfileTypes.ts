
/**
 * =========================================
 * Crop Profile Types
 * =========================================
 *
 * Contratos del catálogo de cultivos de AgroVision.
 *
 * CropProfile describe el perfil técnico utilizado por el análisis.
 * CropProfileResponse describe la respuesta del catálogo persistido.
 *
 * Las listas JSONB se validan en el servicio antes de serializarse.
 * =========================================
 */

// Códigos utilizados actualmente por el contrato técnico del motor de análisis.
export type CropType = "CORN" | "RED_BEAN" | "CASSAVA" | "QUEQUISQUE" | "ORANGE" | "SORGHUM" | "PEANUT" | "GENERAL";

// Sensibilidades utilizadas por las reglas de análisis del cultivo.
export interface CropRiskRules {
    readonly waterStressSensitive: boolean;
    readonly fungalRiskSensitive: boolean;
    readonly heatStressSensitive: boolean;
    readonly nutrientStressSensitive: boolean;
}

// Plantillas de acciones utilizadas por el motor de recomendaciones.
export interface RecommendationTemplates {
    readonly waterStress: string;
    readonly fungalRisk: string;
    readonly lowVigor: string;
    readonly inspection: string;
}

// Perfil técnico utilizado por los consumidores del motor de análisis.
export interface CropProfile {
    readonly cropType: CropType;
    readonly displayName: string;
    readonly scientificName?: string | null;
    readonly analysisFocus: string[];
    readonly mainRisks: string[];
    readonly riskRules: CropRiskRules;
    readonly preferredMetrics: string[];
    readonly recommendationTemplates: RecommendationTemplates;
}

/** Respuesta persistida del catálogo Prisma CropProfile. */
export interface CropProfileResponse {
    // Identidad y denominación del perfil registrado en PostgreSQL.
    readonly id: number;
    readonly cropType: string;
    readonly displayName: string;

    // Colecciones de texto validadas a partir de los documentos JSONB.
    readonly mainRisks: readonly string[];
    readonly preferredMetrics: readonly string[];

    // Fecha serializada en formato ISO 8601 para el transporte HTTP.
    readonly createdAt: string;
}