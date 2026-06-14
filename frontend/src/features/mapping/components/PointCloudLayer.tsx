/**
 * =========================================
 * PointCloudLayer Component
 * =========================================
 *
 * Simula una nube de puntos 2D.
 *
 * En el sistema real, estos puntos vendrían del proceso:
 *
 * LiDAR + pose del rover + transformación al marco global.
 *
 * Por ahora los generamos desde los datos mock para que el
 * prototipo se vea como una herramienta técnica.
 *
 * Por qué las plantas son clusters:
 * En un sistema con LiDAR, una planta no aparece como un icono.
 * Aparece como un conjunto de retornos/puntos alrededor de una
 * zona donde luego se estima centro, radio o altura.
 * =========================================
 */

import type { RenderSimulationData } from "../types/mappingRender.types";

interface PointCloudLayerProps {
  readonly data: RenderSimulationData;
}

const PLANT_OFFSETS = [
  { x: -1.8, y: -0.7, r: 0.34 },
  { x: -1.1, y: 0.6, r: 0.3 },
  { x: -0.6, y: -1.4, r: 0.26 },
  { x: 0.2, y: -0.4, r: 0.34 },
  { x: 0.6, y: 0.9, r: 0.28 },
  { x: 1.1, y: -0.8, r: 0.3 },
  { x: 1.7, y: 0.3, r: 0.26 },
  { x: -0.2, y: 1.5, r: 0.24 },
  { x: 0.9, y: 1.7, r: 0.22 },
];

const OBSTACLE_OFFSETS = [
  { x: -1.2, y: -1.1 },
  { x: 0, y: -1.4 },
  { x: 1.2, y: -0.9 },
  { x: -1.4, y: 0.4 },
  { x: 1.3, y: 0.6 },
  { x: -0.2, y: 1.4 },
];

export function PointCloudLayer({ data }: PointCloudLayerProps) {
  return (
    <g className="pointCloudLayer" aria-label="Nube de puntos simulada">
      <g className="groundCloud">
        {data.trayectory.map((point, index) => (
          <circle
            key={`ground-${index}`}
            cx={point.x + 2.6}
            cy={point.y - 1.8}
            r="0.24"
          />
        ))}
      </g>

      <g className="plantPointCloud">
        {data.plants.map((plant, plantIndex) =>
          PLANT_OFFSETS.map((offset, pointIndex) => (
            <circle
              key={`${plant.id}-${pointIndex}`}
              cx={plant.x + offset.x}
              cy={plant.y + offset.y}
              r={offset.r}
              className={plant.detected ? "cloudPoint detected" : "cloudPoint pending"}
              style={{ opacity: 0.42 + ((plantIndex + pointIndex) % 4) * 0.12 }}
            />
          ))
        )}
      </g>

      <g className="obstaclePointCloud">
        {data.obstacles.map((obstacle) =>
          OBSTACLE_OFFSETS.map((offset, index) => (
            <circle
              key={`${obstacle.id}-${index}`}
              cx={obstacle.x + offset.x}
              cy={obstacle.y + offset.y}
              r="0.34"
            />
          ))
        )}
      </g>
    </g>
  );
}