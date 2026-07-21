# ideathon-demo-evidence-map

Este documento describe el caso oficial utilizado durante la demostración del ideathon y explica cómo cada fuente de evidencia respalda el análisis prescriptivo y la recomendación final entregada al productor.

La demo utiliza un único flujo de extremo a extremo para garantizar consistencia entre análisis, alertas, recomendaciones, cuaderno de campo y reporte prescriptivo.

## Caso oficial de la demo

- **Campo:** `field-001`
- **Zona:** `zone-03`
- **Cultivo:** `ORANGE`
- **Nivel de riesgo:** `HIGH`

El objetivo es que cualquier integrante del equipo (técnico o no técnico) pueda comprender fácilmente qué información se presenta durante la demostración y cómo el sistema llega a la recomendación final.

---

## 1. Zona afectada

La demostración se centra en la zona `zone-03`, perteneciente al campo `field-001`.

El análisis prescriptivo identifica un **riesgo HIGH**, respaldado por múltiples fuentes de evidencia que indican un deterioro severo del vigor vegetal asociado principalmente a estrés hídrico.

---

## 2. Evidencia visual

**Qué se muestra**

Imágenes capturadas durante la inspección de campo donde se observan áreas secas, clorosis y pérdida de vigor en la vegetación.

**Por qué importa**

Permite validar visualmente los síntomas detectados por los demás sistemas de monitoreo y facilita la interpretación del problema por parte del usuario.

**Datos asociados**

- `fn-001` en `fieldNotebookMock.ts`
- Evidencia visual en `zoneInsightMock.ts`

---

## 3. Evidencia satelital simulada

**Qué se muestra**

Índices de vegetación simulados (NDVI, NDWI y GNDVI) que evidencian una disminución significativa del vigor y del contenido de agua en la vegetación.

**Por qué importa**

Demuestra cómo AgroVision puede detectar deterioro del cultivo mediante análisis remoto antes de que el problema afecte completamente la parcela.

**Datos asociados**

- Evidencias satelitales en `zoneInsightMock.ts`
- `EV-01`, `EV-02` y `EV-03` en `prescriptiveReportMock.ts`

---

## 4. Evidencia de sensores

**Qué se muestra**

Lecturas de humedad del suelo inferiores al rango recomendado y temperatura elevada.

**Por qué importa**

Confirma que las condiciones ambientales son compatibles con un escenario de estrés hídrico y justifican una intervención prioritaria.

**Datos asociados**

- `fn-002` en `fieldNotebookMock.ts`
- `EV-04` y `EV-05` en `prescriptiveReportMock.ts`

---

## 5. Alertas activas

**Qué se muestra**

Alertas generadas automáticamente a partir del análisis de evidencia multifuente.

Entre ellas:

- Bajo vigor vegetal.
- Estrés hídrico.
- Estrés térmico.

**Por qué importa**

Permiten comunicar rápidamente el nivel de riesgo y priorizar la atención de la zona afectada.

**Datos asociados**

- Alertas generadas desde `alertGenerationService.ts`
- `activeAlerts` en `prescriptiveReportMock.ts`

---

## 6. Recomendación prescriptiva

**Qué se muestra**

Una recomendación priorizada basada en la evidencia recopilada.

**Por qué importa**

Convierte el diagnóstico técnico en una acción concreta para el productor.

**Acción recomendada**

- Verificar la cobertura del sistema de riego.
- Validar las condiciones de humedad del suelo.
- Aplicar riego correctivo si se confirma déficit hídrico.
- Programar una inspección de seguimiento.

**Datos asociados**

- `recommendationsMock.ts`
- `REC-01` en `prescriptiveReportMock.ts`

---

## 7. Cuaderno de campo

**Qué se muestra**

El historial operativo de la zona, incluyendo:

- inspección realizada;
- riego de emergencia;
- inspección técnica pendiente.

**Por qué importa**

Demuestra la trazabilidad entre la detección del problema y las acciones ejecutadas o planificadas.

**Datos asociados**

- `fn-001`
- `fn-002`
- `fn-003`

---

## 8. Relación con el reporte prescriptivo

El reporte prescriptivo consolida toda la información proveniente de:

- ZoneInsight;
- evidencia multifuente;
- alertas;
- recomendaciones;
- cuaderno de campo.

Esto permite explicar claramente:

- qué ocurrió;
- por qué ocurrió;
- qué evidencia respalda el diagnóstico;
- qué acciones deben ejecutarse.

**Datos asociados**

- `prescriptiveReportService.ts`
- `prescriptiveReportMock.ts`

---

# Flujo oficial de la demo

```
ZoneInsight
      ↓
Evidence Fusion
      ↓
Alerts
      ↓
Recommendations
      ↓
Field Notebook
      ↓
Prescriptive Field Report
      ↓
Dashboard
```

La demostración sigue un único caso de principio a fin utilizando:

- `field-001`
- `zone-03`
- `ORANGE`

garantizando que todas las pantallas, reportes y recomendaciones correspondan al mismo escenario y mantengan coherencia entre los distintos módulos del sistema.