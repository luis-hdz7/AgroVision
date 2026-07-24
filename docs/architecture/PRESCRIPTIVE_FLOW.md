# PRESCRIPTIVE_FLOW.md

# Prescriptive Flow

## Objetivo

Describir el flujo utilizado por AgroVision para transformar datos agrícolas heterogéneos en información prescriptiva que apoye la toma de decisiones.

El objetivo principal es convertir:

**Fuentes de Evidencia → EvidenceFusionService → RiskAssessment → ZoneInsight → AlertGenerationService → RecommendationGenerationService → FieldNotebook → PrescriptiveReportService → Dashboard**

---

# Arquitectura General

```text
                  SENSOR
                     │
                  WEATHER
                     │
                 SATELLITE
                     │
                  HISTORY
                     │
                  MAPPING
                     │
                   IMAGE
                     │
               Vision AI Service
                     │
              Visual Prediction
                     │
              EvidenceItem(VISION)
                     │
────────────────────────────────────────
                     │
          EvidenceFusionService
                     │
              EvidenceItem[]
                     │
          EvidenceRiskService
                     │
             RiskAssessment
                     │
            ZoneInsightService
                     │
                ZoneInsight
                ├────────────► AlertGenerationService
                │                    ↓
                │             AgriculturalAlert[]
                │
                └────────────► RecommendationGenerationService
                                     ↓
                              Recommendation[]
                                     ↓
                                 Dashboard
```

---

# Flujo de Información

El sistema integra información proveniente de múltiples fuentes para construir una evaluación de riesgo explicable.

Fuentes utilizadas:

- SATELLITE
- SENSOR
- WEATHER
- VISION
- HISTORY
- MAPPING

Cada fuente aporta evidencia específica que posteriormente es normalizada y analizada.

---

# Fuentes de Evidencia

## SATELLITE

Proporciona índices espectrales:

- NDVI
- NDWI
- GNDVI

Objetivo:

- Evaluar vigor vegetal.
- Detectar reducción de disponibilidad hídrica.
- Identificar cambios fisiológicos.

---

## SENSOR

Proporciona:

- Soil Moisture

Objetivo:

- Detectar déficit hídrico.
- Corroborar evidencia satelital.

---

## WEATHER

Proporciona:

- Temperatura ambiental.

Objetivo:

- Detectar condiciones compatibles con estrés térmico.
- Complementar el análisis ambiental.

---

## VISION

Proporciona:

- Visual Anomaly
- Dry Area Detected
- Chlorosis Detected

Objetivo:

- Detectar patrones visibles.
- Reforzar la evidencia obtenida por sensores e imágenes satelitales.

---
## Integración del AI Service

El AI Service recibe una imagen y genera una clasificación visual preliminar basada en reglas heurísticas.

La respuesta incluye:

- categoría detectada;
- nivel de confianza;
- explicación;
- recomendación;
- evidencia visual.

Posteriormente, esta información se transforma en un `EvidenceItem` con origen `VISION`, el cual es integrado por `EvidenceFusionService` junto con el resto de las fuentes disponibles.

Esta evidencia no representa un diagnóstico definitivo y únicamente complementa el análisis prescriptivo realizado por el sistema.
---

## HISTORY

Proporciona:

- Vegetation Trend

Objetivo:

- Analizar la evolución temporal del cultivo.
- Detectar deterioros progresivos.

---

## MAPPING

Proporciona:

- Mapping Risk Detected

Objetivo:

- Identificar riesgos espaciales localizados.

---

# Evidence Fusion

Responsable:

`EvidenceFusionService`

Objetivo:

Normalizar toda la información proveniente de diferentes fuentes en una estructura común (`EvidenceItem`).

Ejemplo:

```json
{
  "source": "SATELLITE",
  "metric": "ndvi",
  "value": 0.24,
  "status": "CRITICAL",
  "explanation": "Very low vegetation vigor detected."
}
```
```
{
  "source": "VISION",
  "metric": "water_stress_signal",
  "value": "WATER_STRESS",
  "status": "WARNING",
  "explanation": "Visual signals compatible with water stress were detected. Field validation is recommended."
}
```

---

# Risk Assessment

Responsable:

`EvidenceRiskService`

Objetivo:

Interpretar la evidencia disponible y construir una evaluación prescriptiva reutilizable para el resto del sistema.

El resultado se representa mediante el contrato:

`RiskAssessment`

Incluye:

- fieldId
- zoneId
- cropType
- riskLevel
- riskScore
- healthScore
- mainCause
- evidence
- recommendedAction
- generatedAt

Este contrato centraliza la interpretación del riesgo y evita recalcular información en otros módulos.

---

# Zone Insight

Responsable:

`ZoneInsightService`

Objetivo:

Transformar un `RiskAssessment` en un resumen ejecutivo para el dashboard.

Este servicio **no recalcula el riesgo**, únicamente adapta la información para facilitar su interpretación.

Genera:

- finalRiskLevel
- healthScore
- mainCause
- summary
- recommendedAction
- evidence

---

# Alert Generation

Responsable:

`AlertGenerationService`

Objetivo:

Generar alertas agrícolas utilizando la información proveniente de `ZoneInsight`.

Cada alerta contiene:

- tipo
- severidad
- mensaje
- evidencia
- acción recomendada

---

# Recommendation Generation

Responsable:

`RecommendationGenerationService`

Objetivo:

Generar recomendaciones priorizadas basadas en la evidencia disponible y el nivel de riesgo identificado.

Cada recomendación incluye:

- razón
- acción sugerida
- prioridad
- impacto esperado
- evidencia utilizada

---

# Casos de Referencia

## Caso 1 — Zona Sana

Resultado esperado:

- Riesgo LOW
- Sin anomalías relevantes
- Monitoreo rutinario

---

## Caso 2 — Zona en Observación

Resultado esperado:

- Riesgo MEDIUM
- Reducción moderada del vigor vegetal
- Inspección preventiva y seguimiento reforzado.

---

## Caso 3 — Zona Crítica

Resultado esperado:

- Riesgo HIGH
- Evidencia multifuente compatible con estrés hídrico
- Inspección técnica prioritaria y validación inmediata de la evidencia multifuente.

---

# Ejemplo de RiskAssessment

```json
{
  "fieldId": "field-001",
  "zoneId": "zone-03",
  "cropType": "ORANGE",
  "riskLevel": "HIGH",
  "riskScore": 35,
  "healthScore": 35,
  "mainCause": "WATER_STRESS",
  "recommendedAction":
  "Immediately inspect the affected zone, verify irrigation performance, confirm soil moisture conditions and prioritize corrective irrigation to reduce further crop deterioration."
}
```

---

# Ejemplo de ZoneInsight

```json
{
  "zoneId": "zone-03",
  "finalRiskLevel": "HIGH",
  "healthScore": 35,
  "mainCause": "WATER_STRESS",
  "summary": "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
  "recommendedAction": "Inspect irrigation coverage and verify soil moisture conditions."
}
```

---

# Principios de Diseño

- No generar diagnósticos definitivos.
- Basar cada interpretación en evidencia disponible.
- Mantener trazabilidad entre evidencia y decisión.
- Evitar duplicación de lógica entre servicios.
- Utilizar `RiskAssessment` como contrato central de integración.
- Facilitar la interpretación para dashboard y reportes.

---

# Dashboard Summary

## Responsable

DashboardService

## Objetivo

Construir un resumen ejecutivo reutilizando la información generada por los módulos prescriptivos existentes.

El Dashboard no recalcula el riesgo. Selecciona automáticamente:

- la zona más crítica;
- el riesgo dominante;
- la evidencia principal;
- la alerta activa más relevante;
- la recomendación de mayor prioridad.

Toda la información presentada proviene de ZoneInsight, AlertGenerationService y RecommendationGenerationService, garantizando trazabilidad entre la evidencia y la decisión mostrada al usuario.

El resumen prescriptivo resume la situación de la zona crítica y proporciona una visión rápida para apoyar la toma de decisiones sin sustituir una inspección técnica en campo.

# Consideraciones

Las salidas generadas representan una interpretación prescriptiva basada en la evidencia disponible.

Los resultados describen riesgos estimados y señales compatibles con posibles condiciones del cultivo, por lo que las acciones propuestas deben considerarse recomendaciones de apoyo para la toma de decisiones y pueden requerir inspección técnica en campo.

---

# Resultado Esperado

Cada evaluación debe proporcionar:

1. Evidencia identificable.
2. Evaluación de riesgo consistente.
3. Causa principal.
4. Resumen ejecutivo para el usuario.
5. Alertas respaldadas por evidencia.
6. Recomendaciones accionables.

De esta manera AgroVision transforma datos agrícolas provenientes de múltiples fuentes en decisiones operativas comprensibles, trazables y defendibles.
