import { FieldNotebookEntry } from "../types/fieldNotebookTypes";

export const fieldNotebookMock: FieldNotebookEntry[] = [
  {
    id: "fn-001",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropId: "crop-orange-01",
    activityType: "INSPECTION",
    description: "Inspección visual inicial de la zona afectada.",
    problemObserved: "Visual inspection confirmed dry canopy sections and chlorosis symptoms consistent with severe water stress.",
    actionTaken:
      "Se documentó evidencia visual y se aisló el sector para revisión técnica inmediata.",
    responsibleUser: "Sofía Vega",
    evidence: [
      {
        id: "evid-fn-001",
        type: "image",
        source: "Rover Camera",
        description:
          "Imagen de campo con defoliación visible para la zona zone-03.",
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
    description: "Riego de emergencia programado para el sector crítico.",
    problemObserved: "Humedad del suelo por debajo del rango recomendado.",
    actionTaken:
      "Se activó un riego suplementario en la zona para aliviar el estrés hídrico.",
    responsibleUser: "Julián León",
    evidence: [
      {
        id: "evid-fn-002",
        type: "sensor",
        source: "Soil Moisture Sensor",
        description:
          "Sensor de humedad del suelo con lectura inferior al umbral crítico.",
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
      "Revisión técnica pendiente para evaluar la posible plaga estructural.",
    problemObserved:
      "Síntomas compatibles con plaga estructural y pérdida acelerada del vigor.",
    actionTaken:
      "Pendiente de asignación a la cuadrilla técnica y confirmación en laboratorio.",
    responsibleUser: "Carla Mena",
    evidence: [
      {
        id: "evid-fn-003",
        type: "note",
        source: "Technical Notebook",
        description:
          "Nota de campo con observación pendiente de confirmación en laboratorio.",
        capturedAt: "2026-06-30T08:00:00Z",
      },
    ],
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
        source: "Field Log",
        description:
          "Registro de aplicación de fertilizante en lote adyacente.",
        capturedAt: "2026-07-01T10:15:00Z",
      },
    ],
    createdAt: "2026-07-01T10:15:00Z",
  },
];
