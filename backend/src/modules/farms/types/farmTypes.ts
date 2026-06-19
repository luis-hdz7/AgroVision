

//granja descripcion
export interface FarmOverview {
    readonly id: string;
    readonly name: string;
    readonly location: string;
    readonly totalAreaSquareMeters: number;
    readonly fieldsCount: number;
    readonly activeCropCycles: number;
    readonly sensorsCount: number;
    readonly roverCount: number;
    readonly generalStatus: string;
    readonly lastUpdateAt: string;
}

