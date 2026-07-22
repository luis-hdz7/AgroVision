import { FieldNotebookEntry } from "../types/fieldNotebookTypes";

export const fieldNotebookMock: FieldNotebookEntry[] = [
  {
    id: "fn-001",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropId: "crop-orange-01",
    activityType: "INSPECTION",
    description:
      "Inspección visual inicial en la zona crítica: se detectó clorosis y áreas secas en el dosel.",
    problemObserved:
      "Se observaron hojas con clorosis, pérdida de turgencia y sectores del dosel secos, compatibles con estrés hídrico severo.",
    actionTaken:
      "Se registró la anomalía y se documentó evidencia visual para soportar la evaluación técnica de la zona.",
    responsibleUser: "Sofía Vega",
    alertId: "alert-zone03-visual_anomaly",
    recommendationId: "rec-zone03-visual_anomaly",
    reportId: "report-zone003-001",
    evidence: [
      {
        id: "evid-fn-001",
        type: "image",
        source: "VISION",
        description:
          "Fotografía de campo con clorosis visible y áreas secas en la zona zone-03.",
        url: "https://example.org/evidence/fn-001.jpg",
        capturedAt: "2026-06-29T16:00:00Z",
      },
    ],
    createdAt: "2026-06-29T16:00:00Z",
  },
  {
    id: "fn-002",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropId: "crop-orange-01",
    activityType: "IRRIGATION",
    description:
      "Riego correctivo aplicado para mitigar el déficit hídrico detectado en la zona afectada.",
    problemObserved:
      "La humedad del suelo estaba por debajo del umbral recomendado y coincidía con la observación visual de estrés hídrico.",
    actionTaken:
      "Se activó un riego suplementario de emergencia para recuperar la disponibilidad de agua en la zona radicular.",
    responsibleUser: "Julián León",
    evidence: [
      {
        id: "evid-fn-002",
        type: "sensor",
        source: "SENSOR",
        description:
          "Lectura de humedad del suelo inferior al umbral crítico para la zona zone-03.",
        capturedAt: "2026-06-29T17:00:00Z",
      },
    ],
    createdAt: "2026-06-29T17:00:00Z",
  },
  {
    id: "fn-003",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropId: "crop-orange-01",
    activityType: "INSPECTION",
    description:
      "Seguimiento pendiente para validar la recuperación y confirmar si la recomendación de inspección técnica sigue vigente.",
    problemObserved:
      "La respuesta al riego fue parcial y se debe revisar si persisten síntomas compatibles con plaga estructural o déficits de humedad.",
    actionTaken:
      "Pendiente: revisar la zona dentro de 24-48 horas y validar si se requiere intervención adicional o inspección de plagas.",
    responsibleUser: "Carla Mena",
    evidence: [
      {
        id: "evid-fn-003",
        type: "note",
        source: "MANUAL",
        description:
          "Nota de campo con seguimiento pendiente y próximos pasos para la zona zone-03.",
        capturedAt: "2026-06-30T08:00:00Z",
      },
    ],
    followUpAt: "2026-07-01T08:00:00Z",
    createdAt: "2026-06-30T08:00:00Z",
  },
  {
    id: "fn-004",
    fieldId: "field-001",
    zoneId: "zone-02",
    cropId: "crop-apple-01",
    activityType: "FERTILIZATION",
    description: "Aplicación de fertilizante de seguimiento en el lote vecino.",
    problemObserved:
      "Se detectó un leve descenso del vigor en la zona adyacente.",
    actionTaken:
      "Se aplicó fertilización de ajuste y se programó observación de seguimiento.",
    responsibleUser: "Mateo Ruiz",
    evidence: [
      {
        id: "evid-fn-004",
        type: "document",
        source: "HISTORY",
        description:
          "Registro de aplicación de fertilizante en lote adyacente.",
        capturedAt: "2026-07-01T10:15:00Z",
      },
    ],
    createdAt: "2026-07-01T10:15:00Z",
  },
];
