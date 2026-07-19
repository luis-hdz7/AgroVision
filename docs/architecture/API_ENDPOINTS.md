# API_ENDPOINTS.md

# AgroVision Intelligence Backend API

## Descripción

Este documento describe los endpoints oficiales del backend de AgroVision Intelligence.

Todas las respuestas del sistema siguen el contrato global:

```ts
ApiResponse<T>;
```

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

---

# Health Check

## GET /api/health

### Descripción

Verifica que el backend se encuentre disponible.

### Response

```json
{
  "success": true,
  "data": {
    "status": "UP"
  },
  "message": "Backend service is healthy",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Shared

---

# Vegetation

## GET /api/vegetation/indices?fieldId={fieldId}

### Descripción

Obtiene el historial de índices de vegetación correspondientes a una parcela específica.

### Parámetros

| Nombre  | Tipo   | Descripción                 |
| ------- | ------ | --------------------------- |
| fieldId | string | Identificador de la parcela |

### Response

```json
{
  "success": true,
  "data": [
    {
      "fieldId": "field-001",
      "zoneId": "zone-01",
      "source": "SATELLITE",
      "indices": {
        "ndvi": 0.78,
        "ndwi": 0.45,
        "gndvi": 0.71
      },
      "interpretation": {
        "vigorLevel": "VIGOR_EXCEPCIONAL",
        "anomalyDetected": false
      },
      "capturedAt": "2026-06-29T14:00:00Z"
    }
  ],
  "message": "Vegetation indices retrieved successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Vegetation

---

# Analysis

## GET /api/analysis/zone/{zoneId}

### Descripción

Obtiene el análisis prescriptivo completo para una zona agrícola.

### Parámetros

| Nombre | Tipo   |
| ------ | ------ |
| zoneId | string |

### Response

```json
{
  "success": true,
  "data": {
    "zoneId": "zone-03",
    "fieldId": "field-002",
    "cropType": "CORN",
    "finalRiskLevel": "HIGH",
    "healthScore": 42,
    "evidence": [],
    "mainCause": "Water stress",
    "summary": "Critical vegetation deterioration detected.",
    "recommendedAction": "Increase irrigation immediately.",
    "generatedAt": "2026-06-29T14:30:00Z"
  },
  "message": "Zone analysis retrieved successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Analysis

---

# Risk

## GET /api/risk/field/{fieldId}

### Descripción

Obtiene la evaluación general de riesgo para una parcela.

### Parámetros

| Nombre  | Tipo   |
| ------- | ------ |
| fieldId | string |

### Response

```json
{
  "success": true,
  "data": {
    "fieldId": "field-001",
    "zoneId": "zone-01",
    "cropType": "CORN",
    "riskLevel": "HIGH",
    "riskScore": 82,
    "mainCause": "Water stress",
    "evidence": [],
    "recommendedAction": "Increase irrigation frequency.",
    "generatedAt": "2026-07-09T15:20:18.342Z"
  },
  "message": "Risk assessment retrieved successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Risk

---

# Alerts

## GET /api/alerts

### Descripción

Obtiene todas las alertas activas del sistema.

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "alert-001",
      "fieldId": "field-001",
      "zoneId": "zone-01",
      "type": "LOW_VIGOR",
      "severity": "HIGH",
      "title": "Low vegetation vigor detected",
      "message": "Vegetation health has decreased.",
      "evidence": [],
      "recommendedAction": "Inspect crop health.",
      "status": "ACTIVE",
      "createdAt": "2026-07-09T15:20:18.342Z"
    }
  ],
  "message": "Alerts retrieved successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Alerts

---

# Field Notebook

## GET /api/field-notebook

### Descripción

Expone el historial del cuaderno de campo para consultar inspecciones, evidencias y acciones registradas en el flujo de demo.

### Parámetros

| Nombre  | Tipo | Descripción                                      |
| ------- | ---- | ------------------------------------------------ |
| ninguno | -    | Retorna todas las entradas del cuaderno de campo |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "fn-001",
      "fieldId": "field-002",
      "zoneId": "zone-03",
      "cropId": "crop-orange-01",
      "activityType": "INSPECTION",
      "description": "Inspección visual inicial de la zona afectada.",
      "problemObserved": "Defoliación y clorosis moteada en el sector central.",
      "actionTaken": "Se documentó evidencia visual y se aisló el sector para revisión técnica inmediata.",
      "responsibleUser": "Sofía Vega",
      "evidence": [
        {
          "id": "evid-fn-001",
          "type": "image",
          "source": "Rover Camera",
          "description": "Imagen de campo con defoliación visible para la zona zone-03.",
          "capturedAt": "2026-06-29T16:00:00Z"
        }
      ],
      "createdAt": "2026-06-29T16:00:00Z"
    }
  ],
  "message": "Field notebook entries loaded successfully",
  "error": null,
  "timestamp": "2026-07-19T00:00:00.000Z"
}
```

### Uso en demo

Se utiliza para mostrar inspección realizada, acción tomada y acción pendiente con trazabilidad en el flujo Evidence → Risk → Alert → Recommendation → Action → Report.

---

## GET /api/field-notebook/zone/:zoneId

### Descripción

Retorna las entradas del cuaderno de campo filtradas por una zona específica.

### Parámetros

| Nombre | Tipo   | Descripción                                     |
| ------ | ------ | ----------------------------------------------- |
| zoneId | string | Identificador de la zona, por ejemplo `zone-03` |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "fn-001",
      "fieldId": "field-002",
      "zoneId": "zone-03",
      "cropId": "crop-orange-01",
      "activityType": "INSPECTION",
      "description": "Inspección visual inicial de la zona afectada.",
      "problemObserved": "Defoliación y clorosis moteada en el sector central.",
      "actionTaken": "Se documentó evidencia visual y se aisló el sector para revisión técnica inmediata.",
      "responsibleUser": "Sofía Vega",
      "evidence": [],
      "createdAt": "2026-06-29T16:00:00Z"
    }
  ],
  "message": "Field notebook entries loaded successfully",
  "error": null,
  "timestamp": "2026-07-19T00:00:00.000Z"
}
```

### Uso en demo

Permite validar la trazabilidad de las acciones asociadas a la zona crítica `zone-03` para la demo del ideathon.

---

## GET /api/field-notebook/field/:fieldId

### Descripción

Retorna las entradas del cuaderno de campo filtradas por un campo específico.

### Parámetros

| Nombre  | Tipo   | Descripción                                      |
| ------- | ------ | ------------------------------------------------ |
| fieldId | string | Identificador del campo, por ejemplo `field-001` |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "fn-004",
      "fieldId": "field-001",
      "zoneId": "zone-02",
      "cropId": "crop-apple-01",
      "activityType": "FERTILIZATION",
      "description": "Aplicación de fertilizante de seguimiento en el lote vecino.",
      "problemObserved": "Se detectó un leve descenso del vigor en la zona adyacente.",
      "actionTaken": "Se aplicó fertilización de ajuste y se programó observación de seguimiento.",
      "responsibleUser": "Mateo Ruiz",
      "evidence": [],
      "createdAt": "2026-07-01T10:15:00Z"
    }
  ],
  "message": "Field notebook entries loaded successfully",
  "error": null,
  "timestamp": "2026-07-19T00:00:00.000Z"
}
```

### Uso en demo

Sirve para mostrar cómo el cuaderno de campo se vincula al seguimiento de campo y al historial de soporte del reporte prescriptivo.

---

# Recommendations

## GET /api/recommendations

### Descripción

Obtiene las recomendaciones prescriptivas generadas por el sistema.

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "rec-001",
      "fieldId": "field-001",
      "zoneId": "zone-01",
      "priority": "HIGH",
      "reason": "Water stress detected.",
      "suggestedAction": "Increase irrigation.",
      "expectedImpact": {
        "impactArea": "WATER_SAVING",
        "description": "Reduce water stress."
      },
      "evidence": [],
      "createdAt": "2026-07-09T15:20:18.342Z"
    }
  ],
  "message": "Recommendations retrieved successfully",
  "error": null,
  "timestamp": "2026-07-09T15:20:18.342Z"
}
```

### Módulo

Recommendations

---

# Resumen de Endpoints

| Método | Endpoint                                    | Módulo          |
| ------ | ------------------------------------------- | --------------- |
| GET    | `/api/health`                               | Shared          |
| GET    | `/api/vegetation/indices?fieldId=field-001` | Vegetation      |
| GET    | `/api/analysis/zone/:zoneId`                | Analysis        |
| GET    | `/api/risk/field/:fieldId`                  | Risk            |
| GET    | `/api/alerts`                               | Alerts          |
| GET    | `/api/recommendations`                      | Recommendations |

---

# Contratos utilizados

- ApiResponse<T>
- VegetationIndexSnapshot
- ZoneInsight
- RiskAssessment
- AgriculturalAlert
- Recommendation
- EvidenceItem

---

# Estado

**Versión:** 1.0

**Proyecto:** AgroVision Intelligence

**Última actualización:** Julio 2026
