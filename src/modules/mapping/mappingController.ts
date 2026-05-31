import { Request, Response } from "express";

import { SimulationService } from "./mappingService";
import mappingEngineService from "./engine/mappingEngineService";

const simulationService = new SimulationService();

export const getMappingSimulation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Datos crudos del mock
    const simulationData =
      simulationService.getSimulation();

    // Datos procesados por Backend 2
    const processedData =
      mappingEngineService.processSimulationData(
        simulationData
      );

    res.status(200).json({
      success: true,
      data: processedData,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};