/**
 * =========================================
 * SensorSweep Component
 * =========================================
 *
 * Simula el barrido actual del sensor.
 *
 * En el sistema real, el LiDAR entrega distancias R
 * asociadas a ángulos H. En este prototipo visual usamos
 * rayos generados desde la pose del rover para representar
 * la idea de escaneo.
 *
 * Por qué no usamos random:
 * Un render profesional debe ser estable.
 * Si usamos Math.random(), el mapa cambia en cada render y
 * parece inestable. Por eso usamos arrays fijos.
 * =========================================
 */

import type { RenderRover } from "../types/mappingRender.types";

interface SensorSweepProps {
  readonly rover: RenderRover;
}

const SENSOR_ANGLES = [-48, -36, -24, -12, 0, 12, 24, 36, 48];
const SENSOR_RANGES = [16, 21, 24, 26, 28, 25, 22, 19, 15];

export function SensorSweep({ rover }: SensorSweepProps) {
  const { x, y } = rover.position;

  return (
    <g className="sensorSweep" aria-label="Barrido LiDAR simulado">
      <path
        className="sensorSector"
        d={buildSectorPath(x, y, rover.angle, 30, 48)}
      />

      {SENSOR_ANGLES.map((angleOffset, index) => {
        const endpoint = getPolarEndpoint(x, y, rover.angle + angleOffset, SENSOR_RANGES[index]);
        const isHit = index === 2 || index === 4 || index === 6;

        return (
          <g key={`sensor-ray-${angleOffset}`} className="sensorRayGroup">
            <line
              x1={x}
              y1={y}
              x2={endpoint.x}
              y2={endpoint.y}
              className={isHit ? "sensorRay sensorRay--hit" : "sensorRay"}
            />


            <rect 
              x={endpoint.x - 0.45}
              y={endpoint.y - 0.45}
              width="0.9"
              height="0.9"
              transform={`rotate(45 ${endpoint.x} ${endpoint.y})`}
              className={isHit ? "scanPoint scanPoint--hit" : "scanPoint"}          
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Crea el polígono del sector de escaneo.
 *
 * El sector no busca ser físicamente exacto todavía.
 * Su función es comunicar visualmente hacia dónde está
 * mirando el sensor.
 */
function buildSectorPath(
  x: number,
  y: number,
  angle: number,
  range: number,
  aperture: number
): string {
  const left = getPolarEndpoint(x, y, angle - aperture, range);
  const center = getPolarEndpoint(x, y, angle, range + 5);
  const right = getPolarEndpoint(x, y, angle + aperture, range);

  return `M ${x} ${y} L ${left.x} ${left.y} Q ${center.x} ${center.y} ${right.x} ${right.y} Z`;
}

/**
 * Convierte ángulo + distancia a coordenadas SVG.
 *
 * En SVG el eje Y crece hacia abajo, por eso usamos
 * sin(angle) directamente para desplazar en Y.
 */
function getPolarEndpoint(
  x: number,
  y: number,
  angleDegrees: number,
  distance: number
): { readonly x: number; readonly y: number } {
  const radians = (angleDegrees * Math.PI) / 180;

  return {
    x: x + Math.cos(radians) * distance,
    y: y + Math.sin(radians) * distance,
  };
}