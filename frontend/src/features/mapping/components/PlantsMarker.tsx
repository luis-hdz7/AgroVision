/**
 * =========================================
 * PlantMarkers Component
 * =========================================
 *
 * Renderiza plantas detectadas como clusters técnicos.
 *
 * Antes:
 * - icono de plantita.
 *
 * Ahora:
 * - centro estimado;
 * - radio/canopia simulada;
 * - etiqueta P-01, P-02...
 *
 * Esto se parece más a una vista superior de medición
 * sobre nube de puntos, como una herramienta de análisis.
 * =========================================
 */

import type { RenderPlant } from "../types/mappingRender.types";

interface PlantMarkersProps {
  readonly plants: ReadonlyArray<RenderPlant>;
}

export function PlantMarkers({ plants }: PlantMarkersProps) {
  return (
    <g className="plantMarkersLayer" aria-label="Plantas detectadas">
        {plants.map((plant, index) => (
            <g
              key={plant.id}
              data-id={plant.id}
              data-x={plant.x}
              data-y={plant.y}
              data-detected={plant.detected}
              className={plant.detected ? "plantMarker detected" : "plantMarker pending"}
              transform={`translate(${plant.x} ${plant.y})`}
              aria-label={`Planta ${plant.id}`}
            >

              {/* Canopy representa el área visual aproximada de la planta. */}
              <circle className="plantCanopy" r="3.3" />
              {/* Ring delimita el cluster vegetal*/}
              <circle className="plantRing" r="2.15" />

              {/* Forma vegetal para diferenciar */}
              <path
                className="plantShape"
                d="M 0 1.4 L 0 -1.3 M 0 -0.9 C -1.2 -1.9 -2.2 -1.1 -2 0.1 M 0 -0.9 C 1.2 -1.9 2.2 -1.1 2 0.1"
              />
              <circle className="plantCenter" r="0.55" />

              {/* Ticks técnicos: ayudan a leer el centro estimado. */}
              <line x1="-3.8" y1="0" x2="-2.6" y2="0" className="plantTick" />
              <line x1="2.6" y1="0" x2="3.8" y2="0" className="plantTick" />
              <line x1="0" y1="-3.8" x2="0" y2="-2.6" className="plantTick" />
              <line x1="0" y1="2.6" x2="0" y2="3.8" className="plantTick" />

              <text className="plantCode" x="4.3" y="-2.6">
                P-{String(index + 1).padStart(2, "0")}
              </text>
            </g>
        ))}
    </g>
  );
}