/*
    * EVIDENCE RISK SERVICE
    * Objetivo: Analizar la evidencia fusionada para generar un diagnóstico de riesgo prescriptivo.
    * Este servicio traduce datos técnicos (EvidenceItem) en decisiones operativas (MainCause, RiskLevel, Action).
*/

import { RiskLevel } from "../types/riskTypes";
import { EvidenceItem } from "../../analysis/services/evidenceFusionService";

export type MainCause =
    | "WATER_STRESS"
    | "LOW_VIGOR"
    | "HEAT_STRESS"
    | "VISUAL_ANOMALY"
    | "NONE";

export interface EvidenceRiskResult {
    mainCause: MainCause;
    riskLevel: RiskLevel;
    criticalEvidence: EvidenceItem[];
    recommendedAction: string;
}

export class EvidenceRiskService {

    /*
        * Evalúa la lista de evidencias y determina el nivel de riesgo y la causa principal.
        * Es el core de la lógica prescriptiva: jerarquiza la evidencia para priorizar acciones.
    */
    static evaluate(evidence: EvidenceItem[]): EvidenceRiskResult {
        //* 1. Clasificación por severidad para lógica de decisión
        const criticalEvidence = evidence.filter(item => item.status === "CRITICAL");
        const warningEvidence = evidence.filter(item => item.status === "WARNING");

        //* 2. Identificación de disparadores de estrés (Booleano)
        const waterStress = evidence.some(item =>
            item.metric === "soilMoisturePercentage" && (item.status === "WARNING" || item.status === "CRITICAL"));

        const heatStress = evidence.some(item =>
            item.metric === "temperatureCelsius" && (item.status === "WARNING" || item.status === "CRITICAL"));

        const lowVigor = evidence.some(item =>
            item.metric === "ndvi" && (item.status === "WARNING" || item.status === "CRITICAL"));

        const visualAnomaly = evidence.some(item =>
            item.metric === "visualAnomaly" && (item.status === "WARNING" || item.status === "CRITICAL"));

        //* 3. Resolución de diagnósticos finales
        const riskLevel = this.resolveRiskLevel(criticalEvidence.length, warningEvidence.length);
        const mainCause = this.resolveMainCause({ waterStress, heatStress, lowVigor, visualAnomaly });

        return {
            mainCause,
            riskLevel,
            // Fallback: si no hay críticas, pasamos las advertencias para que el dashboard no quede vacío
            criticalEvidence: criticalEvidence.length > 0 ? criticalEvidence : warningEvidence,
            recommendedAction: this.resolveRecommendation(mainCause)
        };
    }

    /*
        * Define la severidad del riesgo basándose en el conteo de evidencias.
        * Ajustable según la política de la empresa (ej: ¿cuántas advertencias equivalen a riesgo ALTO?).
    */
    private static resolveRiskLevel(criticalCount: number, warningCount: number): RiskLevel {
        if (criticalCount >= 2 || warningCount >= 3) {
            return "HIGH";
        }
        if (criticalCount >= 1 || warningCount >= 1) {
            return "MEDIUM";
        }
        return "LOW";
    }

    /*
        * Jerarquización de causas: Determina cuál es el factor crítico prioritario.
        * Nota: El orden de esta lista determina la prioridad de atención (ej: el agua se atiende primero).
    */
    private static resolveMainCause(
        causes: {
            waterStress: boolean;
            heatStress: boolean;
            lowVigor: boolean;
            visualAnomaly: boolean;
        }
    ): MainCause {
        if (causes.waterStress) return "WATER_STRESS";
        if (causes.heatStress) return "HEAT_STRESS";
        if (causes.lowVigor) return "LOW_VIGOR";
        if (causes.visualAnomaly) return "VISUAL_ANOMALY";
        return "NONE";
    }

    /*
        * Mapeo de acción prescriptiva: Entrega instrucciones claras basadas en la causa detectada.
    */
    private static resolveRecommendation(cause: MainCause): string {
        const actions: Record<MainCause, string> = {
            WATER_STRESS: "Increase irrigation and inspect water distribution.",
            HEAT_STRESS: "Monitor crop exposure and apply heat mitigation measures.",
            LOW_VIGOR: "Inspect nutrition status and vegetation health.",
            VISUAL_ANOMALY: "Perform field inspection to validate the anomaly.",
            NONE: "Continue normal monitoring."
        };
        return actions[cause];
    }
}

//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)
// @luis-hdz7 el 29/06/2026 (realizando pequeños ajustes)