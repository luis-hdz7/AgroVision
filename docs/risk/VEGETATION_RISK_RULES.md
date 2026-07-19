# VEGETATION_RISK_RULES.md

## Objetivo

Definir las reglas heurísticas utilizadas por AgroVision para interpretar índices de vegetación y transformarlos en evidencia utilizable por el motor prescriptivo.

Estas reglas no representan diagnósticos agronómicos definitivos. Los resultados generados deben interpretarse como señales preliminares que pueden requerir validación mediante inspección técnica en campo.

---

# Índices Utilizados

## NDVI (Normalized Difference Vegetation Index)

Indicador de vigor vegetal y actividad fotosintética.

| Rango       | Interpretación         | Riesgo |
| ----------- | ---------------------- | ------ |
| < 0.30      | Vigor vegetal muy bajo | HIGH   |
| 0.30 - 0.49 | Vigor reducido         | MEDIUM |
| 0.50 - 0.69 | Vigor moderado         | WATCH  |
| >= 0.70     | Vegetación saludable   | LOW    |

### Acción Recomendada

* Revisar disponibilidad hídrica.
* Verificar condiciones nutricionales.
* Realizar inspección visual cuando existan evidencias adicionales.

---

## NDWI (Normalized Difference Water Index)

Indicador de contenido hídrico de la cobertura vegetal.

| Rango       | Interpretación                       | Riesgo |
| ----------- | ------------------------------------ | ------ |
| < 0.15      | Déficit hídrico severo               | HIGH   |
| 0.15 - 0.24 | Posible reducción de agua disponible | MEDIUM |
| 0.25 - 0.39 | Monitoreo recomendado                | WATCH  |
| >= 0.40     | Disponibilidad hídrica adecuada      | LOW    |

### Acción Recomendada

* Revisar sistema de riego.
* Verificar humedad del suelo.
* Correlacionar con temperatura y precipitación.

---

## GNDVI (Green Normalized Difference Vegetation Index)

Indicador relacionado con actividad clorofílica y estado nutricional.

| Rango       | Interpretación                             | Riesgo |
| ----------- | ------------------------------------------ | ------ |
| < 0.25      | Actividad clorofílica severamente reducida | HIGH   |
| 0.25 - 0.39 | Posible deterioro fisiológico              | MEDIUM |
| 0.40 - 0.59 | Nivel aceptable con observación            | WATCH  |
| >= 0.60     | Condición favorable                        | LOW    |

### Acción Recomendada

* Revisar fertilización.
* Verificar signos de clorosis.
* Correlacionar con inspección visual.

---

# Interpretación de Vigor Vegetal

## LOW

Condiciones compatibles con deterioro significativo del cultivo.

### Evidencia Típica

* NDVI bajo.
* GNDVI bajo.
* Presencia de clorosis.
* Tendencia negativa persistente.

### Riesgo

HIGH

### Acción

Inspección técnica prioritaria.

---

## MEDIUM

Condiciones compatibles con estrés moderado.

### Evidencia Típica

* NDVI intermedio.
* Disminución gradual de índices.
* Tendencia negativa reciente.

### Riesgo

MEDIUM

### Acción

Monitoreo reforzado y validación en campo.

---

## HIGH

Vegetación saludable y estable.

### Evidencia Típica

* NDVI alto.
* NDWI adecuado.
* Sin anomalías visuales.

### Riesgo

LOW

### Acción

Continuar monitoreo rutinario.

---

## UNKNOWN

Información insuficiente para determinar el estado vegetativo.

### Acción

Solicitar nueva captura satelital o actualización de datos.

---

# Reglas de Evidencia Multifuente

## Estrés Hídrico Potencial

### Condiciones

* NDWI bajo.
* Humedad de suelo baja.

### Interpretación

Señales compatibles con estrés hídrico.

### Acción

Revisar cobertura de riego e inspeccionar la zona.

---

## Estrés Hídrico Potencial Reforzado

### Condiciones

* NDWI bajo.
* Temperatura elevada.

### Interpretación

Mayor probabilidad de reducción de disponibilidad hídrica.

### Acción

Priorizar evaluación de infraestructura de riego.

---

## Reducción de Vigor Vegetal

### Condiciones

* NDVI bajo.
* GNDVI bajo.

### Interpretación

Posible deterioro fisiológico o nutricional.

### Acción

Realizar inspección agronómica.

---

## Clorosis Compatible

### Condiciones

* GNDVI bajo.
* ChlorosisDetected = true

### Interpretación

Patrones visuales compatibles con reducción de actividad clorofílica.

### Acción

Verificar estado nutricional y realizar inspección en campo.

---

## Área Seca Detectada

### Condiciones

* DryAreaDetected = true
* NDWI bajo

### Interpretación

Evidencia preliminar compatible con déficit hídrico localizado.

### Acción

Validación visual y revisión de cobertura de riego.

---
---

# Regla Integrada de Deterioro de Vegetación

## Condiciones

Las siguientes condiciones deben evaluarse de manera conjunta:

- NDVI clasificado como **LOW**.
- NDWI clasificado como **LOW**.
- GNDVI clasificado como **LOW**.

Cuando esta combinación esté respaldada por evidencia adicional (por ejemplo, humedad del suelo reducida, anomalías visuales o tendencia histórica negativa), el motor prescriptivo deberá considerar que existe una alta probabilidad de deterioro de la vegetación.

### Interpretación

La coincidencia de índices bajos de vigor vegetal (NDVI), contenido hídrico (NDWI) y actividad clorofílica (GNDVI) representa evidencia consistente de reducción del desempeño fisiológico del cultivo.

Estas señales no constituyen un diagnóstico definitivo, pero incrementan el nivel de confianza del análisis cuando son corroboradas mediante evidencia multifuente.

### Riesgo Estimado

**HIGH**

### Evidencia Complementaria

La confianza del análisis aumenta cuando además se detecta una o más de las siguientes condiciones:

- Humedad del suelo clasificada como **WARNING** o **CRITICAL**.
- Temperatura elevada.
- Anomalías visuales compatibles con estrés vegetal.
- Tendencia histórica negativa de la vegetación.
- Riesgo espacial identificado mediante análisis de mapeo.

### Acción Recomendada

- Priorizar inspección técnica en campo.
- Verificar cobertura y funcionamiento del sistema de riego.
- Confirmar la humedad del suelo mediante mediciones locales.
- Aplicar medidas correctivas únicamente después de validar la evidencia obtenida en campo.

---

# Consideraciones

AgroVision utiliza reglas heurísticas orientadas a soporte de decisiones.

Los resultados generados representan evidencia preliminar y no sustituyen la evaluación técnica realizada por personal especializado.
