/**
 * =========================================
 * useSimulationPlayback
 * =========================================
 *
 * Hook de reproducción visual del rover.
 *
 * Responsabilidad:
 * - avanzar la simulación frame por frame;
 * - actualizar la posición del rover;
 * - mostrar trayectoria progresiva;
 * - exponer controles start/pause/reset;
 * - calcular progreso visual.
 *
 * Conexión futura:
 * Cuando backend entregue /api/mapping/playback,
 * este hook podrá recibir frames reales en vez de usar trajectory.
 * =========================================
 */


import { useEffect, useMemo, useState } from "react";
import type {
  RenderObstacle,
  RenderPlant,
  RenderPoint,
  RenderSimulationData,
} from "../types/mappingRender.types";

interface UseSimulationPlaybackResult {
  readonly playbackData: RenderSimulationData;
  readonly isPlaying: boolean;
  readonly progress: number;
  readonly currentFrame: number;
  readonly totalFrames: number;
  readonly start: () => void;
  readonly pause: () => void;
  readonly reset: () => void;
}

// Número de frames interpolados.
const INTERPOLATION_STEPS = 20;
// Intervalo de reproducción en ms.
const PLAYBACK_INTERVAL_MS = 200;
// Radio de detección
const DETECTION_RADIUS = 16;

export function useSimulationPlayback(
  data: RenderSimulationData
): UseSimulationPlaybackResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  /**
   * Ruta total real.
   *
   * Importante:
   * Aquí unimos trajectory + plannedPath.
   * Así el rover NO se queda a medio camino.
   */
  const fullRoute = useMemo<ReadonlyArray<RenderPoint>>(() => {
    return mergeRoute(data.trayectory, data.plannedPath ?? []);
  }, [data.trayectory, data.plannedPath]);

  /**
   * Ruta suavizada.
   *
   * Convierte saltos grandes en pasos pequeños.
   */
  const smoothRoute = useMemo<ReadonlyArray<RenderPoint>>(() => {
    return interpolateRoute(fullRoute, INTERPOLATION_STEPS);
  }, [fullRoute]);

  const totalFrames = smoothRoute.length;
  const lastFrameIndex = Math.max(totalFrames - 1, 0);
  const safeCurrentFrame = Math.min(currentFrame, lastFrameIndex);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = window.setInterval(() => {
      setCurrentFrame((frame) => {
        const nextFrame = frame + 1;

        if (nextFrame >= totalFrames) {
          setIsPlaying(false);
          return lastFrameIndex;
        }

        return nextFrame;
      });
    }, PLAYBACK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, totalFrames, lastFrameIndex]);

  /**
   * Línea azul gruesa.
   *
   * Esta es la clave:
   * solo contiene lo que el rover YA recorrió.
   * Por eso crece progresivamente.
   */
  const visibleTrajectory = useMemo<ReadonlyArray<RenderPoint>>(() => {
        if (smoothRoute.length === 0) return [];

        if (!hasStarted) {
            return [smoothRoute[0]];
        }

        return smoothRoute.slice(0, safeCurrentFrame + 1);
    }, [smoothRoute, safeCurrentFrame, hasStarted]);
  /**
   * Línea punteada.
   *
   * Ruta pendiente desde la posición actual hasta el final.
   */
  const pendingTrajectory = useMemo<ReadonlyArray<RenderPoint>>(() => {
    if (smoothRoute.length === 0) return [];

    return smoothRoute.slice(safeCurrentFrame);
  }, [smoothRoute, safeCurrentFrame]);

  const currentPosition =
    smoothRoute[safeCurrentFrame] ?? data.rover.position;

  const previousPosition =
    smoothRoute[Math.max(safeCurrentFrame - 1, 0)] ?? currentPosition;

  const roverAngle = getHeadingAngle(
    previousPosition,
    currentPosition,
    data.rover.angle
  );

  /**
   * Antes de iniciar no revelamos detecciones.
   */
  const canRevealDetections = hasStarted && safeCurrentFrame > 0;

  const visiblePlants = useMemo<ReadonlyArray<RenderPlant>>(() => {
    if (!canRevealDetections) return [];

    return data.plants.filter((plant) =>
      wasDetectedByRoute(plant, visibleTrajectory, DETECTION_RADIUS)
    );
  }, [data.plants, visibleTrajectory, canRevealDetections]);

  const visibleObstacles = useMemo<ReadonlyArray<RenderObstacle>>(() => {
    if (!canRevealDetections) return [];

    return data.obstacles.filter((obstacle) =>
      wasDetectedByRoute(obstacle, visibleTrajectory, DETECTION_RADIUS)
    );
  }, [data.obstacles, visibleTrajectory, canRevealDetections]);

  const progress =
    totalFrames > 1
      ? Math.round((safeCurrentFrame / lastFrameIndex) * 100)
      : 100;

  /**
   * Data final que recibe TerrainCanvas.
   *
   * MUY IMPORTANTE:
   * trajectory = visibleTrajectory
   *
   * Si aquí pones data.trajectory, la línea azul gruesa aparece completa
   * desde el inicio y se rompe la simulación.
   */
  const playbackData = useMemo<RenderSimulationData>(() => {
    return {
      ...data,

      rover: {
        ...data.rover,
        position: currentPosition,
        angle: roverAngle,
        status: isPlaying ? "MOVING" : data.rover.status,
      },

      // Línea azul gruesa: recorrido ya realizado.
      trayectory: visibleTrajectory,

      // Línea punteada: recorrido pendiente.
      plannedPath: pendingTrajectory.length > 1 ? pendingTrajectory : [],

      // Detecciones progresivas.
      plants: visiblePlants,
      obstacles: visibleObstacles,

      // Telemetría progresiva.
      stats: {
        plantsDetected: visiblePlants.filter((plant) => plant.detected).length,
        obstaclesDetected: visibleObstacles.length,
        distanceTraveled: Math.round(
          data.stats.distanceTraveled * (progress / 100)
        ),
        inspectedPercentage: Math.round(
          data.stats.inspectedPercentage * (progress / 100)
        ),
      },
    };
  }, [
    data,
    currentPosition,
    roverAngle,
    isPlaying,
    visibleTrajectory,
    pendingTrajectory,
    visiblePlants,
    visibleObstacles,
    progress,
  ]);

  function start() {
    if (safeCurrentFrame >= lastFrameIndex) {
      setCurrentFrame(0);
    }

    setHasStarted(true);
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function reset() {
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentFrame(0);
  }

  return {
    playbackData,
    isPlaying,
    progress,
    currentFrame: safeCurrentFrame,
    totalFrames,
    start,
    pause,
    reset,
  };
}

function mergeRoute(
  trajectory: ReadonlyArray<RenderPoint>,
  plannedPath: ReadonlyArray<RenderPoint>
): ReadonlyArray<RenderPoint> {
  if (trajectory.length === 0) return plannedPath;
  if (plannedPath.length === 0) return trajectory;

  const lastTrajectoryPoint = trajectory[trajectory.length - 1];
  const firstPlannedPoint = plannedPath[0];

  const isDuplicated =
    lastTrajectoryPoint.x === firstPlannedPoint.x &&
    lastTrajectoryPoint.y === firstPlannedPoint.y;

  return isDuplicated
    ? [...trajectory, ...plannedPath.slice(1)]
    : [...trajectory, ...plannedPath];
}

function interpolateRoute(
  points: ReadonlyArray<RenderPoint>,
  stepsPerSegment: number
): ReadonlyArray<RenderPoint> {
  if (points.length <= 1) return points;

  const result: RenderPoint[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];

    for (let step = 0; step < stepsPerSegment; step += 1) {
      const factor = step / stepsPerSegment;

      result.push({
        x: lerp(start.x, end.x, factor),
        y: lerp(start.y, end.y, factor),
      });
    }
  }

  result.push(points[points.length - 1]);

  return result;
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function wasDetectedByRoute(
  target: RenderPoint,
  route: ReadonlyArray<RenderPoint>,
  radius: number
): boolean {
  return route.some((point) => distance(point, target) <= radius);
}

function distance(first: RenderPoint, second: RenderPoint): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function getHeadingAngle(
  previous: RenderPoint,
  current: RenderPoint,
  fallbackAngle: number
): number {
  const deltaX = current.x - previous.x;
  const deltaY = current.y - previous.y;

  if (deltaX === 0 && deltaY === 0) return fallbackAngle;

  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
}