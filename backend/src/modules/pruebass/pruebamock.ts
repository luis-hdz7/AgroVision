/*
 * Smoke Test
 *
 * Verifica que los endpoints críticos del backend respondan
 * correctamente
 *
 * No valida la lógica interna de cada módulo; únicamente
 * confirma disponibilidad y cumplimiento básico del contrato
 * ApiResponse.
 */

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { method: "GET", path: "/api/health" },
  { method: "GET", path: "/api/crops/profiles" },
  { method: "GET", path: "/api/vegetation/indices?fieldId=field-001" },
  { method: "GET", path: "/api/analysis/zone/zone-03" },
  { method: "GET", path: "/api/risk/field/field-001" },
  { method: "GET", path: "/api/alerts" },
  { method: "GET", path: "/api/recommendations" },
  { method: "GET", path: "/api/reports/prescriptive/zone-03" },
  { method: "GET", path: "/api/field-notebook/zone/zone-03" },
  { method: "POST", path: "/api/vision/analyze" },
];

async function runSmokeTest() {
  console.log("\n===============================");
  console.log(" AgroVision Backend Smoke Test");
  console.log("===============================\n");

  for (const endpoint of endpoints) {
    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (endpoint.method === "POST") {
        options.body = JSON.stringify({
          image: "water_leaf.jpg",
        });
      }

      const response = await fetch(`${BASE_URL}${endpoint.path}`, options);

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(`Expected JSON but received: ${contentType}`);
}
      const json = await response.json();

      const pasado =
        response.ok &&
        typeof json.success === "boolean";

      console.log(
        `${pasado ? "Verificado" : "FAIL"} | ${response.status} | ${response.statusText} | ${endpoint.method.padEnd(4)} ${endpoint.path}`
      );

      if (!response.ok) {
        console.log(` Status ${response.status}`);
      }
    } catch (error) {
      console.log(
        `FAIL | ${endpoint.method.padEnd(4)} ${endpoint.path}`
      );

      console.log(error);
    }
  }

  console.log("\nSmoke Test Finished.\n");
}

runSmokeTest();