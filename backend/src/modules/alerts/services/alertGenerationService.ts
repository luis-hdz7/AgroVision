import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { AgriculturalAlert, AlertType } from "../types/alertsTypes";
import {EvidenceItem} from "../../analysis/types/evidenceTypes";

/*
 * HELPER: Formatea el tipo de cultivo para mostrarlo de forma legible.
 * Transforma "RED_BEAN" -> "RED BEAN".
 */
function getCropDisplayName(cropType: ZoneInsight["cropType"]): string {
    return cropType.replaceAll("_", " ");
}

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
        id: `alert-${insight.zoneId}-${type.toLowerCase()}`,
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
 * HELPER: Verifica si existe evidencia para una métrica determinada.
 */
function hasEvidence(
    insight: ZoneInsight,
    metric: string,
    statuses: EvidenceItem["status"][] = ["WARNING", "CRITICAL"]
): boolean {

    return insight.evidence.some(item =>
        item.metric === metric &&
        statuses.includes(item.status)
    );

}
/*
 * HELPER: Riesgo compatible con estrés hídrico.
 */
function hasWaterStressEvidence(
    insight: ZoneInsight
): boolean {
    return (
        hasEvidence(insight, "soilMoisturePercentage") ||
        hasEvidence(insight, "ndwi")
    );
}

function buildLowVigorMessage(insight: ZoneInsight): string {
    const cropName = getCropDisplayName(insight.cropType);
    switch (insight.finalRiskLevel) {
        case "LOW":
            return `Vegetation indicators remain generally stable in ${cropName}. Continue routine monitoring to confirm normal crop development.`;
        case "MEDIUM":
            return `Multiple vegetation indicators suggest reduced crop vigor in ${cropName}. Preventive field inspection is recommended to identify the underlying cause.`;
        case "HIGH":
        case "CRITICAL":
            return `Multiple vegetation indicators indicate significant reduction in crop vigor in ${cropName}. Immediate field inspection is recommended to determine the underlying cause and prioritize corrective actions.`;
        default:
            return `Crop monitoring is recommended.`;
    }
}


/*
 * HELPER: Riesgo compatible con estrés térmico.
 */
function hasHeatStressEvidence(
    insight: ZoneInsight
): boolean {

    return hasEvidence(
        insight,
        "temperatureCelsius"
    );

}

/*
 * HELPER: Evidencia de bajo vigor vegetal.
 */
function hasLowVigorEvidence(
    insight: ZoneInsight
): boolean {

    return (
        insight.healthScore <= 50 ||
        hasEvidence(insight, "ndvi") ||
        hasEvidence(insight, "gndvi")
    );

}

/*
 * HELPER: Evidencia visual relevante.
 */
function hasVisualEvidence(
    insight: ZoneInsight
): boolean {

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
    if (hasLowVigorEvidence(insight)) {

        alerts.push(
            createAlert(
                insight,
                "LOW_VIGOR",
                "Reduced vegetation vigor associated with water stress",
                buildLowVigorMessage(insight)
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
                `Visual inspection detected anomalies compatible with vegetation stress in ${cropName}. Field verification is recommended before applying corrective measures.`
            )
        );

    }

    /*
     * 3. Estrés hídrico
     */
    if (hasWaterStressEvidence(insight)) {

        alerts.push(
            createAlert(
                insight,
                "WATER_STRESS",
                "Potential water stress",
                "Low soil moisture and vegetation water indicators suggest conditions compatible with water stress. Irrigation infrastructure and field conditions should be verified."
            )
        );

    }

    /*
     * 4. Estrés térmico
     */
    if (hasHeatStressEvidence(insight)) {

        alerts.push(
            createAlert(
                insight,
                "HEAT_STRESS",
                "Elevated temperature may aggravate the existing water stress.",
                "Elevated air temperature may increase crop stress and reduce vegetation performance. Continue monitoring environmental conditions and perform field verification if required."
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
// @luis-hdz7 el 18/07/2026 (alineación de alertas con evidencia multifuente)