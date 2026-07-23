/**
 * =========================================
 * MainRecommendationCard
 * =========================================
 *
 * Card para la recomendación principal del dashboard.
 *
 * Finalidad:
 * - mostrar prioridad;
 * - mostrar acción sugerida;
 * - explicar la razón;
 * - mostrar impacto esperado.
*/

import type { DashboardSummary } from "../types/dashboard.types";

type MainRecommendation =
    DashboardSummary["recommendations"]["mainRecommendation"];

interface MainRecommendationCardProps {
    readonly recommendation: MainRecommendation;
}

/**
 * Renderiza la recomendación principal.
 *
 * Funcionamiento:
 * - recibe la recomendación ya calculada desde summary;
 * - no decide prioridad;
 * - no modifica datos;
 * - solo representa información accionable.
*/

export function MainRecommendationCard({ recommendation }: MainRecommendationCardProps) {
    return (
        <article className="dashboardPanel">
            <header>
                <p>Recomendación principal</p>
                <h2>{recommendation.priority}</h2>
            </header>

            <strong>{recommendation.suggestedAction}</strong>
            <span>{recommendation.reason}</span>

            <footer>
                <small>{recommendation.expectedImpact.impactArea}</small>
                <p>{recommendation.expectedImpact.description}</p>
            </footer>
        </article>
    );
}