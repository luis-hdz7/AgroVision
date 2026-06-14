/**
 * =========================================
 * MappingPage
 * =========================================
 *
 * Página principal del módulo Mapping 2D.
 *
 * Integra entregables de:
 *
 * Frontend 1:
 * - layout general;
 * - controles;
 * - telemetría;
 * - resumen;
 * - organización visual.
 *
 * Frontend 2:
 * - render técnico;
 * - playback;
 * - rover;
 * - trayectoria;
 * - plantas;
 * - obstáculos;
 * - LiDAR sweep;
 * - datos backend-ready.
 *
 * Flujo:
 * mappingService
 *   ↓
 * mappingAdapter
 *   ↓
 * useSimulationPlayback
 *   ↓
 * TerrainCanvas + paneles
 * =========================================
 */

import { useEffect, useState } from "react";
import { MapLegend } from "../components/MapLegend";
import { TerrainCanvas } from "../components/TerrainCanvas";
import { useSimulationPlayback } from "../hooks/useSimulationPlayback";
import { adaptMappingData } from "../services/mappingAdapter";
import { getMappingSimulation } from "../services/mappingServices";
import { mappingMock } from "../services/mappingMock";
import type { RenderSimulationData } from "../types/mappingRender.types";
import { TechnicalDataLog } from "../components/TechnicalDataLog";
import "../mapping.css";

export function MappingPage() {
  /**
   * Estado inicial con mock adaptado.
   *
   * Esto evita render vacío y evita romper reglas de hooks.
   * Luego, si backend responde, reemplazamos esta data.
   */
  const [data, setData] = useState<RenderSimulationData>(() =>
    adaptMappingData(mappingMock)
  );

  // Indica carga inicial o recarga manual.
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Hook de playback.
   *
   * Siempre se ejecuta porque data nunca es null.
   * Esto evita errores de hooks condicionales.
   */
  const {
    playbackData,
    isPlaying,
    progress,
    currentFrame,
    totalFrames,
    start,
    pause,
    reset,
  } = useSimulationPlayback(data);

  useEffect(() => {
    // Carga inicial preparada para backend.
    void loadSimulation();
  }, []);

  async function loadSimulation() {
    setIsLoading(true);

    // Puede venir del backend o del mock fallback.
    const simulation = await getMappingSimulation();

    // Adapter protege al render ante datos fuera de rango.
    const adaptedSimulation = adaptMappingData(simulation);

    setData(adaptedSimulation);
    setIsLoading(false);
  }

  function handleResetSimulation() {
    // Reinicia playback visual.
    reset();

    // Recarga datos por si backend actualizó la simulación.
    void loadSimulation();
  }

  const detectedPlantPercentage =
    playbackData.plants.length > 0 ? Math.round((playbackData.stats.plantsDetected / playbackData.plants.length) * 100) : 0;

/**
 * Métricas visibles.
 *
 * Se alimentan desde playbackData para mantener coherencia
 * con el estado visual actual.
 */
  const metrics = [
    {
      icon: "🔋",
      label: "Batería",
      value: `${playbackData.rover.battery}%`,
      helper: "Rover operativo",
      meta: `${playbackData.rover.status} · θ ${Math.round(
      playbackData.rover.angle)}°`,
      percent: playbackData.rover.battery,
    },
    {
      icon: "🌿",
      label: "Plantas",
      value: `${playbackData.stats.plantsDetected}/${playbackData.plants.length}`,
      helper: "Clusters detectados",
      meta: `${detectedPlantPercentage}% confirmación visual`,
      percent: detectedPlantPercentage,
    },
    {
      icon: "🛑",
      label: "Obstáculos",
      value: String(playbackData.stats.obstaclesDetected),
      helper: "Alertas activas",
      meta:
      playbackData.stats.obstaclesDetected > 0
        ? "Riesgo espacial detectado"
        : "Sin riesgo visible",
      percent: Math.min(playbackData.stats.obstaclesDetected * 25, 100),
    },
    {
      icon: "📍",
      label: "Recorrido",
      value: `${playbackData.stats.distanceTraveled}m`,
      helper: "Distancia simulada",
      meta: `Frame ${currentFrame + 1}/${totalFrames} · ${progress}%`,
      percent: playbackData.stats.inspectedPercentage,
    },
  ];

  const steps = [
    { label: "1. Datos", state: "done" },
    { label: "2. Render 2D", state: "done" },
    { label: "3. Playback", state: "active" },
    { label: "4. Demo", state: "done" },
  ] as const;

  return (
    <section className="mappingDemoPage">
      <header className="mappingTopbar">
        <div className="brandCluster">
          <span className="brandMark">AG</span>

          <div>
            <strong>AGROVISION</strong>
            <span>Sprint final · Mapeo 2D</span>
          </div>
        </div>

        <div className="topbarSearch">
          Backend-ready: /api/mapping/simulation · /api/mapping/playback
        </div>

        <div className="roleBadge">
          <span>FE</span>
          <strong>Mapping Final</strong>
          <small>UI + Render</small>
        </div>
      </header>

      <main className="mappingShell">
        <section className="heroPanel">
          <div>
            <p className="eyebrow">AgroVision / Demo final</p>
            <h1>Rover Mapping System</h1>
            <p>
              Simulación técnica 2D con trayectoria progresiva, pose del rover,
              nube de puntos, barrido LiDAR, plantas y obstáculos detectados.
            </p>
          </div>

          <div className="heroActions">
            <div className="stepRail">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className={`stepChip stepChip--${step.state}`}
                >
                  <span />
                  <strong>{step.label}</strong>
                </div>
              ))}
            </div>

            <div className="simulationControls panelGlass">
              <button
                type="button"
                className="simulationButton primary"
                onClick={isPlaying ? pause : start}
              >
                {isPlaying ? "Pausar" : "Iniciar"}
              </button>

              <button
                type="button"
                className="simulationButton secondary"
                onClick={handleResetSimulation}
              >
                Reiniciar
              </button>

              <div className="playbackStatus">
                <span>
                  Frame {currentFrame + 1}/{totalFrames}
                </span>
                <strong>{progress}%</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="mappingLayout">
          <section className="mapPanel panelGlass">
            <div className="panelTitle">
              <div>
                <p className="panelKicker">Vista principal</p>
                <h2>Plano XY de escaneo</h2>
              </div>

              <div className="panelActions">
                <span className="liveDot" />
                <span>{isLoading ? "Sincronizando..." : "Datos simulados"}</span>
              </div>
            </div>

            {/* Render técnico de Frontend 2 con playback activo. */}
            <TerrainCanvas data={playbackData} />

            {/* Telemetría debajo del render para ocupar mejor el espacio horizontal. */}
            <section className="statusPanel statusPanel--wide panelGlass">
              <div className="sidePanelHeader">
                <div>
                  <p className="panelKicker">📊 Estado</p>
                  <h2>Telemetría</h2>
                </div>

                <span className="statusPill">{playbackData.rover.status}</span>
              </div>

              <div className="metricsGrid metricsGrid--wide">
                {metrics.map((metric) => (
                  <article key={metric.label} className="metricCard">
                    <span>
                      {metric.icon} {metric.label}
                    </span>

                    <strong>{metric.value}</strong>
                    <small>{metric.helper}</small>
                    <p className="metricMeta">{metric.meta}</p>

                    <div className="meterTrack">
                      <span
                        className="meterFill"
                        style={{ width: `${metric.percent}%` }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <TechnicalDataLog
              data={playbackData}
              currentFrame={currentFrame}
              totalFrames={totalFrames}
              progress={progress}
            />
          </section>

          <aside className="sidePanel">
            <MapLegend />

            <section className="finalSummaryCard panelGlass">
              <p className="panelKicker">📌 Resumen</p>
              <h2>Resultado parcial</h2>

              <div className="summaryList">
                <div>
                  <span>🌿 Plantas detectadas</span>
                  <strong>{playbackData.stats.plantsDetected}</strong>
                </div>

                <div>
                  <span>🛑 Obstáculos</span>
                  <strong>{playbackData.stats.obstaclesDetected}</strong>
                </div>

                <div>
                  <span>📍 Área inspeccionada</span>
                  <strong>{playbackData.stats.inspectedPercentage}%</strong>
                </div>

                <div>
                  <span>🔋 Batería actual</span>
                  <strong>{playbackData.rover.battery}%</strong>
                </div>

                <div>
                  <span>🎞️ Playback</span>
                  <strong>{progress}%</strong>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </section>
  );
}


