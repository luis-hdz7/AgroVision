/**
 * =========================================
 * VisionSummaryCard
 * =========================================
 *
 * Card de resumen del análisis visual IA.
 *
 * Finalidad:
 * - mostrar última predicción visual;
 * - mostrar confianza del análisis;
 * - explicar el resultado en lenguaje técnico simple.
*/

import type { DashboardSummary } from "../types/dashboard.types";
type VisionSummary = DashboardSummary["vision"];

interface VisionSummaryCardProps {
    readonly vision: VisionSummary;
}

/**
 * Renderiza el resumen visual de IA.
 *
 * Funcionamiento:
 * - recibe datos ya normalizados desde summary.vision;
 * - convierte confidence de 0-1 a porcentaje;
 * - muestra lastPrediction como valor técnico del contrato.
*/

export function VisionSummaryCard({ vision }: VisionSummaryCardProps) {
    // El contrato maneja confidence como decimal; UI lo muestra como porcentaje.
    const confidencePercentage = Math.round(vision.confidence * 100);

    return (
        <article className="dashboardPanel">
            <header>
                <p>Análisis visual preliminar</p>
                <h2>{vision.lastPrediction}</h2>
            </header>

            <strong>{confidencePercentage}% confianza</strong>
            <span>{vision.explanation}</span>
        </article>
    );
}