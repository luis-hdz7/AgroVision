import { RawSimulationData } from '../types/mappingTypes';
import roverSimulationMock from '../../../data/mocks/roverSimulationMock.json';

export class SimulationService {
  getSimulation(): RawSimulationData {
    return roverSimulationMock as RawSimulationData;
  }
}
