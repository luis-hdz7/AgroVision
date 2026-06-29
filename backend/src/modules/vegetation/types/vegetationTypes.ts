// origen del dato satelital o terrestre
export type vegetationSource = "SENTINEL" | "LANDSAT" | "DRONE" | "MANUAL_SENSOR";
// interpretacion agronomica automatizada NDVI
export type vegetationVigorLevel = "BAJO_VIGOR" | "ESTRES_MODERADO" | "SALUDABLE" | "VIGOR_EXCEPCIONAL";


//indices
export interface VegetationIndices {
    readonly ndvi: number;
    readonly ndwi: number;
    readonly gndvi: number;
}

export interface VegetationInterpretation {
    readonly vigorLevel: vegetationVigorLevel;
    readonly anomalyDetected: boolean;
    readonly explanation: string;
}


//item de evidencia
export interface EvidenceItem {
    readonly type: "SATELITE" | "SENSOR" | "WEATHER" | "VISION";
    readonly source: vegetationSource
    readonly value: string;
    readonly description: string;
}

export interface VegetationIndexSnapshot {
    readonly id: string;
    readonly fieldId: string;
    readonly zoneId: string; // "zone-01", "zone-02", etc.
    readonly source: vegetationSource;
    readonly indices: VegetationIndices;
    readonly interpretation: VegetationInterpretation;
    readonly capturedAt: string;
}