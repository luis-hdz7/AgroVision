//Apartado de procesamiento de solicitud.
import { processMappingEngine } from '../../../services/mappingEngine.service/service.js';
export const getMappingSimulation = async (req, res) => {
    try {
        //Aqui se obtienen los datos simulados del rover
        const rawData = processMappingEngine();
        //Se estructura la respuesta incluyendo datos del rover
        const responseData = {
            terrain: rawData.terrain,
            rover: {
                trajectory: rawData.rover.trajectory
            },
            plants: rawData.plants,
            obstacles: rawData.obstacles,
            status: rawData.status,
            stats: rawData.stats,
            events: rawData.events
        };
        //envia la respuesta
        res.status(200).json({
            success: true,
            data: responseData
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};
