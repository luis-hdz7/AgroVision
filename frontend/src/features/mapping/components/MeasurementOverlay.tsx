/**
 * =========================================
 * MeasurementOverlay Component
 * =========================================
 *
 * Capa visual de mediciones técnicas del mapa.
 *
 * Responsabilidad:
 * - calcular distancias relevantes entre objetos visibles;
 * - dibujar líneas de medición dentro del SVG;
 * - mostrar etiquetas con distancia simulada en metros;
 * - evitar saturar el mapa con demasiadas líneas.
 *
 * Importante:
 * Este componente recibe `playbackData` desde TerrainCanvas.
 * Por eso solo mide objetos que ya fueron revelados durante
 * la simulación:
 *
 * - plantas visibles;
 * - obstáculos visibles;
 * - posición actual del rover.
 *
 * No mide objetos que aún no han sido detectados.
 * =========================================
 */

import type {
  RenderObstacle,
  RenderPlant,
  RenderPoint,
  RenderSimulationData,
} from "../types/mappingRender.types";

interface MeasurementOverlayProps {
  readonly data: RenderSimulationData;
}

/**
 * Tipo lógico de entidad medible.
 *
 * Sirve para diferenciar visualmente:
 * - rover;
 * - planta;
 * - obstáculo.
 */
type EntityKind = "rover" | "plant" | "obstacle";

/**
 * Entidad normalizada para medición.
 *
 * Convertimos rover, plantas y obstáculos a una misma
 * estructura para poder calcular distancias entre ellos
 * sin duplicar lógica.
 */
interface MeasurementEntity extends RenderPoint {
  readonly id: string;
  readonly label: string;
  readonly kind: EntityKind;
}

/**
 * Línea de medición calculada.
 *
 * type define el color visual:
 * - safe: medición normal;
 * - warning: cercanía planta-obstáculo;
 * - danger: cercanía rover-obstáculo.
 */
interface MeasurementLine {
  readonly id: string;
  readonly from: MeasurementEntity;
  readonly to: MeasurementEntity;
  readonly type: "safe" | "warning" | "danger";
}

export function MeasurementOverlay({ data }: MeasurementOverlayProps) {
  /**
   * Convertimos la posición actual del rover en una entidad medible.
   *
   * Esta posición cambia durante el playback, por eso las mediciones
   * hacia el rover también se actualizan visualmente.
   */
  const roverEntity: MeasurementEntity = {
    id: "rover",
    label: "ROVER",
    kind: "rover",
    x: data.rover.position.x,
    y: data.rover.position.y,
  };

  /**
   * Convertimos plantas y obstáculos visibles a entidades medibles.
   *
   * Nota:
   * data.plants y data.obstacles ya vienen filtrados por playback.
   * Es decir, aquí solo existen si el rover ya los detectó.
   */
  const plantEntities = data.plants.map(toPlantEntity);
  const obstacleEntities = data.obstacles.map(toObstacleEntity);

  /**
   * Lista combinada de objetos detectados.
   *
   * Se usa para encontrar el objeto más cercano al rover,
   * sin importar si es planta u obstáculo.
   */
  const visibleEntities = [...plantEntities, ...obstacleEntities];

  /**
   * Construye las mediciones relevantes.
   *
   * No hacemos medición "todos contra todos", porque eso llenaría
   * el mapa de líneas y destruiría la legibilidad.
   */
  const measurements = buildMeasurements({
    rover: roverEntity,
    plants: plantEntities,
    obstacles: obstacleEntities,
    allObjects: visibleEntities,
  });

  return (
    <g className="measurementOverlay" aria-label="Mediciones visuales">
      {/* Radio visual de detección actual del rover */}
      <circle
        cx={data.rover.position.x}
        cy={data.rover.position.y}
        r="14"
        className="detectionRadius"
      />

      {measurements.map((measurement) => {
        // Punto medio donde se coloca el texto de distancia.
        const midPoint = getMidPoint(measurement.from, measurement.to);

        // Distancia visual convertida a metros simulados.
        const meters = toMeters(distance(measurement.from, measurement.to));

        return (
          <g key={measurement.id} className="measurementGroup">
            <line
              x1={measurement.from.x}
              y1={measurement.from.y}
              x2={measurement.to.x}
              y2={measurement.to.y}
              className={`measurementLine measurementLine--${measurement.type}`}
            />

            <text
              x={midPoint.x}
              y={midPoint.y - 1.4}
              className={`measurementText measurementText--${measurement.type}`}
            >
              {measurement.from.label} → {measurement.to.label} · {meters}m
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Construye mediciones relevantes del mapa.
 *
 * Decisión de diseño:
 * No se dibujan todas las distancias posibles porque visualmente
 * sería demasiado ruidoso.
 *
 * Se calculan solo estas relaciones:
 * 1. Rover → objeto más cercano.
 * 2. Rover → obstáculo más cercano.
 * 3. Planta → planta más cercana.
 * 4. Planta → obstáculo más cercano.
 */
function buildMeasurements(params: {
  readonly rover: MeasurementEntity;
  readonly plants: ReadonlyArray<MeasurementEntity>;
  readonly obstacles: ReadonlyArray<MeasurementEntity>;
  readonly allObjects: ReadonlyArray<MeasurementEntity>;
}): ReadonlyArray<MeasurementLine> {
  const measurements: MeasurementLine[] = [];

  // Objeto detectado más cercano al rover: puede ser planta u obstáculo.
  const nearestObject = getNearestEntity(params.rover, params.allObjects);

  // Obstáculo detectado más cercano al rover.
  const nearestObstacleToRover = getNearestEntity(
    params.rover,
    params.obstacles
  );

  // Par de plantas más cercanas entre sí.
  const nearestPlantPair = getNearestPair(params.plants);

  // Par más cercano entre una planta y un obstáculo.
  const nearestPlantToObstaclePair = getNearestMixedPair(
    params.plants,
    params.obstacles
  );

  if (nearestObject) {
    measurements.push({
      id: "rover-nearest-object",
      from: params.rover,
      to: nearestObject,

      // Si el objeto cercano es obstáculo, se marca como peligro.
      type: nearestObject.kind === "obstacle" ? "danger" : "safe",
    });
  }

  /**
   * Si el obstáculo más cercano ya fue medido como nearestObject,
   * no repetimos la misma línea.
   */
  if (
    nearestObstacleToRover &&
    nearestObstacleToRover.id !== nearestObject?.id
  ) {
    measurements.push({
      id: "rover-nearest-obstacle",
      from: params.rover,
      to: nearestObstacleToRover,
      type: "danger",
    });
  }

  if (nearestPlantPair) {
    measurements.push({
      id: "nearest-plant-pair",
      from: nearestPlantPair.from,
      to: nearestPlantPair.to,
      type: "safe",
    });
  }

  if (nearestPlantToObstaclePair) {
    measurements.push({
      id: "nearest-plant-obstacle-pair",
      from: nearestPlantToObstaclePair.from,
      to: nearestPlantToObstaclePair.to,

      // Planta cerca de obstáculo: advertencia, no peligro directo al rover.
      type: "warning",
    });
  }

  return removeDuplicatedMeasurements(measurements);
}

/**
 * Convierte una planta del render a entidad medible.
 *
 * El index se usa para mostrar P-01, P-02, etc.
 */
function toPlantEntity(plant: RenderPlant, index: number): MeasurementEntity {
  return {
    id: plant.id,
    label: `P-${String(index + 1).padStart(2, "0")}`,
    kind: "plant",
    x: plant.x,
    y: plant.y,
  };
}

/**
 * Convierte un obstáculo del render a entidad medible.
 *
 * El index se usa para mostrar OBS-1, OBS-2, etc.
 */
function toObstacleEntity(
  obstacle: RenderObstacle,
  index: number
): MeasurementEntity {
  return {
    id: obstacle.id,
    label: `OBS-${index + 1}`,
    kind: "obstacle",
    x: obstacle.x,
    y: obstacle.y,
  };
}

/**
 * Retorna la entidad más cercana a un punto origen.
 *
 * Si la lista está vacía, retorna undefined.
 */
function getNearestEntity(
  origin: MeasurementEntity,
  entities: ReadonlyArray<MeasurementEntity>
): MeasurementEntity | undefined {
  return [...entities].sort(
    (first, second) => distance(origin, first) - distance(origin, second)
  )[0];
}

/**
 * Busca el par más cercano dentro de un mismo grupo.
 *
 * Uso actual:
 * - planta más cercana a otra planta.
 */
function getNearestPair(
  entities: ReadonlyArray<MeasurementEntity>
):
  | {
      readonly from: MeasurementEntity;
      readonly to: MeasurementEntity;
    }
  | undefined {
  if (entities.length < 2) return undefined;

  let bestPair:
    | {
        readonly from: MeasurementEntity;
        readonly to: MeasurementEntity;
        readonly distance: number;
      }
    | undefined;

  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) {
      const currentDistance = distance(entities[i], entities[j]);

      if (!bestPair || currentDistance < bestPair.distance) {
        bestPair = {
          from: entities[i],
          to: entities[j],
          distance: currentDistance,
        };
      }
    }
  }

  return bestPair;
}

/**
 * Busca el par más cercano entre dos grupos diferentes.
 *
 * Uso actual:
 * - planta más cercana a obstáculo.
 */
function getNearestMixedPair(
  firstGroup: ReadonlyArray<MeasurementEntity>,
  secondGroup: ReadonlyArray<MeasurementEntity>
):
  | {
      readonly from: MeasurementEntity;
      readonly to: MeasurementEntity;
    }
  | undefined {
  if (firstGroup.length === 0 || secondGroup.length === 0) return undefined;

  let bestPair:
    | {
        readonly from: MeasurementEntity;
        readonly to: MeasurementEntity;
        readonly distance: number;
      }
    | undefined;

  for (const first of firstGroup) {
    for (const second of secondGroup) {
      const currentDistance = distance(first, second);

      if (!bestPair || currentDistance < bestPair.distance) {
        bestPair = {
          from: first,
          to: second,
          distance: currentDistance,
        };
      }
    }
  }

  return bestPair;
}

/**
 * Evita líneas duplicadas entre los mismos objetos.
 *
 * Ejemplo:
 * A → B y B → A representan la misma medición.
 */
function removeDuplicatedMeasurements(
  measurements: ReadonlyArray<MeasurementLine>
): ReadonlyArray<MeasurementLine> {
  const seen = new Set<string>();

  return measurements.filter((measurement) => {
    const key = [measurement.from.id, measurement.to.id].sort().join("-");

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

/**
 * Calcula el punto medio entre dos coordenadas.
 *
 * Se usa para ubicar la etiqueta de distancia.
 */
function getMidPoint(first: RenderPoint, second: RenderPoint): RenderPoint {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

/**
 * Distancia euclidiana entre dos puntos SVG.
 */
function distance(first: RenderPoint, second: RenderPoint): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

/**
 * Convierte unidades SVG a metros simulados.
 *
 * Escala temporal:
 * 1 unidad SVG ≈ 0.22 m
 *
 * Cuando Backend 2/3 entregue distancias reales,
 * esta función puede eliminarse o reemplazarse.
 */
function toMeters(svgDistance: number): number {
  return Math.round(svgDistance * 0.22 * 10) / 10;
}