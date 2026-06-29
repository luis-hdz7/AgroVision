import { VegetationIndexSnapshot } from "../vegetationTypes";

export const vegetationIndexMock: VegetationIndexSnapshot[] = [
    {
        id: "veg-001",
        fieldId: "field-001",
        zoneId: "zone-01",
        source: "SENTINEL",
        indices: {
            ndvi: 0.75,   // Vigor alto
            ndwi: 0.42,   // Buena hidratación foliar
            gndvi: 0.68   // Buen contenido de clorofila
        },
        interpretation: {
            vigorLevel: "VIGOR_EXCEPCIONAL",
            anomalyDetected: false,
            explanation: "La zona presenta un desarrollo óptimo del dosel vegetal con altos niveles de absorción de clorofila y estabilidad hídrica."
        },
        capturedAt: "2026-06-28T10:30:00Z"
    },
    {
        id: "veg-002",
        fieldId: "field-001",
        zoneId: "zone-02",
        source: "DRONE",
        indices: {
            ndvi: 0.52,   // Vigor moderado
            ndwi: 0.15,   // Alerta de estrés hídrico ligero
            gndvi: 0.48
        },
        interpretation: {
            vigorLevel: "ESTRES_MODERADO",
            anomalyDetected: true,
            explanation: "Se detecta un descenso leve en el índice de agua (NDWI), sugiriendo un retraso menor en el ciclo de riego de este sector."
        },
        capturedAt: "2026-06-28T11:15:00Z"
    },
    {
        id: "veg-003",
        fieldId: "field-002",
        zoneId: "zone-03",
        source: "LANDSAT",
        indices: {
            ndvi: 0.31,   // Vigor bajo / Suelo desnudo
            ndwi: -0.05,  // Estrés hídrico severo
            gndvi: 0.28
        },
        interpretation: {
            vigorLevel: "BAJO_VIGOR",
            anomalyDetected: true,
            explanation: "Anomalía crítica detectada. Los índices indican pérdida drástica de follaje y estrés por calor extremo o falta severa de humedad."
        },
        capturedAt: "2026-06-29T09:00:00Z"
    }
];