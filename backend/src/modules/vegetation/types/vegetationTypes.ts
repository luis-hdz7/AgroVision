export interface EvidenceItem {
    readonly type: "SATELITE" | "SENSOR" | "WEATHER" | "VISION";
    readonly value: string;
    readonly description: string;
}

export interface VegetationIndexSnapshot {
    readonly id: string;
    readonly fieldId: string;
    readonly captureDate: string;
    readonly ndviMean: number; //valor del indice entre -1.0 y 1.0
    readonly vegetativeCoveragePercentage: number; //de 0 a 100
    readonly evidence: readonly EvidenceItem[];
}