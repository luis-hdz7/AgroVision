// origen del dato satelital o terrestre
export type vegetationSource = "SENTINEL" | "LANDSAT" | "DRONE" | "MANUAL_SENSOR";
// interpretacion agronomica automatizada NDVI
export type VegetationInterpretation = "BAJO_VIGOR" | "ESTRES_MODERADO" | "SALUDABLE" | "VIGOR_EXCEPCIONAL";

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
    readonly captureDate: string;
    readonly ndviMean: number; //valor del indice entre -1.0 y 1.0
    readonly vegetativeCoveragePercentage: number; //de 0 a 100
    readonly interpretation: VegetationInterpretation;
    readonly evidence: readonly EvidenceItem[];
}