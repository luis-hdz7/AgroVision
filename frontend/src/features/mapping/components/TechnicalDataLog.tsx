/**
 * =========================================
 * TechnicalDataLog Component
 * =========================================
 *
 * Panel técnico desplegable para mostrar los datos
 * que el rover ha registrado durante la simulación.
 *
 * Responsabilidad:
 * - listar plantas detectadas;
 * - listar obstáculos detectados;
 * - mostrar coordenadas x/y;
 * - calcular distancia desde el rover;
 * - mostrar mediciones técnicas relevantes;
 * - funcionar con playbackData, no con data original.
 *
 * Por qué existe:
 * El mapa visual es útil, pero una demo avanzada también
 * debe mostrar datos técnicos interpretables.
 *
 * Este panel convierte el render en una herramienta de análisis,
 * no solo en una animación.
 * =========================================
 */

import type {
  RenderObstacle,
  RenderPlant,
  RenderPoint,
  RenderSimulationData,
} from "../types/mappingRender.types";

interface TechnicalDataLogProps {
  readonly data: RenderSimulationData;
  readonly currentFrame: number;
  readonly totalFrames: number;
  readonly progress: number;
}

interface ObjectLogRow {
  readonly id: string;
  readonly type: "PLANTA" | "OBSTÁCULO";
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly distanceToRover: number;
  readonly status: string;
  readonly detail: string;
}

interface MeasurementLogRow {
  readonly id: string;
  readonly label: string;
  readonly target: string;
  readonly distance: number;
  readonly level: "safe" | "warning" | "danger";
}

export function TechnicalDataLog({
  data,
  currentFrame,
  totalFrames,
  progress,
}: TechnicalDataLogProps) {
  const roverPosition = data.rover.position;

  /**
   * Importante:
   * data.plants y data.obstacles vienen desde playbackData.
   * Eso significa que aquí solo aparecen objetos ya revelados
   * por la simulación.
   */
  const plants = data.plants;
  const obstacles = data.obstacles;

  const nearestPlant = getNearestEntity(roverPosition, plants);
  const nearestObstacle = getNearestEntity(roverPosition, obstacles);
  const nearestPlantPair = getNearestPair(plants);

  const objectRows: ReadonlyArray<ObjectLogRow> = [
    ...plants.map((plant, index) =>
      createPlantLogRow(plant, index, roverPosition)
    ),
    ...obstacles.map((obstacle, index) =>
      createObstacleLogRow(obstacle, index, roverPosition)
    ),
  ];

  const measurementRows: ReadonlyArray<MeasurementLogRow> = [
    nearestPlant
      ? {
          id: "rover-nearest-plant",
          label: "ROVER → planta cercana",
          target: nearestPlant.id,
          distance: toMeters(distance(roverPosition, nearestPlant)),
          level: "safe",
        }
      : undefined,

    nearestObstacle
      ? {
          id: "rover-nearest-obstacle",
          label: "ROVER → obstáculo cercano",
          target: nearestObstacle.id,
          distance: toMeters(distance(roverPosition, nearestObstacle)),
          level: "danger",
        }
      : undefined,

    nearestPlantPair
      ? {
          id: "nearest-plant-pair",
          label: "Separación vegetal mínima",
          target: `${nearestPlantPair.from.id} ↔ ${nearestPlantPair.to.id}`,
          distance: toMeters(distance(nearestPlantPair.from, nearestPlantPair.to)),
          level: "warning",
        }
      : undefined,
  ].filter(isDefined) as ReadonlyArray<MeasurementLogRow>;

  return (
    <details className="technicalLogPanel panelGlass" open>
      <summary className="technicalLogSummary">
        <div>
          <p className="panelKicker">Registro técnico</p>
          <h2>Datos capturados por el rover</h2>
        </div>

        <span>{objectRows.length} registros</span>
      </summary>

      <div className="technicalLogBody">
        <section className="technicalLogStats">
          <article>
            <span>Frame actual</span>
            <strong>
              {currentFrame + 1}/{totalFrames}
            </strong>
          </article>

          <article>
            <span>Progreso</span>
            <strong>{progress}%</strong>
          </article>

          <article>
            <span>Pose rover</span>
            <strong>
              x:{formatNumber(data.rover.position.x)} y:
              {formatNumber(data.rover.position.y)}
            </strong>
          </article>

          <article>
            <span>Heading</span>
            <strong>{Math.round(data.rover.angle)}°</strong>
          </article>
        </section>

        <section className="technicalLogSection">
          <div className="technicalLogHeader">
            <h3>Objetos registrados</h3>
            <span>Plantas + obstáculos visibles</span>
          </div>

          <div className="technicalTableWrapper">
            <table className="technicalTable">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>ID</th>
                  <th>Coordenadas</th>
                  <th>Distancia rover</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {objectRows.length > 0 ? (
                  objectRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span
                          className={`logType logType--${
                            row.type === "PLANTA" ? "plant" : "obstacle"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>

                      <td>
                        <strong>{row.label}</strong>
                        <small>{row.detail}</small>
                      </td>

                      <td>
                        x:{formatNumber(row.x)} · y:{formatNumber(row.y)}
                      </td>

                      <td>{row.distanceToRover}m</td>

                      <td>{row.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="emptyLogCell">
                      Aún no hay objetos registrados. Inicia la simulación para
                      que el rover detecte plantas y obstáculos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="technicalLogSection">
          <div className="technicalLogHeader">
            <h3>Mediciones activas</h3>
            <span>Relaciones calculadas</span>
          </div>

          <div className="measurementLogList">
            {measurementRows.length > 0 ? (
              measurementRows.map((measurement) => (
                <article
                  key={measurement.id}
                  className={`measurementLogItem measurementLogItem--${measurement.level}`}
                >
                  <div>
                    <strong>{measurement.label}</strong>
                    <span>{measurement.target}</span>
                  </div>

                  <p>{measurement.distance}m</p>
                </article>
              ))
            ) : (
              <p className="emptyLogMessage">
                Sin mediciones activas todavía. El rover debe detectar objetos
                primero.
              </p>
            )}
          </div>
        </section>
      </div>
    </details>
  );
}

function createPlantLogRow(
  plant: RenderPlant,
  index: number,
  roverPosition: RenderPoint
): ObjectLogRow {
  return {
    id: plant.id,
    type: "PLANTA",
    label: `P-${String(index + 1).padStart(2, "0")}`,
    x: plant.x,
    y: plant.y,
    distanceToRover: toMeters(distance(roverPosition, plant)),
    status: plant.detected ? "Confirmada" : "Pendiente",
    detail: plant.id,
  };
}

function createObstacleLogRow(
  obstacle: RenderObstacle,
  index: number,
  roverPosition: RenderPoint
): ObjectLogRow {
  const distanceToRover = toMeters(distance(roverPosition, obstacle));

  return {
    id: obstacle.id,
    type: "OBSTÁCULO",
    label: `OBS-${index + 1}`,
    x: obstacle.x,
    y: obstacle.y,
    distanceToRover,
    status: getRiskLabel(distanceToRover),
    detail: `radio visual ${obstacle.size}`,
  };
}

function getNearestEntity<T extends RenderPoint>(
  origin: RenderPoint,
  entities: ReadonlyArray<T>
): T | undefined {
  return [...entities].sort(
    (first, second) => distance(origin, first) - distance(origin, second)
  )[0];
}

function getNearestPair<T extends RenderPoint>(
  entities: ReadonlyArray<T>
):
  | {
      readonly from: T;
      readonly to: T;
    }
  | undefined {
  if (entities.length < 2) return undefined;

  let bestPair:
    | {
        readonly from: T;
        readonly to: T;
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

function distance(first: RenderPoint, second: RenderPoint): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function toMeters(svgDistance: number): number {
  return Math.round(svgDistance * 0.22 * 10) / 10;
}

function formatNumber(value: number): number {
  return Math.round(value * 10) / 10;
}

function getRiskLabel(distanceToRover: number): string {
  if (distanceToRover <= 3) return "Riesgo alto";
  if (distanceToRover <= 6) return "Riesgo medio";
  return "Riesgo bajo";
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}