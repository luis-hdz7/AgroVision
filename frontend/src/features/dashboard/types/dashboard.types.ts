/**
 * ======================
 * Dahsboard types
 * ======================
 *
 * contrato de datos del dashboard general
 *
 * - definir la forma de los datos que usará la pantalla principal
 * - preparar integración futura con backend
 * - mantener el tipado fuerte en métricas, parcelas, alertas, clima y analisis visuales
 */


/*
 * Tono visual/lógico de una tarjeta o estado
 */
export type DashboardTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';


// nivel final de riesgo usado por dashboard, alertas y analisis 
export type RiskLevel = "LOW" | "MEDIUM" |"HIGH" | "CRITICAL"

//Estado de la capa satelital 
//para la MVP usamos SIMULATED , aun no implementamos Sentinel/Landsat real 
export type  SatelliteLayerStatus = "AVAILABLE" | "SIMULATED" | "UNAVAILABLE"

/**Fuente de evidencia */
// sirve para explicar de dónde sale una colclusión 
export type EvidenceSource = 
  | "VISION"
  | "SATELLITE"
  | "SENSOR"
  | "WEATHER"
  | "HISTORY"
  | "MANUAL"
  | "MAPPING"
  | "SIMULATION";

// Estado técnico de una evidencia.
export type EvidenceStatus =
  | "NORMAL"
  | "WATCH"
  | "WARNING"
  | "CRITICAL";

/** Tipo de riesgo dominante. */
// Se separa del texto visual para mantener consistencia técnica.
export type DominantRisk =
  | "WATER_STRESS"
  | "FUNGAL_RISK"
  | "LOW_VIGOR"
  | "VISUAL_ANOMALY"
  | "HEAT_STRESS"
  | "SYSTEM"
  | "UNKNOWN";

// Estado del análisis IA visual.
export type VisionAnalysisStatus =
  | "PENDING"
  | "READY"
  | "WARNING"
  | "CRITICAL"
  | "UNAVAILABLE";

// direccion de  una tendencia/grafica
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';

// estatus de las parcelas
export type ParcelStatus = 'OPTIMAL' | 'ATTENCION' | 'CRITICAL' | 'OFFLINE';

// prioridad de recomendaciones
export type RecommendationPrority = 'HIGH' | 'MEDIUM' | 'LOW';

//severidad de alerta
export type AlertSeverity = 'WARNING' | 'CRITICAL' | 'INFO';

// Evidencia reutilizable, sin este no hay un dashboard prescriptivo defendible
export interface EvidenceItem {
  readonly source: EvidenceSource;
  readonly metric: string;
  readonly value?: number | string | boolean | null;
  readonly unit?: string | null;
  readonly status: EvidenceStatus;
  readonly explanation?: string;
}

// Bloque ejecutivo del dashboard.
// Debe responder: qué pasa, dónde pasa y qué hacer.
export interface DashboardIntelligence {
  readonly dominantRisk: DominantRisk;
  readonly mostAffectedZoneId?: string | null;
  readonly prescriptiveSummary: string;
  readonly satelliteLayerStatus?: SatelliteLayerStatus;
}

// Resumen de alertas para el dashboard.
// No reemplaza Alert completa; solo resume lo crítico.
export interface DashboardAlertSummary {
  readonly active: number;
  readonly critical: number;
  readonly warning: number;
  readonly criticalAlerts: ReadonlyArray<{
    readonly id: string;
    readonly title: string;
    readonly severity: RiskLevel;
    readonly zoneId?: string | null;
    readonly evidence: ReadonlyArray<EvidenceItem>;
    readonly recommendedAction: string;
    readonly createdAt: string;
  }>;
}

// Resumen de recomendaciones para dashboard.
// No reemplaza Recommendation completa.
export interface DashboardRecommendationSummary {
  readonly urgent: number;
  readonly highPriority: number;
  readonly mainRecommendation: {
    readonly id: string;
    readonly priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    readonly reason: string;
    readonly suggestedAction: string;
    readonly expectedImpact: {
      readonly impactArea:
        | "WATER_SAVING"
        | "YIELD_PROTECTION"
        | "DISEASE_PREVENTION"
        | "COST_REDUCTION"
        | "CROP_HEALTH";
      readonly description: string;
    };
    readonly evidence: ReadonlyArray<EvidenceItem>;
    readonly createdAt: string;
  };
}


// Estado resumido del análisis visual IA.
// Esto permite mostrar si ya hay evidencia visual útil.
export interface DashboardVisionSummary {
  readonly status: VisionAnalysisStatus;
  readonly lastPrediction:
    | "HEALTHY"
    | "WATER_STRESS"
    | "CHLOROSIS"
    | "DRY_AREA"
    | "LEAF_SPOT"
    | "UNKNOWN";
  readonly confidence: number;
  readonly explanation: string;
  readonly lastAnalyzedAt: string;
}


// Resumen de vegetación simulada.
// Representa NDVI/vigor sin integrar Sentinel real todavía.
export interface DashboardVegetationSummary {
  readonly source: "SIMULATION" | "SATELLITE" | "ROVER_CAMERA" | "UPLOAD" | "HISTORY";
  readonly ndvi?: number | null;
  readonly vigorLevel: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  readonly anomalyDetected: boolean;
  readonly explanation: string;
  readonly capturedAt: string;
}


// DashboardSummary actualizado para frontend.
// Agrupa lo necesario para comunicar inteligencia agrícola.
export interface DashboardSummary {
  readonly farm: {
    readonly id: string;
    readonly name: string;
    readonly totalAreaSquareMeters: number;
  };

  readonly crops: {
    readonly total: number;
    readonly healthy: number;
    readonly warning: number;
    readonly critical: number;
  };

  readonly healthScore: number;

  readonly alerts: DashboardAlertSummary;

  readonly recommendations: DashboardRecommendationSummary;

  readonly intelligence: DashboardIntelligence;

  readonly vegetation: DashboardVegetationSummary;

  readonly vision: DashboardVisionSummary;

  readonly lastUpdatedAt: string;
}

// Forma final que consume DashboardPage.
export interface DashboardData {
  readonly summary: DashboardSummary;
}