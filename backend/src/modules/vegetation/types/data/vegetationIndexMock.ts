import { VegetationIndexSnapshot } from "../vegetationTypes";

export const vegetationIndexMock: VegetationIndexSnapshot[] = [
    {
        id: "veg-001",
        fieldId: "field-001",
        zoneId: "zone-01",
        source: "SATELLITE",
        indices: {
            ndvi: 0.78,   // Vigor alto
            ndwi: 0.45,   // Buena hidratación foliar
            gndvi: 0.71   // Buen contenido de clorofila
        },
        interpretation: {
            vigorLevel: "HIGH",
            anomalyDetected: false,
            explanation: "Optimal canopy density detected through satellite reflectance."
        },
        capturedAt: "2026-06-29T14:00:00Z"
    },
    {
        id: "veg-002",
        fieldId: "field-001",
        zoneId: "zone-02",
        source: "SIMULATION",
        indices: {
            ndvi: 0.52,   // Vigor moderado
            ndwi: 0.18,   // Alerta de estrés hídrico ligero
            gndvi: 0.49
        },
        interpretation: {
            vigorLevel: "MEDIUM",
            anomalyDetected: true,
            explanation: "Predictive simulation shows a slight decrease in leaf water retention"
        },
        capturedAt: "2026-06-29T14:15:00Z"
    },
    {
        id: "veg-003",
        fieldId: "field-001",
        zoneId: "zone-03",
        source: "ROVER_CAMERA",
        indices: {
            ndvi: 0.32,   // Vigor bajo / Suelo desnudo
            ndwi: -0.04,  // Estrés hídrico severo
            gndvi: 0.29
        },
        interpretation: {
            vigorLevel: "LOW",
            anomalyDetected: true,
            explanation: "Critical anomaly confirmed through rover optical imagery."
        },
        capturedAt: "2026-06-29T14:30:00Z"
    }
];