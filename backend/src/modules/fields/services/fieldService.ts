import { Field } from "../types/fieldTypes";

export class FieldService {

    public async getFields(): Promise<Field[]> {
        const fields: Field[] = [
            {
                id: "field-01",
                farmId: "farm-agrovision-01",
                name: "Lote Norte - Maíz",
                areaSquareMeters: 120000,
                cropId: "crop-cycle-99",
                soilType: "LOAMY",
                irrigationType: "DRIP",
                drainageStatus: "GOOD",
                status: "NORMAL",
                lastInspectionAt: new Date().toISOString()
            },
            {
                id: "field-02",
                farmId: "farm-agrovision-01",
                name: "Lote Sur - Tomate",
                areaSquareMeters: 85000,
                cropId: "crop-cycle-102",
                soilType: "CLAY",
                irrigationType: "SPRINKLER",
                drainageStatus: "MODERATE",
                status: "WATER_STRESS",
                lastInspectionAt: new Date().toISOString()
            }
        ];
        return fields;
    }
}