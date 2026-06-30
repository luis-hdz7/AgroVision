/*
    * ALERTS MOCK
    * Genera alertas de prueba utilizando los ZoneInsight simulados.
    * Esto permite validar el flujo:
    *
    * ZoneInsight -> AlertGenerationService -> AgriculturalAlert
*/

import { zoneInsightMock } from "../../analysis/data/zoneInsightMock";
import { generateAlerts } from "../services/alertGenerationService";
import { AgriculturalAlert } from "../types/alertsTypes";

export const alertsMock: AgriculturalAlert[] =
    zoneInsightMock.flatMap(insight =>
        generateAlerts(insight)
    );


//* Ediciones de este archivo
// @luis-hdz7 el 30/06/2026 (creación y primera edición)