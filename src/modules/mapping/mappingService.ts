import fs from 'fs';
import path from 'path';


//nueva clase xd
export class SimulationService {
    //obteniendo el json
    getSimulation() {
        const mockPath = path.join(__dirname,'../data/roverSimulationMock.json');
        const fileContent = fs.readFileSync(mockPath, 'utf-8');
        const rawData = JSON.parse(fileContent);//convierte el text en json
        return {//retorna un objeto con los datos timestamp y stepindex
            ...rawData,
            stepIndex: 0
        };
    }
}