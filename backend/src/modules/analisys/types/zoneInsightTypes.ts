import { CropType } from "../../crops/types/cropProfileTypes";

export interface EvidenceItem {
    readonly type: "SATELLITE" | "SIMULATION" | "ROVER_CAMERA" | "UPLOAD";
    readonly value: string;
    readonly description: string;
}

export interface ZoneInsight {
    readonly id: string;
    readonly zoneId: string;
    readonly fieldId: string;
    readonly cropType: CropType
    readonly finalRiskLevel: "LOW" | "MEDIUM" | "HIGH";
    readonly healthScore: number; //de 1 a 100
    readonly evidence: readonly EvidenceItem[];
    readonly mainCause: string;
    readonly summary: string;
    readonly recommendedAction: string;
    readonly generatedAt: string;
}