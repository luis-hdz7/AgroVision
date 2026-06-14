/**
 * =========================================
 * TerrainCanvas Component
 * =========================================
 *
 * Canvas principal del render 2D.
 *
 * Nuevo enfoque:
 * Este componente ya no intenta mostrar un mapa agrícola
 * tipo NDVI/parcela. Ahora muestra una simulación técnica
 * del proceso de mapeo del rover.
 *
 * Capas:
 * 1. Grid XY / occupancy map.
 * 2. Nube de puntos simulada.
 * 3. Barrido LiDAR.
 * 4. Trayectoria.
 * 5. Plantas detectadas.
 * 6. Obstáculos.
 * 7. Mediciones.
 * 8. Pose del rover.
 *
 * Por qué SVG:
 * - permite coordenadas limpias;
 * - escala bien;
 * - permite separar capas;
 * - es ideal para overlays técnicos.
 * =========================================
 */

import type { RenderSimulationData } from "../types/mappingRender.types";
import { MeasurementOverlay } from "../../../../src/features/mapping/components/MeasurementOverlay";
import { ObstaclePoints } from "../../../../src/features/mapping/components/ObstaclePoint";
import { OccupancyGrid } from "../../../../src/features/mapping/components/OccupancyGrid";
import { PathTrail } from "../../../../src/features/mapping/components/PathTrail";
import { PlantMarkers } from "../../../../src/features/mapping/components/PlantsMarker";
import { PointCloudLayer } from "../../../../src/features/mapping/components/PointCloudLayer";
import { RoverMarker } from "../../../../src/features/mapping/components/RoverMarker";
import { SensorSweep } from "./SensorSweep";

interface TerrainCanvasProps {
  readonly data: RenderSimulationData;
}

export function TerrainCanvas({ data }: TerrainCanvasProps) {
  return (
    <div className="terrainCanvasWrapper">
      <div className="terrainMetaBar">
        <span>FRAME 0472</span>
        <strong>Rover Mapping Simulation</strong>
        <span>XY · LiDAR · Pose</span>
      </div>

      <svg
        className="terrainCanvas"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Simulación técnica 2D del mapeo del rover"
      >
        <defs>
          <radialGradient id="scanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(80, 220, 255, 0.22)" />
            <stop offset="100%" stopColor="rgba(80, 220, 255, 0)" />
          </radialGradient>

          <linearGradient id="canvasFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#07131d" />
            <stop offset="55%" stopColor="#06101a" />
            <stop offset="100%" stopColor="#030811" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" className="technicalMapBase" />

        <OccupancyGrid />

        <PointCloudLayer data={data} />

        <SensorSweep rover={data.rover} />

        <PathTrail
          points={data.trayectory}
          plannedPoints={data.plannedPath}
        />

        <PlantMarkers plants={data.plants} />

        <ObstaclePoints obstacles={data.obstacles} />

        <MeasurementOverlay data={data} />

        <RoverMarker rover={data.rover} />

        <g className="mapHud">
          <text x="8" y="5.4" className="mapHudTitle">
            ROVER SCAN / TOP VIEW
          </text>

          <text x="8" y="8.4" className="mapHudSubtitle">
            Simulated LiDAR returns · trajectory · detected clusters
          </text>

          <text x="74" y="5.4" className="mapHudValue">
            θ {data.rover.angle}°
          </text>

          <text x="74" y="8.4" className="mapHudSubtitle">
            battery {data.rover.battery}%
          </text>
        </g>

        <g className="scaleBar" transform="translate(73 95)">
          <line x1="0" y1="0" x2="16" y2="0" />
          <line x1="0" y1="-1.2" x2="0" y2="1.2" />
          <line x1="16" y1="-1.2" x2="16" y2="1.2" />
          <text x="8" y="-2.2">5 m visual</text>
        </g>
      </svg>
    </div>
  );
}