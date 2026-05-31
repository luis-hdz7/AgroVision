import inspectionProgress from "./inspectionProgress";

import {
  RawSimulationData,
  SimulationData
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

    return {
      terrain: data.terrain,

      rover: {
        position: lastPoint
          ? {
              x: lastPoint.x,
              y: lastPoint.y
            }
          : {
              x: 0,
              y: 0
            },

        trajectory
      },

      status: data.status,

      plants: data.plants,

      obstacles: data.obstacles,

      stats: {
        ...data.stats,

        plantsDetected:
          data.plants.length,

        obstaclesDetected:
          data.obstacles.length
      },

      inspectionProgress: progress,

      events: data.events
    };
  }
}

export default new MappingEngineService();