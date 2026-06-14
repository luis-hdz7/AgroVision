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

// direccion de  una tendencia/grafica
export type TrendDirection = 'up' | 'down' | 'stable';

// estatus de las parcelas
export type ParcelStatus = 'optimal' | 'attencion' | 'critical' | 'offline ';

// prioridad de recomendaciones
export type RecommendationPrority = 'high' | 'medium' | 'low';

//severidad de alerta
export type AlertSeverity = 'warning' | 'critical' | 'info';

//interface dashborard métricas
export interface DashboardMetrics {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly tone: DashboardTone;
  readonly helper: string;
  readonly trend?: {
    readonly label: string;
    readonly direction: TrendDirection;
  };
}

// inreface parcelas
export interface ParcelSummary {}

//interface info  general de la finca o terreno

//punto especifico en una grafica

// tendencia usada en humedad, salud, temperatura, etc
