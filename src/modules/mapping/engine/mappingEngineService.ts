import inspectionProgress from "./inspectionProgress";
import { SimulationData } from "../mappingTypes";

class MappingEngineService {
  processSimulationData(data: SimulationData) {
    const trajectory = data.rover.trajectory;

    const lastPoint =
      trajectory[trajectory.length - 1];

    const progress =
      inspectionProgress.calculate(
        trajectory.length,
        data.terrain
      );

    return {
      ...data,

      rover: {
        position: {
          x: lastPoint.x,
          y: lastPoint.y
        },
        trajectory
      },

      stats: {
        ...data.stats,
        plantsDetected: data.plants.length,
        obstaclesDetected: data.obstacles.length
      },

      inspectionProgress: progress
    };
  }
}

export default new MappingEngineService();

