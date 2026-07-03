import { CropType } from "../../crops/types/cropProfileTypes";

export type EvidenceSource =
    | "VISION"
    | "SATELLITE"
    | "SENSOR"
    | "WEATHER"
    | "HISTORY"
    | "MAPPING"
    | "SIMULATION"
    | "ROVER_CAMERA";

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

export interface ZoneInsight {
    readonly id: string;
    readonly zoneId: string;
    readonly fieldId: string;
    readonly cropType: CropType;

    readonly finalRiskLevel:
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "CRITICAL";

    readonly healthScore: number;

    readonly evidence: readonly EvidenceItem[];

    readonly mainCause: string;
    readonly summary: string;
    readonly recommendedAction: string;

    readonly generatedAt: string;
}