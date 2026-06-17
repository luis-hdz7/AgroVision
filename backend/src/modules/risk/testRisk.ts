import { calculateRisk } from "./engine/riskEngine";
function printResult(title:string,result:ReturnType<typeof calculateRisk>){
    console.log(`\n========== ${title} ==========`);
    console.dir(
        result,
        {
            depth:null
        }
    );
}

// =======================
// TEST 1 — LOW
// =======================
const low =
calculateRisk({
    cropId:"crop-001",
    fieldId:"field-001",
    soilMoisturePercentage:55,
    temperatureCelsius:24,
    cropHealthScore:90
});

printResult("TEST LOW",low);
// =======================
// TEST 2 — MEDIUM
// =======================
const medium =calculateRisk({
    cropId:"crop-002",
    fieldId:"field-002",
    soilMoisturePercentage:20,
    temperatureCelsius:38,
    cropHealthScore:80
});
printResult("TEST MEDIUM",medium);

// =======================
// TEST 3 — HIGH
// =======================
const high =calculateRisk({
    cropId:"crop-003",
    fieldId:"field-003",
    soilMoisturePercentage:20,
    temperatureCelsius:38,
    cropHealthScore:40
});

printResult("TEST HIGH",high);

// =======================
// TEST 4 — WATCH (borde)
// =======================

const watch =calculateRisk({
    cropId:"crop-004",
    fieldId:"field-004",
    soilMoisturePercentage:45,
    temperatureCelsius:31,
    cropHealthScore:74
});

printResult("TEST WATCH",watch);
// =======================
// VALIDACIONES
// =======================
console.log("\n========== VALIDACION ==========");
console.assert(low.riskLevel==="LOW","ERROR → LOW");
console.assert(medium.riskLevel==="MEDIUM","ERROR → MEDIUM");
console.assert(high.riskLevel==="HIGH","ERROR → HIGH");
console.log("Validaciones completadas");

// =======================
// RESUMEN
// =======================
console.log("\n========== RESUMEN ==========");
console.table({
    low:{
        score:low.healthScore,
        risk:low.riskLevel,
        status:low.status
    },
    medium:{
        score:
            medium.healthScore,

        risk:medium.riskLevel,
        status:medium.status
    },
    high:{score:high.healthScore,
        risk:high.riskLevel,
        status:high.status
    },
    watch:{
        score:watch.healthScore,
        risk:watch.riskLevel,
        status:watch.status
    }
});
