// origen del dato satelital o terrestre
export type vegetationSource = "SATELLITE" | "SIMULATION" | "ROVER_CAMERA" | "UPLOAD";




//indices calculados para una zona
export interface VegetationIndices {
    readonly ndvi: number; //vigor general de la vegetación.
    readonly ndwi: number; //stima el contenido de humedad de la vegetación.
    readonly gndvi: number; //actividad fotosintética utilizando la banda verde.
}



export interface VegetationInterpretation { // interpretacion agronomica automatizada NDVI
    readonly vigorLevel:  | "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
    readonly anomalyDetected: boolean;
    readonly explanation: string;
}


//item de evidencia
export interface EvidenceItem {
    readonly source: vegetationSource// de donde viene la evidencia
    readonly metric: string; //metrica analizada
    readonly value?: number | string | boolean | null; //valor observado
    readonly unit?: string | null; //unidad de medida
    readonly status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";
    readonly explanation: string;
}
//captura de indices de vevetacion correspondiente a una zona de cultivo
export interface VegetationIndexSnapshot {
    readonly id: string;
    readonly fieldId: string;
    readonly zoneId: string; // "zone-01", "zone-02", etc.
    readonly source: vegetationSource;
    readonly indices: VegetationIndices;
    readonly interpretation: VegetationInterpretation;
    readonly capturedAt: string;
}