# Field Report v0

Este documento describe el modelo de reporte por parcela utilizado en el backend para consolidar información de campo, riesgo, alertas, recomendaciones y acciones.

## Campos del reporte por zona

- `fieldId`
  - Identificador único de la parcela o zona agrícola.
  - Sirve para relacionar el reporte con el campo exacto dentro del sistema.
- `fieldName`
  - Nombre legible de la parcela.
  - Facilita la interpretación humana y la presentación en interfaces.
- `cropName`
  - Nombre del cultivo asociado a esta parcela.
  - Permite contextualizar el estado agronómico del reporte.
- `incidentDescription`
  - Describe qué pasó en la parcela.
  - Responde al problema u observación principal registrada.
- `location`
  - Ubicación específica dentro del campo o zona.
  - Responde a dónde pasó el incidente y ayuda a ubicarlo espacialmente.
- `severity`
  - Nivel de gravedad del reporte: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  - Indica qué tan grave fue el problema y ayuda a priorizar la acción.
- `alerts`
  - Lista de alertas vinculadas al reporte.
  - Incluye eventos detectados automáticamente o señales de campo que soportan el problema.
- `evidence`
  - Evidencias asociadas: fotos, videos, registros de sensores, notas o documentos.
  - Responde qué evidencia existe y respalda las observaciones.
- `recommendations`
  - Lista de acciones sugeridas para atender el problema.
  - Responde qué se recomienda hacer para mitigarlo o corregirlo.
- `actionsTaken`
  - Lista de acciones ya ejecutadas o registradas en el cuaderno de campo.
  - Responde qué acción se tomó en la práctica.
- `createdAt`
  - Fecha de creación del reporte.
  - Permite ordenar y auditar registros por tiempo.
- `updatedAt`
  - Fecha de última actualización.
  - Indica cambios posteriores a la creación del reporte.

## Para qué sirve cada campo

- `fieldId` y `fieldName`
  - Vinculan el reporte con la parcela y garantizan trazabilidad espacial.
- `cropName`
  - Contextualiza la condición del campo según el tipo de cultivo.
- `incidentDescription`
  - Explica el evento o problema observado.
- `location`
  - Precisa el lugar dentro del campo donde ocurrió el incidente.
- `severity`
  - Permite clasificar el riesgo y priorizar acciones.
- `alerts`
  - Muestra las notificaciones que justifican o acompañan el reporte.
- `evidence`
  - Respaldan las observaciones y ayudan en la validación de decisiones.
- `recommendations`
  - Transforman el problema en acciones sugeridas.
- `actionsTaken`
  - Reflejan la ejecución real registrada en el cuaderno de campo.
- `createdAt` y `updatedAt`
  - Permiten seguimiento temporal y auditoría.

## Cómo se relaciona con alertas

- El campo `alerts` contiene notificaciones y señales que respaldan el reporte.
- Cada alerta puede describir un evento detectado en el monitoreo o una condición crítica dentro del campo.
- El reporte puede agrupar varias alertas en una misma zona para entregar un contexto más claro.

## Cómo se relaciona con recomendaciones

- El campo `recommendations` detalla las acciones sugeridas para controlar o corregir el incidente.
- Las recomendaciones ayudan a convertir el análisis del reporte en un plan de acción.
- Se pueden priorizar en función de la gravedad (`severity`) y de la evidencia disponible.

## Cómo se relaciona con el cuaderno de campo

- El campo `actionsTaken` documenta las intervenciones registradas en el cuaderno de campo.
- El cuaderno de campo es la fuente de la ejecución real: qué se hizo, cuándo y quién lo hizo.
- `FieldReport` actúa como un vínculo entre detección, propuesta de acciones y la respuesta operativa efectiva.
