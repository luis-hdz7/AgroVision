import type {
    PlaybackStep,
  RoverPosition,
  SimulationEvent,
} from "../modules/mapping/mappingTypes";

//se cambio PlayBackStep[] para devolver 1 playback unico

export function buildPlayback(
  trajectory: RoverPosition[],
  events: SimulationEvent[]
) {
  const frames = trajectory.map((point, index) => ({
    step: index + 1,
    rover: {
      x: point.x,
      y: point.y,
    },
    events: events.filter(event => event.step === index + 1),
  }));

  return {
    frames
  };
}
