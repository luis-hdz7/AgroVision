/**
 * =========================================
 * Alerts Types
 * =========================================
 * 
 * Tipos para las alertas prescriptivas
 * 
 * Finalidad:
 * - representar alertas con evidencia 
 * - manter los campos alineados con el contrato necesario 
 * - evitar errores en la validacion de datos
*/

export type AlertType =
  | 'WATER_STRESS'
  | 'FUNGAL_RISK'
  | 'LOW_VIGOR'
  | 'VISUAL_ANOMALY'
  | 'HEAT_STRESS'
  | 'SYSTEM';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertStatus =
  | "ACTIVE"
  | "RESOLVED"
  | "IGNORED";

export type EvidenceSource =
  | "VISION"
  | "SATELLITE"
  | "SENSOR"
  | "WEATHER"
  | "HISTORY"
  | "MANUAL"
  | "MAPPING"
  | "SIMULATION";

export type EvidenceStatus =
  | "NORMAL"
  | "WATCH"
  | "WARNING"
  | "CRITICAL";

