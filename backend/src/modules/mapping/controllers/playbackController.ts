import type {
  Request,
  Response,
} from "express";

import { SimulationService } from "./mappingService";
import mappingEngineService from "../engine/mappingEngineService";
import { buildPlayback } from "../services/playBackService";

const simulationService =
  new SimulationService();

/**
  * GET /api/mapping/playback

  * Devuelve los fotogramas de reproducción generados por el backend.
  * Esto es opcional para el frontend actual, pero útil para la futura sincronización de la reproducción controlada por el backend.
*/

export const getMappingPlayback = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawSimulationData =
      simulationService.getSimulation();

    const processedData =
      mappingEngineService.processSimulationData(
        rawSimulationData
      );

    const playback =
      buildPlayback(
        processedData.trajectory,
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