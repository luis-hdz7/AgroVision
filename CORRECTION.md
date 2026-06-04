# CORRECTION.md

# Corrección Backend — AgroVision Mapping 2D

## Objetivo

Alinear el backend del módulo **Mapping 2D** con el contrato que necesita el frontend final.

```text
Backend procesa datos → entrega contrato listo → Frontend renderiza sin parches raros
```

---

## Problemas corregidos

### 1. Error de build

El backend fallaba con:

```text
prisma.config.ts is not under rootDir src
```

Se corrigió en:

```text
tsconfig.json
```

### 2. Contrato backend/frontend desalineado

Antes el backend devolvía datos separados:

```text
status.battery
status.state
inspectionProgress.percentage
plants.health
```

Pero el frontend necesita:

```text
rover.battery
rover.status
stats.inspectedPercentage
plants.detected
```

Ahora el backend adapta los datos antes de responder.

### 3. Endpoint faltante

Se agregó:

```text
GET /api/mapping/summary
```

---

## Archivos modificados

| Archivo                                              | Qué se corrigió                                                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `tsconfig.json`                                      | Se limitó la compilación a `src/**/*.ts`, se excluyó Prisma config y se habilitó importar JSON. |
| `src/modules/mapping/mappingTypes.ts`                | Se definió el contrato final entre backend y frontend.                                          |
| `src/modules/mapping/engine/mappingEngineService.ts` | Se convirtió el mock/backend raw en datos listos para frontend.                                 |
| `src/services/eventDetection.ts`                     | Se agregó detección de plantas y obstáculos por cercanía al rover.                              |
| `src/services/playBackService.ts`                    | Se mejoró el playback con frames, posición, ángulo y eventos.                                   |
| `src/modules/mapping/mappingController.ts`           | `/simulation` ahora devuelve datos compatibles con frontend.                                    |
| `src/modules/mapping/playbackController.ts`          | `/playback` ahora usa los datos procesados por el engine.                                       |
| `src/modules/mapping/summaryController.ts`           | Nuevo endpoint para resumen final de la simulación.                                             |
| `src/modules/mapping/mappingRoutes.ts`               | Se registraron `/simulation`, `/playback` y `/summary`.                                         |
| `src/modules/mapping/mappingService.ts`              | Se documentó como capa temporal de acceso al mock.                                              |
| `src/data/roverSimulationMock.json`                  | Dataset ampliado para probar mejor trayectoria, plantas, obstáculos y detecciones.              |

---

## Contrato final esperado

El endpoint principal:

```text
GET /api/mapping/simulation
```

debe responder así:

```ts
{
  success: true,
  data: {
    terrain,
    rover: {
      position,
      angle,
      battery,
      status
    },
    trajectory,
    plannedPath,
    plants,
    obstacles,
    stats: {
      plantsDetected,
      obstaclesDetected,
      distanceTraveled,
      inspectedPercentage
    },
    events
  }
}
```

---

## Endpoints finales

```text
GET /api/mapping/simulation
GET /api/mapping/playback
GET /api/mapping/summary
```

---

## Responsabilidad de cada parte

### Backend 1

Mantener actualizado:

```text
src/data/roverSimulationMock.json
```

Debe contener una ruta suficiente, plantas, obstáculos y datos útiles para demo.

### Backend 2

Revisar lógica de procesamiento:

```text
mappingEngineService.ts
eventDetection.ts
inspectionProgress.ts
```

Debe validar que detecciones, progreso, distancia y ángulo tengan sentido.

### Backend 3

Revisar API:

```text
mappingRoutes.ts
mappingController.ts
playbackController.ts
summaryController.ts
```

Debe validar endpoints, respuestas y errores.

### Frontend

Consumir principalmente:

```text
GET /api/mapping/simulation
```

Recordatorio:

```ts
const payload = await response.json();
return payload.data;
```

La respuesta viene envuelta en:

```ts
{
  (success, data);
}
```

---

## Validación rápida

Ejecutar:

```bash
npm install
npm run build
npm run dev
```

Probar:

```text
http://localhost:3000/api/mapping/simulation
http://localhost:3000/api/mapping/playback
http://localhost:3000/api/mapping/summary
```

---

## Resumen corto

Se corrigió el backend para que compile, entregue datos compatibles con el frontend, genere eventos de detección, exponga playback y agregue un resumen final del módulo Mapping 2D.
