//Trabajo a realizar
/*Frontend 1	UI / Pantalla	MappingPage, paneles, controles, resumen final, responsive.	Consume summary y estado visual. Coordina con Frontend 2 para ubicar el render dentro de la pantalla.
Frontend 2	Render 2D	SVG del terreno, rover, trayectoria, plantas, obstáculos y playback.	Consume datos normalizados de Backend 3. Coordina con Backend 2 por coordenadas.
Backend 1	Datos simulados	Mock JSON, timeline, datos de batería, plantas y obstáculos.	Entrega dataset a Backend 2 y Backend 3.
Backend 2	Mapping Engine	Normalización de coordenadas, progreso, eventos y lógica de render.	Recibe mock de Backend 1 y entrega payload procesado a Backend 3.
Backend 3	API / Integración	Routes, controller, schemas, endpoints y documentación Postman.	Entrega contrato API a Frontend 1 y Frontend 2.*/

/*Día 1 — Base del módulo
Objetivo: definir datos, contrato API y estructura visual. Al final del día debe existir una base estable para trabajar sin pisarse.

Bloque	Dev	Módulo a trabajar	Tarea	Entregable
1 · 2h30	Frontend 1	MappingPage	Diseñar layout base de pantalla.	Estructura visual sin lógica.
1 · 2h30	Frontend 2	TerrainCanvas	Definir SVG/canvas base del terreno.	Plano vacío con grid.
1 · 2h30	Backend 1	simulation-data	Crear dataset simulado.	roverSimulation.mock.json.
1 · 2h30	Backend 2	mapping-engine	Definir estructura de coordenadas 2D.	Tipos/base lógica.
1 · 2h30	Backend 3	terrain.routes	Definir contrato API.	Endpoints documentados.
2 · 2h30	Frontend 1	MappingStatsPanel	Crear panel lateral/resumen.	Cards: batería, plantas, obstáculos.
2 · 2h30	Frontend 2	MapLegend	Crear leyenda visual.	Colores e iconos definidos.
2 · 2h30	Backend 1	seed simulation	Completar datos simulados.	Trayectoria, plantas, obstáculos.
2 · 2h30	Backend 2	coordinateMapper	Crear función de normalización.	Coordenadas listas para render.
2 · 2h30	Backend 3	API response format	Estandarizar respuesta JSON.	Contrato listo para frontend.

Entregable del Día 1
• Pantalla base creada.
• Plano 2D vacío creado.
• Dataset simulado listo.
• Contrato API definido.
• Estructura de coordenadas acordada.
*/


//*Crear las interfaces y tipos necesarios para el módulo de Mapping, incluyendo datos de simulación, coordenadas, eventos y payloads para la API.*/
export interface Coordinate {
    x: number
    y: number
}
//esta se usara para normalizacion
export interface TerrainDimensions {
    width: number
    height: number
}
export interface RoverPosition extends Coordinate {
    timestamp: number
}
export interface Plant extends Coordinate {
    id: string
    detected: boolean
}
export interface Obstacle extends Coordinate {
    id: string
    size: number
}
export interface RoverState {
    battery: number
    status: "IDLE" | "MOVING" | "SCANNING"
}
export interface SimulationStats {
    plantsDetected: number
    obstaclesDetected: number
    distanceTraveled: number
}
export type SimulationEvent =
  | {
      type: "MOVE"
      position: RoverPosition
    }
  | {
      type: "PLANT_DETECTED"
      plantId: string
      timestamp: number
    }
  | {
      type: "OBSTACLE_DETECTED"
      obstacleId: string
      timestamp: number
    }
export interface SimulationData {
    terrain: TerrainDimensions
    rover: {
        trajectory: RoverPosition[]
        state: RoverState
    }
    plants: Plant[]
    obstacles: Obstacle[]
    stats: SimulationStats
    events: SimulationEvent[]
}
export interface NormalizedCoordinate {
    x: number
    y: number
}
export interface CanvasConfig {
    width: number
    height: number
}


