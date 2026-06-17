export const RISK_THRESHOLDS = {
    soilMoisturePercentage:{
        watch:50,
        warning:40,
        critical:30
    },
    temperatureCelsius:{
        watch:30,
        warning:35,
        critical:40
    },
    cropHealthScore:{
        watch:75,
        warning:60,
        critical:50
    }} as const;
export const RISK_PENALTIES = {
    soilMoisture:{
        watch:5,
        warning:10,
        critical:20
    },

    temperature:{
        watch:5,
        warning:10,
        critical:15
    },

    cropHealth:{
        watch:5,
        warning:15,
        critical:25
    }
} as const;

//*Ediciones de este archivo
// @luis-hdz7 el 16/6/2026