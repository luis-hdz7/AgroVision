
/**
 * =========================================
 * FinalSummaryCard
 * =========================================
 *
 * Resumen final del mapeo.
 *
 * Responsabilidad:
 * Mostrar un cierre rápido del estado actual de la simulación.
 *
 * Más adelante, cuando exista /api/mapping/summary,
 * este componente podrá recibir el resumen real del backend.
 * =========================================
 */

import type { RenderSimulationData } from "../types/mappingRender.types";

interface FinalSummaryCardProps {
  readonly data: RenderSimulationData;
}

export function FinalSummaryCard({ data }: FinalSummaryCardProps) {
  return (
    <section className="finalSummaryCard panelGlass">
      <p className="panelKicker">Resumen</p>
      <h2>Resultado parcial</h2>

      <div className="summaryList">
        <div className="summaryList">
          <span>Área inspeccionada</span>
          <strong>{data.stats.inspectedPercentage}%</strong>
        </div>

        <div className="summaryList">
          <span>Plantas detectadas</span>
          <strong>{data.stats.plantsDetected}</strong>
        </div>

        <div className="summaryList">
          <span>Obstáculos</span>
          <strong>{data.stats.obstaclesDetected}</strong>
        </div>

        <div className="summaryList">
          <span>Batería actual</span>
          <strong>{data.rover.battery}%</strong>
        </div>
      </div>
    </section>
  );
}


