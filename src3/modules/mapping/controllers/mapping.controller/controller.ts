//Apartado de procesamiento de solicitud.

import { Request, Response } from 'express';
import { processMappingEngine } from '../../../services/mappingEngine.service/service.js';
import { FullMappingResponse } from '../../interfaces/interface.js';

export const getMappingSimulation = async (req: Request, res: Response): Promise<void> => {
    try {
      //Aqui se obtienen los datos simulados del rover
        const rawData = processMappingEngine();

        //Se estructura la respuesta incluyendo datos del rover
        const responseData: FullMappingResponse = {
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

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};