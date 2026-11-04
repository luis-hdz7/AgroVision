/**
 * =========================================
 * Rover Trajectory Demo Data
 * =========================================
 *
 * Trayectoria sintética utilizada por la demostración GIS.
 *
 * Responsabilidad:
 * - definir la secuencia ordenada de posiciones del rover;
 * - proporcionar una trayectoria conforme al contrato MapLineFeature;
 * - compartir el mismo recorrido entre representación y animación.
 *
 * =========================================
 */

// Consumimos el contrato GIS centralizado de las geometrías lineales.
import type { MapLineFeature } from "../types/mappingGeo.types";
import { relocateDemoPosition } from "./demoLocation";

// Trayectoria histórica simulada del rover.
export const agroVisionRoverTrajectory: MapLineFeature = {
    // Feature GeoJSON.
    type: "Feature",
    // ID estable.
    id: "trajectory-001",
    // Geometría histórica.
    geometry: {
        // Una trayectoria es un LineString.
        type: "LineString",
        // Secuencia ordenada de posiciones GPS simuladas.
        coordinates: [
            // Inicio del recorrido.
            [-87.1312, 12.6251],
            // Primer desplazamiento.
            [-87.1308, 12.6258],
            // Segundo desplazamiento.
            [-87.1300, 12.6265],
            // Avance hacia el centro.
            [-87.1290, 12.6270],
            // Cambio de dirección.
            [-87.1279, 12.6272],
            // Continuación.
            [-87.1268, 12.6268],
            // Entrada al siguiente sector.
            [-87.1257, 12.6261],
            // Desplazamiento longitudinal.
            [-87.1247, 12.6257],
            // Giro hacia el este.
            [-87.1237, 12.6252],
            // Último tramo.
            [-87.1227, 12.6250],
        ].map(relocateDemoPosition),
    },
    // Propiedades GIS de la trayectoria.
    properties: {
        // Identificador único.
        routeId: "trajectory-001",
        // La asociación completa con fields se determina por los sectores recorridos.
        fieldId: null,
        // La asociación con zonas se determina por los sectores recorridos.
        zoneId: null,
        // Tipo oficial de línea.
        kind: "ROVER_TRAJECTORY",
        // Nombre visible.
        name: "Trayectoria Rover 01",
        // Distancia disponible cuando se calcula a partir del recorrido.
        distanceMeters: null,
    },
};

/**
 * =========================================
 * DOCUMENTACIÓN DEL MÓDULO
 * =========================================
 *
 * Origen:
 * La trayectoria conserva las diez posiciones relativas y su orden;
 * se desplaza junto con las parcelas de demostración.
 *
 * Contrato:
 * MapLineFeature representa el recorrido como LineString.
 * Las coordenadas siguen el orden longitud, latitud.
 * feature.id y properties.routeId identifican la misma ruta.
 *
 * Relaciones:
 * El recorrido atraviesa distintos sectores agrícolas.
 * fieldId y zoneId permanecen en null hasta disponer de una
 * asociación que represente correctamente la trayectoria completa.
 *
 * Integración:
 * El consumidor importa agroVisionRoverTrajectory desde este
 * módulo y entrega la misma geometría a la capa de trayectoria
 * y al controlador de animación del rover.
 *
 * Evolución:
 * Un recorrido GPS real puede sustituir estos datos manteniendo
 * el contrato y el orden cronológico de sus posiciones.
 *
 * =========================================
 */
