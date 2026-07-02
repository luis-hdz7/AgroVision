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
                    ↓
       AlertGenerationService
                    ↓
       AgriculturalAlert[]
                    ↓
 RecommendationGenerationService
                    ↓
          Recommendation[]
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

## Reglas iniciales del motor de riesgo

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

## Resultado esperado del análisis

El análisis debe devolver:

* mainCause
* finalRiskLevel
* evidence
* recommendedAction

Estos resultados son encapsulados posteriormente en un objeto ZoneInsight.

---

## Reglas de generación de alertas

Las alertas se generan a partir de ZoneInsight.

### WATER_STRESS

Se genera cuando la causa principal contiene indicadores asociados a:

* humedad;
* agua;
* riego;
* drenaje;
* saturación;
* estrés hídrico.

### LOW_VIGOR

Se genera cuando:

```text
healthScore <= 50
```

### HEAT_STRESS

Se genera cuando la causa principal contiene indicadores asociados a:

* calor;
* temperatura;
* heat;
* estrés térmico.

### VISUAL_ANOMALY

Se genera cuando existe evidencia proveniente de:

* ROVER_CAMERA;
* UPLOAD.

---

## Contrato de Alertas

Toda alerta debe incluir:

* severidad;
* evidencia;
* acción recomendada;
* zona afectada;
* fecha de generación.

Una alerta sin evidencia no debe generarse.

Las alertas producidas por el sistema son:

* WATER_STRESS
* LOW_VIGOR
* HEAT_STRESS
* VISUAL_ANOMALY

---

## Reglas de generación de recomendaciones

Las recomendaciones se generan utilizando:

* ZoneInsight;
* AgriculturalAlert[];
* CropProfile (opcional).

Su objetivo es transformar:

```text
Causa
     ↓
Evidencia
     ↓
Acción
     ↓
Impacto esperado
```

en una recomendación accionable para el productor agrícola.

---

## Prioridad de recomendaciones

| Riesgo   | Prioridad |
| -------- | --------- |
| LOW      | LOW       |
| MEDIUM   | MEDIUM    |
| HIGH     | HIGH      |
| CRITICAL | URGENT    |

---

## Obtención de acciones sugeridas

Si existe un CropProfile para el cultivo analizado:

```text
CropProfile.recommendationTemplates
```

se utilizarán las recomendaciones especializadas del cultivo.

Ejemplos:

* RED_BEAN
* CASSAVA
* QUEQUISQUE
* ORANGE
* SORGHUM

Si no existe un perfil específico:

```text
ZoneInsight.recommendedAction
```

será utilizada como acción sugerida por defecto.

---

## Impactos esperados soportados

* WATER_SAVING
* YIELD_PROTECTION
* DISEASE_PREVENTION
* COST_REDUCTION
* CROP_HEALTH

---

## Contrato de Recomendaciones

Toda recomendación debe incluir:

* priority;
* reason;
* suggestedAction;
* expectedImpact;
* evidence;
* createdAt.

Toda recomendación debe estar respaldada por evidencia verificable.

Toda recomendación debe explicar explícitamente por qué se recomienda actuar.

---

## Reglas de calidad

### Alertas

Toda alerta debe:

* incluir evidencia verificable;
* indicar severidad;
* indicar acción recomendada;
* estar asociada a una zona.

No deben generarse alertas sin evidencia.

### Recomendaciones

Toda recomendación debe:

* incluir una razón explícita;
* estar respaldada por evidencia;
* contener una acción concreta y ejecutable;
* indicar el impacto esperado.

### Acciones sugeridas

Incorrecto:

```text
Monitorear cultivo
```

Correcto:

```text
Inspeccionar la zona afectada durante las próximas 24 horas y verificar humedad del suelo.
```

Incorrecto:

```text
Revisar cultivo
```

Correcto:

```text
Realizar inspección visual en el sector afectado y tomar muestras físicas para análisis agronómico.
```

---

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

---

## Consumidores del resultado

Los resultados generados por este flujo son utilizados por:

* Dashboard Ejecutivo.
* Módulo de Alertas.
* Módulo de Recomendaciones.
* Sistema de Reportes.
* Análisis Agrícola por Zona.

El objetivo final es transformar datos aislados en decisiones accionables respaldadas por evidencia.
