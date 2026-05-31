import type {
    PlaybackStep,
  RoverPosition,
  SimulationEvent,
} from "../modules/mapping/mappingTypes";

export function buildPlayback(
  trajectory: RoverPosition[],
  events: SimulationEvent[]
): PlaybackStep[] {

  return trajectory.map((point, index) => ({
    step: index + 1,

    rover: {
      x: point.x,
      y: point.y,
    },

    events: events.filter(
      event => event.step === index + 1
    ),
  }));
}