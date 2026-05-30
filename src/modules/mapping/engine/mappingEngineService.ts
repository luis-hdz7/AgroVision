import inspectionProgress from "./inspectionProgress";
import { SimulationData } from "../mappingTypes";

class MappingEngineService {
  processSimulationData(data: SimulationData) {
    return {
      ...data,
      inspectionProgress: inspectionProgress.calculate(
        data.rover.trajectory.length,
        data.terrain
      )
    };
  }
}

export default new MappingEngineService();