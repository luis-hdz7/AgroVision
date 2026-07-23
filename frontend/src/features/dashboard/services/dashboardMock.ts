/**
* =========================================
*  Dashboard Mock
* =========================================
*
* Mock prescriptivo del Dashboard.
* Simula una zona con bajo vigor, NDVI reducido,
* humedad baja y recomendación accionable.
*
* Caso demo oficial: field-001 / zone-03 / ORANGE / HIGH
* Alineado con los valores del backend (zoneInsightMock, alertsMock, recommendationsMock).
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

    fieldId: "field-001",
    cropType: "ORANGE",

    crops: {
      total: 6,
      healthy: 3,
      warning: 2,
      critical: 1,
    },

    healthScore: 35,

    intelligence: {
      dominantRisk: "WATER_STRESS",
      mostAffectedZoneId: "zone-03",
      prescriptiveSummary:
        "La zona 03 del cultivo de naranjo presenta deterioro severo por estrés hídrico. Múltiples fuentes de evidencia (sensor, satélite, visión) indican humedad crítica, NDVI muy bajo y clorosis. Priorice revisión de riego inmediata y seguimiento en 24 horas.",
      satelliteLayerStatus: "SIMULATED",
    },

    vegetation: {
      source: "SIMULATION",
      ndvi: 0.24,
      vigorLevel: "LOW",
      anomalyDetected: true,
      explanation:
        "La capa satelital simulada muestra vigor vegetal muy bajo (NDVI 0.24) en la zona 03, compatible con estrés hídrico severo.",
      capturedAt: "2026-07-03T12:10:00.000Z",
    },

    vision: {
      status: "WARNING",
      lastPrediction: "WATER_STRESS",
      confidence: 0.87,
      explanation:
        "El análisis visual detecta clorosis, áreas secas y deficiencia de vigor en el dosel del naranjo de la zona 03.",
      lastAnalyzedAt: "2026-07-03T12:10:00.000Z",
    },

    alerts: {
      active: 4,
      critical: 1,
      warning: 2,
      criticalAlerts: [
        {
          id: "alert-zone-03-water_stress",
          title: "Riesgo alto de estrés hídrico en zona 03",
          severity: "HIGH",
          zoneId: "zone-03",
          evidence: [
            {
              source: "SENSOR",
              metric: "soilMoisturePercentage",
              value: 28,
              unit: "%",
              status: "CRITICAL",
              explanation:
                "Humedad del suelo crítica (28%), por debajo del umbral operativo del cultivo de naranjo.",
            },
            {
              source: "SATELLITE",
              metric: "ndvi",
              value: 0.24,
              unit: "index",
              status: "CRITICAL",
              explanation:
                "NDVI muy bajo (0.24), indica vigor vegetal severamente reducido.",
            },
            {
              source: "VISION",
              metric: "prediction",
              value: "WATER_STRESS",
              unit: null,
              status: "WARNING",
              explanation:
                "Análisis visual compatible con estrés hídrico: clorosis y áreas secas detectadas.",
            },
          ],
          recommendedAction:
            "Revisar riego en zona 03, verificar presión del sistema y aplicar riego correctivo de emergencia.",
          createdAt: "2026-07-03T12:10:00.000Z",
        },
      ],
    },

    recommendations: {
      urgent: 1,
      highPriority: 2,
      mainRecommendation: {
        id: "rec-zone-03-water_stress",
        priority: "URGENT",
        reason:
          "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
        suggestedAction:
          "Estrés hídrico detectado en periodo crítico de floración del Naranjo. Activar riego controlado inmediato.",
        expectedImpact: {
          impactArea: "YIELD_PROTECTION",
          description:
            "Actuar hoy puede reducir pérdida de vigor y evitar propagación del estrés a zonas vecinas.",
        },
        evidence: [
          {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.24,
            unit: "index",
            status: "CRITICAL",
            explanation:
              "NDVI muy bajo (0.24), vigor vegetativo severamente reducido.",
          },
          {
            source: "WEATHER",
            metric: "temperatureCelsius",
            value: 38,
            unit: "°C",
            status: "WARNING",
            explanation:
              "Temperatura elevada (38°C) aumenta la demanda hídrica del cultivo durante el día.",
          },
        ],
        createdAt: "2026-07-03T12:10:00.000Z",
      },
    },

    lastUpdatedAt: "2026-07-03T12:10:00.000Z",
  },
}
