export type AlertType=
    | "WATER_DEFICIT"
    | "HEAT_STRESS"
    | "CROP_HEALTH_ANOMALY";

export type AlertSeverity=
    | "INFO"
    | "WARNING"
    | "CRITICAL";

export type AlertStatus=
    | "ACTIVE"
    | "RESOLVED"
    | "IGNORED";

export interface AgriculturalAlert{
    id:string;
    type:AlertType;
    severity:AlertSeverity;
    title:string;
    description:string;
    affectedEntity:{type:| "FIELD"| "CROP";
        id:string;
};
    evidence:{
        metric:string | null;
        value:number | null;
        unit:string | null;
        threshold:number | null;
        source:| "ANALYSIS";
};
    status:AlertStatus;
    recommendedAction:string | null;
    createdAt:string;
}


//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creacion y primera edicion)