import { PrescriptiveFieldReport } from "../types/prescriptiveReportTypes";

// Mock de reporte prescriptivo alineado con el caso oficial de la demo:
// field-001 -> zone-03 -> ORANGE

export const prescriptiveReportMock: PrescriptiveFieldReport = {
  reportId: "report-zone-03-001",
  fieldId: "field-001",
  zoneId: "zone-03",
  cropType: "ORANGE",
  healthScore: 35,
  finalRiskLevel: "HIGH",
  mainCause:
    "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor. Critical soil moisture deficit and reduced vegetation indices support this assessment. Immediate inspection of irrigation coverage and soil moisture conditions is recommended.",
  summary:
    "El caso field-001 / zone-03 / ORANGE concentra evidencia multifuente y acciones trazables desde el notebook.",

  evidence: [
    {
      id: "EV-01",
      source: "SATELLITE",
      metric: "ndvi",
      value: 0.24,
      unit: null,
      status: "CRITICAL",
      explanation: "Very low vegetation vigor detected.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-02",
      source: "SATELLITE",
      metric: "ndwi",
      value: 0.12,
      unit: null,
      status: "CRITICAL",
      explanation: "Very low canopy water content detected.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-03",
      source: "SATELLITE",
      metric: "gndvi",
      value: 0.22,
      unit: null,
      status: "CRITICAL",
      explanation: "Severe reduction in chlorophyll activity detected.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-04",
      source: "SENSOR",
      metric: "soilMoisturePercentage",
      value: 28,
      unit: "%",
      status: "CRITICAL",
      explanation: "Critical soil moisture deficit detected.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-05",
      source: "WEATHER",
      metric: "temperatureCelsius",
      value: 38,
      unit: "°C",
      status: "WARNING",
      explanation: "Elevated temperature may increase crop stress.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "EV-06",
      source: "HISTORY",
      metric: "vegetationTrend",
      value: -35,
      unit: "%",
      status: "WARNING",
      explanation: "Negative vegetation trend detected.",
      capturedAt: "2026-07-03T12:10:00Z",
    },
  ],

  activeAlerts: [
    {
      id: "AL-01",
      zoneId: "zone-03",
      severity: "HIGH",
      type: "LOW_VIGOR",
      title: "Reduced vegetation vigor (ORANGE)",
      message:
        "Multiple vegetation indicators suggest severe loss of crop vigor.",
      recommendedAction: "Inspect irrigation coverage and verify soil moisture conditions.",
      createdAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "AL-02",
      zoneId: "zone-03",
      severity: "HIGH",
      type: "WATER_STRESS",
      title: "Potential water stress (ORANGE)",
      message:
        "Critical soil moisture deficit indicates potential water stress.",
      recommendedAction: "Apply corrective irrigation after field verification.",
      createdAt: "2026-07-03T12:10:00Z",
    },
    {
      id: "AL-03",
      zoneId: "zone-03",
      severity: "HIGH",
      type: "HEAT_STRESS",
      title: "Potential heat stress (ORANGE)",
      message:
        "Elevated temperature may intensify vegetation stress conditions.",
      recommendedAction: "Continue monitoring environmental conditions.",
      createdAt: "2026-07-03T12:10:00Z",
    },
  ],

  recommendations: [
    {
      id: "REC-01",
      zoneId: "zone-03",
      reason:
        "Multiple evidence sources indicate severe vegetation deterioration associated with water stress.",
      suggestedAction:
        "Inspect irrigation coverage, validate soil moisture conditions and apply corrective irrigation if water deficit is confirmed.",
      expectedImpact: {
        impactArea: "YIELD_PROTECTION",
        description: "Reduce the risk of continued vegetation deterioration.",
      },
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
      id: "fn-003",
      title: "Seguimiento pendiente",
      description:
        "Revisar la zona dentro de 24-48 horas y validar si se requiere intervención adicional o inspección de plagas.",
      status: "PENDING",
      responsible: "Carla Mena",
      registeredAt: "2026-06-30T08:00:00Z",
      dueDate: "2026-07-01T08:00:00Z",
      priority: "HIGH",
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
    },
  ],

  createdAt: "2026-07-03T12:10:00Z",
};
