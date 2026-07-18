/*
 * Tipos compartidos para la evidencia multifuente.
 *
 * Estos contratos representan la evidencia normalizada utilizada por:
 *
 * - EvidenceFusionService
 * - Risk Engine
 * - Zone Insight
 * - Alerts
 * - Recommendations
 *
 * No contienen lógica de negocio, únicamente contratos compartidos.
 */

export type EvidenceSource =
    | "SENSOR"
    | "WEATHER"
    | "SATELLITE"
    | "VISION"
    | "HISTORY"
    | "MAPPING"
    | "SIMULATION"
    | "ROVER_CAMERA"
    | "UPLOAD";

export type EvidenceStatus =
    | "NORMAL"
    | "WATCH"
    | "WARNING"
    | "CRITICAL";

export interface EvidenceItem {
    readonly source: EvidenceSource;

    // métrica evaluada
    readonly metric: string;

    // valor observado
    readonly value?: number | string | boolean | null;

    // unidad de medida cuando aplica
    readonly unit?: string | null;

    // estado normalizado
    readonly status: EvidenceStatus;

    // explicación técnica utilizada por Dashboard y Reportes
    readonly explanation: string;
}