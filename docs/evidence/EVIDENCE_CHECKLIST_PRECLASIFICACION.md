# Checklist de Evidencias - Preclasificación

## Objetivo
Verificar que todas las capas de evidencia estén presentes, validadas y correctamente vinculadas antes de generar y presentar el reporte prescriptivo en demo.

El flujo que se valida es:
**Evidencia → Riesgo → Alerta → Recomendación → Acción → Reporte**

---

## 1. Evidencia Visual

Validar que la captura de campo sea clara y representativa del problema.

- [ ] Foto de campo capturada por rover o equipo técnico
- [ ] Síntomas visibles documentados (clorosis, defoliación, manchas)
- [ ] Zona correctamente identificada (`zone-03` para demo)
- [ ] Timestamp de captura registrado
- [ ] Referencia en mock: `fn-001` (fieldNotebookMock.ts)
- [ ] Referencia en reporte: `ev-001` (prescriptiveReportMock.ts)

**Consideración:** La foto debe ser legible en pantalla y mostrar claramente la anomalía.

---

## 2. Evidencia Satelital Simulada

Validar que el índice GNDVI demuestre pérdida de vigor en el tiempo.

- [ ] GNDVI simulado generado para zona crítica
- [ ] Comparativa con referencia histórica (14 días atrás)
- [ ] Caída de vigor cuantificada (ej: -0.28 puntos)
- [ ] Clasificación de severidad asignada (alta/severa)
- [ ] Fecha de análisis registrada
- [ ] Referencia en reporte: `ev-002` (prescriptiveReportMock.ts)

**Consideración:** Este dato valida que el problema no es puntual sino tendencial.

---

## 3. Evidencia de Sensor

Validar que la lectura ambiental respalda la causa raíz del estrés.

- [ ] Lectura de humedad de suelo capturada
- [ ] Valor por debajo del umbral recomendado (especificar umbral)
- [ ] Localización del sensor en zona crítica
- [ ] Timestamp de lectura
- [ ] Referencia en notebook: `fn-002` (fieldNotebookMock.ts)
- [ ] Referencia en reporte: `ev-003` (prescriptiveReportMock.ts)

**Consideración:** Respalda hipótesis de estrés hídrico y urgencia de riego.

---

## 4. Evaluación de Riesgo

Validar que el riesgo se haya calculado desde las evidencias.

- [ ] Nivel de riesgo final asignado (alto para demo)
- [ ] Causa raíz identificada (ej: "Estrés hídrico + baja defensa")
- [ ] Score de vigor vegetal calculado
- [ ] Componentes que alimentan el riesgo documentados
- [ ] Justificación visible para usuario/jurado

**Consideración:** El riesgo NO es arbitrario, emana de las evidencias.

---

## 5. Alerta Activa

Validar que la alerta comunique el peligro inminente.

- [ ] Alerta priorizada creada (`AL-01` para demo)
- [ ] Segunda alerta complementaria (`AL-02`)
- [ ] Mensaje claro y no técnico para agricultor
- [ ] Timestamp de generación
- [ ] Estado de alerta (activa/pendiente resolución)
- [ ] Referencia en reporte: ambas alertas presentes en `alerts[]`

**Consideración:** La alerta es el disparador para la acción, no un aviso genérico.

---

## 6. Recomendación

Validar que la recomendación fluya directamente de la alerta y evidencia.

- [ ] Recomendación específica generada (`REC-01` para demo)
- [ ] Acción sugerida clara y ejecutable
- [ ] Urgencia correctamente comunicada
- [ ] Beneficio esperado cuantificado (si aplica)
- [ ] Timestamp de generación
- [ ] Vinculación clara con alerta que la genera
- [ ] Referencia en reporte: `suggestedAction` y `recommendation`

**Consideración:** No es consejo genérico; es prescriptivo basado en datos.

---

## 7. Acción - Cuaderno de Campo

Validar que el historial de acciones respalde la trazabilidad.

- [ ] Acción 1: Inspección técnica registrada (`fn-001`)
  - [ ] Resultado documentado
  - [ ] Fecha/hora de ejecución
  
- [ ] Acción 2: Riego de emergencia ejecutado (`fn-002`)
  - [ ] Volumen o parámetro aplicado
  - [ ] Fecha/hora de ejecución
  
- [ ] Acción 3: Revisión técnica pendiente (`fn-003`)
  - [ ] Descripción de próximos pasos
  - [ ] Fecha estimada

**Consideración:** Demuestra que alertas y recomendaciones se convierten en acciones reales.

---

## 8. Reporte Prescriptivo

Validar que el reporte integre todas las capas sin redundancia.

- [ ] Campo `fieldId` correcto
- [ ] Campo `zoneId` correcto (zone-03)
- [ ] Campo `cropType` especificado
- [ ] Campo `generatedAt` con timestamp
- [ ] Campo `finalRiskLevel` ("high" para demo)
- [ ] Campo `healthScore` calculado
- [ ] Campo `mainCause` claro y documentado
- [ ] Array `evidence[]` con ev-001, ev-002, ev-003
- [ ] Array `alerts[]` con AL-01, AL-02
- [ ] Array `recommendations[]` con REC-01
- [ ] Campo `suggestedAction` textual
- [ ] Campo `expectedImpact` cuantificado

**Consideración:** El reporte es el resumen ejecutivo donde todo converge.

---

## 9. Flujo de Demo - Navegación Esperada

Validar que la secuencia sea clara para el usuario (productor/jurado).

- [ ] **Pantalla 1:** ZoneInsight muestra zona crítica resaltada
- [ ] **Pantalla 2:** Foto de campo visible con síntomas claros
- [ ] **Pantalla 3:** Gráfico GNDVI muestra caída de vigor en tiempo
- [ ] **Pantalla 4:** Lectura de sensor respalda causa (humedad baja)
- [ ] **Pantalla 5:** Alerta priorizada comunica riesgo
- [ ] **Pantalla 6:** Recomendación enlaza riesgo con acción
- [ ] **Pantalla 7:** Cuaderno de campo muestra qué se hizo/hace
- [ ] **Pantalla 8:** Reporte prescriptivo resume todo en una vista

**Consideración:** Cada pantalla debe responder: "¿Por qué llegamos a esta conclusión?"

---

## 10. Validación Final - Checklist de Integración

Antes de marcar como "listo para demo":

- [ ] Todos los campos anteriores completados
- [ ] No hay datos inconsistentes entre mock y reporte
- [ ] Timestamps son coherentes (alerta después de evidencia)
- [ ] Referencias de IDs coinciden entre módulos
- [ ] Mensajes son claros sin jerga técnica innecesaria
- [ ] Valores numéricos tienen sentido (ej: humidity % en rango 0-100)
- [ ] Evidencia visual (foto) está cargada y accesible
- [ ] GNDVI simulado genera gráfico correctamente
- [ ] Toda la cadena está versionada en Git

---

## Responsables y Fechas

| Sección | Responsable | Fecha Validación | Status |
|---------|-------------|------------------|--------|
| Evidencia Visual | | | |
| Evidencia Satelital | | | |
| Evidencia Sensor | | | |
| Riesgo | | | |
| Alertas | | | |
| Recomendación | | | |
| Acciones (Notebook) | | | |
| Reporte Prescriptivo | | | |
| Flujo Demo | | | |
| Integración Final | | | |

---

## Notas Importantes

1. **Trazabilidad es la clave:** Cada decisión debe tener un "por qué" sustentado en datos.
2. **Sin datos, sin alerta:** No se genera alerta sin evidencia mínima.
3. **Mock es fuente de verdad:** Mientras se desarrolla, los datos mock deben ser realistas y consistentes.
4. **Demo coherencia:** El jurado no debe ver saltos lógicos entre evidencia y conclusión.
5. **Período de validación:** Días 5-8 julio enfocados en validar que todo esto esté correcto antes de Día 11 (presentación final).

---

**Última actualización:** 2026-07-09
**Estado:** En construcción / Preclasificación
