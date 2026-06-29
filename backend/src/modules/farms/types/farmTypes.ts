

//granja descripcion
export interface FarmOverview {
    readonly id: string;
    readonly name: string;
    readonly location: {
        readonly country: string;
        readonly region: string;
        readonly city?: string | null;
        readonly latitude?: number | null;
        readonly longitude?: number | null;
    }
    readonly totalAreaSquareMeters: number;
    readonly fieldsCount: number;
    readonly activeCropCycles: number;
    readonly sensorsCount: number;
    readonly roverCount: number;
    readonly generalStatus: "STABLE" | "WARNING" | "CRITICAL";
    readonly lastUpdateAt: string;
}

