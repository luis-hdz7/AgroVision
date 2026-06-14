/**
 * =========================================
 * ObstaclePoints Component
 * =========================================
 *
 * Renderiza obstáculos como detecciones técnicas.
 *
 * - símbolo de alerta;
 * - zona delimitada;
 * - código OBS.
 *
 * Esto hace que el obstáculo se lea como un dato
 * detectado por el rover.
 * =========================================
 */

import type { RenderObstacle } from "../types/mappingRender.types";

interface ObstaclePointsProps {
  readonly obstacles: ReadonlyArray<RenderObstacle>;
}

export function ObstaclePoints({ obstacles }: ObstaclePointsProps) {
  return (
    <g className="obstacleLayer" aria-label="Obstáculos detectados">
      {obstacles.map((obstacle, index) => (
        <g
          key={obstacle.id}
          className="obstacleMarker"
          transform={`translate(${obstacle.x} ${obstacle.y})`}
          aria-label={`Obstáculo ${obstacle.id}`}
        >
          {/* radio visual de riesgo alrededor del obstaculo. */}
          <circle className="obstacleRange" r={obstacle.size + 2.4} />

          {/* forma principal del obstáculo.*/}
          <rect
            className="obstacleShape"
            x={-obstacle.size * 0.72}
            y={-obstacle.size * 0.72}
            width={obstacle.size * 1.44}
            height={obstacle.size * 1.44}
            rx="0.35"
            transform="rotate(45)"
          />

          {/*cruz central para reforzar lectura de alerta */}
          <line x1="-1.2" y1="-1.2" x2="1.2" y2="1.2" className="obstacleCross" />
          <line x1="1.2" y1="-1.2" x2="-1.2" y2="1.2" className="obstacleCross" />

          <text className="obstacleCode" x="4.2" y="0.8">
            OBS-{index + 1}
          </text>
        </g>
      ))}
    </g>
  );
}