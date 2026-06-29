/**
* =========================================
*  Dashboard Mock
* =========================================
*
* Mock prescriptivo del Dashboard.
* Simula una zona con bajo vigor, NDVI reducido,
* humedad baja y recomendación accionable.
*
* Regla:
* Este mock no debe vivir dentro de DashboardPage.
* La página solo consume datos.
* 
*/

import type { DashboardData } from '../types/dashboard.types';

export const dashboardMock: DashboardData = {
    summary: {
    farm: {
      id: "farm-001",
      name: "Finca Santa Cecilia",
      totalAreaSquareMeters: 42000,
    },

    crops: {
      total: 6,
      healthy: 3,
      warning: 2,
      critical: 1,
    },

    healthScore: 64,

    intelligence: {
      dominantRisk: "WATER_STRESS",
      mostAffectedZoneId: "zone-03",
      prescriptiveSummary:
        "Zona 03 presenta bajo vigor vegetal, humedad reducida y señales visuales compatibles con estrés hídrico. Priorice inspección de riego hoy y registre nueva medición en 24 horas.",
      satelliteLayerStatus: "SIMULATED",
    },

    vegetation: {
      source: "SIMULATION",
      ndvi: 0.42,
      vigorLevel: "LOW",
      anomalyDetected: true,
      explanation:
        "La capa satelital simulada muestra bajo vigor vegetal concentrado en la zona 03.",
      capturedAt: "2026-06-28T08:40:00.000Z",
    },

    vision: {
      status: "WARNING",
      lastPrediction: "WATER_STRESS",
      confidence: 0.87,
      explanation:
        "El análisis visual preliminar detecta reducción de cobertura verde y presencia moderada de áreas secas.",
      lastAnalyzedAt: "2026-06-28T08:45:00.000Z",
    },

    alerts: {
      active: 4,
      critical: 1,
      warning: 2,
      criticalAlerts: [
        {
          id: "alert-001",
          title: "Riesgo alto de estrés hídrico en zona 03",
          severity: "HIGH",
          zoneId: "zone-03",
          evidence: [
            {
              source: "SATELLITE",
              metric: "ndvi",
              value: 0.42,
              unit: "index",
              status: "WARNING",
              explanation:
                "NDVI simulado por debajo del rango esperado para vigor estable.",
            },
            {
              source: "SENSOR",
              metric: "soilMoisturePercentage",
              value: 34,
              unit: "%",
              status: "WARNING",
              explanation:
                "Humedad estimada por debajo del umbral operativo del cultivo.",
            },
            {
              source: "VISION",
              metric: "prediction",
              value: "WATER_STRESS",
              unit: null,
              status: "WARNING",
              explanation:
                "La imagen analizada presenta señales compatibles con estrés hídrico.",
            },
          ],
          recommendedAction:
            "Revisar riego en zona 03, verificar presión del sistema y repetir inspección visual en 24 horas.",
          createdAt: "2026-06-28T09:00:00.000Z",
        },
      ],
    },

    recommendations: {
      urgent: 1,
      highPriority: 2,
      mainRecommendation: {
        id: "recommendation-001",
        priority: "URGENT",
        reason:
          "La zona 03 combina bajo vigor vegetal, humedad reducida y evidencia visual de estrés.",
        suggestedAction:
          "Priorizar revisión del sistema de riego en zona 03 y aplicar riego correctivo si la inspección confirma déficit.",
        expectedImpact: {
          impactArea: "YIELD_PROTECTION",
          description:
            "Actuar hoy puede reducir pérdida de vigor y evitar propagación del estrés a zonas vecinas.",
        },
        evidence: [
          {
            source: "SATELLITE",
            metric: "vigorLevel",
            value: "LOW",
            unit: null,
            status: "WARNING",
            explanation:
              "La simulación satelital identifica bajo vigor en el área crítica.",
          },
          {
            source: "WEATHER",
            metric: "temperatureCelsius",
            value: 33,
            unit: "°C",
            status: "WATCH",
            explanation:
              "Temperatura elevada aumenta demanda hídrica del cultivo durante el día.",
          },
        ],
        createdAt: "2026-06-28T09:05:00.000Z",
      },
    },

    lastUpdatedAt: "2026-06-28T09:10:00.000Z",
  },
}