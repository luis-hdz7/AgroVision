# Limitaciones del Análisis Visual

## Objetivo

Este documento describe el alcance y las limitaciones del módulo de análisis visual de AgroVision.

El AI Service implementado en esta versión del proyecto proporciona una clasificación visual preliminar basada en reglas heurísticas con el propósito de demostrar la arquitectura de integración del sistema. Sus resultados constituyen evidencia de apoyo para el motor prescriptivo y no deben interpretarse como diagnósticos agronómicos definitivos.

---

# Alcance Actual

El módulo de análisis visual permite identificar únicamente señales compatibles con las siguientes categorías:

- HEALTHY
- WATER_STRESS
- CHLOROSIS
- DRY_AREA
- LEAF_SPOT
- UNKNOWN

Estas categorías representan observaciones visuales preliminares y no confirman la presencia de enfermedades o condiciones específicas del cultivo.

---

# Limitaciones

## No constituye un diagnóstico definitivo

Las predicciones generadas representan una interpretación preliminar de patrones visuales observados en una imagen.

La clasificación obtenida debe considerarse una señal inicial que requiere validación mediante inspección técnica en campo.

---

## No sustituye la evaluación de un especialista

El sistema no reemplaza el criterio de ingenieros agrónomos ni la inspección directa del cultivo.

Las recomendaciones generadas tienen como finalidad apoyar la toma de decisiones y deben complementarse con observaciones de campo cuando sea necesario.

---

## Análisis visual preliminar

El AI Service utiliza reglas heurísticas simples para simular un flujo de análisis visual.

En esta versión del proyecto no se emplean modelos de aprendizaje profundo ni redes neuronales entrenadas sobre datos agrícolas reales.

---

## Confianza de las predicciones

Los valores de confianza asociados a cada predicción son estimaciones heurísticas utilizadas para demostrar el funcionamiento del sistema.

Estos valores no representan probabilidades estadísticas ni métricas de precisión de un modelo de inteligencia artificial entrenado.

---

## Integración con evidencia multifuente

La predicción visual constituye únicamente una fuente de evidencia dentro del flujo prescriptivo.

Antes de generar una evaluación de riesgo, el sistema combina información proveniente de:

- Sensores
- Clima
- Imágenes satelitales
- Historial del cultivo
- Mapeo
- Análisis visual

Esto permite reducir la dependencia de una única fuente de información.

---

## Capa satelital simulada

La información satelital utilizada durante la demostración corresponde a datos simulados con fines académicos.

La arquitectura fue diseñada para permitir la integración futura con proveedores reales de imágenes satelitales.

---

# Trabajo Futuro

La arquitectura del AI Service fue diseñada para facilitar futuras mejoras, entre ellas:

- Integración de modelos de visión por computadora entrenados con imágenes agrícolas.
- Incorporación de conjuntos de datos reales para mejorar la precisión de las predicciones.
- Ajuste dinámico de niveles de confianza.
- Soporte para nuevas categorías de anomalías visuales.
- Integración con servicios de inferencia basados en inteligencia artificial.

---

# Conclusión

El análisis visual implementado en AgroVision debe entenderse como una fuente adicional de evidencia dentro del flujo prescriptivo del sistema.

Las decisiones finales se fundamentan en la combinación de múltiples fuentes de información y no exclusivamente en la clasificación visual obtenida.