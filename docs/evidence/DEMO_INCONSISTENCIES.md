# Registro de inconsistencias — demo preclasificación

| ID | Inconsistencia detectada | Estado | Responsable | Resolución |
|---|---|---|---|---|
| DEMO-001 | Dashboard histórico con métricas distintas al caso oficial. | Resuelta | Equipo Dashboard | Se normalizó el mock a `field-001` / `zone-03` / `ORANGE`, score 35, NDVI 0.24, humedad 28 % y temperatura 38 °C. `farm-001` se conserva como ID de finca. |
| DEMO-002 | Ejemplo de `REPORTS_STRUCTURE.md` usaba `field-002` y `corn`. | Resuelta | Equipo Reports / Documentación | El ejemplo se actualizó al caso oficial. |
| DEMO-003 | Contrato de reporte no transportaba responsable ni evidencia para acciones pendientes, ni evidencia por acción tomada. | Resuelta | Equipo Reports API | El endpoint de reporte deriva responsable, fecha y evidencia desde `FieldNotebookService` para acciones tomadas y pendientes. |
| DEMO-004 | Tipos y fallback del frontend no estaban alineados con el contrato del reporte. | Resuelta | Equipo Frontend Reports | Se unificaron los campos de alertas, recomendaciones y acciones, incluida evidencia asociada. |

**Regla de escalamiento:** toda nueva diferencia entre Dashboard, API, Reporte y Notebook debe agregarse a esta tabla antes de la demo y asignarse al equipo propietario de la capa afectada.
