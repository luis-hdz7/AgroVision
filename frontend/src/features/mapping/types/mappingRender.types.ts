/**
 * =========================================
 * Mapping Render Types
 * =========================================
 *
 * Contrato visual usado por Frontend 2.
 *
 * Estos tipos representan datos ya preparados
 * para renderizarse en SVG.
 *
 * IMPORTANTE:
 * - Las coordenadas deben venir en rango 0–100.
 * - Este archivo NO representa datos crudos del rover.
 * - Este archivo representa datos listos para pintar.
 * =========================================
 */


/*
 * Punto base para el render 2D.
 * x e y trabajan en escala porcentual:
 * - x: 0 = izquierda, 100 = derecha
 * - y: 0 = arriba, 100 = abajo
 */

export interface RenderPoint {
  readonly x: number;
  readonly y: number;
}

/*
 * Estados visuales posibles del rover.
 * Se usan para cambiar color, icono o animación
 * según el estado actual.
 */
export type RobertStatus = 'IDLE' | 'MOVING' | 'SCANNING' | 'ERROR';

/*
 * Representa el rober dentro del render.
 */
export interface RenderRover {
  readonly position: RenderPoint;
  readonly angle: number;
  readonly battery: number;
  readonly status: RobertStatus;
}

/*
 * Planta renderizable.
 */
export interface RenderPlant extends RenderPoint {
  readonly id: string;
  readonly detected: boolean;
}

/*
 * Obstaculo renderizable.
 */
export interface RenderObstacle extends RenderPoint {
  readonly id: string;
  readonly size: number;
}

/*
 * Estadísticas visibles para el panel de estado.
 * No son indispensables para dibujar el mapa,
 * pero sí para que el usuario entienda el recorrido.
 */
export interface RenderStats {
    readonly plantsDetected: number;
    readonly obstaclesDetected: number;
    readonly distanceTraveled: number;
    readonly inspectedPercentage: number;
  };

/*
 * Estructura final que consume el render 2D.
 * Este es el contrato principal entre:
 * Backend 2 → Backend 3 → Frontend 2
 * se utiliza ReadonlyArray para evitar modificaciones en los arreglos
 */
export interface RenderSimulationData {
  readonly rover: RenderRover;
  readonly trayectory: ReadonlyArray<RenderPoint>;
  readonly plannedPath?: ReadonlyArray<RenderPoint>;
  readonly obstacles: ReadonlyArray<RenderObstacle>;
  readonly plants: ReadonlyArray<RenderPlant>;
  readonly stats: RenderStats;
}


