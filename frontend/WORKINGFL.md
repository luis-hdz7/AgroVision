# Flujo de tarbajo entre backend 1, 2, 3

### Backend 1 **_(Datos simulados)_**

[**Debe entregar**]
SimulationData{}
`      -terrain
       -rover.trajectory
       -rover.state
       -plants
       -obstacles
       -stats
       -events
`

[**Que no debe hacer**]
NO debe normalizar coordenadas

[**Que archivos toca**]

> data/roverSimulationMock.json
> modules/mapping/simulationService.ts
> modules/mapping/mappingTypes.ts solo si necesita agregar datos crudos

---

### Backend 2 **_(MappingEngine)_**

[Recibe] -> SimulationData{}
[**Debe entregar**]
RenderSimulationData[]
`      -normalizar coordenadas
       -invertir eje Y
       -calcular progreso
       -procesar eventos
       -preparar datos para render
`

[**Que no debe hacer**]
NO crea datos simulados y NO crea endpoints principales.

[**Que archivos toca**]

> modules/mapping/engine/coordinateMapper.ts
> modules/mapping/engine/eventProcessor.ts
> modules/mapping/engine/inspectionProgress.ts
> modules/mapping/engine/mappingEngineService.ts
> modules/mapping/mappingTypes.ts solo para tipos de salida renderizada

---

### Backend 3 **_(API-expone los datos)_**

[Recibe] -> RenderSimulationData[]
[**Debe entregar**]
`      GET /api/mapping/simulation
       GET /api/mapping/playback
       GET /api/mapping/summary
    `

[**Que no debe hacer**]
NO debe meterse en lógica de normalización.

[**Que archivos toca**]

> modules/mapping/mappingController.ts
> modules/mapping/mappingRoutes.ts
> modules/mapping/mappingSchema.ts
> modules/mapping/mappingService.ts

---

# Como se conectan con frontend y backend

## Flujo de trabajo

graph TD - Backend 1
simulation.service.ts
roverSimulationMock.json
            ↓

> [!Expone datos por API al frontend]

    - Backend 2
    mappingEngineService.ts
    coordinateMapper.ts
    inspectionProgress.ts
    eventProcessor.ts
            ↓

> [!Convierte a RenderSimulationData]

    - Backend 3
    mappingController.ts
    mappingRoutes.ts
            ↓

> [!Expone datos por API al frontend]
