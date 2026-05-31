// src/modules/mapping/mappingController.ts
import { Request, Response } from "express";
import { processMappingEngine } from "./mappingService";


export const getMappingSimulation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const responseData = processMappingEngine();

    res.status(200).json({
      success: true,
      data: responseData,
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
