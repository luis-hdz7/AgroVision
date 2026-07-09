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
}