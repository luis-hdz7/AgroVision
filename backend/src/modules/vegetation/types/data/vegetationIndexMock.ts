import { VegetationIndexSnapshot } from "../vegetationTypes";

export const vegetationIndexMock: VegetationIndexSnapshot[] = [
    {
        id: "veg-001",
        fieldId: "field-001", //parcela del frijol
        captureDate: "2026-06-15",
        ndviMean: 0.72, //indica follage
        vegetativeCoveragePercentage: 85,
        evidence: [
            {
                type: "SATELITE",
                value: "Sentiel-2 L2A",
                description: "Imagen Libre de nubes sobre zona norte de la finca."
            },
            {
                type: "SENSOR",
                value: "Active NDVI Handheld",
                description: "Validación de campo mediante sensor espectral terrestre."
            }
        ]
    },
    {
        id:"veg-002",
        fieldId: "field-002", //Historio de la misma parcela del mes pasado
        captureDate: "2026-05-15",
        ndviMean: 0.58,
        vegetativeCoveragePercentage: 60,
        evidence: [
            {
                type: "SATELITE",
                value: "Sentinel-2 L2A",
                description: "Muestreo satelital inicial de etapa vegetativa."
            }
        ]
    },
    {
        id: "veg-003",
        fieldId: "field-002", // Parcela con anomalía o estrés (NDVI bajo)
        captureDate: "2026-06-20",
        ndviMean: 0.38, //alerya de estres hidrico o nutricional
        vegetativeCoveragePercentage: 45,
        evidence: [
            {
                type: "SATELITE",
                value: "Landsat 9",
                description: "Reflectancia corregida en bandas NIR y Red."
            },
            {
                type: "VISION",
                value: "Drone Orthomosaic",
                description: "Conteo de fallas de germinación y parches de suelo desnudo."
            }
        ]
    }
];