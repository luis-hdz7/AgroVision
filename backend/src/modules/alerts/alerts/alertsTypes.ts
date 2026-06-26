/*
    * Definición de tipos y estructuras para el sistema de alertas de AgroVision.
    ! Una alerta debe ser accionable: debe explicar qué sucedió, dónde,
    * y proporcionar evidencia técnica para respaldar la decisión.
*/

export type AlertType =
    | "WATER_DEFICIT"
    | "HEAT_STRESS"
    | "CROP_HEALTH_ANOMALY";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertStatus = "ACTIVE" | "RESOLVED" | "IGNORED";

/*
    * Representa una alerta agrícola.
    *
 */
export interface AgriculturalAlert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
    affectedEntity: {
        type: "FIELD" | "CROP";
        id: string;
    };
    // La evidencia es obligatoria para garantizar la confianza del usuario
    evidence: {
        metric: string | null;
        value: number | null;
        unit: string | null;
        threshold: number | null;
        source: "ANALYSIS"; // Fuente de la alerta basada en el motor de riesgo
    };
    status: AlertStatus;
    recommendedAction: string | null; // Acción propuesta para el usuario
    createdAt: string;
}

//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creación y primera edición)
// @luis-hdz7 el 26/6/2026 (documentación técnica aplicada)