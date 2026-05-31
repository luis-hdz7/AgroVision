import { RawSimulationData } from "./mappingTypes";
import roverSimulationMock from "../../data/roverSimulationMock.json";

export class SimulationService {
  getSimulation(): RawSimulationData {
    return roverSimulationMock as RawSimulationData;
  }
}