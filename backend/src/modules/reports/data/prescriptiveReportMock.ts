// Importa el tipo del reporte prescriptivo para asegurar que el objeto
// cumpla con la estructura definida en prescriptiveReportTypes.ts
import {
    PrescriptiveFieldReport,
} from "../types/prescriptiveReportTypes";

// Mock (datos de prueba) de un reporte prescriptivo.
// Se utiliza para pruebas, desarrollo o mientras no existe conexión
// con una API o base de datos.
export const prescriptiveReportMock: PrescriptiveFieldReport = {

    // Identificador del campo agrícola
    fieldId: "FIELD-001",

    // Identificador de la zona específica del campo
    zoneId: "ZONE-NORTH-01",

    // Tipo de cultivo
    cropType: "MAIZ",

    // Puntaje de salud del cultivo
    healthScore: 62,

    // Nivel de riesgo final
    finalRiskLevel: "HIGH",

    // Principal causa detectada del problema
    mainCause: "Estres hidrico",

    // Evidencias utilizadas para generar el reporte
    evidence: [
        {
            id: "EV-01",
            source: "SATELLITE",
            description:
                "Las imagenes satelitales muestran perdida de vigor en la vegetacion.",

            // Fecha en formato ISO
            date: "2026-06-28T10:57:00Z",
        },
        {
            id: "EV-02",
            source: "ROVER_CAMERA",
            description:
                "Los sensores reportan humedad del suelo inferior al nivel recomendado",

            date: "2026-06-29T08:00:00Z",
        },
        {
            id: "EV-03",
            source: "SIMULATION",
            description:
                "No se registran precipitaciones importantes durante los ultimos 12 dias",

            date: "2026-06-29T10:57:00Z",
        },
        {
            id: "EV-04",
            source: "HISTORICAL",
            description:
                "Esta zona presento estres hidrico similar hace 10 meses bajo condiciones comparables",

            date: "2026-06-25T00:00:00Z",
        },
    ],

    // Alertas activas detectadas para la zona
    activeAlerts: [
        {
            id: "AL-01",
            zoneId: "ZONE-NORTH-01",
            level: "HIGH",
            message: "Estres hidrico critico.",
        },
        {
            id: "AL-02",
            zoneId: "ZONE-NORTH-01",
            level: "MEDIUM",
            message: "Posible aparicion de enfermedad foliar.",
        },
    ],

    // Recomendaciones generadas por el sistema
    recommendations: [
        {
            id: "REC-01",
            zoneId: "ZONE-NORTH-01",
            recommendation: "Aplicar riego suplementario en la zona norte",
            priority: "HIGH",
        },
    ],

    // Acciones realizadas (ninguna por el momento)
    actionsTaken: [],

    // Acciones pendientes
    pendingActions: [
        {
            id: "PEND-01",
            description: "Programar riego suplementario en sector norte",

            // Fecha en formato ISO
            dueDate: "2026-07-02T00:00:00Z",

            priority: "HIGH",
        },
    ],

    // Fecha de creación del reporte
    createdAt: "2026-06-29T11:00:00Z",
};