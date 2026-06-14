/**
 * =========================================
 * Mapping Mock
 * =========================================
 *
 * Datos locales temporales para construir
 * y probar el render 2D sin depender del backend.
 *
 * Este mock, simula el resultado visual
 * de un rover recorriendo un entorno y registrando:
 *
 * - pose actual;
 * - trayectoria XY;
 * - plantas detectadas;
 * - obstáculos;
 * - métricas generales.
 * =========================================
 */

import type { RenderSimulationData } from "../types/mappingRender.types";

/*
 * Mock principal del render.
*/
export const mappingMock = {

  rover: {
    position: { x: 34, y: 68 },
    angle: -32,
    battery: 78,
    status: "MOVING",
  },

  trayectory: [
    { x: 14, y: 86 },
    { x: 19, y: 80 },
    { x: 25, y: 74 },
    { x: 34, y: 68 },
    { x: 43, y: 61 },
    { x: 52, y: 56 },
    { x: 61, y: 53 },
  ],

  plannedPath: [
    { x: 61, y: 53 },
    { x: 70, y: 48 },
    { x: 78, y: 40 },
    { x: 84, y: 32 },
  ],

  plants: [
    { id: "plant-1", x: 48, y: 66, detected: false },
    { id: "plant-2", x: 40, y: 55, detected: true },
    { id: "plant-3", x: 80, y: 46, detected: true },
    { id: "plant-4", x: 31, y: 62, detected: true },
    { id: "plant-5", x: 53, y: 49, detected: true },
    { id: "plant-6", x: 65, y: 44, detected: true },
    { id: "plant-7", x: 36, y: 75, detected: true },
    { id: "plant-8", x: 59, y: 62, detected: true },
    { id: "plant-9", x: 69, y: 55, detected: false },
  ],

  obstacles: [
    { id: "obs-1", x: 53, y: 71, size: 3 },
    { id: "obs-2", x: 76, y: 59, size: 4 },
    { id: "obs-3", x: 22, y: 68, size: 3 },
    { id: "obs-4", x: 43, y: 48, size: 1.5 },
    { id: "obs-5", x: 85, y: 17, size: 2 },
    { id: "obs-6", x: 82, y: 21, size: 2.5 },
  ],

  stats: {
    plantsDetected: 6,
    obstaclesDetected: 3,
    distanceTraveled: 42,
    inspectedPercentage: 46,
  }, 
} satisfies RenderSimulationData;