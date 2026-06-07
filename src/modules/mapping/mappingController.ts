import type { Request, Response } from 'express';

import { SimulationService } from './mappingService';
import mappingEngineService from './engine/mappingEngineService';

const simulationService = new SimulationService();

/**
 * GET /api/mapping/simulation
 *
 * Devuelve datos de simulación de mapeo listos para el frontend.
 * La estructura de la respuesta es:
 * {
 * success: true,
 * data: MappingSimulationData
 * }
 */

export const getMappingSimulation = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Datos crudos del mock
    const rawSimulationData = simulationService.getSimulation();

    // Datos procesados por Backend 2
    const processedData =
      mappingEngineService.processSimulationData(rawSimulationData);

    res.status(200).json({
      success: true,
      data: processedData,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};
