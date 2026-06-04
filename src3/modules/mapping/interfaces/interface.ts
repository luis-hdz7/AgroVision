export interface Position {
  x: number;
  y: number;
}

export interface TrajectoryPoint extends Position {
  timestamp: number;
}

export interface Terrain {
  width: number;
  height: number;
}

export interface Plant {
  id: string;
  x: number;
  y: number;
  health: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  size: number;
}

export interface RoverStatus {
  battery: number;
  state: string;
}

export interface InspectionStats {
  plantsDetected: number;
  obstaclesDetected: number;
  distanceTraveled: number;
}

export interface RoverEvent {
  message: string;
  timestamp: number;
  plantId?: string;
}

export interface FullMappingResponse {
  terrain: Terrain;
  rover: {
    trajectory: TrajectoryPoint[];
  };
  plants: Plant[];
  obstacles: Obstacle[];
  status: RoverStatus;
  stats: InspectionStats;
  events: RoverEvent[];
}