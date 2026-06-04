import type {
  Coordinate,
  MappingPlaybackData,
  PlaybackFrame,
  SimulationEvent,
} from "../modules/mapping/mappingTypes";


/**
  * Crea una línea de tiempo de reproducción del backend.

  * Este endpoint es opcional para el frontend actual, ya que este ya incluye useSimulationPlayback.ts. 
  * Sin embargo, mantenerlo estable permite que futuras versiones reciban fotogramas precalculados del backend.
*/

export function buildPlayback(
  trajectory: ReadonlyArray<Coordinate>,
  events: ReadonlyArray<SimulationEvent>
): MappingPlaybackData {
  const frames: PlaybackFrame[] =
    trajectory.map((point, index) => {
      const step = index + 1;

      return {
        step,
        rover: {
          x: point.x,
          y: point.y,
        },
        angle: getHeadingAngle(
          trajectory,
          index
        ),
        events: events.filter(
          (event) => event.step === step
        ),
      };
    });

  return {
    frames,
  };
}

function getHeadingAngle(
  trajectory: ReadonlyArray<Coordinate>,
  index: number): number {
  if (trajectory.length < 2 || index === 0) {
    return 0;
  }

  const previous = trajectory[index - 1];

  const current = trajectory[index];

  return Math.round(
    Math.atan2(
      current.y - previous.y,
      current.x - previous.x
    ) * (180 / Math.PI)
  );
}