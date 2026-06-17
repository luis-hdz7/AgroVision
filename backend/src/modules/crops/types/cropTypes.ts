import { read } from "node:fs";
import { readonly } from "zod";

export interface CropCycle {
    readonly id: string;
    readonly fielId: string;
    readonly cropName: string;
    readonly healthScore: number;
    readonly growthStage: "PLANTING" | "GROWING" | "HARVESTING" | "FINISHED"
    readonly plantedAt: string
}

