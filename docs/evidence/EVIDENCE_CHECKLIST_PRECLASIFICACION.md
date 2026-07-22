# Checklist de Evidencias - Preclasificación

## Objetivo

Verificar que todas las capas de evidencia estén presentes, validadas y correctamente vinculadas antes de generar y presentar el reporte prescriptivo en demo.

El flujo que se valida es:
**Evidencia → Riesgo → Alerta → Recomendación → Acción → Reporte**

---

## 1. Evidencia visual

- [x] Se registró una inspección visual clara para la zona `zone-03`
- [x] Se documentaron síntomas compatibles con estrés hídrico y clorosis
- [x] La evidencia está vinculada al notebook (`fn-001`)
- [x] La evidencia tiene fecha, responsable y descripción

---

## 2. Evidencia satelital simulada

- [x] Se incorporó una referencia de pérdida de vigor para la demo
- [x] La evidencia se puede relacionar con el análisis del reporte prescriptivo
- [ ] Se puede visualizar en una pantalla de demo si se desea profundizar el contexto

---

## 3. Evidencia de sensor

- [x] Se registró una lectura de humedad del suelo para la zona crítica
- [x] La lectura apoya la causa raíz de estrés hídrico
- [x] La evidencia está vinculada al notebook (`fn-002`)

---

## 4. Notebook con narrativa de decisión

- [x] `zone-03` tiene al menos 3 eventos
- [x] Hay una inspección visual inicial
- [x] Hay una acción correctiva de riego
- [x] Hay un seguimiento pendiente claro
- [x] Cada evento tiene evidencia, responsable y fecha

---

## 5. Recomendación y alerta

- [x] Existe una alerta activa asociada al caso de demo
- [x] Existe una recomendación prescriptiva asociada al problema
- [x] La recomendación se relaciona con la evidencia y el notebook

---

## 6. Reporte prescriptivo

- [x] El reporte incluye acciones tomadas desde el notebook
- [x] El reporte incluye acciones pendientes desde el notebook
- [x] El reporte refleja la narrativa de inspección → riego → seguimiento
- [x] El reporte se basa en la información derivada del insight de zona y del notebook

---

## 7. Flujo de demo

- [x] **Paso 1:** Zona crítica detectada
- [x] **Paso 2:** Evidencia visual
- [x] **Paso 3:** Evidencia satelital simulada
- [x] **Paso 4:** Evidencia de sensor
- [x] **Paso 5:** Alerta
- [x] **Paso 6:** Recomendación
- [x] **Paso 7:** Acción registrada en notebook
- [x] **Paso 8:** Reporte prescriptivo

---

## 8. Validación final

- [x] No hay inconsistencias mayores entre mock, notebook y reporte
- [x] La cadena de decisión es comprensible para usuario técnico y no técnico
- [x] La demo puede explicarse como una secuencia lógica de hechos

---

**Última actualización:** 2026-07-21
**Estado:** Listo para demo / alineado con la implementación actual
