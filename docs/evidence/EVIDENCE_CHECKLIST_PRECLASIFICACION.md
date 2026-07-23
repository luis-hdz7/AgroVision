# Checklist de Evidencias — Preclasificación

**Caso oficial de demo:** `field-001` · `zone-03` · `ORANGE` · riesgo `HIGH`
**Fecha de entrega:** 22/jul/2026
**Estado general:** listo para demo, con incidencias históricas resueltas y registradas.

## Pantallas y flujo funcional

| Capa                 | Estado   | Validación crítica                                                                                                         |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Dashboard            | Alineado | Expone `field-001`, zona crítica `zone-03`, cultivo `ORANGE`, health score 35, NDVI 0.24, humedad 28% y temperatura 38 °C. |
| Alertas              | Alineado | Las alertas activas pertenecen a `zone-03` y contienen evidencia y acción recomendada.                                     |
| Recomendaciones      | Alineado | La recomendación prioritaria se relaciona con la alerta y con la evidencia multifuente del mismo caso.                     |
| Reporte prescriptivo | Alineado | Consolida caso, alertas, recomendaciones, evidencia y acciones del notebook.                                               |
| Notebook             | Alineado | `fn-001`, `fn-002` y `fn-003` cubren inspección, riego y seguimiento para `field-001` / `zone-03`.                         |

## Endpoints de demo

| Endpoint                                | Estado | Evidencia crítica                                                                  |
| --------------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| `GET /api/dashboard/summary`            |        | Devuelve la zona crítica y resumen prescriptivo de `field-001` / `zone-03`.        |
| `GET /api/alerts`                       |        | Alertas activas de la zona con evidencia multifuente.                              |
| `GET /api/recommendations`              |        | Recomendación de riego para el caso demo.                                          |
| `GET /api/reports/prescriptive/zone-03` |        | Incluye acciones tomadas y pendientes con responsable, fecha y evidencia asociada. |
| `GET /api/field-notebook/zone/zone-03`  |        | Devuelve los eventos de notebook con responsable, fecha, acción y evidencia.       |

## Vision AI — Evidencia visual (`zone-03`, `ORANGE`)

| Campo                  | Detalle                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pantalla**           | Notebook de campo (`fn-001`) y Reporte prescriptivo (`/reports/prescriptive/zone-03`), donde se muestra la evidencia con `source: "VISION"`.                                                                                                                                                                                                               |
| **Endpoint/mock**      | `zoneInsightMock.ts` (`ins-003`) → evidencia `VISION` (`visualAnomaly`, `dryAreaDetected`, `chlorosisDetected`). `fieldNotebookMock.ts` (`fn-001`) → evidencia visual + relación con `alertId` / `recommendationId` / `reportId`. `GET /api/reports/prescriptive/zone-03` → consolida la evidencia en el reporte.                                          |
| **Captura**            | Fotografía de campo con clorosis y áreas secas (`evid-fn-001`, `url: https://example.org/evidence/fn-001.jpg`).                                                                                                                                                                                                                                            |
| **Limitación técnica** | La evidencia Vision AI en `ZoneInsight` es simulada (mock); no proviene de un modelo de visión real conectado en este momento. El reporte prescriptivo enlaza el notebook por `zoneId`, no por `alertId`/`recommendationId` de forma directa — ajuste pendiente si se requiere trazabilidad estricta por ID (ver nota en `ideathon-demo-evidence-map.md`). |

- [x] Vision AI identificado como entrada visual del flujo (no pantalla aislada).
- [x] Evidencia `source: "VISION"` presente en `ZoneInsight` y en `fieldNotebookMock`.
- [x] Relación con alerta (`alert-zone-03-visual_anomaly`) documentada en `fn-001`.
- [x] Relación con recomendación (`rec-zone-03-visual_anomaly`) documentada en `fn-001`.
- [x] Relación con reporte (`report-zone-03-001`) documentada en `fn-001`.

## Trazabilidad de acciones

- [x] `fn-001`: inspección visual tomada; responsable, fecha y fotografía asociada.
- [x] `fn-002`: riego correctivo tomado; responsable, fecha y lectura de sensor asociada.
- [x] `fn-003`: seguimiento pendiente; responsable, fecha objetivo y nota de campo asociada.
- [x] El reporte conserva esas acciones y su evidencia, sin inventar acciones fuera del notebook.

## Control de inconsistencias

- [x] Las métricas antiguas del Dashboard y el identificador de finca fueron revisados: `farm-001` identifica la finca y no reemplaza `field-001`.
- [x] El ejemplo de estructura de reportes usa el caso oficial de demo.
- [x] El contrato frontend/backend de reporte conserva los campos de acciones y su evidencia.
- [x] Las incidencias y responsables están registradas en [DEMO_INCONSISTENCIES.md](DEMO_INCONSISTENCIES.md).
