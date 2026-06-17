# Campos obligatorios del cuaderno de campo

1. id
   - Identificador único de la entrada para trazabilidad y auditoría.
2. fieldId
   - Identifica el campo donde se registró la actividad.
3. cropId
   - Identifica el cultivo afectado o en revisión.
4. activityType
   - Tipo de actividad realizada (IRRIGATION, FERTILIZATION, PEST_CONTROL, DISEASE_CONTROL, INSPECTION, SOIL_CORRECTION, HARVEST, OTHER).
5. description
   - Resumen claro de lo observado o realizado.
6. problemObserved
   - Descripción del problema localizado en el campo o cultivo.
7. actionTaken
   - Intervención ejecutada para resolver, mitigar o monitorear el problema.
8. responsibleUser
   - Usuario responsable de la entrada o de la intervención.
9. evidence
   - Evidencia de respaldo: fotos, videos, notas, datos de sensores o documentos.
10. createdAt
    - Fecha y hora en que se generó la entrada en el cuaderno de campo.

## Para qué sirve cada campo

- id: permite referenciar la entrada de forma única y cruzar registros con el historial.
- fieldId: asegura que la información se asocia al lugar exacto donde ocurrió el evento.
- cropId: permite relacionar la entrada con el ciclo de cultivo específico.
- activityType: estandariza la clasificación de la intervención agrícola.
- description: aporta contexto y facilita entender qué se hizo o qué se registró.
- problemObserved: documenta el origen de la acción y el motivo de la intervención.
- actionTaken: deja constancia de la respuesta concreta frente al problema.
- responsibleUser: habilita trazabilidad de quién registró o ejecutó la acción.
- evidence: respalda el registro con pruebas físicas o datos técnicos.
- createdAt: fija el momento en que la entrada ingresó al historial.

## Importancia
Cada campo obligatorio contribuye a que el cuaderno de campo capture la información necesaria para reconstruir:
- qué pasó,
- dónde pasó,
- quién actuó,
- qué evidencia respalda la decisión,
- qué quedó pendiente.
