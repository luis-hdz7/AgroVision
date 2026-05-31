import tr from "zod/v4/locales/tr.js";
import type {
  Plant,
  Obstacle,
  RoverPosition,
  SimulationEvent,
} from "../modules/mapping/mappingTypes";

function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(
    (x2 - x1) ** 2 +
    (y2 - y1) ** 2
  );
}

const DETECTION_RADIUS = 5;

export function detectEvents(
  trajectory: RoverPosition[],
  plants: Plant[],
  obstacles: Obstacle[]
): SimulationEvent[] {

  const events: SimulationEvent[] = [];

  const detectedPlants = new Set<string>();
  const detectedObstacles = new Set<string>();
//ordenando el timelap para playback
  const sortedTrayectory = [...trajectory].sort((a, b) => a.timestamp - b.timestamp);


  sortedTrayectory.forEach((point) => {

    plants.forEach((plant) => {

      const distance = calculateDistance(
        point.x,
        point.y,
        plant.x,
        plant.y
      );

      if (
        distance <= DETECTION_RADIUS &&
        !detectedPlants.has(plant.id)
      ) {

        detectedPlants.add(plant.id);

        events.push({
          type: "plant_detected",
          message: "Plant detected",
          timestamp: point.timestamp,
          plantId: plant.id,
          x: plant.x,
          y: plant.y
        });
      }
    });

    obstacles.forEach((obstacle) => {

      const distance = calculateDistance(
        point.x,
        point.y,
        obstacle.x,
        obstacle.y
      );

      if (
        distance <= DETECTION_RADIUS &&
        !detectedObstacles.has(obstacle.id)
      ) {

        detectedObstacles.add(obstacle.id);

        events.push({
          type: "obstacle_detected",
          message: "Obstacle detected",
          timestamp: point.timestamp,
          obstacleId: obstacle.id,
          x: point.x,
          y: point.y
        });
      }
    });

  });

  return events.sort((a, b) => a.timestamp - b.timestamp);
}