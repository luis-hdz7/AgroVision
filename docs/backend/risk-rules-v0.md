# Risk Rules V0

## Objetivo

Definir las reglas utilizadas por `calculateRisk()` para transformar métricas agrícolas en un resultado compatible con `CropHealthAnalysis`.

Esta versión (**V0**) utiliza un modelo heurístico basado en condiciones observables y está diseñada para validación temprana durante el desarrollo del sistema.

Las reglas podrán evolucionar posteriormente utilizando criterios agronómicos oficiales.

---

# Variables utilizadas

La función recibe:

```ts
soilMoisturePercentage: number
temperatureCelsius: number
cropHealthScore: number
```

Significado:

* `soilMoisturePercentage`
  → porcentaje de humedad del suelo.

* `temperatureCelsius`
  → temperatura ambiental observada.

* `cropHealthScore`
  → indicador inicial de salud del cultivo (0–100).

---

# Modelo de evaluación

El análisis parte del estado inicial del cultivo.

```txt
healthScore = cropHealthScore
```

Posteriormente se aplican penalizaciones según los factores de riesgo detectados.

Restricción:

```txt
0 ≤ healthScore ≤ 100
```

El valor final se limita al rango permitido.

---

# Umbrales iniciales

Los umbrales están definidos en:

```txt
riskThresholds.ts
```

| Variable               | WATCH | WARNING | CRITICAL |
| ---------------------- | ----- | ------- | -------- |
| soilMoisturePercentage | ≤ 50  | ≤ 40    | ≤ 30     |
| temperatureCelsius     | ≥ 30  | ≥ 35    | ≥ 40     |
| cropHealthScore        | ≤ 75  | ≤ 60    | ≤ 50     |

---

# Evaluación de humedad del suelo

Variable:

```txt
soilMoisturePercentage
```

Interpretación:

* WATCH → monitoreo recomendado.
* WARNING → riesgo creciente.
* CRITICAL → posible estrés hídrico.

Acciones posibles:

* Registrar factor de análisis.
* Registrar anomalía:

```txt
WATER_STRESS
```

* Reducir `healthScore`.
* Generar recomendación.

Ejemplo:

```txt
Increase irrigation frequency
```

---

# Evaluación térmica

Variable:

```txt
temperatureCelsius
```

Interpretación:

* WATCH → temperatura elevada.
* WARNING → posible estrés térmico.
* CRITICAL → condiciones severas.

Acciones posibles:

* Registrar factor de análisis.
* Registrar anomalía:

```txt
HEAT_STRESS
```

* Reducir `healthScore`.
* Generar recomendación.

Ejemplo:

```txt
Apply immediate heat mitigation measures
```

---

# Evaluación del estado del cultivo

Variable:

```txt
cropHealthScore
```

Interpretación:

* WATCH → seguimiento recomendado.
* WARNING → deterioro parcial.
* CRITICAL → deterioro severo.

Acciones posibles:

* Registrar factor de análisis.
* Registrar anomalía:

```txt
VEGETATION_DROP
```

* Reducir `healthScore`.
* Generar recomendación.

Ejemplo:

```txt
Schedule immediate field inspection
```

---

# Clasificación de riesgo

| healthScore | riskLevel |
| ----------- | --------- |
| 70–100      | LOW       |
| 40–69       | MEDIUM    |
| 0–39        | HIGH      |

---

# Conversión de score a estado

| healthScore | status   |
| ----------- | -------- |
| 75–100      | HEALTHY  |
| 50–74       | WATCH    |
| 25–49       | WARNING  |
| 0–24        | CRITICAL |

---

# Casos de prueba

## Caso 1 — Bajo riesgo

Entrada:

```txt
soilMoisturePercentage = 55
temperatureCelsius = 24
cropHealthScore = 90
```

Salida esperada:

```txt
healthScore ≈ 90
riskLevel = LOW
status = HEALTHY
```

---

## Caso 2 — Riesgo medio

Entrada:

```txt
soilMoisturePercentage = 20
temperatureCelsius = 38
cropHealthScore = 80
```

Resultado esperado:

```txt
healthScore ≈ 50
riskLevel = MEDIUM
status = WATCH
```

Anomalías esperadas:

```txt
WATER_STRESS
HEAT_STRESS
```

---

## Caso 3 — Riesgo alto

Entrada:

```txt
soilMoisturePercentage = 20
temperatureCelsius = 38
cropHealthScore = 40
```

Resultado esperado:

```txt
healthScore = 0
riskLevel = HIGH
status = CRITICAL
```

Anomalías esperadas:

```txt
WATER_STRESS
HEAT_STRESS
VEGETATION_DROP
```

---

# Limitaciones V0

* El modelo actual utiliza reglas heurísticas.
* No reemplaza validación agronómica.
* No incorpora históricos ni predicción.
* El contrato define estructura de datos, no el algoritmo.
* Los umbrales actuales fueron definidos para validación funcional.
* Las reglas podrán ajustarse en futuras versiones.

---

# Archivos relacionados

```txt
riskTypes.ts
riskThresholds.ts
riskRulesService.ts
riskEngine.ts
```
