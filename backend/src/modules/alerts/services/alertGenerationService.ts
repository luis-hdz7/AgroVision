import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { AgriculturalAlert, AlertType } from "../types/alertsTypes";
import { RiskLevel } from "../../risk/types/riskTypes";

/*
    * HELPER: Formatea el tipo de cultivo para mostrarlo de forma legible.
    * Transforma 'RED_BEAN' -> 'RED BEAN' para una mejor UI.
*/
function getCropDisplayName(cropType: ZoneInsight["cropType"]): string {
    return cropType.replaceAll("_", " ");
}

/*
    * HELPER: Mapea el nivel de riesgo del motor a una severidad de alerta.
*/
/*
    * FACTORY: Construye una alerta estandarizada a partir del ZoneInsight.
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
        severity: insight.finalRiskLevel,
        title: `${title} (${cropName})`,
        message,
        evidence: [...insight.evidence],
        recommendedAction: insight.recommendedAction,
        status: "ACTIVE",
        createdAt: insight.generatedAt
    };
}

/*
    * HELPER: Determina si la causa principal corresponde a estrés hídrico.
*/
function hasWaterStressCause(insight: ZoneInsight): boolean {
    return insight.mainCause === "WATER_STRESS";
}

/*
    * HELPER: Determina si la causa principal corresponde a estrés térmico.
*/
function hasHeatStressCause(insight: ZoneInsight): boolean {
    return insight.mainCause === "HEAT_STRESS";
}

/*
    * HELPER: Determina si la causa principal corresponde a bajo vigor.
*/
function hasLowVigor(insight: ZoneInsight): boolean {
    return (
        insight.mainCause === "LOW_VIGOR" ||
        insight.healthScore <= 50
    );
}

/*
    * HELPER: Verifica si existe evidencia visual relevante.
*/
function hasVisualEvidence(insight: ZoneInsight): boolean {
    return insight.evidence.some(item =>
        item.source === "VISION" &&
        (
            item.status === "WARNING" ||
            item.status === "CRITICAL"
        )
    );
}

/*
    * SERVICIO PRINCIPAL
    * Genera alertas prescriptivas respaldadas por evidencia multifuente.
*/
export function generateAlerts(
    insight: ZoneInsight
): AgriculturalAlert[] {

    const alerts: AgriculturalAlert[] = [];

    const cropName = getCropDisplayName(insight.cropType);

    /*
        * 1. Bajo vigor vegetal
    */
    if (hasLowVigor(insight)) {

        alerts.push(
            createAlert(
                insight,
                "LOW_VIGOR",
                "Reduced vegetation vigor",
                `Available evidence suggests reduced vegetation vigor in ${cropName}. Technical field inspection is recommended.`
            )
        );

    }

    /*
        * 2. Anomalía visual
    */
    if (hasVisualEvidence(insight)) {

        alerts.push(
            createAlert(
                insight,
                "VISUAL_ANOMALY",
                "Visual anomaly detected",
                `Visual evidence suggests patterns requiring technical inspection in ${cropName}.`
            )
        );

    }

    /*
        * 3. Estrés hídrico
    */
    if (hasWaterStressCause(insight)) {

        alerts.push(
            createAlert(
                insight,
                "WATER_STRESS",
                "Potential water stress",
                "Available evidence suggests conditions compatible with water stress. Irrigation review and field verification are recommended."
            )
        );

    }

    /*
        * 4. Estrés térmico
    */
    if (hasHeatStressCause(insight)) {

        alerts.push(
            createAlert(
                insight,
                "HEAT_STRESS",
                "Potential heat stress",
                "Environmental indicators suggest elevated temperature conditions. Continue monitoring and perform technical inspection if necessary."
            )
        );

    }

    return alerts;
}

/*
    * Ediciones de este archivo
*/
// @luis-hdz7 el 30/06/2026 (creación y primera edición)
// @luis-hdz7 el 08/07/2026 (refactorización para arquitectura prescriptiva basada en ZoneInsight y EvidenceItem)