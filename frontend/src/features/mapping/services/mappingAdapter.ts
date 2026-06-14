//filtro de seguridad entre datos externos y el render.
//Aunque el backend mande un punto fuera de rango, el adapter lo corrige.

/**
 * =========================================
 * Mapping Adapter
 * =========================================
 
 * Capa de protección entre los datos externos y los componentes visuales.

 * Su responsabilidad:
 * - evitar coordenadas fuera de rango;
 * - mantener el contrato del render;
 * - evitar que cambios del backend rompan el SVG.
 * =========================================
*/

import type { RenderPoint, RenderRover, RenderPlant, RenderObstacle, RenderSimulationData} from '../types/mappingRender.types';


/**
 * Adapta y sanitiza los datos del mapping.

 * Por ahora recibe RenderSimulationData directamente.
 * Más adelante puede recibir la respuesta real del backend y transformarla aquí.
*/
export function adaptMappingData(data: RenderSimulationData): RenderSimulationData {
    return {
        rover: adaptRover(data.rover),
        trayectory: data.trayectory.map(limitPoint),
        plannedPath: data.plannedPath?.map(limitPoint),
        obstacles: data.obstacles.map(adaptObstacle),
        plants: data.plants.map(adaptPlant),
        stats: data.stats
    }
}

/*
 * Sanitiza la posición del rover.
*/
function adaptRover(rover: RenderRover): RenderRover {
  return {
    ...rover,
    position: limitPoint(rover.position),
    battery: clamp(rover.battery, 0, 100),
  };
}

/*
 * Sanitiza una planta.
 */
function adaptPlant(plant: RenderPlant): RenderPlant {
  const point = limitPoint(plant);

  return {
    ...plant,
    x: point.x,
    y: point.y,
  };
}

/*
 * Sanitiza un obstáculo.
 */
function adaptObstacle(obstacle: RenderObstacle): RenderObstacle {
  const point = limitPoint(obstacle);

  return {
    ...obstacle,
    x: point.x,
    y: point.y,
    size: clamp(obstacle.size, 1, 10),
  };
}

/*
 * Limita una coordenada al rango visual permitido.
 * El SVG trabaja con viewBox 0 0 100 100, por eso ningún punto debe salir de 0–100.
 */
function limitPoint(point: RenderPoint): RenderPoint {
  return {
    x: clamp(point.x, 0, 100),
    y: clamp(point.y, 0, 100),
  };
}

/*
 * Fuerza un número a mantenerse dentro de un rango.
*/
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}


