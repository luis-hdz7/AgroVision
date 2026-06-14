import tr from "zod/v4/locales/tr.js";
import type {
  Obstacle,
  Plant,
  RoverPosition,
  SimulationEvent,
} from "../types/mappingTypes";

/** 
  * Radio de detección en unidades de mapa.

  * Se ha aumentado el radio, que era muy pequeño, para que la demostración sea fiable con conjuntos de datos simulados.
  * Si el rover pasa a una distancia razonable de una planta u obstáculo, el
  * backend generará un evento de detección.
*/
const DETECTION_RADIUS = 15;

// funcion matemática auxiliar para calcular la distancia en línea recta entre dos coordenadas
function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.hypot(
    x2 - x1,
    y2 - y1
  );
}

/**
  * Genera eventos de detección comparando los puntos de la trayectoria del rover con plantas y obstaculos
  * Cada planta/obstáculo se emite solo una vez para evitar detecciones duplicadas.
*/
export function detectEvents(
  trajectory: ReadonlyArray<RoverPosition>,
  plants: ReadonlyArray<Plant>,
  obstacles: ReadonlyArray<Obstacle>
): SimulationEvent[] {
  // Lista donde se guardaran todos los eventos que se vayan descubriendo
  const events: SimulationEvent[] = [];

  // conjuntos de memoria para recordar qué IDs ya descubrimos y no volverlos a reportar 
  const detectedPlants =
    new Set<string>();

  const detectedObstacles =
    new Set<string>();

  // Recorre la trayectoria del rover, punto por punto.
  trajectory.forEach((point, index) => {
      // paso actual de la simulación, por convención empieza en 1
      const step = index + 1;

      // --- SECCIÓN: DETECCIÓN DE PLANTAS ---
      // en el punto actal del rover, revisa todas las plantas del mapa una por una
      plants.forEach((plant) => {

        // calcula la distancia entre el rover y la planta actual
        const distance =
          calculateDistance(
            point.x,
            point.y,
            plant.x,
            plant.y
          );

         // si está cerca (dentro del rango de escaneo)y no la habíamos detectado antes en el recorrido
        if (
          distance <= DETECTION_RADIUS &&
          !detectedPlants.has(plant.id)
        ) {
          // Guarda el ID en la memoria para ignorarla en los siguientes puntos
          detectedPlants.add(plant.id);
          // agrega el nuevo evento de planta detectada a la lista
          events.push({
            type: "plant_detected",
            message: "Plant detected",
            timestamp: point.timestamp,
            step,
            plantId: plant.id,
            x: plant.x,
            y: plant.y,
          });
        }
      });

      // --- SECCIÓN: DETECCIÓN DE OBSTÁCULOS ---
      // En este mismo punto del rover, revisa todos los obstáculos del mapa uno por uno
      obstacles.forEach((obstacle) => {
        // misma logica que para las plantas
        const distance =
          calculateDistance(
            point.x,
            point.y,
            obstacle.x,
            obstacle.y
          );
        // misma logica
        if (
          distance <= DETECTION_RADIUS &&
          !detectedObstacles.has(obstacle.id)
        ) {
          detectedObstacles.add(obstacle.id);
          //misma logica
          events.push({
            type: "obstacle_detected",
            message: "Obstacle detected",
            timestamp: point.timestamp,
            step,
            obstacleId: obstacle.id,
            x: obstacle.x,
            y: obstacle.y,
          });
        }
      });
  });

  // ordena los eventos por tiempo del mas antiguo al más reciente por timestamp
  return events.sort(
    (a, b) => a.timestamp - b.timestamp
  );
}
