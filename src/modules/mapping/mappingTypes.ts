/**
 * =========================================
 * Mapping Module Types
 * =========================================
 * Interfaces y tipos principales para:
 * - coordenadas
 * - simulación
 * - rover
 * - eventos
 * - renderizado
 * - payloads API
 * =========================================
 */

// =========================
// Base Coordinates
// =========================

/**
 * Coordenada base utilizada
 * en el sistema de mapping.
 */
export interface Coordinate {
  readonly x: number
  readonly y: number
}

// =========================
// Terrain
// =========================

/**
 * Dimensiones reales del terreno.
 */
export interface TerrainDimensions {
  readonly width: number
  readonly height: number
}

// =========================
// Canvas
// =========================

/**
 * Configuración del canvas/SVG.
 */
export interface CanvasConfig {
  readonly width: number
  readonly height: number
}

// =========================
// Rover
// =========================

/**
 * Posición del rover
 * dentro de la trayectoria.
 */
export interface RoverPosition
  extends Coordinate {
  readonly timestamp: number
}

/**
 * Estados posibles del rover.
 */
export type RoverStatus =
  | "IDLE"
  | "MOVING"
  | "SCANNING"

/**
 * Estado actual del rover.
 */
export interface RoverState {
  readonly battery: number
  readonly status: RoverStatus
}

// =========================
// Terrain Objects
// =========================

/**
 * Planta detectada en el terreno.
 */
export interface Plant
  extends Coordinate {
  readonly id: string
  readonly detected: boolean
}

/**
 * Obstáculo detectado.
 */
export interface Obstacle
  extends Coordinate {
  readonly id: string
  readonly size: number
}

// =========================
// Statistics
// =========================

/**
 * Estadísticas generales
 * de la simulación.
 */
export interface SimulationStats {
  readonly plantsDetected: number
  readonly obstaclesDetected: number
  readonly distanceTraveled: number
}

// =========================
// Events
// =========================

/**
 * Base común para eventos.
 */
export interface BaseEvent {
  readonly timestamp: number
}

/**
 * Eventos posibles
 * durante la simulación.
 */
export type SimulationEvent =
  | (BaseEvent & {
      type: "MOVE"
      position: RoverPosition
    })

  | (BaseEvent & {
      type: "PLANT_DETECTED"
      plantId: string
    })

  | (BaseEvent & {
      type: "OBSTACLE_DETECTED"
      obstacleId: string
    })

// =========================
// Simulation Data
// =========================

/**
 * Estructura principal
 * de la simulación.
 */
export interface SimulationData {
  readonly terrain: TerrainDimensions

  readonly rover: {
    trajectory: RoverPosition[]
    state: RoverState
  }

  readonly plants: Plant[]

  readonly obstacles: Obstacle[]

  readonly stats: SimulationStats

  readonly events: SimulationEvent[]
}