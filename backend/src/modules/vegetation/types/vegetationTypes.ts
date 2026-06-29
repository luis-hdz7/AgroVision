export interface EvidenceItem {
    readonly type: "SATELITE" | "SENSOR" | "WEATHER" | "VISION";
    readonly value: string;
    readonly description: string;
}

export interface VegetationIndexSnapshot {
    readonly id: string;
    readonly fieldId: string;
    readonly captureDate: string;
    readonly ndviMean: number;
    readonly vegetativeCoveragePercentage: number;
    readonly evidence: readonly EvidenceItem[];
}