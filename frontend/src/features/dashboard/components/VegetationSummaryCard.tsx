/**
 * =========================================
 * VegetationSummaryCard
 * =========================================
 *
 * Card de resumen de vegetación.
 *
 * Finalidad:
 * - mostrar vigor vegetal;
 * - indicar si existe anomalía;
 * - explicar el resultado de la capa satelital simulada.
*/

import type { DashboardSummary } from "../types/dashboard.types";

type VegetationSummary = DashboardSummary["vegetation"];

interface VegetationSummaryCardProps {
    readonly vegetation: VegetationSummary;
}

/**
 * Renderiza el resumen de vegetación.
 *
 * Funcionamiento:
 * - recibe datos ya preparados desde summary.vegetation;
 * - muestra vigorLevel como indicador principal;
 * - traduce anomalyDetected a texto legible;
 * - muestra explanation como soporte.
*/
export function VegetationSummaryCard({ vegetation }: VegetationSummaryCardProps) {

    // Texto calculado solo para visualización.
    const anomalyText = vegetation.anomalyDetected ? "Anomalía detectada" : "Sin anomalía relevante";

    return (
      <article className="dashboardPanel">
        <header>
          <p>Vegetación simulada</p>
          <h2>{vegetation.vigorLevel}</h2>
        </header>

        <strong>{anomalyText}</strong>
        <span>{vegetation.explanation}</span>
      </article>
    );
}