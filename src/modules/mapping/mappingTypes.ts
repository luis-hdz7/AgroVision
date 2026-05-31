/**
 * =========================================
 * Mapping Module Types
 * =========================================
 */

// =========================
// Base Coordinates
// =========================

export interface Coordinate {
  readonly x: number
  readonly y: number
}

// =========================
// Terrain
// =========================

export interface TerrainDimensions {
  readonly width: number
  readonly height: number
}

// =========================
// Canvas
// =========================

export interface CanvasConfig {
  readonly width: number
  readonly height: number
}

// =========================
// Rover
// =========================

export interface RoverPosition extends Coordinate {
  readonly timestamp: number
}

type RoverStatus =
  | "idle"
  | "moving"
  | "scanning"
  | "charging"
  | "error";
export interface RoverState {
  readonly battery: number
  readonly state: RoverStatus
}

export interface Rover {
  readonly position: Coordinate
  readonly trajectory: RoverPosition[]
}

// =========================
// Terrain Objects
// =========================

export type PlantHealth =
  | "good"
  | "warning"
  | "critical"

export interface Plant extends Coordinate {
  readonly id: string
  readonly health: PlantHealth
}

export interface Obstacle extends Coordinate {
  readonly id: string
  readonly size: number
}

// =========================
// Statistics
// =========================

export interface SimulationStats {
  readonly plantsDetected: number
  readonly obstaclesDetected: number
  readonly distanceTraveled: number
}

// =========================
// Inspection Progress
// =========================

export interface InspectionProgress {
  readonly percentage: number
  readonly inspectedArea: number
  readonly totalArea: number
}

// =========================
// Events
// =========================

export interface SimulationEvent {
  readonly type:
    | "plant_detected"
    | "obstacle_detected";

  readonly message: string;
  readonly timestamp: number;

  readonly plantId?: string;
  readonly obstacleId?: string;

  readonly x?: number;
  readonly y?: number;
}
// =========================
// Simulation Data
// =========================

export interface SimulationData {
  readonly terrain: TerrainDimensions

  readonly rover: Rover

  readonly status: RoverState

  readonly plants: Plant[]

  readonly obstacles: Obstacle[]

  readonly stats: SimulationStats

  readonly inspectionProgress: InspectionProgress

  readonly events: SimulationEvent[]
}

// =========================
// Raw Simulation Data
// =========================

export interface RawSimulationData {
  readonly terrain: TerrainDimensions

  readonly rover: {
    readonly trajectory: RoverPosition[]
  }

  readonly status: RoverState

  readonly plants: Plant[]

  readonly obstacles: Obstacle[]

  readonly stats: SimulationStats

  readonly events: SimulationEvent[]
}