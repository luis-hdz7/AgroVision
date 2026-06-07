import type {
  Request,
  Response,
} from "express";

import { SimulationService } from "./mappingService";
import mappingEngineService from "./engine/mappingEngineService";
import type { MappingSummaryData } from "./mappingTypes";

const simulationService =
    new SimulationService();

/** 
  * GET /api/mapping/summary
  * Devuelve un informe final compacto para tarjetas, paneles o resúmenes finales de la demostración.
*/

export const getMappingSummary = async (
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
    
    // el modulo que les hizo falta kbronasos >:)
    // -latigo -latigo -latigo
    const summary: MappingSummaryData = {
      plantsDetected:
        processedData.stats.plantsDetected,

      obstaclesDetected:
        processedData.stats.obstaclesDetected,

      distanceTraveled:
        processedData.stats.distanceTraveled,

      inspectedPercentage:
        processedData.stats.inspectedPercentage,

      finalRoverPosition:
        processedData.rover.position,

      finalRoverStatus:
        processedData.rover.status,

      battery:
        processedData.rover.battery,

      totalEvents:
        processedData.events.length,
    };

    res.status(200).json({
      success: true,
      data: summary,
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

