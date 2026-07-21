# Reports Structure - AgroVision

## Objetivo

Documentar la estructura real del reporte prescriptivo que actualmente expone el backend de AgroVision. Este documento refleja la implementación actual de los tipos y del servicio de reportes, y evita incluir campos que ya no forman parte del modelo.

---

## 1. Tipo real implementado

Actualmente el backend expone un único reporte prescriptivo para una zona, con la siguiente forma:

```typescript
interface PrescriptiveFieldReport {
  fieldId: string;
  zoneId: string;
  cropType: string;
  healthScore: number;
  finalRiskLevel: RiskLevel;
  mainCause: string;
  evidence: PrescriptiveEvidenceSummary[];
  activeAlerts: PrescriptiveAlertSummary[];
  recommendations: PrescriptiveRecommendationSummary[];
  actionsTaken: PrescriptiveActionLog[];
  pendingActions: PrescriptivePendingAction[];
  createdAt: string;
}
```

### Campos que no forman parte del modelo actual

No existen en la implementación actual los siguientes campos:

- `reportId`
- `reportType`
- `generatedAt`
- `suggestedAction`
- `actionPriority`
- `expectedImpact`
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
  date: string;
}
```

### Significado de cada campo

- `id`: identificador de la evidencia, por ejemplo `ev-001`.
- `source`: fuente original de la evidencia, por ejemplo `SATELLITE` o `ROVER_CAMERA`.
- `metric`: métrica asociada, como `ndvi`, `temperature` o `soil_moisture`.
- `value`: valor medido o inferido.
- `unit`: unidad del valor si aplica.
- `status`: estado de la evidencia, por ejemplo `NORMAL`, `WATCH`, `WARNING` o `CRITICAL`.
- `explanation`: descripción breve de por qué esa evidencia es relevante.
- `date`: fecha de referencia del reporte, tomada desde la fuente de insight.

---

## 3. Estructura de alertas

```typescript
interface PrescriptiveAlertSummary {
  id: string;
  zoneId: string;
  severity: RiskLevel;
  message: string;
}
```

### Observación importante

La implementación actual usa `activeAlerts`, no `alerts`.

---

## 4. Estructura de recomendaciones

```typescript
interface PrescriptiveRecommendationSummary {
  id: string;
  zoneId: string;
  recommendation: string;
  priority: RecommendationPriority;
  relatedEvidenceIds: string[];
}
```

### Significado de cada campo

- `recommendation`: texto resultante que combina la razón y la acción sugerida.
- `priority`: prioridad de la recomendación.
- `relatedEvidenceIds`: lista de IDs de evidencias que sustentan la recomendación.

---

## 5. Acciones tomadas y pendientes

```typescript
interface PrescriptiveActionLog {
  id: string;
  actionTaken: string;
  responsible: string;
  executionDate: string;
}
```

```typescript
interface PrescriptivePendingAction {
  id: string;
  description: string;
  dueDate: string | null;
  priority: RecommendationPriority;
}
```

Estas estructuras se construyen a partir de las entradas del cuaderno de campo del módulo correspondiente.

---

## 6. Ejemplo real basado en la implementación

```json
{
  "fieldId": "field-002",
  "zoneId": "zone-03",
  "cropType": "corn",
  "healthScore": 42,
  "finalRiskLevel": "HIGH",
  "mainCause": "Estrés hídrico severo combinado con baja defensa y posible inicio de plagas estructurales",
  "evidence": [
    {
      "id": "ev-001",
      "source": "ROVER_CAMERA",
      "metric": "visual",
      "value": null,
      "unit": null,
      "status": "WARNING",
      "explanation": "Clorosis moteada en hojas, defoliación parcial visible",
      "date": "2026-07-05T14:30:22Z"
    }
  ],
  "activeAlerts": [
    {
      "id": "AL-01",
      "zoneId": "zone-03",
      "severity": "HIGH",
      "message": "Estrés hídrico severo detectado"
    }
  ],
  "recommendations": [
    {
      "id": "REC-01",
      "zoneId": "zone-03",
      "recommendation": "Riego urgente → Aplicar riego de emergencia",
      "priority": "URGENT",
      "relatedEvidenceIds": ["ev-001"]
    }
  ],
  "actionsTaken": [
    {
      "id": "entry-001",
      "actionTaken": "Se aplicó riego preventivo",
      "responsible": "field-operator",
      "executionDate": "2026-07-05T14:30:22Z"
    }
  ],
  "pendingActions": [
    {
      "id": "entry-002",
      "description": "Pendiente inspección técnica",
      "dueDate": "2026-07-05T14:30:22Z",
      "priority": "HIGH"
    }
  ],
  "createdAt": "2026-07-05T14:30:22Z"
}
```

---

## 7. Flujo actual de generación

```text
Insight de zona
  ↓
Adaptar evidencias
  ↓
Generar alertas activas
  ↓
Generar recomendaciones
  ↓
Integrar acciones tomadas y pendientes
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

---

## 10. Versionado

- **v2.0** (2026-07-20): Documentación alineada con la estructura real del backend actual.

**Última actualización:** 2026-07-20
