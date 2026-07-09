# API_ENDPOINTS.md

# AgroVision Intelligence Backend API

## Descripción

Este documento describe los endpoints oficiales del backend de AgroVision Intelligence.

Todas las respuestas del sistema siguen el contrato global:

```ts
ApiResponse<T>
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

| Nombre | Tipo | Descripción |
|---------|------|-------------|
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

| Nombre | Tipo |
|---------|------|
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

| Nombre | Tipo |
|---------|------|
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

| Método | Endpoint | Módulo |
|---------|----------|---------|
| GET | `/api/health` | Shared |
| GET | `/api/vegetation/indices?fieldId=field-001` | Vegetation |
| GET | `/api/analysis/zone/:zoneId` | Analysis |
| GET | `/api/risk/field/:fieldId` | Risk |
| GET | `/api/alerts` | Alerts |
| GET | `/api/recommendations` | Recommendations |

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