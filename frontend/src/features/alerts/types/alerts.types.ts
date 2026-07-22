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

export interface EvidenceItem {
    readonly source: EvidenceSource;
    readonly metric: string;
    readonly value?: number | string | boolean | null;
    readonly unit?: string | null;
    readonly status: EvidenceStatus;
    readonly explanation: string;
}

export interface AgriculturalAlert {
    readonly id: string;
    readonly fieldId: string;
    readonly zoneId: string | null;
    readonly type: AlertType;
    readonly severity: AlertSeverity;
    readonly title: string;
    readonly message: string;
    readonly evidence: ReadonlyArray<EvidenceItem>;
    readonly recommendedAction: string;
    readonly status: AlertStatus; 
    readonly createdAt: string;
    readonly resolvedAt: string | null; 
}


/**
 * Forma normalizada que usa la pantalla.
 * se separa de ApiResponse para no acoplar la UI al transporte HTTP.
*/

export interface AlertsData {
    readonly alerts: ReadonlyArray<AgriculturalAlert>;
    readonly totalActive: number;
    readonly totalCritical: number;
    readonly generatedAt: string;
}

export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message?: string;
    readonly error?: string;
    readonly timestamp: string;
}