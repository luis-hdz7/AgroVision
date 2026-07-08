# PRESCRIPTIVE_FLOW.md

## Objetivo

Describir el flujo utilizado por AgroVision para transformar datos agrícolas heterogéneos en recomendaciones accionables para productores y técnicos.

El objetivo principal es convertir:

**Evidencia → Causa → Riesgo → Acción Recomendada**

---

# Arquitectura General

```text
SATELLITE
VISION
SENSOR
WEATHER
HISTORY
MAPPING
        ↓
EvidenceFusionService
        ↓
EvidenceItem[]
        ↓
EvidenceRiskService
        ↓
Main Cause
Risk Level
Recommended Action
        ↓
ZoneInsightService
        ↓
ZoneInsight
        ↓
Alerts
Recommendations
Dashboard
```

---

# Fuentes de Evidencia

## SATELLITE

Proporciona índices espectrales:

* NDVI
* NDWI
* GNDVI

Objetivo:

* Evaluar vigor vegetal.
* Detectar reducción de disponibilidad hídrica.
* Identificar cambios fisiológicos.

---

## SENSOR

Proporciona información de campo:

* Humedad de suelo.

Objetivo:

* Detectar déficit hídrico.
* Corroborar evidencia satelital.

---

## WEATHER

Proporciona:

* Temperatura ambiental.

Objetivo:

* Detectar condiciones compatibles con estrés térmico.
* Complementar análisis de disponibilidad hídrica.

---

## VISION

Proporciona:

* VisualAnomalyDetected
* DryAreaDetected
* ChlorosisDetected

Objetivo:

* Validar patrones observables.
* Reforzar evidencia satelital.

---

## HISTORY

Proporciona:

* VegetationTrend

Objetivo:

* Analizar evolución temporal.
* Detectar deterioros progresivos.

---

## MAPPING

Proporciona:

* MappingRiskDetected

Objetivo:

* Identificar riesgos espaciales localizados.

---

# Evidence Fusion

Responsable:

`EvidenceFusionService`

Objetivo:

Normalizar todas las fuentes en una estructura común.

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

---

# Risk Interpretation

Responsable:

`EvidenceRiskService`

Objetivo:

Transformar evidencia técnica en información accionable.

Resultados:

* Main Cause
* Risk Level
* Recommended Action

Ejemplo:

```text
NDWI bajo
+
Humedad baja
↓
WATER_STRESS
```

---

# Zone Insight Generation

Responsable:

`ZoneInsightService`

Objetivo:

Construir un resumen ejecutivo entendible para dashboard y reportes.

Genera:

* finalRiskLevel
* healthScore
* mainCause
* summary
* recommendedAction
* evidence

---

# Casos de Referencia

## Caso 1 — Zona Sana

### Resultado Esperado

* Riesgo LOW
* Sin anomalías relevantes
* Monitoreo rutinario

---

## Caso 2 — Zona en Observación

### Resultado Esperado

* Riesgo MEDIUM
* Reducción moderada de vigor
* Seguimiento reforzado

---

## Caso 3 — Zona Crítica

### Resultado Esperado

* Riesgo HIGH
* Evidencia multifuente compatible con estrés hídrico
* Inspección prioritaria

---

# Ejemplo ZoneInsight

```json
{
  "zoneId": "zone-03",
  "finalRiskLevel": "HIGH",
  "mainCause": "WATER_STRESS",
  "recommendedAction": "Inspect irrigation coverage and verify soil moisture conditions."
}
```

---

# Principios de Diseño

* No generar diagnósticos definitivos.
* Priorizar explicabilidad.
* Utilizar evidencia defendible.
* Mantener trazabilidad de cada decisión.
* Facilitar interpretación para dashboard y reportes.

---

# Resultado Esperado

Cada ZoneInsight debe proporcionar:

1. Evidencia identificable.
2. Causa principal.
3. Nivel de riesgo.
4. Acción concreta.
5. Resumen comprensible para usuario final.

De esta manera AgroVision transforma datos agrícolas complejos en decisiones operativas comprensibles y accionables.
