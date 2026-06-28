import { CropProfile } from "../types/cropProfileTypes";

export const cropProfileMock: CropProfile[] = [
    {
        cropType: "RED_BEAN",
        displayName: "Frijol Rojo",
        scientificName: "Phaseolus vulgaris",
        analysisFocus: ["Humedad del suelo en etapa de floración", "Vigor vegetativo mediante NDVI"],
        mainRisks: ["Estrés hídrico severo", "Antracnosis por exceso de humedad acumulada"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: false,
            nutrientStressSensitive: true,
        },
        preferredMetrics: ["NDVI", "Soil Moisture", "Temperature"],
        recommendationTemplates: {
            waterStress: "Alerta de baja humedad en Frijol Rojo. Incrementar el ciclo de riego programado a 45 minutos durante las primeras horas de la mañana.",
            fungalRisk: "Humedad relativa superior al 85%. Aplicar tratamiento preventivo contra hongos fungicidas en la zona afectada y suspnder riego foliar.",
            lowVigor: "Índice NDVI por debajo del umbral óptimo (0.45). Programar inspeccion visual para verificar posible deficiencia de nitrógeno.",
            inspection: "Étapa crítica de floración detectada. Realizar muestreo manual de suelo y verificar que el drenaje no se encuentra obstruido."
        },
    },
    {
        cropType: "CASSAVA",
        displayName: "Yuca",
        scientificName: "Manihot esculenta",
        analysisFocus: ["Desarrollo radicular", "Control de saturación de agua en suelo"],
        mainRisks: ["Pudrición de raíces por encharcamiento", "Pérdida de vigor por sequía prolongada"],
        riskRules: {
            waterStressSensitive: false,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: false,
        },
        preferredMetrics: ["NDVI", "Soil Moisture"],
        recommendationTemplates: {
            waterStress: "Estrés hídrico moderado detectado en Yuca. Aunque tolera sequía, se aconseja un riego de auxilio si la humedad desciende del 20%.",
            fungalRisk: "Riesgo de pudrición radicular alto debido a compactación y exceso de agua. Revisar canales de drenaje de la parcela de inmediato.",
            lowVigor: "Vigor vegetativo descendente. Inspeccionar el envés de las hojas en busca de presencia de mosca blanca o ácaros.",
            inspection: "Fase de acumulación de almidón en curso. Programar toma de muestras semanales del estado del suelo.",
        },
    },
    {
        cropType: "GENERAL",
        displayName: "Cultivo General",
        scientificName: null,
        analysisFocus: ["Monitoreo de vigor estandarizado", "Alertas meteorológicas generales"],
        mainRisks: ["Anomalías climáticas repentinas", "Fluctuaciones extremas de humedad"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: ["NDVI", "Soil Moisture", "Temperature", "NDWI"],
        recommendationTemplates: {
        waterStress: "Nivel de humedad por debajo de la media histórica de la finca. Monitorear los sectores de riego automáticos.",
        fungalRisk: "Condiciones de microclima favorables para la propagación de patógenos. Incrementar la frecuencia de reportes del Rover.",
        lowVigor: "Caída generalizada en los índices de vegetación. Validar si coincide con la fase natural de senescencia del lote.",
        inspection: "Establecer rutina de patrullaje visual preventivo en los bordes perimetrales de la parcela.",
        },
    }
];