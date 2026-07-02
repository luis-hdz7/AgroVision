/*
    * Definición de tipos y estructuras para el sistema de alertas de AgroVision.
    ! Una alerta debe ser accionable: debe explicar qué sucedió, dónde,
    * y proporcionar evidencia técnica para respaldar la decisión.
*/

import { RiskLevel } from "../../risk/types/riskTypes";
import { EvidenceItem } from "../../analysis/types/zoneInsightTypes";

/*
    * Tipos de alerta soportados por AgroVision.
*/
export type AlertType =
    | "WATER_STRESS"
    | "FUNGAL_RISK"
    | "LOW_VIGOR"
    | "VISUAL_ANOMALY"
    | "HEAT_STRESS"
    | "SYSTEM";

/*
    * Estado operativo de una alerta.
*/
export type AlertStatus =
    | "ACTIVE"
    | "RESOLVED"
    | "IGNORED";

export type AlertSeverity =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

/*
    * Contrato prescriptivo de alerta.
    * Toda alerta debe responder:
    * - ¿Dónde está el problema?
    * - ¿Qué tan grave es?
    * - ¿Qué evidencia lo respalda?
    * - ¿Qué acción se recomienda?
*/
export interface AgriculturalAlert {
    id: string;
    fieldId: string;
    zoneId?: string | null;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    message: string;
    evidence: EvidenceItem[];
    recommendedAction: string;
    status: AlertStatus;
    createdAt: string;
    resolvedAt?: string | null;
}


//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creación y primera edición)
// @luis-hdz7 el 26/6/2026 (documentación técnica aplicada)
// @luis-hdz7 29/06/2026 (adaptación a alertas prescriptivas multifuente)