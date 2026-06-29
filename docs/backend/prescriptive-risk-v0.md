# Prescriptive Risk V0

## Objetivo

Extender el motor de riesgo existente mediante evidencia multifuente para generar una interpretación prescriptiva que responda:

* ¿Dónde está el problema?
* ¿Qué tan grave es?
* ¿Qué evidencia lo respalda?
* ¿Qué acción se recomienda?

El sistema no realiza diagnósticos definitivos de enfermedades. Su propósito es identificar condiciones de riesgo agrícola mediante la combinación de evidencia proveniente de sensores, clima, visión artificial, historial y análisis de vegetación.

---

## Flujo de análisis

```text
Sensor + Weather + Vision + Satellite + History
                    ↓
            EvidenceItem[]
                    ↓
       EvidenceRiskService
                    ↓
             ZoneInsight
```

---

## Evidencias soportadas

| Fuente    | Métrica                |
| --------- | ---------------------- |
| SENSOR    | soilMoisturePercentage |
| WEATHER   | temperatureCelsius     |
| SATELLITE | ndvi                   |
| VISION    | visualAnomaly          |
| HISTORY   | vegetationTrend        |

---

## Riesgos identificables

* WATER_STRESS
* LOW_VIGOR
* HEAT_STRESS
* VISUAL_ANOMALY

---

## Reglas iniciales

### Humedad

* Baja humedad → WARNING o CRITICAL
* Humedad adecuada → NORMAL

### Temperatura

* Temperatura elevada → WARNING o CRITICAL
* Temperatura normal → NORMAL

### NDVI

* NDVI < 0.30 → CRITICAL
* NDVI < 0.50 → WARNING
* NDVI >= 0.50 → NORMAL

### Anomalías visuales

* Anomalía detectada → WARNING
* Sin anomalías → NORMAL

### Tendencia histórica

* Variación <= -20% → WARNING
* Tendencia estable → NORMAL

---

## Resultado esperado

El análisis debe devolver:

* mainCause
* riskLevel
* criticalEvidence
* recommendedAction

Posteriormente estos datos alimentan:

* ZoneInsight
* Alert
* Recommendation
* Dashboard
* Reports

# Ejemplos de Validación

## Caso 1 - Zona Sana

### Entrada

* Humedad: 62%
* Temperatura: 27°C
* NDVI: 0.72
* Anomalía visual: false
* Tendencia: +4%

### Resultado esperado

```json
{
  "mainCause": "NONE",
  "riskLevel": "LOW"
}
```

### Interpretación

La zona presenta vigor vegetal adecuado, humedad suficiente y ausencia de anomalías visuales.

### Acción recomendada

Continuar monitoreo normal.

---

## Caso 2 - Zona con Bajo Vigor

### Entrada

* Humedad: 58%
* Temperatura: 28°C
* NDVI: 0.42
* Anomalía visual: true
* Tendencia: -15%

### Resultado esperado

```json
{
  "mainCause": "LOW_VIGOR",
  "riskLevel": "MEDIUM"
}
```

### Interpretación

El NDVI indica vigor vegetal inferior al rango esperado y se detectan señales visuales compatibles con deterioro.

### Acción recomendada

Realizar inspección agronómica y revisar estado nutricional del cultivo.

---

## Caso 3 - Estrés Hídrico Alto

### Entrada

* Humedad: 18%
* Temperatura: 35°C
* NDVI: 0.28
* Anomalía visual: true
* Tendencia: -30%

### Resultado esperado

```json
{
  "mainCause": "WATER_STRESS",
  "riskLevel": "HIGH"
}
```

### Interpretación

La combinación de baja humedad, NDVI crítico y deterioro visual sugiere una condición severa de estrés hídrico.

### Acción recomendada

Incrementar riego, verificar distribución de agua y realizar inspección de campo.
