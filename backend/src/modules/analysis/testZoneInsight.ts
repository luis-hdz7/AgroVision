//Este archivo lo cree yo @luis-hdz7 solo para probar que todo funciona bien
//!Pueden ignorarlo
import { ZoneInsightService } from "../analysis/services/zoneInsightService";

function printInsight(
    title: string,
    result: any
) {
    console.log(`\n========== ${title} ==========`);

    console.dir(result, {
        depth: null
    });
}

//*ZONA SANA
const healthy =
    ZoneInsightService.buildInsight({

        zoneId: "zone-001",

        fieldId: "field-001",

        cropType: "RED_BEAN",

        healthScore: 88,

        riskLevel: "LOW",

        soilMoisturePercentage: 60,

        temperatureCelsius: 26,

        ndvi: 0.75,

        visualAnomalyDetected: false,

        vegetationTrend: 5
    });

printInsight(
    "ZONA SANA",
    healthy
);

//*BAJO VIGOR
const lowVigor =
    ZoneInsightService.buildInsight({

        zoneId: "zone-002",

        fieldId: "field-002",

        cropType: "RED_BEAN",

        healthScore: 70,

        riskLevel: "MEDIUM",

        soilMoisturePercentage: 55,

        temperatureCelsius: 28,

        ndvi: 0.42,

        visualAnomalyDetected: true,

        vegetationTrend: -15
    });

printInsight(
    "BAJO VIGOR",
    lowVigor
);


//*ESTRES HIDRICO
const waterStress =
    ZoneInsightService.buildInsight({

        zoneId: "zone-003",

        fieldId: "field-003",

        cropType: "RED_BEAN",

        healthScore: 35,

        riskLevel: "HIGH",

        soilMoisturePercentage: 18,

        temperatureCelsius: 35,

        ndvi: 0.28,

        visualAnomalyDetected: true,

        vegetationTrend: -30
    });

printInsight(
    "ESTRES HIDRICO",
    waterStress
);

//*VALIDACIONES
console.log(
    "\n========== VALIDACIONES =========="
);

console.assert(
    healthy.finalRiskLevel === "LOW",
    "ERROR → Healthy"
);

console.assert(
    lowVigor.mainCause === "LOW_VIGOR",
    "ERROR → Low vigor"
);

console.assert(
    waterStress.mainCause ===
        "WATER_STRESS",
    "ERROR → Water stress"
);

console.log(
    "Validaciones completadas"
);

//*RESUMEN FINAL
console.table({

    healthy: {
        risk:
            healthy.finalRiskLevel,

        cause:
            healthy.mainCause
    },

    lowVigor: {
        risk:
            lowVigor.finalRiskLevel,

        cause:
            lowVigor.mainCause
    },

    waterStress: {
        risk:
            waterStress.finalRiskLevel,

        cause:
            waterStress.mainCause
    }
});