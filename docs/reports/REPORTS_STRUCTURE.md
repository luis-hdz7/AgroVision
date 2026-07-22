# Reports Structure - AgroVision

## Objetivo

Documentar la estructura real del reporte prescriptivo que actualmente expone el backend de AgroVision. Este documento refleja la implementación actual de los tipos y del servicio de reportes, y evita incluir campos que ya no forman parte del modelo.

---

## 1. Tipo real implementado

Actualmente el backend expone un único reporte prescriptivo para una zona, con la siguiente forma:

```typescript
interface PrescriptiveFieldReport {
  reportId: string;
  fieldId: string;
  zoneId: string;
  cropType: string;
  healthScore: number;
  finalRiskLevel: RiskLevel;
  mainCause: string;
  summary: string;
  evidence: PrescriptiveEvidenceSummary[];
  activeAlerts: PrescriptiveAlertSummary[];
  recommendations: PrescriptiveRecommendationSummary[];
  actionsTaken: PrescriptiveActionLog[];
  pendingActions: PrescriptivePendingAction[];
  createdAt: string;
}
```

> **Corrección respecto a versiones anteriores de este documento:** `reportId` **sí existe** en la implementación actual (formato `report-${zoneId}-001`) y `summary` también forma parte del reporte. Ambos habían quedado fuera por error en la versión previa de esta documentación.

### Campos que no forman parte del modelo actual

No existen en la implementación actual los siguientes campos:

- `reportType`
- `generatedAt`
- `actionPriority`
- `estimatedCost`
- `estimatedDaysToRecover`
- `createdBy`
- `version`
- `lastModifiedAt`
- `notes`
- `alerts` como nombre de propiedad principal del reporte (en la implementación real se usa `activeAlerts`)

---

## 2. Estructura de evidencia

```typescript
interface PrescriptiveEvidenceSummary {
  id: string;
  source: string;
  metric: string;
  value: number | string | boolean | null;
  unit?: string | null;
  status: string;
  explanation: string;
  capturedAt: string;
}
```

> **Corrección:** el campo de fecha se llama `capturedAt`, no `date`.

### Significado de cada campo

- `id`: identificador de la evidencia, por ejemplo `ev-001`.
- `source`: fuente original de la evidencia, tomada de `ZoneInsight.evidence[].source` — por ejemplo `SATELLITE`, `SENSOR`, `WEATHER`, `HISTORY` o `VISION`.
- `metric`: métrica asociada, como `ndvi`, `soilMoisturePercentage`, `temperatureCelsius`, o métricas visuales como `visualAnomaly`, `dryAreaDetected`, `chlorosisDetected`.
- `value`: valor medido o inferido.
- `unit`: unidad del valor si aplica.
- `status`: estado de la evidencia, por ejemplo `NORMAL`, `WATCH`, `WARNING` o `CRITICAL`.
- `explanation`: descripción breve de por qué esa evidencia es relevante.
- `capturedAt`: fecha de referencia del reporte, derivada de `ZoneInsight.generatedAt`.

> **Evidencia visual preliminar:** el reporte puede contener evidencia con `source: "VISION"` proveniente directamente del análisis de `ZoneInsight`, generada antes de una inspección de campo formal (por ejemplo `visualAnomaly`, `dryAreaDetected`, `chlorosisDetected`). Esta evidencia respalda alertas de tipo `VISUAL_ANOMALY` y sus recomendaciones asociadas, y puede confirmarse o ampliarse posteriormente mediante el Notebook de campo (ver `PrescriptiveActionLog.evidence` en la sección 5).

---

## 3. Estructura de alertas

```typescript
interface PrescriptiveAlertSummary {
  id: string;
  zoneId: string;
  severity: RiskLevel;
  type: string;
  title: string;
  message: string;
  recommendedAction: string;
  createdAt: string;
}
```

> **Corrección:** la estructura real incluye también `type`, `title`, `recommendedAction` y `createdAt`, no solo `id`, `zoneId`, `severity` y `message`.

### Observación importante

La implementación actual usa `activeAlerts`, no `alerts`, como propiedad del reporte.

---

## 4. Estructura de recomendaciones

```typescript
interface PrescriptiveRecommendationSummary {
  id: string;
  zoneId: string;
  reason: string;
  suggestedAction: string;
  expectedImpact: {
    impactArea: string;
    description: string;
  };
  priority: RecommendationPriority;
  relatedEvidenceIds: string[];
}
```

> **Corrección:** no existe un campo único `recommendation` con texto combinado. La implementación real separa `reason` (el "por qué"), `suggestedAction` (la acción concreta) y `expectedImpact` (objeto con `impactArea` y `description`).

### Significado de cada campo

- `reason`: causa/justificación de la recomendación, derivada de `ZoneInsight.mainCause` + `summary`.
- `suggestedAction`: acción concreta sugerida (puede venir de un `CropProfile` o de `ZoneInsight.recommendedAction`).
- `expectedImpact`: impacto esperado de aplicar la recomendación, con área (`WATER_SAVING`, `CROP_HEALTH`, `YIELD_PROTECTION`, `DISEASE_PREVENTION`) y descripción.
- `priority`: prioridad de la recomendación (incluye `URGENT`).
- `relatedEvidenceIds`: lista de IDs de evidencias (`PrescriptiveEvidenceSummary.id`) que la sustentan.

---

## 5. Acciones tomadas y pendientes

```typescript
interface PrescriptiveActionLog {
  id: string;
  title: string;
  description: string;
  status: "DONE";
  responsible: string;
  registeredAt: string;
  evidence: PrescriptiveActionEvidence[];
}

interface PrescriptivePendingAction {
  id: string;
  title: string;
  description: string;
  status: "PENDING";
  responsible: string;
  registeredAt: string;
  dueDate: string | null;
  priority: RecommendationPriority;
  evidence: PrescriptiveActionEvidence[];
}

interface PrescriptiveActionEvidence {
  id: string;
  type: string;
  source: string;
  description: string;
  url?: string;
  capturedAt: string;
}
```

> **Corrección:** las estructuras reales no son `{id, actionTaken, responsible, executionDate}` ni `{id, description, dueDate, priority}`. Ambas incluyen `title`, `status` (`"DONE"` / `"PENDING"` respectivamente), `registeredAt`, y un arreglo `evidence[]` con la evidencia asociada del Notebook de campo (incluye evidencia visual cuando `source: "VISION"`).

Estas estructuras se construyen a partir de las entradas del Notebook de campo, filtrando por si el texto de la acción contiene o no la palabra "pendiente"/"pending".

---

## 6. Ejemplo real basado en la implementación

```json
{
  "reportId": "report-zone-03-001",
  "fieldId": "field-001",
  "zoneId": "zone-03",
  "cropType": "ORANGE",
  "healthScore": 35,
  "finalRiskLevel": "HIGH",
  "mainCause": "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
  "summary": "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor. Las acciones se trazan desde el notebook de campo.",
  "evidence": [
    {
      "id": "ev-006",
      "source": "VISION",
      "metric": "chlorosisDetected",
      "value": true,
      "unit": null,
      "status": "WARNING",
      "explanation": "Visual signs compatible with chlorosis were detected.",
      "capturedAt": "2026-07-03T12:10:00Z"
    }
  ],
  "activeAlerts": [
    {
      "id": "alert-zone-03-visual_anomaly",
      "zoneId": "zone-03",
      "severity": "HIGH",
      "type": "VISUAL_ANOMALY",
      "title": "Visual anomaly detected (ORANGE)",
      "message": "Visual inspection detected anomalies compatible with vegetation stress in ORANGE. Field verification is recommended before applying corrective measures.",
      "recommendedAction": "Inspect irrigation coverage and verify soil moisture conditions.",
      "createdAt": "2026-07-03T12:10:00Z"
    }
  ],
  "recommendations": [
    {
      "id": "rec-zone-03-visual_anomaly",
      "zoneId": "zone-03",
      "reason": "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor. Multiple evidence sources consistently indicate severe vegetation deterioration associated with water stress.",
      "suggestedAction": "Inspect irrigation coverage and verify soil moisture conditions.",
      "expectedImpact": {
        "impactArea": "DISEASE_PREVENTION",
        "description": "Allows early validation of visual anomalies before they progress."
      },
      "priority": "HIGH",
      "relatedEvidenceIds": ["ev-006"]
    }
  ],
  "actionsTaken": [
    {
      "id": "fn-002",
      "title": "IRRIGATION",
      "description": "Se activó un riego suplementario de emergencia para recuperar la disponibilidad de agua en la zona radicular.",
      "status": "DONE",
      "responsible": "Julián León",
      "registeredAt": "2026-06-29T17:00:00Z",
      "evidence": [
        {
          "id": "evid-fn-002",
          "type": "sensor",
          "source": "SENSOR",
          "description": "Lectura de humedad del suelo inferior al umbral crítico para la zona zone-03.",
          "capturedAt": "2026-06-29T17:00:00Z"
        }
      ]
    }
  ],
  "pendingActions": [
    {
      "id": "fn-003",
      "title": "Seguimiento pendiente",
      "description": "Pendiente: revisar la zona dentro de 24-48 horas y validar si se requiere intervención adicional o inspección de plagas.",
      "status": "PENDING",
      "responsible": "Carla Mena",
      "registeredAt": "2026-06-30T08:00:00Z",
      "dueDate": "2026-07-01T08:00:00Z",
      "priority": "HIGH",
      "evidence": [
        {
          "id": "evid-fn-003",
          "type": "note",
          "source": "MANUAL",
          "description": "Nota de campo con seguimiento pendiente y próximos pasos para la zona zone-03.",
          "capturedAt": "2026-06-30T08:00:00Z"
        }
      ]
    }
  ],
  "createdAt": "2026-07-03T12:10:00Z"
}
```

---

## 7. Flujo actual de generación

```text
Insight de zona
  ↓
Adaptar evidencias (incluye evidencia visual preliminar, source: VISION)
  ↓
Generar alertas activas
  ↓
Generar recomendaciones
  ↓
Integrar acciones tomadas y pendientes (desde el Notebook de campo)
  ↓
Responder el reporte prescriptivo
```

---

## 8. Endpoint relacionado

La ruta actualmente implementada es:

- `GET /api/reports/prescriptive/:zoneId`

Esta ruta devuelve el reporte prescriptivo generado para una zona específica.

---

## 9. Notas de compatibilidad

La documentación anterior hablaba de un modelo más amplio con campos de auditoría y resumen ejecutivo. Ese modelo ya no coincide con la implementación actual del backend. Por eso este documento se limita a la estructura realmente expuesta por los tipos y el servicio de reportes.

**Nota de trazabilidad (Vision AI):** actualmente `getPrescriptiveReportByZone` enlaza el Notebook de campo al reporte por `zoneId`, no por relación directa de `alertId`/`recommendationId`. El Notebook de campo (`fieldNotebookMock.ts`) sí registra estos identificadores en cada entrada para trazabilidad documental, pero el servicio de reportes aún no los consume para hacer el cruce explícito. Ajuste sugerido a Jorge/Leo si se requiere trazabilidad estricta por ID.

---

## 10. Versionado

- **v2.1** (2026-07-22): Corrección de `reportId` y `summary` (sí existen en el modelo real); corrección de estructuras de `PrescriptiveAlertSummary`, `PrescriptiveRecommendationSummary`, `PrescriptiveActionLog` y `PrescriptivePendingAction` para reflejar los campos reales; se documenta evidencia visual preliminar (`source: "VISION"`).
- **v2.0** (2026-07-20): Documentación alineada con la estructura real del backend actual.

**Última actualización:** 2026-07-22
