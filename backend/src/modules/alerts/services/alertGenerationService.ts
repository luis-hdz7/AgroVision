import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { AgriculturalAlert, AlertSeverity, AlertType } from "../types/alertsTypes";

// Palabras clave para la detección automática de causas basadas en texto
const WATER_STRESS_KEYWORDS = ["agua", "humedad", "hídr", "drenaje", "riego", "saturación"];
const HEAT_STRESS_KEYWORDS = ["calor", "temperatura", "heat", "estrés térmico"];

/*
    * HELPER: Formatea el tipo de cultivo para mostrarlo de forma legible.
    * Transforma 'soy_bean' -> 'soy bean' para una mejor UI.
*/
function getCropDisplayName(cropType: ZoneInsight["cropType"]): string {
    return cropType.replace("_", " ");
}

/*
    * HELPER: Mapea el nivel de riesgo del motor a una severidad de alerta compatible con el dashboard.
*/
function mapSeverity(riskLevel: ZoneInsight["finalRiskLevel"]): AlertSeverity {
    switch (riskLevel) {
        case "CRITICAL": return "CRITICAL";
        case "HIGH": return "HIGH";
        case "MEDIUM": return "MEDIUM";
        default: return "LOW";
    }
}

/*
    * FACTORY: Crea una estructura de alerta estandarizada, incorporando el nombre del cultivo
    * en el título y el mensaje para facilitar el contexto en reportes y dashboards.
*/
function createAlert(
    insight: ZoneInsight,
    type: AlertType,
    title: string,
    message: string
): AgriculturalAlert {
    const cropName = getCropDisplayName(insight.cropType);

    return {
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fieldId: insight.fieldId,
        zoneId: insight.zoneId,
        type,
        severity: mapSeverity(insight.finalRiskLevel),
        title: `${title} (${cropName})`,
        message,
        evidence: [...insight.evidence],
        recommendedAction: insight.recommendedAction,
        status: "ACTIVE",
        createdAt: insight.generatedAt // Se usa la fecha generada por el insight
    };
}

// --- Métodos de validación de causas ---

function hasWaterStressCause(insight: ZoneInsight): boolean {
    const cause = insight.mainCause.toLowerCase();
    return WATER_STRESS_KEYWORDS.some(keyword => cause.includes(keyword));
}

function hasHeatStressCause(insight: ZoneInsight): boolean {
    const cause = insight.mainCause.toLowerCase();
    return HEAT_STRESS_KEYWORDS.some(keyword => cause.includes(keyword));
}

function hasVisualEvidence(insight: ZoneInsight): boolean {
    return insight.evidence.some(e => e.source === "VISION");
}

/*
    * SERVICIO PRINCIPAL: Generador de alertas
    * Centraliza la lógica de negocio para evaluar cuándo se dispara una alerta
    * basándose en los datos analizados del ZoneInsight.
*/
export function generateAlerts(insight: ZoneInsight): AgriculturalAlert[] {
    const alerts: AgriculturalAlert[] = [];
    const cropName = getCropDisplayName(insight.cropType);

    //* 1. Alerta por bajo vigor vegetal (Score <= 50) 
    if (insight.healthScore <= 50) {
        alerts.push(
            createAlert(
                insight,
                "LOW_VIGOR",
                "Pérdida de vigor detectada",
                `El cultivo ${cropName} presenta un health score de ${insight.healthScore}, indicando una reducción significativa del vigor.`
            )
        );
    }

    //* 2. Alerta por anomalía visual detectada en el campo
    if (hasVisualEvidence(insight)) {
        alerts.push(
            createAlert(
                insight,
                "VISUAL_ANOMALY",
                "Anomalía visual detectada",
                `Se encontraron evidencias visuales en el cultivo ${cropName} que requieren inspección técnica.`
            )
        );
    }

    //* 3. Alerta por estrés hídrico
    if (hasWaterStressCause(insight)) {
        alerts.push(
            createAlert(
                insight,
                "WATER_STRESS",
                "Posible estrés hídrico",
                `${insight.mainCause} (Cultivo: ${cropName})`
            )
        );
    }

    //* 4. Alerta por estrés térmico */
    if (hasHeatStressCause(insight)) {
        alerts.push(
            createAlert(
                insight,
                "HEAT_STRESS",
                "Posible estrés térmico",
                `${insight.mainCause} (Cultivo: ${cropName})`
            )
        );
    }

    return alerts;
}

//*Ediciones de este archivo
// @luis-hdz7 el 30/6/2026 (creación y primera edición)