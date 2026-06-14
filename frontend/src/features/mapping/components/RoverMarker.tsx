/**
 * =========================================
 * RoverMarker Component
 * =========================================
 *
 * Renderiza la pose actual del rover.
 *
 * Pose = posición + orientación.
 
 * - cuerpo central;
 * - vector de heading;
 * - eje lateral;
 * - etiqueta de pose;
 * - halo de posición.
 * =========================================
 */

import type { RenderRover } from "../types/mappingRender.types";

interface RoverMarkerProps {
  readonly rover: RenderRover;
}

export function RoverMarker({ rover }: RoverMarkerProps) {
  // x/y coordenadas normalizadas dentro del viewBox SVG
  const { x, y } = rover.position;

  return (
    <g
      className={`roverMarker roverMarker--${rover.status.toLowerCase()}`}
      transform={`translate(${x} ${y}) rotate(${rover.angle})`}
      aria-label="Rover"
    >
      <circle className="roverPositionHalo" r="4.8" />

      {/* Ejes locales del rover: ayudan a leer orientación. */}
      <line x1="-4.6" y1="0" x2="4.6" y2="0" className="roverAxis roverAxis--x" />
      <line x1="0" y1="-3.4" x2="0" y2="3.4" className="roverAxis roverAxis--y" />

      {/* Fleca direccional del rover. */}
      <path
        className="roverHeading"
        d="M 5.2 0 L -2.6 -2.8 L -1.4 0 L -2.6 2.8 Z"
      />

      <circle className="roverBody" r="2.2" />
      <circle className="roverCore" r="0.72" />

      <text
        className="roverPoseLabel"
        x="4.4"
        y="-4.5"
        transform={`rotate(${-rover.angle})`}
      >
        ROVER
      </text>
    </g>
  );
}
