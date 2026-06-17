# Historial de reportes y cuaderno de campo v0

## Flujo base

1. Dato: se capturan observaciones del campo, alertas, evidencia y métricas de salud.
2. Análisis: se evalúa el estado del cultivo, el riesgo y la relación entre alerta y evidencia.
3. Alerta: se genera una alerta con su entidad afectada y su evidencia asociada.
4. Recomendación: se propone la mejor acción de mitigación o monitoreo.
5. Acción: se registra la intervención ejecutada por el usuario responsable.
6. Historial: todo se conserva como reporte y entrada de cuaderno de campo para trazabilidad.

## Diagrama simple del flujo

Dato -> Análisis -> Alerta -> Recomendación -> Acción -> Historial

## Reglas de evidencia

- Cada alerta debe guardar su evidencia cuando exista.
- El reporte debe conservar la referencia al origen de la evidencia.
- El cuaderno de campo debe permitir anexar fotos, notas o sensores.
