# Smoke Test Results

## Fecha

20 de julio de 2026

## Fecha modificacion

21 de julio de 2026

---

## Objetivo

Verificar que los endpoints críticos del backend respondan correctamente y cumplan el contrato `ApiResponse`.

---

## Resultados

| Método | Endpoint | Estado |
|---------|----------|--------|
| GET | /api/health | PASS |
| GET | /api/crops/profiles | PASS |
| GET | /api/vegetation/indices?fieldId=field-001 | PASS |
| GET | /api/analysis/zone/zone-03 | PASS |
| GET | /api/risk/field/field-001 | PASS |
| GET | /api/alerts | PASS |
| GET | /api/recommendations | PASS |
| GET | /api/reports/prescriptive/zone-03 | PASS |
| GET | /api/field-notebook/zone/zone-03 | PASS |
| POST | /api/vision/analyze | PASS |

---

## Observaciones

- Todos los endpoints respondieron correctamente.
- Todas las respuestas utilizaron el contrato `ApiResponse`.
- No se detectaron errores de tipado ni rutas sin montar.
- El endpoint de visión utiliza actualmente una respuesta simulada (mock) compatible con el AI Service.

---

## Errores Econtrados

No se detectaron errores durante la compilación, el arranque del servidor ni la ejecución del moske Tes.

---

## Correcciones aplicadas

No fue necesario ralizar correciones. Los edpoints y la estrutura del proyecto se mantuvieron estables durante la validación.

## Build

Comando ejecutado:

```bash
npm run build
```

- Ejecutado y Sin errores de tipado


Resultado:
Verificado | 200 | OK | GET  /api/health
Verificado | 200 | OK | GET  /api/crops/profiles
Verificado | 200 | OK | GET  /api/vegetation/indices?fieldId=field-001
Verificado | 200 | OK | GET  /api/analysis/zone/zone-03
Verificado | 200 | OK | GET  /api/risk/field/field-001
Verificado | 200 | OK | GET  /api/alerts
Verificado | 200 | OK | GET  /api/recommendations
Verificado | 200 | OK | GET  /api/reports/prescriptive/zone-03
Verificado | 200 | OK | GET  /api/field-notebook/zone/zone-03
Verificado | 200 | OK | POST /api/vision/analyze
```

Estado del build:

Build completed successfully.

```