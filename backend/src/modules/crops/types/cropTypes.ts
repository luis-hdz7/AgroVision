
export interface CropCycle {
    readonly id: string;
    readonly fieldId: string;
    readonly cropName: string;
    readonly healthScore: number;
    readonly growthStage: "PLANTING" | "GROWING" | "HARVESTING" | "FINISHED";
    readonly plantedAt: string
    readonly expectedHarvestAt: string;
}

