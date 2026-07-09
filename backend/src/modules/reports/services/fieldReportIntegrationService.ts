/**
 * Field Report Integration Service
 * 
 * Integra datos de múltiples módulos para crear un reporte completo del campo:
 * - ZoneInsight: Análisis de zonas críticas
 * - Alerts: Alertas activas
 * - Recommendations: Recomendaciones generadas
 * - History: Cuaderno de campo (fieldNotebook)
 * - FieldReport: Integración general
 */

import { FieldReport } from "../types/fieldReportTypes";

export interface FieldReportIntegration {
  fieldId: string;
  fieldName: string;
  generatedAt: string;
  
  // Layer 1: Zone Insights
  zoneInsights: {
    totalZones: number;
    criticalZones: number;
    zones: Array<{
      zoneId: string;
      riskLevel: string;
      healthScore: number;
      mainCause?: string;
    }>;
  };
  
  // Layer 2: Alerts
  alerts: {
    totalActive: number;
    byType: Record<string, number>;
    items: Array<{
      alertId: string;
      zoneId: string;
      type: string;
      severity: string;
      message: string;
      createdAt: string;
    }>;
  };
  
  // Layer 3: Recommendations
  recommendations: {
    totalPending: number;
    byPriority: Record<string, number>;
    items: Array<{
      recommendationId: string;
      zoneId: string;
      title: string;
      description: string;
      actionType: string;
      priority: string;
      createdAt: string;
      status: string;
    }>;
  };
  
  // Layer 4: History (Field Notebook Actions)
  history: {
    totalActions: number;
    recentActions: Array<{
      actionId: string;
      zoneId: string;
      description: string;
      type: string;
      executedAt?: string;
      status: string;
    }>;
  };
  
  // Layer 5: Integrated Field Report Summary
  fieldReport: {
    status: string;
    overallRiskLevel: string;
    overallHealthScore: number;
    totalEvidence: number;
    activeAlerts: number;
    pendingRecommendations: number;
    lastUpdate: string;
  };
}

/**
 * Obtener datos de ZoneInsight (mock)
 */
function getZoneInsights(fieldId: string) {
  // Aquí se conectaría con zoneInsightService
  // Por ahora, datos mock
  return {
    totalZones: 3,
    criticalZones: 1,
    zones: [
      {
        zoneId: "zone-01",
        riskLevel: "low",
        healthScore: 85,
      },
      {
        zoneId: "zone-02",
        riskLevel: "medium",
        healthScore: 65,
        mainCause: "Nutrient deficiency",
      },
      {
        zoneId: "zone-03",
        riskLevel: "high",
        healthScore: 42,
        mainCause: "Water stress + pest pressure",
      },
    ],
  };
}

/**
 * Obtener alertas activas (mock)
 */
function getActiveAlerts(fieldId: string) {
  // Aquí se conectaría con alertService
  return {
    totalActive: 2,
    byType: {
      water_stress: 1,
      pest: 1,
    },
    items: [
      {
        alertId: "AL-01",
        zoneId: "zone-03",
        type: "water_stress",
        severity: "high",
        message: "Severe water stress detected in zone-03",
        createdAt: "2026-07-05T11:00:00Z",
      },
      {
        alertId: "AL-02",
        zoneId: "zone-03",
        type: "pest",
        severity: "high",
        message: "Possible pest infestation detected",
        createdAt: "2026-07-05T11:05:00Z",
      },
    ],
  };
}

/**
 * Obtener recomendaciones pendientes (mock)
 */
function getRecommendations(fieldId: string) {
  // Aquí se conectaría con recommendationService
  return {
    totalPending: 1,
    byPriority: {
      immediate: 1,
    },
    items: [
      {
        recommendationId: "REC-01",
        zoneId: "zone-03",
        title: "Apply emergency irrigation",
        description: "Apply 30-35mm of water via drip irrigation in the next 12-24 hours",
        actionType: "irrigation",
        priority: "immediate",
        createdAt: "2026-07-05T11:10:00Z",
        status: "pending",
      },
    ],
  };
}

/**
 * Obtener historial de acciones del cuaderno de campo (mock)
 */
function getFieldNotebookHistory(fieldId: string) {
  // Aquí se conectaría con fieldNotebookService
  return {
    totalActions: 3,
    recentActions: [
      {
        actionId: "fn-001",
        zoneId: "zone-03",
        description: "Field inspection - visual symptoms observed",
        type: "inspection",
        executedAt: "2026-07-05T09:15:00Z",
        status: "completed",
      },
      {
        actionId: "fn-002",
        zoneId: "zone-03",
        description: "Emergency irrigation applied - 30mm",
        type: "irrigation",
        executedAt: "2026-07-05T14:00:00Z",
        status: "completed",
      },
      {
        actionId: "fn-003",
        zoneId: "zone-03",
        description: "Technical review scheduled",
        type: "monitoring",
        status: "pending",
      },
    ],
  };
}

/**
 * Obtener integración completa del reporte del campo
 */
export function getFieldReportIntegration(fieldId: string): FieldReportIntegration | null {
  // Validar que el campo existe
  if (!fieldId) {
    return null;
  }

  const zoneInsights = getZoneInsights(fieldId);
  const alerts = getActiveAlerts(fieldId);
  const recommendations = getRecommendations(fieldId);
  const history = getFieldNotebookHistory(fieldId);

  // Calcular métricas agregadas
  const overallHealthScore =
    Math.round(
      zoneInsights.zones.reduce((sum, z) => sum + z.healthScore, 0) /
        zoneInsights.zones.length,
    ) || 0;

  const overallRiskLevel =
    zoneInsights.criticalZones > 0
      ? "high"
      : zoneInsights.zones.some((z) => z.riskLevel === "medium")
        ? "medium"
        : "low";

  return {
    fieldId,
    fieldName: `Field ${fieldId}`,
    generatedAt: new Date().toISOString(),

    zoneInsights,

    alerts,

    recommendations,

    history,

    fieldReport: {
      status: "active",
      overallRiskLevel,
      overallHealthScore,
      totalEvidence: zoneInsights.zones.reduce((sum) => sum + 3, 0), // Aprox 3 evidencias por zona
      activeAlerts: alerts.totalActive,
      pendingRecommendations: recommendations.totalPending,
      lastUpdate: new Date().toISOString(),
    },
  };
}
