import { calculateRisk } from "./engine/riskEngine";

// =======================
// PRUEBA 1 — LOW
// =======================

console.log("\n========== TEST LOW ==========");

const low = calculateRisk({
    cropId: "crop-001",
    fieldId: "field-001",

    soilMoisturePercentage: 55,

    temperatureCelsius: 24,

    cropHealthScore: 90
});

console.log(low);


// =======================
// PRUEBA 2 — MEDIUM
// =======================

console.log("\n========== TEST MEDIUM ==========");

const medium = calculateRisk({
    cropId: "crop-002",
    fieldId: "field-002",

    soilMoisturePercentage: 20,

    temperatureCelsius: 38,

    cropHealthScore: 80
});

console.log(medium);


// =======================
// PRUEBA 3 — HIGH
// =======================

console.log("\n========== TEST HIGH ==========");

const high = calculateRisk({
    cropId: "crop-003",
    fieldId: "field-003",

    soilMoisturePercentage: 20,

    temperatureCelsius: 38,

    cropHealthScore: 40
});

console.log(high);


// =======================
// RESUMEN RÁPIDO
// =======================

console.log("\n========== RESUMEN ==========");

console.log({
    low: {
        score: low.healthScore,
        risk: low.riskLevel,
        status: low.status
    },

    medium: {
        score: medium.healthScore,
        risk: medium.riskLevel,
        status: medium.status
    },

    high: {
        score: high.healthScore,
        risk: high.riskLevel,
        status: high.status
    }
});
