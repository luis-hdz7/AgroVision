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
// Rover
// =========================

export interface RoverPosition extends Coordinate {
  readonly timestamp: number
}

export type RawRoverStatus =
  | "idle"
  | "moving"
  | "scanning"
  | "charging"
  | "error"
  | "IDLE"
  | "MOVING"
  | "SCANNING"
  | "CHARGING"
  | "ERROR" ;

export interface RoverState {
  readonly battery: number
  readonly state: RawRoverStatus
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

export interface RawSimulationStats {
  readonly plantsDetected?: number
  readonly obstaclesDetected?: number
  readonly distanceTraveled?: number
}

// =========================
// Raw Simulation Data
// =========================
export interface RawSimulationData {
  readonly terrain: TerrainDimensions;

  readonly rover: {
    readonly trajectory: RoverPosition[];

/**
  * Ruta planificada opcional para la reproducción del frontend.
  * Si no se especifica, el frontend puede usar la trayectoria como única ruta.
*/
    readonly plannedPath?: Coordinate[];
  };
  readonly status: RoverState;
  readonly plants: Plant[];
  readonly obstacles: Obstacle[];
  readonly stats?: RawSimulationStats;

/**
  * Los eventos manuales son opcionales, ya que el backend puede generar eventos de detección
  * a partir de la proximidad de la trayectoria mediante eventDetection.ts.
*/
  readonly events?: SimulationEvent[];
}


// =========================
// Frontend-compatible output
// =========================

export type RenderRoverStatus = 'IDLE' | 'MOVING' | 'SCANNING' | 'ERROR';

export interface RenderRover {
  readonly position: Coordinate;
  readonly angle: number;
  readonly battery: number;
  readonly status: RenderRoverStatus;
}

export interface RenderPlant extends Coordinate {
  readonly id: string;
  readonly detected: boolean;
  readonly health?: PlantHealth;

}

export interface RenderObstacle extends Coordinate {
  readonly id: string;
  readonly size: number;
}

export interface RenderStats {
  readonly plantsDetected: number;
  readonly obstaclesDetected: number;
  readonly distanceTraveled: number;
  readonly inspectedPercentage: number;
}

export interface InspectionProgress {
  readonly percentage: number;
  readonly inspectedArea: number;
  readonly totalArea: number;
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
  readonly step: number;

  readonly plantId?: string;
  readonly obstacleId?: string;

  readonly x?: number;
  readonly y?: number;
}

// =========================
// Render Simulation Data
// =========================
export interface MappingSimulationData {
  readonly terrain: TerrainDimensions;
  readonly rover: RenderRover;

  readonly trajectory: Coordinate[];
  readonly plannedPath: Coordinate[];

  readonly plants: RenderPlant[];
  readonly obstacles: RenderObstacle[];

  readonly stats: RenderStats;

  readonly events: SimulationEvent[];
}

// =========================
// Playback Frame Data
// =========================
export interface PlaybackFrame {
  readonly step: number;
  readonly rover: Coordinate;
  readonly angle: number;
  readonly events: SimulationEvent[];
}

export interface MappingPlaybackData {
  readonly frames: PlaybackFrame[];
}

export interface MappingSummaryData {
  readonly plantsDetected: number;
  readonly obstaclesDetected: number;
  readonly distanceTraveled: number;
  readonly inspectedPercentage: number;
  readonly finalRoverPosition: Coordinate;
  readonly finalRoverStatus: RenderRoverStatus;
  readonly battery: number;
  readonly totalEvents: number;
}






// =========================
// Inspection Progress
// =========================

// export interface InspectionProgress {
//   readonly percentage: number
//   readonly inspectedArea: number
//   readonly totalArea: number
// }

// =========================
// Summary Data
// =========================
