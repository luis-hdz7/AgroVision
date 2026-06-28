

//interfaz de parcela
export interface Field {
    readonly id: string;
    readonly farmId: string;
    readonly name: string;
    readonly areaSquareMeters: number;
    readonly cropId?: string;
    readonly soilType: "SANDY" | "LOAMY" | "CLAY" | "SILT" | "MIXED" | "UNKNOWN";
    readonly irrigationType: "NONE"| "DRIP" | "SPRINKLER" | "FURROW" | "MANUAL" | "UNKNOWN";
    readonly drainageStatus: "GOOD" | "MODERATE" | "POOR"
    readonly status: "NORMAL" | "WATER_STRESS" | "DISEASE_RISK" | "NUTRIENT_RISK" | "UNKNOWN"
    readonly lastInspectionAt?: string | null;
}