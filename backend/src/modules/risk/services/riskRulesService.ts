import {AnalysisFactor,AnalysisAnomaly} from "../types/riskTypes";
import {RISK_THRESHOLDS,RISK_PENALTIES} from "../engine/riskThresholds";
export type RuleResult={
    factor:AnalysisFactor;
    anomaly?:AnalysisAnomaly;
    recommendation?:string;
    penalty:number;
};
export function evaluateSoilMoisture(value:number):RuleResult{
    const threshold=RISK_THRESHOLDS.soilMoisturePercentage;
    if(value<=threshold.critical){
        return{
            factor:{
                name:"Soil Moisture",
                metric:"soilMoisturePercentage",
                value,
                unit:"%",
                status:"CRITICAL",
                explanation:"Soil moisture below critical threshold"},
            anomaly:{
                type:"WATER_STRESS",
                severity:"HIGH",
                description:"Low soil moisture detected"},
            recommendation:"Increase irrigation frequency",
            penalty:RISK_PENALTIES.soilMoisture.critical
        };
    }
    if(value<=threshold.warning){
        return{
            factor:{
                name:"Soil Moisture",
                metric:"soilMoisturePercentage",
                value,
                unit:"%",
                status:"WARNING",
                explanation:"Soil moisture approaching critical level"},

            recommendation:"Monitor irrigation schedule",

            penalty:RISK_PENALTIES.soilMoisture.watch
        };}
    if(value<=threshold.watch){
        return{
            factor:{
                name:"Soil Moisture",
                metric:"soilMoisturePercentage",
                value,
                unit:"%",
                status:"WATCH",
                explanation:"Soil moisture should be monitored"},
            penalty:RISK_PENALTIES.soilMoisture.warning
        };
    }
    return{
        factor:{
            name:"Soil Moisture",
            metric:"soilMoisturePercentage",
            value,
            unit:"%",
            status:"NORMAL",
            explanation:"Soil moisture within acceptable range"
        },
        penalty:0
    };
}

export function evaluateTemperature(value:number):RuleResult{
    const threshold=
        RISK_THRESHOLDS
            .temperatureCelsius;
    if(value>=threshold.critical){
        return{
            factor:{
                name:"Temperature",
                metric:"temperatureCelsius",
                value,
                unit:"°C",
                status:"CRITICAL",
                explanation:"Temperature exceeds critical threshold"},

            anomaly:{
                type:"HEAT_STRESS",
                severity:"HIGH",
                description:"Extreme heat conditions detected"},

            recommendation:"Apply immediate heat mitigation measures",

            penalty:RISK_PENALTIES.temperature.critical
        };
    }
    if(value>=threshold.warning){
        return{
            factor:{
                name:"Temperature",
                metric:"temperatureCelsius",
                value,
                unit:"°C",
                status:"WARNING",
                explanation:"Temperature approaching critical conditions"
            },

            anomaly:{
                type:"HEAT_STRESS",
                severity:"MEDIUM",
                description:"Heat stress risk detected"
            },

            recommendation:"Monitor crop exposure to heat",
            penalty:RISK_PENALTIES.temperature.warning
        };
    }

    if(value>=threshold.watch){
        return{
            factor:{
                name:"Temperature",
                metric:"temperatureCelsius",
                value,
                unit:"°C",
                status:"WATCH",
                explanation:"Temperature should be monitored"},
            recommendation:"Continue temperature observation",
            penalty:RISK_PENALTIES.temperature.watch
        };
    }
    return{
        factor:{
            name:"Temperature",
            metric:"temperatureCelsius",
            value,
            unit:"°C",
            status:"NORMAL",
            explanation:"Temperature stable"},
        penalty:0
    };
}

export function evaluateCropHealth(value:number):RuleResult{
    const threshold=RISK_THRESHOLDS.cropHealthScore;
    if(value<=threshold.critical){
        return{
            factor:{
                name:"Crop Health",
                metric:"cropHealthScore",
                value,
                unit:"score",
                status:"CRITICAL",
                explanation:"Crop health score is critically low"},

            anomaly:{
                type:"VEGETATION_DROP",
                severity:"HIGH",
                description:"General crop deterioration detected"},

            recommendation:"Schedule immediate field inspection",

            penalty:RISK_PENALTIES.cropHealth.critical
        };
    }

    if(value<=threshold.warning){
        return{
            factor:{
                name:"Crop Health",
                metric:"cropHealthScore",
                value,
                unit:"score",
                status:"WARNING",
                explanation:"Crop health below expected level"},

            anomaly:{
                type:"VEGETATION_DROP",
                severity:"MEDIUM",
                description:"Crop health degradation detected"},

            recommendation:"Inspect vegetation condition",

            penalty:RISK_PENALTIES.cropHealth.warning
        };
    }

    if(value<=threshold.watch){

        return{
            factor:{
                name:"Crop Health",
                metric:"cropHealthScore",
                value,
                unit:"score",
                status:"WATCH",
                explanation:"Crop health requires monitoring"},
            recommendation:"Increase observation frequency",
            penalty:RISK_PENALTIES.cropHealth.watch
        };
    }

    return{
        factor:{
            name:"Crop Health",
            metric:"cropHealthScore",
            value,
            unit:"score",
            status:"NORMAL",
            explanation:"Crop health acceptable"},
        penalty:0
    };
}

//*Ediciones de este archivo
// @luis-hdz7 el 16/6/2026 (creacion y primera edicion)