import inspectionProgress from "./inspectionProgress";
import { detectEvents } from "../services/eventDetection";

import type {
  Coordinate,
  MappingSimulationData,
  RawRoverStatus,
  RawSimulationData,
  RenderRoverStatus,
  SimulationEvent,
} from "../types/mappingTypes";

class MappingEngineService {
  
/**
* Convierte los datos brutos del backend/simulados en el contrato exacto listo para el frontend.
* Importante:
* - El frontend espera la batería del rover y su estado dentro del rover.
* - El frontend espera el estado en mayúsculas: IDLE | MOVING | SCANNING.
* - El frontend espera el porcentaje de inspección dentro de las estadísticas.
*/
  processSimulationData(data: RawSimulationData): MappingSimulationData {

    const trajectory = data.rover.trajectory;
    // nueva constante -> ruta planificada para el frontend
    const plannedPath = data.rover.plannedPath ?? [];

    // si no hay ruta planificada, usar la trayectoria como ruta
    const lastPoint = trajectory[trajectory.length - 1];

    // posicion actual y el progreso de la inspeccion del terreno
    const currentPosition: Coordinate = lastPoint ? {x: lastPoint.x, y: lastPoint.y} : {x: 0, y: 0};
    const progress =
      inspectionProgress.calculate(
        trajectory.length,
        data.terrain
      );

    /**
    * Los eventos generados por el backend se utilizan como "fuente de verdad" para las entidades detectadas.
    * Los eventos manuales del mock se conservan si existen.
    */
    const generatedEvents =
      detectEvents(
        trajectory,
        data.plants,
        data.obstacles
      );
    
    // si no hay eventos manuales detectados, utilizar los generados por el backend
    const manualEvents = data.events ?? [];
    
    // combina los eventos generados automáticamente con los registrados manualmente
    const events = 
      this.mergeEvents(
          generatedEvents,
          manualEvents
      );
    
    // extrae los IDs únicos de las plantas detectadas filtrando por tipo y eliminando nulos
    const detectedPlantIds = 
      new Set(
        events
          .filter((event) => event.type === "plant_detected")
          .map((event) => event.plantId)
          .filter(Boolean) as string[]
      );
    
    // misma logica que plantas 
    const detectedObstacleIds =
      new Set(
        events
          .filter((event) => event.type === "obstacle_detected")
          .map((event) => event.obstacleId)
          .filter(Boolean) as string[]
      );
    
      const distanceTraveled =
        this.calculateRouteDistance(trajectory);
       
      return {
        terrain: data.terrain,
        rover: {
          position: currentPosition,
          angle: this.getHeadingAngle(trajectory),
          battery: this.clamp(data.status.battery, 0, 100),
          status: this.normalizeStatus(data.status.state),
        },

        trajectory: trajectory.map(({ x, y }) => ({ x, y })),
        plannedPath,

        plants: data.plants.map((plant) => ({
          id: plant.id,
          x: plant.x,
          y: plant.y,
          health: plant.health,
          detected: detectedPlantIds.has(plant.id),
        })),

        obstacles: data.obstacles.map((obstacle) => ({
          id: obstacle.id,
          x: obstacle.x,
          y: obstacle.y,
          size: obstacle.size,
        })),

        stats: {
          plantsDetected: detectedPlantIds.size,
          obstaclesDetected: detectedObstacleIds.size,
          distanceTraveled:
            data.stats?.distanceTraveled ?? distanceTraveled,
          inspectedPercentage: progress.percentage,
        },
        events,
      };
  }

  /** 
    * Convierte los valores de estado del backend/brutos en el contrato visual del frontend.
    * Los estados de carga y error se asignan intencionalmente a IDLE porque el frontend actual solo admite IDLE | MOVING | SCANNING.
  */
  private normalizeStatus(status: RawRoverStatus): RenderRoverStatus {
    const normalized =
      status.toLowerCase();
    if (normalized === "moving") {
      return "MOVING";
    }
    if (normalized === "scanning") {
      return "SCANNING";
    }
    if (normalized === "error") {
      return "ERROR";
    }
    return "IDLE";
  }

  
  /**
  * Calcula el ángulo de dirección del rover a partir de los dos últimos puntos de la trayectoria.
  * El frontend utiliza este valor para rotar el marcador del rover.
  */
  private getHeadingAngle( trajectory: ReadonlyArray<Coordinate>): number {
     // Si no hay al menos 2 puntos, no se puede calcular una dirección
    if (trajectory.length < 2) {
      return 0;
    }

    // Obtiene los últimos dos puntos de la trayectoria
    const previous =
      trajectory[trajectory.length - 2];
    const current =
      trajectory[trajectory.length - 1];

    // Calcula el ángulo en radianes usando la diferencia entre ejes Y y X
    const angleRadians =
      Math.atan2(
        current.y - previous.y,
        current.x - previous.x
      );
    // Convierte el ángulo de radianes a grados (0 a 180 / -180) y lo redondea
    return Math.round(angleRadians * (180 / Math.PI));
  }
  
  /**
  * Calcula la distancia de la ruta desde los puntos XY.
  * Esto mantiene la fiabilidad de las estadísticas incluso si el conjunto de datos simulado contiene valores obsoletos.
  */
  private calculateRouteDistance(trajectory: ReadonlyArray<Coordinate>): number {
    if (trajectory.length < 2) {
      return 0;
    }

    // Recrre todos los puntos sumando la distancia entre cada par consecutivo
    const distance =
      trajectory.reduce((total, point, index) => {
          //el primer punto (índice 0) no tiene un punto anterior con el cual compararse
          if (index === 0) {
            return total;
          }

          // obtiene el punto inmediatamente anterior
          const previous = trajectory[index - 1];
          
          // calcula la línea recta entre el punto anterior y el actual usando Pitágoras , la hipotenusa brou... :O
          return (total + Math.hypot(
              point.x - previous.x,
              point.y - previous.y
            )
          );
          // el conteo de la distancia total inicia en 0
        }, 0
      );
    // Retorna la distancia total final formateada y redondeada a 2 decimales
    return Number(distance.toFixed(2));
  }


  
  /**
  * Combina eventos generados y manuales sin duplicar la misma detección
  */
  private mergeEvents( generatedEvents: SimulationEvent[], manualEvents: SimulationEvent[]): SimulationEvent[] {
    // diccionrio temporal para guardar los eventos usando una clave única de identificación
    const eventMap =
      new Map<string, SimulationEvent>();

    // Junta ambas listas en un solo arreglo y lo recorre evento por evento
    [...generatedEvents, ...manualEvents].forEach((event) => {
        // crea una "huella digital" del evento uniendo sus propiedades con dos puntos ":"
        const key =
          [
            event.type,
            event.step,
            event.plantId ?? "",
            event.obstacleId ?? "",
          ].join(":");
        
        // guarda el evento en el mapa, si la clave ya existe, sobrescribe el viejo 
        eventMap.set(key, event);
    });

    // convierte el mapa de nuevo a un arreglo y lo ordena del evento más antiguo al más reciente
    return [...eventMap.values()].sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  /** 
  * Restringe un valor a un rango mínimo y máximo.
  */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

}

export default new MappingEngineService();