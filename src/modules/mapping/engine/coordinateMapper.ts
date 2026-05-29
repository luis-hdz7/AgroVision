import {
  Coordinate,
  RoverPosition,
  Plant,
  Obstacle,
} from "../mappingTypes"

// =========================
// Normalize Options
// =========================

export interface NormalizeOptions {
  terrainWidth: number
  terrainHeight: number
  canvasWidth: number
  canvasHeight: number
}

// =========================
// Normalized Simulation Data
// =========================

export interface NormalizedSimulationData {
  trajectory: RoverPosition[]
  plants: Plant[]
  obstacles: Obstacle[]
}

// =========================
// Normalize Coordinate
// =========================

export function normalizeCoordinate(
  coordinate: Coordinate,
  options: NormalizeOptions
): Coordinate {
  if (
    options.terrainWidth === 0 ||
    options.terrainHeight === 0
  ) {
    throw new Error("Terrain dimensions cannot be zero")
  }

  const normalizedX =
    (coordinate.x / options.terrainWidth) *
    options.canvasWidth

  const normalizedY =
    (coordinate.y / options.terrainHeight) *
    options.canvasHeight

  return {
    x: normalizedX,
    y: normalizedY,
  }
}

// =========================
// Invert Y Coordinate
// =========================

export function invertYCoordinate(
  y: number,
  canvasHeight: number
): number {
  return canvasHeight - y
}

// =========================
// Normalize + Invert Coordinate
// =========================

export function normalizeAndInvertCoordinate(
  coordinate: Coordinate,
  options: NormalizeOptions
): Coordinate {
  const normalized = normalizeCoordinate(
    coordinate,
    options
  )

  return {
    x: normalized.x,
    y: invertYCoordinate(
      normalized.y,
      options.canvasHeight
    ),
  }
}

// =========================
// Normalize Trajectory
// =========================

export function normalizeTrajectory(
  trajectory: RoverPosition[],
  options: NormalizeOptions
): RoverPosition[] {
  return trajectory.map((point) => {
    const normalized =
      normalizeAndInvertCoordinate(
        point,
        options
      )

    return {
      ...point,
      x: normalized.x,
      y: normalized.y,
    }
  })
}

// =========================
// Normalize Plants
// =========================

export function normalizePlants(
  plants: Plant[],
  options: NormalizeOptions
): Plant[] {
  return plants.map((plant) => {
    const normalized =
      normalizeAndInvertCoordinate(
        plant,
        options
      )

    return {
      ...plant,
      x: normalized.x,
      y: normalized.y,
    }
  })
}

// =========================
// Normalize Obstacles
// =========================

export function normalizeObstacles(
  obstacles: Obstacle[],
  options: NormalizeOptions
): Obstacle[] {
  return obstacles.map((obstacle) => {
    const normalized =
      normalizeAndInvertCoordinate(
        obstacle,
        options
      )

    return {
      ...obstacle,
      x: normalized.x,
      y: normalized.y,
    }
  })
}

// =========================
// Normalize Simulation Data
// =========================

export function normalizeSimulationData(
  trajectory: RoverPosition[],
  plants: Plant[],
  obstacles: Obstacle[],
  options: NormalizeOptions
): NormalizedSimulationData {
  return {
    trajectory: normalizeTrajectory(
      trajectory,
      options
    ),

    plants: normalizePlants(
      plants,
      options
    ),

    obstacles: normalizeObstacles(
      obstacles,
      options
    ),
  }
}