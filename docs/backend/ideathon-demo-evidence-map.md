# ideathon-demo-evidence-map

Este documento describe el caso oficial utilizado durante la demostración y muestra cómo la narrativa del cuaderno de campo se convierte en una secuencia técnica útil para la demo, los reportes y la trazabilidad.

La demo sigue un flujo claro y comprensible para un jurado técnico y no técnico:

1. Se detecta una zona crítica.
2. Se recopila evidencia visual.
3. Se incorpora evidencia satelital simulada.
4. Se valida con evidencia de sensores.
5. Se genera una alerta.
6. Se propone una recomendación.
7. Se registra la acción en el notebook.
8. Se consolida todo en el reporte prescriptivo.

---

## Caso oficial de la demo

- **Campo:** `field-001`
- **Zona:** `zone-03`
- **Cultivo:** `ORANGE`
- **Nivel de riesgo:** `HIGH`

El objetivo es que el equipo pueda seguir la cadena de decisión desde la detección del problema hasta la acción registrada y el reporte final.

---

## 1. Zona crítica detectada

La demostración se centra en la zona `zone-03`, perteneciente al campo `field-001`.

El análisis prescriptivo identifica un riesgo `HIGH` asociado principalmente a estrés hídrico y pérdida de vigor.

---

## 2. Evidencia visual

Se muestra una inspección visual registrada en el notebook con síntomas como clorosis y zonas secas del dosel.

**Datos asociados**

- `fn-001` en `fieldNotebookMock.ts`
- Evidencia visual en el flujo del reporte prescriptivo

---

## 3. Evidencia satelital simulada

Se incorpora una referencia de deterioro de vigor y de condiciones de humedad compatibles con el problema detectado.

**Por qué importa**

Permite mostrar que el problema no es solo local, sino que también tiene una lectura temporal y espacial.

---

## 4. Evidencia de sensores

Se valida la hipótesis de estrés hídrico con una lectura de humedad del suelo inferior al umbral recomendado.

**Datos asociados**

- `fn-002` en `fieldNotebookMock.ts`
- evidencia del reporte prescriptivo basada en el insight de zona

---

## 5. Alerta

El sistema genera una alerta activa que resume la condición crítica de la zona.

**Por qué importa**

Convierte la evidencia en una señal priorizada para la acción.

---

## 6. Recomendación

La recomendación prescriptiva orienta al usuario hacia una respuesta concreta, en este caso una intervención de riego y validación de seguimiento.

**Datos asociados**

- `recommendationsMock.ts`
- `prescriptiveReportService.ts`

---

## 7. Acción registrada en notebook

El cuaderno de campo documenta la secuencia de decisión:

- inspección visual inicial,
- riego correctivo ejecutado,
- seguimiento pendiente para validar recuperación.

Esto convierte el flujo en una narrativa operativa y trazable.

**Datos asociados**

- `fn-001`
- `fn-002`
- `fn-003`

---

## 8. Reporte prescriptivo

El reporte consolidado toma la evidencia, la alerta, la recomendación y las acciones del notebook para permitir una explicación completa del caso.

**Datos asociados**

- `prescriptiveReportService.ts`
- `FieldNotebookService`

---

## Flujo oficial de la demo

```text
Zona crítica detectada
      ↓
Evidencia visual
      ↓
Evidencia satelital simulada
      ↓
Evidencia de sensor
      ↓
Alerta
      ↓
Recomendación
      ↓
Acción registrada en notebook
      ↓
Reporte prescriptivo
```

La demostración utiliza:

- `field-001`
- `zone-03`
- `ORANGE`

para mantener coherencia entre todas las pantallas y módulos del sistema.
