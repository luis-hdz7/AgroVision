import inspectionProgress from "./inspectionProgress";
import { detectEvents } from "../../../services/eventDetection";
import {
  validateBattery,
  validateStats,
} from "../../../services/validation";

import {
  RawSimulationData,
  SimulationData,
} from "../mappingTypes";

class MappingEngineService {
  processSimulationData(
    data: RawSimulationData
  ): SimulationData {

    const trajectory =
      data.rover.trajectory;

    const lastPoint =
      trajectory[trajectory.length - 1];

    const progress =
      inspectionProgress.calculate(
        trajectory.length,
        data.terrain
      );

    const detectedEvents =
      detectEvents(
        trajectory,
        data.plants,
        data.obstacles
      );

    const batteryValid =
      validateBattery(
        data.status.battery
      );

    const statsValid =
      validateStats(
        data.plants,
        data.obstacles,
        data.stats.plantsDetected,
        data.stats.obstaclesDetected
      );

    if (!batteryValid) {
      console.warn(
        "[MappingEngine] Invalid battery value:",
        data.status.battery
      );
    }

    if (!statsValid) {
      console.warn(
        "[MappingEngine] Invalid simulation stats"
      );
    }

    return {
      terrain: data.terrain,

      rover: {
        position: lastPoint
          ? {
              x: lastPoint.x,
              y: lastPoint.y,
            }
          : {
              x: 0,
              y: 0,
            },

        trajectory,
      },

      status: data.status,

      plants: data.plants,

      obstacles: data.obstacles,

      stats: {
        ...data.stats,

        plantsDetected:
          data.plants.length,

        obstaclesDetected:
          data.obstacles.length,
      },

      inspectionProgress: progress,

      events: detectedEvents,
    };
  }
}

export default new MappingEngineService();