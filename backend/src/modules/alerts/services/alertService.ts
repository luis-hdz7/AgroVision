import { alertsMock } from "../data/alertsMock";
import { AgriculturalAlert } from "../types/alertsTypes";

/*
 * Servicio encargado de proporcionar las alertas agrícolas simuladas.
 * Actualmente consume datos del mock, pero en el futuro podrá consultar
 * una base de datos o un servicio externo sin modificar el controlador.
 */

export class AlertService {
    /**
     * Recupera todas las alertas registradas.
     */
    public static getAllAlerts(): AgriculturalAlert[] {
        return alertsMock
    }
    /**
     * Filtrar las alertas pertenecientes a una zona específica.
     */
    public static getAlertsByZone(zoneId: string): AgriculturalAlert[] {
        return this.getAllAlerts().filter(alert => alert.zoneId === zoneId);
    }
    /**
     * Recupera únicamente las alertas de mayor prioridad (HIGH).
     */
    public static getCriticalAlerts(): AgriculturalAlert[] {
        return this.getAllAlerts().filter(alert => alert.severity === "HIGH");
    }
}