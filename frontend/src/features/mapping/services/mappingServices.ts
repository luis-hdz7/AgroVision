/**
 * =========================================
 * Mapping Service
 * =========================================
 *
 * Servicio de datos para el módulo Mapping 2D.
 *
 * Responsabilidad:
 * - intentar consumir la API real del backend;
 * - usar mock local si backend todavía no está activo;
 * - mantener viva la demo aunque backend falle.
 *
 * Conexión futura:
 * Backend 3 deberá exponer:
 * GET /api/mapping/simulation
 *
 * Por qué existe:
 * MappingPage no debe depender directamente de mappingMock.
 * Este servicio deja el frontend listo para integración real.
 * =========================================
*/

import { mappingMock } from "./mappingMock";
import type { RenderSimulationData } from "../types/mappingRender.types";

/*
 * Endpoint esperado desde Backend 3.
 */
const MAPPING_SIMULATION_ENDPOINT = "/api/mapping/simulation";

/**
 * Obtiene datos de simulación del rover.
 *
 * Flujo:
 * 1. intenta pedir datos reales al backend;
 * 2. valida que la respuesta sea correcta;
 * 3. retorna JSON como RenderSimulationData;
 * 4. si algo falla, retorna mappingMock.
*/
export async function getMappingSimulation(): Promise<RenderSimulationData> {
  try {
    // fetch queda preparado para cuando Backend 3 publique el endpoint.
    const response = await fetch(MAPPING_SIMULATION_ENDPOINT);

    // response.ok cubre respuestas HTTP 200-299.
    if (!response.ok) {
      throw new Error("Mapping API response was not OK");
    }

    // Se asume que backend respetará el contrato RenderSimulationData.
    const data = (await response.json()) as RenderSimulationData;

    return data;
  } catch {
    // Fallback intencional: permite seguir trabajando sin backend conectado.
    return mappingMock;
  }
}

// const payload = await response.json();
// return payload.data;