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

## Evidencia y acciones del caso

| Evento | Acción | Responsable y fecha | Evidencia |
|---|---|---|---|
| `fn-001` | Inspección visual | Sofía Vega · 29/jun/2026 | Fotografía de clorosis y áreas secas. |
| `fn-002` | Riego correctivo | Julián León · 29/jun/2026 | Lectura de humedad bajo umbral. |
| `fn-003` | Seguimiento pendiente | Carla Mena · 01/jul/2026 | Nota de campo y próximos pasos. |

## Endpoints que sostienen la demostración

- `GET /api/dashboard/summary`
- `GET /api/alerts`
- `GET /api/recommendations`
- `GET /api/reports/prescriptive/zone-03`
- `GET /api/field-notebook/zone/zone-03`

El orden de navegación puede terminar en el Reporte para el pitch; la evidencia operativa se origina y se mantiene en el Notebook, por lo que ambos quedan explícitamente vinculados.
