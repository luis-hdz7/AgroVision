import { PrescriptiveFieldReport } from "../types/prescriptiveReportTypes";

// Mock de reporte prescriptivo alineado con el caso oficial de la demo:
// field-001 -> zone-03 -> ORANGE

export const prescriptiveReportMock: PrescriptiveFieldReport = {
  fieldId: "field-001",
  zoneId: "zone-03",
  cropType: "ORANGE",
  healthScore: 35,
  finalRiskLevel: "HIGH",
  mainCause:
    "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",

  evidence: [
    {
      id: "EV-01",
      source: "SATELLITE",
      metric: "ndvi",
      value: 0.24,
      unit: null,
      status: "CRITICAL",
      explanation: "Very low vegetation vigor detected.",
      date: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-02",
      source: "SATELLITE",
      metric: "ndwi",
      value: 0.12,
      unit: null,
      status: "CRITICAL",
      explanation: "Very low canopy water content detected.",
      date: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-03",
      source: "SATELLITE",
      metric: "gndvi",
      value: 0.22,
      unit: null,
      status: "CRITICAL",
      explanation: "Severe reduction in chlorophyll activity detected.",
      date: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-04",
      source: "SENSOR",
      metric: "soilMoisturePercentage",
      value: 28,
      unit: "%",
      status: "CRITICAL",
      explanation: "Critical soil moisture deficit detected.",
      date: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-05",
      source: "WEATHER",
      metric: "temperatureCelsius",
      value: 38,
      unit: "°C",
      status: "WARNING",
      explanation: "Elevated temperature may increase crop stress.",
      date: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-06",
      source: "HISTORY",
      metric: "vegetationTrend",
      value: -35,
      unit: "%",
      status: "WARNING",
      explanation: "Negative vegetation trend detected.",
      date: "2026-07-03T12:10:00Z",
    },
  ],

  activeAlerts: [
    {
      id: "AL-01",
      zoneId: "zone-03",
      severity: "HIGH",
      message:
        "Multiple vegetation indicators suggest severe loss of crop vigor.",
    },
    {
      id: "AL-02",
      zoneId: "zone-03",
      severity: "HIGH",
      message:
        "Critical soil moisture deficit indicates potential water stress.",
    },
    {
      id: "AL-03",
      zoneId: "zone-03",
      severity: "HIGH",
      message:
        "Elevated temperature may intensify vegetation stress conditions.",
    },
  ],

  recommendations: [
    {
      id: "REC-01",
      zoneId: "zone-03",
      recommendation:
        "Inspect irrigation coverage, validate soil moisture conditions and apply corrective irrigation if water deficit is confirmed.",
      priority: "HIGH",
      relatedEvidenceIds: [
        "EV-01",
        "EV-02",
        "EV-03",
        "EV-04",
        "EV-05",
        "EV-06",
      ],
    },
  ],

  actionsTaken: [],

  pendingActions: [
    {
      id: "PEND-01",
      description:
        "Perform immediate field inspection in zone-03 and execute corrective irrigation if required.",
      dueDate: "2026-07-04T00:00:00Z",
      priority: "HIGH",
    },
  ],

  createdAt: "2026-07-03T12:10:00Z",
};