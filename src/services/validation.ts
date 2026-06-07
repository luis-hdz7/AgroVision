import type { Plant, Obstacle } from "../modules/mapping/mappingTypes";

export function validateBattery(
  battery: number
): boolean {
  return battery >= 0 && battery <= 100;
}

export function validateStats(
  plants: Plant[],
  obstacles: Obstacle[],
  plantsDetected: number,
  obstaclesDetected: number
): boolean {
  return (
    plants.length === plantsDetected &&
    obstacles.length === obstaclesDetected
  );
}