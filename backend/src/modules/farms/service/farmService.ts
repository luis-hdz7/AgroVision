import { FarmOverview } from "../types/farmTypes";

export class FarmService {
    public async getFarmOverview(): Promise<FarmOverview> {
        
        const overview: FarmOverview = {
            //simulando datos de una finca
            id: "finca-01",
            name: "Finca de los zopotes",
            location: "Chinandega, Nicaragua",
            totalAreaSquareMeters: 450000, //45 hectareas
            fieldsCount: 12,
            activeCropCycles: 8,
            sensorsCount: 34,
            roverCount: 2,
            generalStatus: "STABLE",
            lastUpdateAt: new Date().toISOString()
        };
        return overview
    } 
}