import { CropProfile } from "../types/cropProfileTypes";

export const cropProfilesMock: CropProfile[] = [
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
        cropType: "QUEQUISQUE",
        displayName: "quequisque (malanga)",
        scientificName: "Colocasia esculenta",
        analysisFocus: ["Saturación de agua en cormo", "Desarrollo del área foliar inicial"],
        mainRisks: ["Pudrición del cormo por exceso de humedad", "Gusano del cuerno en hojas"],
        riskRules: {
            waterStressSensitive: false, // Soporta más humedad, pero no estancada
            fungalRiskSensitive: true,
            heatStressSensitive: false,
            nutrientStressSensitive: true,
        },
        preferredMetrics: ["Soil Moisture", "NDVI", "Humidity"],
        recommendationTemplates: {
            waterStress: "Monitoreo de humedad estancada en Quequisque. Verificar drenajes de las parcelas para evitar pudrición.",
            fungalRisk: "Humedad del suelo superior al 80% sostenida. Aplicar control preventivo para hongos en el cormo.",
            lowVigor: "Vigor foliar bajo detectado en Quequisque. Monitorear ataque de plagas desfoliadoras o falta de fertilizante.",
            inspection: "Fase de desarrollo del cormo activa. Inspeccionar manualmente la base de la planta y la compactación."
        }
    },
    {
        cropType: "ORANGE",
        displayName: "Naranjo Dulce",
        scientificName: "Citrus sinensis",
        analysisFocus: ["Estrés hídrico en fase de floración", "Detección de anomalías por HLB"],
        mainRisks: ["Caída de flor por sequía", "Vulnerabilidad a vectores de plagas (Gomosis)"],
        riskRules: {
            waterStressSensitive: true,
            fungalRiskSensitive: true,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: ["NDVI", "Temperature", "Soil Moisture"],
        recommendationTemplates: {
            waterStress: "Estrés hídrico detectado en periodo crítico de floración del Naranjo. Activar riego controlado inmediato.",
            fungalRisk: "Humedad y temperatura alta combinada. Monitorear presencia de gomosis en la base del tronco.",
            lowVigor: "Pérdida drástica de vigor foliar en cítrico (NDVI bajo). Programar muestreo de campo preventivo para HLB.",
            inspection: "Inicio de brotación detectado. Realizar inspección visual nocturna de plagas en hojas nuevas."
        }
    },
    {
        cropType: "SORGHUM",
        displayName: "Sorgo Blanco",
        scientificName: "Sorghum bicolor",
        analysisFocus: ["Resistencia a estrés térmico", "Vigor vegetativo post-corte"],
        mainRisks: ["Estrés por calor extremo", "Ataque de pulgón amarillo en etapas tempranas"],
        riskRules: {
            waterStressSensitive: false, // Es bastante tolerante a la sequía
            fungalRiskSensitive: false,
            heatStressSensitive: true,
            nutrientStressSensitive: true,
        },
        preferredMetrics: ["Temperature", "NDVI", "Soil Moisture"],
        recommendationTemplates: {
            waterStress: "Humedad crítica detectada en Sorgo. Aunque es tolerante, se recomienda riego de auxilio para evitar detención del crecimiento.",
            fungalRisk: "Condiciones de humedad inusuales para Sorgo. Monitorear preventivamente zonas bajas con acumulación de agua.",
            lowVigor: "Alerta de bajo vigor en Sorgo. Verificar inmediatamente presencia de pulgón amarillo o deficiencia severa de nitrógeno.",
            inspection: "Fase de panojamiento iniciada. Realizar inspección visual en el envés de las hojas para descartar plagas."
        }
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