# Mapa de evidencia — demo ideathon

**Caso oficial:** `field-001` → `zone-03` → `ORANGE` → riesgo `HIGH`.

## Recorrido de demo

```text
Dashboard
  └─ Zona crítica zone-03: NDVI 0.24, humedad 28 %, temperatura 38 °C
       ↓
Alertas
  └─ Riesgo alto de estrés hídrico respaldado por sensor, satélite y visión
       ↓
Recomendaciones
  └─ Verificar cobertura de riego y aplicar riego correctivo
       ↓
Reporte prescriptivo
  └─ Consolida riesgo, alertas, recomendación, evidencia y trazabilidad
       ↓
Notebook de campo
  └─ fn-001 inspección → fn-002 riego → fn-003 seguimiento pendiente
```

El Dashboard es el punto de entrada: hace visible la zona prioritaria. Alertas y recomendaciones traducen la evidencia en una decisión. El reporte permite explicar esa decisión y enlaza cada acción con su responsable, fecha y evidencia del notebook.

# Mapa de evidencia — demo ideathon

**Caso oficial:** `field-001` → `zone-03` → `ORANGE` → riesgo `HIGH`.

## Recorrido de demo

```text
Dashboard
  └─ Zona crítica zone-03: NDVI 0.24, humedad 28 %, temperatura 38 °C
       ↓
Alertas
  └─ Riesgo alto de estrés hídrico respaldado por sensor, satélite y visión
       ↓
Recomendaciones
  └─ Verificar cobertura de riego y aplicar riego correctivo
       ↓
Reporte prescriptivo
  └─ Consolida riesgo, alertas, recomendación, evidencia y trazabilidad
       ↓
Notebook de campo
  └─ fn-001 inspección → fn-002 riego → fn-003 seguimiento pendiente
```

El Dashboard es el punto de entrada: hace visible la zona prioritaria. Alertas y recomendaciones traducen la evidencia en una decisión. El reporte permite explicar esa decisión y enlaza cada acción con su responsable, fecha y evidencia del notebook.

## Vision AI en el flujo

Vision AI no es una pantalla aislada: es una fuente de evidencia más dentro de `ZoneInsight.evidence` (`source: "VISION"`), integrada al mismo flujo de trazabilidad que sensores, satélite e historial.

Para `zone-03` (ORANGE, riesgo `HIGH`, insight `ins-003`), Vision AI aporta 3 señales:

| Métrica             | Valor  | Estado    |
| ------------------- | ------ | --------- |
| `visualAnomaly`     | `true` | `WARNING` |
| `dryAreaDetected`   | `true` | `WARNING` |
| `chlorosisDetected` | `true` | `WARNING` |

Estas señales alimentan `hasVisualEvidence()` en `alertGenerationService`, que genera la alerta `VISUAL_ANOMALY`. Esa alerta genera a su vez la recomendación correspondiente vía `recommendationGenerationService`. El resultado queda trazado end-to-end:

```text
ZoneInsight (ins-003, evidence source: VISION)
     ↓
Alert (alert-zone-03-visual_anomaly)
     ↓
Recommendation (rec-zone-03-visual_anomaly)
     ↓
Report (report-zone-03-001) ← consolida evidence + alerts + recommendations
     ↓
Notebook (fn-001) ← inspección de campo que documenta y confirma la señal Vision AI
```

**Nota de trazabilidad:** el reporte prescriptivo (`getPrescriptiveReportByZone`) enlaza el notebook al reporte por `zoneId`, no por `alertId`/`recommendationId` de forma directa. Los campos `alertId`, `recommendationId` y `reportId` agregados a `fn-001` documentan la relación explícita para efectos de trazabilidad y demo, aunque el servicio actual no los consulta todavía. **Ajuste sugerido a Jorge/Leo:** si se requiere enlace estricto por ID (no solo por zona), habría que extender `prescriptiveReportService.ts` para cruzar `entry.alertId` / `entry.recommendationId` contra `alertsMock` / `recommendationsMock`.

## Evidencia y acciones del caso

| Evento   | Acción                        | Responsable y fecha       | Evidencia                                                 | Alerta / Recomendación / Reporte                                                     |
| -------- | ----------------------------- | ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `fn-001` | Inspección visual (Vision AI) | Sofía Vega · 29/jun/2026  | `source: VISION` — clorosis, áreas secas, anomalía visual | `alert-zone-03-visual_anomaly` / `rec-zone-03-visual_anomaly` / `report-zone-03-001` |
| `fn-002` | Riego correctivo              | Julián León · 29/jun/2026 | Lectura de humedad bajo umbral                            | `alert-zone-03-water_stress` / `rec-zone-03-water_stress` / `report-zone-03-001`     |
| `fn-003` | Seguimiento pendiente         | Carla Mena · 01/jul/2026  | Nota de campo y próximos pasos                            | —                                                                                    |

## Endpoints que sostienen la demostración

- `GET /api/dashboard/summary`
- `GET /api/alerts`
- `GET /api/recommendations`
- `GET /api/reports/prescriptive/zone-03`
- `GET /api/field-notebook/zone/zone-03`

El orden de navegación puede terminar en el Reporte para el pitch; la evidencia operativa se origina y se mantiene en el Notebook, por lo que ambos quedan explícitamente vinculados.

## Evidencia y acciones del caso

| Evento   | Acción                | Responsable y fecha       | Evidencia                             |
| -------- | --------------------- | ------------------------- | ------------------------------------- |
| `fn-001` | Inspección visual     | Sofía Vega · 29/jun/2026  | Fotografía de clorosis y áreas secas. |
| `fn-002` | Riego correctivo      | Julián León · 29/jun/2026 | Lectura de humedad bajo umbral.       |
| `fn-003` | Seguimiento pendiente | Carla Mena · 01/jul/2026  | Nota de campo y próximos pasos.       |

## Endpoints que sostienen la demostración

- `GET /api/dashboard/summary`
- `GET /api/alerts`
- `GET /api/recommendations`
- `GET /api/reports/prescriptive/zone-03`
- `GET /api/field-notebook/zone/zone-03`

El orden de navegación puede terminar en el Reporte para el pitch; la evidencia operativa se origina y se mantiene en el Notebook, por lo que ambos quedan explícitamente vinculados.
