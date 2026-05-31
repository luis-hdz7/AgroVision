import { Request, Response } from "express";

import { SimulationService } from "./mappingService";
import mappingEngineService from "./engine/mappingEngineService";

import { buildPlayback } from "../../services/playBackService";

const simulationService = new SimulationService();

export const getMappingPlayback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const simulationData =
      simulationService.getSimulation();

    const processedData =
      mappingEngineService.processSimulationData(
        simulationData
      );

    const playback =
      buildPlayback(
        processedData.rover.trajectory,
        processedData.events
      );

    res.status(200).json({
      success: true,
      data: playback,
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