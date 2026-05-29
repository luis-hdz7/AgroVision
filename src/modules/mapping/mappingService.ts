import {SimulationData} from './mappingTypes';
import roverSimulationMock from '../../data/roverSimulationMock.json';


//nueva clase xd
export class SimulationService {
    //obteniendo el json
    get Simulation(): SimulationData {
        return roverSimulationMock as unknown as SimulationData;
    }
}