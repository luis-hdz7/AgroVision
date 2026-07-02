/**
 * =========================================
 * Crop Profile Types
 * =========================================
 *
 * Tipos para perfiles de cultivos estratégicos.
 * preparan la UI para representar reglas, riesgos y recomendaciones ajustadas por cultivo.
 *
 * IMPORTANTE:
 * - define la base de cultivos estratégicos.
 * - no contiene datos, solo contratos. Así se evita duplicar estructuras cuando backend entregue: GET /api/crops/profiles
 * - Los perfiles solo contextualizan el análisis prescriptivo.
 * =========================================
*/

import type { CropProfile } from "../types/cropProfile.types";

export const cropProfilesMock: ReadonlyArray<CropProfile> = [
    {
        cropType: "RED_BEAN",
        displayName: "Frijol rojo",
        scientificName: "Phaseolus vulgaris",
        analysisFocus: [
            "Estrés hídrico temprano",
            "Bajo vigor vegetal",
            "Riesgo fúngico por humedad",
            "Cambios visuales en cobertura verde",
        ],
        mainRisks: ["WATER_STRESS", "FUNGAL_RISK", "LOW_VIGOR"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: [
            "ndvi",
            "soilMoisturePercentage",
            "temperatureCelsius",
            "greenCoveragePercentage",
            "chlorosisSuspected",
        ],
        recommendationTemplates: {
            waterStress:
                "Verificar humedad del suelo y priorizar riego moderado en zonas con bajo vigor.",
            fungalRisk:
                "Inspeccionar follaje y evitar exceso de humedad si se detecta patrón compatible con riesgo fúngico.",
            lowVigor:
                "Revisar vigor vegetal, historial de riego y nutrición antes de tomar acción correctiva.",
            inspection:
                "Registrar inspección visual por zona y comparar con evidencia climática y satelital simulada.",
        },
    },
    {
        cropType: "CASSAVA",
        displayName: "Yuca",
        scientificName: "Manihot esculenta",
        analysisFocus: [
            "Bajo vigor prolongado",
            "Estrés por sequía",
            "Cambios de verdor en follaje",
            "Condición general por zona",
        ],
        mainRisks: ["WATER_STRESS", "LOW_VIGOR", "HEAT_STRESS"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: false,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: [
            "ndvi",
            "ndwi",
            "soilMoisturePercentage",
            "temperatureCelsius",
            "greenCoveragePercentage",
        ],
        recommendationTemplates: {
            waterStress:
                "Revisar disponibilidad de agua en zonas con bajo NDWI o humedad reducida.",
            fungalRisk:
                "Monitorear follaje en zonas densas, especialmente después de lluvias persistentes.",
            lowVigor:
                "Comparar vigor vegetal por zona y revisar compactación, humedad y estado del follaje.",
            inspection:
                "Priorizar inspección por zonas con pérdida sostenida de vigor.",
        },
    },

    {
        cropType: "QUEQUISQUE",
        displayName: "Quequisque",
        scientificName: "Xanthosoma sagittifolium",
        analysisFocus: [
            "Estrés por humedad irregular",
            "Riesgo fúngico",
            "Bajo vigor",
            "Anomalías visuales foliares",
        ],
        mainRisks: ["FUNGAL_RISK", "WATER_STRESS", "VISUAL_ANOMALY"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: false,
            nutrientStressSensitive: true,
        },
        preferredMetrics: [
            "ndvi",
            "ndwi",
            "soilMoisturePercentage",
            "leafSpotSuspected",
            "greenCoveragePercentage",
        ],
        recommendationTemplates: {
        waterStress:
            "Verificar humedad disponible y evitar fluctuaciones fuertes entre zonas.",
        fungalRisk:
            "Inspeccionar hojas y drenaje en zonas con humedad alta o manchas detectadas.",
        lowVigor:
            "Revisar zonas con bajo vigor y cruzar evidencia visual con humedad del suelo.",
        inspection:
            "Realizar inspección foliar dirigida en áreas con anomalías visuales.",
        }, 
    },

    {
        cropType: "ORANGE",
        displayName: "Naranjo",
        scientificName: "Citrus sinensis",
        analysisFocus: [
            "Estrés hídrico",
            "Clorosis preliminar",
            "Bajo vigor por zona",
            "Anomalías visuales en follaje",
        ],
        mainRisks: ["WATER_STRESS", "NUTRIENT_STRESS", "LOW_VIGOR"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: [
            "ndvi",
            "gndvi",
            "soilMoisturePercentage",
            "greenCoveragePercentage",
            "dryAreaPercentage",
            "chlorosisSuspected",
        ],
        recommendationTemplates: {
            waterStress:
                "Priorizar revisión de riego en árboles con bajo vigor y señales visuales de sequedad.",
            fungalRisk:
                "Inspeccionar follaje y frutos si existen manchas o humedad persistente.",
            lowVigor:
                "Comparar vigor por zona y revisar riego, nutrición y estado visual del árbol.",
            inspection:
                "Registrar evidencia fotográfica del árbol afectado y repetir análisis en 24 horas.",
        },
    },

    {
        cropType: "SORGHUM",
        displayName: "Sorgo",
        scientificName: "Sorghum bicolor",
        analysisFocus: [
            "Estrés térmico",
            "Estrés hídrico",
            "Bajo vigor vegetal",
            "Tendencia de sequedad por zona",
        ],
        mainRisks: ["HEAT_STRESS", "WATER_STRESS", "LOW_VIGOR"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: false,
            heatStressSensitive: true,
            nutrientStressSensitive: false,
        },
        preferredMetrics: [
            "ndvi",
            "ndwi",
            "temperatureCelsius",
            "soilMoisturePercentage",
            "dryAreaPercentage",
        ],
        recommendationTemplates: {
            waterStress:
                "Verificar humedad en zonas con pérdida de vigor y temperatura elevada.",
            fungalRisk:
                "Mantener monitoreo visual después de lluvias, aunque no sea el riesgo dominante.",
            lowVigor:
                "Evaluar vigor vegetal y tendencia térmica antes de definir corrección.",
            inspection:
                "Revisar zonas con mayor temperatura y menor cobertura verde.",
        },
    },

    {
        cropType: "PEANUT",
        displayName: "Maní",
        scientificName: "Arachis hypogaea",
        analysisFocus: [
            "Estrés hídrico",
            "Riesgo fúngico",
            "Bajo vigor",
            "Anomalías visuales foliares",
        ],
        mainRisks: ["WATER_STRESS", "FUNGAL_RISK", "LOW_VIGOR"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: [
            "ndvi",
            "soilMoisturePercentage",
            "temperatureCelsius",
            "leafSpotSuspected",
            "greenCoveragePercentage",
        ],
        recommendationTemplates: {
            waterStress:
                "Revisar humedad del suelo y evitar déficit durante etapas sensibles.",
            fungalRisk:
                "Inspeccionar hojas bajas y zonas con humedad persistente.",
            lowVigor:
                "Cruzar vigor vegetal, humedad y evidencia visual antes de intervenir.",
            inspection:
                "Realizar inspección puntual en zonas con manchas o bajo verdor.",
        },
    },

    {
        cropType: "GENERAL",
        displayName: "Cultivo genérico",
        scientificName: null,
        analysisFocus: [
            "Riesgo general por zona",
            "Bajo vigor",
            "Estrés visual preliminar",
            "Condiciones ambientales",
        ],
        mainRisks: ["WATER_STRESS", "LOW_VIGOR", "VISUAL_ANOMALY"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: false,
        },
        preferredMetrics: [
            "ndvi",
            "soilMoisturePercentage",
            "temperatureCelsius",
            "greenCoveragePercentage",
            "dryAreaPercentage",
        ],
        recommendationTemplates: {
            waterStress:
                "Revisar humedad y priorizar inspección en zonas con bajo vigor.",
            fungalRisk:
                "Inspeccionar visualmente áreas con anomalías y humedad persistente.",
            lowVigor:
                "Validar si el bajo vigor se repite en imagen, sensor o capa satelital simulada.",
            inspection:
                "Registrar evidencia visual y comparar con métricas disponibles.",
        },
    },
]

/**
 * Función utilitaria para buscar un perfil por tipo de cultivo
 * esto evita repetir cropProfilesMock.find(...) en futuras páginas, es decir evita duplicar búsquedas cuando la UI necesite un perfil concreto.
 */

export function getCropProfileByType(cropType: CropProfile['cropType']) {
    return cropProfilesMock.find((profile) => profile.cropType === cropType);
}

