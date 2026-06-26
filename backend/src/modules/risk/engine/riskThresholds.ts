/*
    * Configuración centralizada de reglas heurísticas para el motor de riesgo.
    * Esta configuración permite ajustar la sensibilidad del sistema sin modificar 
    * la lógica de procesamiento en los servicios.
*/

// Define los límites de referencia para clasificar el estado de las variables.

export const RISK_THRESHOLDS = {
    soilMoisturePercentage: {
        watch: 50,    // <= 50%
        warning: 40,  // <= 40%
        critical: 30  // <= 30%
    },
    temperatureCelsius: {
        watch: 30,    // >= 30°C
        warning: 35,  // >= 35°C
        critical: 40  // >= 40°C
    },
    cropHealthScore: {
        watch: 75,    // <= 75
        warning: 60,  // <= 60
        critical: 50  // <= 50
    }
} as const;

// Define el impacto (penalización) sobre el healthScore general de AgroVision
// al detectarse un factor en un nivel de riesgo específico.

export const RISK_PENALTIES = {
    soilMoisture: {
        watch: 5,
        warning: 10,
        critical: 20
    },
    temperature: {
        watch: 5,
        warning: 10,
        critical: 15
    },
    cropHealth: {
        watch: 5,
        warning: 15,
        critical: 25
    }
} as const;

//* Ediciones de este archivo
// @luis-hdz7 el 16/6/2026 (creación inicial de constantes de umbrales y penalizaciones)
// @luis-hdz7 el 26/6/2026 (documentación técnica basada en Risk Rules V0)