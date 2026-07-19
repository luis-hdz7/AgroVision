# ideathon-demo-evidence-map

Este documento explica qué evidencia se muestra durante la demo del ideathon
y cómo cada tipo de evidencia sustenta la recomendación final entregada al
agricultor para la zona crítica zone-03 (campo field-002).

El objetivo es que cualquier persona del equipo (técnica o no técnica) entienda
de un vistazo qué está viendo en pantalla y por qué el sistema llegó a esa
recomendación.

## 1. Zona afectada

Se destaca la zona `zone-03`, perteneciente al campo `field-002`, donde el riesgo
prescriptivo muestra una afectación significativa del vigor vegetal y una anomalía
foliar compatible con una plaga estructural en etapa inicial.

## 2. Evidencia visual

Qué se muestra: una foto de campo capturada por el rover, donde se observan
hojas con clorosis moteada y defoliación parcial.

Por qué importa: confirma la observación humana y permite que el usuario del demo
entienda el impacto visible en la parcela.

Dato mock asociado: `fn-001` en `fieldNotebookMock.ts` y `ev-001` en `prescriptiveReportMock.ts`.

## 3. Evidencia satelital simulada

Qué se muestra: un mapa GNDVI simulado que compara el estado actual de la zona
con una referencia de 14 días atrás, mostrando una caída severa del vigor.

Por qué importa: demuestra que el sistema puede detectar pérdida de vegetación
antes de que el problema se vea en toda la parcela, usando una señal satelital.

Dato mock asociado: `ev-002` en `prescriptiveReportMock.ts`.

## 4. Evidencia de sensor

Qué se muestra: lectura de humedad de suelo del sector crítico, por debajo del
umbral recomendado.

Por qué importa: valida la causa raíz de estrés hídrico y orienta la urgencia del
riego complementario.

Dato mock asociado: `ev-003` en `prescriptiveReportMock.ts` y `fn-002` en `fieldNotebookMock.ts`.

## 5. Alerta activa

Qué se muestra: una alerta priorizada que comunica el peligro actual en la zona.

Por qué importa: permite visualizar el problema en una sola capa y muestra el
momento exacto en que el sistema decide actuar.

Dato mock asociado: `AL-01` y `AL-02` en `prescriptiveReportMock.ts`.

## 6. Recomendación

Qué se muestra: una recomendación priorizada generada desde la alerta y la evidencia.

Por qué importa: enlaza el diagnóstico con la acción esperada para el agricultor.

Dato mock asociado: `REC-01` en `prescriptiveReportMock.ts`.

## 7. Acción tomada o pendiente

Qué se muestra: el historial del cuaderno de campo que registra lo que ya se hizo
(inspección, riego de emergencia) y lo que todavía está pendiente (revisión técnica).

Por qué importa: evidencia la trazabilidad del proceso y la transición de la alerta a la
acción ejecutada o pendiente.

Dato mock asociado: `fn-001`, `fn-002` y `fn-003` en `fieldNotebookMock.ts`.

## 8. Relación con el reporte prescriptivo

Qué se muestra: el cuaderno de campo permite demostrar cómo una inspección realizada,
una acción tomada y una acción pendiente se relacionan con el reporte prescriptivo final
para la zona `zone-03` del campo `field-002`.

Por qué importa: conecta el historial operativo del campo con la narrativa del reporte,
permitiendo explicar al usuario qué se observó, qué se hizo y qué sigue pendiente antes de
consolidar la recomendación de negocio o técnica.

Dato mock asociado: `fn-001` (inspección realizada), `fn-002` (acción tomada), `fn-003` (acción pendiente) y el flujo de `prescriptiveReportService`.

## Flujo resumido para la demo

ZoneInsight → Alertas → Recomendaciones → Cuaderno de campo → PrescriptiveFieldReport → Dashboard

La demo navega: zona afectada → evidencia visual → evidencia satelital simulada → evidencia de sensor → alerta → recomendación → inspección realizada → acción tomada → acción pendiente → reporte prescriptivo, mostrando que cada paso está respaldado por datos concretos y no por una afirmación genérica.
