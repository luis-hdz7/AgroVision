/**
 * =========================================
 * PathTrail Component
 * =========================================
 *
 * Dibuja la trayectoria del rover.
 *
 * Diferencia visual:
 * - points: trayectoria recorrida, línea sólida.
 * - plannedPoints: trayectoria proyectada, línea punteada.
 *
 * También marca:
 * - punto inicial;
 * - frames intermedios;
 * - punto actual.
 *
 * Por qué se mantiene separado:
 * La trayectoria es una capa independiente del mapa.
 * Esto permite que luego Backend 2 entregue más frames
 * sin tocar el resto del canvas.
 * =========================================
 */

import type { RenderPoint } from "../types/mappingRender.types";

interface PathTrailProps {
  readonly points: ReadonlyArray<RenderPoint>;
  readonly plannedPoints?: ReadonlyArray<RenderPoint>;
}

export function PathTrail({ points, plannedPoints = [] }: PathTrailProps) {
  // si solo hay un punto, no se muestra el trayectoria
  const hasRealProgress = points.length > 1;
  //primer punto de recorrido: se usa para pintar START
  const startPoint = points[0] ?? plannedPoints[0];
  //ultimo punto de recorrido: se usa para pintar el FRAME actual
  const currentPoint = points[points.length - 1];

  return (
    <g className="trajectoryLayer" aria-label="Trayectoria del rover">
      {plannedPoints.length > 1 && (
        <polyline
          points={toPolylinePoints(plannedPoints)}
          className="plannedPath"
          fill="none"
        />
      )}
      
      {hasRealProgress && (
        <polyline
          points={toPolylinePoints(points)}
          className="pathTrail"
          fill="none"
        />
      )}
{/* 
      {hasRealProgress &&  
          points.map((point, index) => (
            <circle
              key={`${point.x}-${point.y}-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 1.05 : 0.62}
              className="trajectorySample"
            />
          ))} */}

      {startPoint && (
        <g className="startMarker" transform={`translate(${startPoint.x} ${startPoint.y})`}>
          <circle r="1.7" />
          <text x="2.4" y="-1.6">START</text>
        </g>
      )}

      {hasRealProgress && currentPoint && (
        <g className="currentMarker" transform={`translate(${currentPoint.x} ${currentPoint.y})`}>
          <circle r="1.9" />
          <text x="2.6" y="-1.8">FRAME 0472</text>
        </g>
      )}
    </g>
  );
}

/**
 * Convierte el arreglo depuntos a formato SVG.
 
 * Entrada:
 * [{ x: 10, y: 20 }, { x: 30, y: 40 }]
 *
 * Salida:
 * "10,20 30,40"
 */
function toPolylinePoints(points: ReadonlyArray<RenderPoint>): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}