/**
 * =========================================
 * RecommendationCard
 * =========================================
 *
 * Card visual para una recomendación prescriptiva.
 *
 * Finalidad:
 * - mostrar prioridad;
 * - explicar razón;
 * - mostrar acción sugerida;
 * - mostrar impacto esperado;
 * - mostrar evidencia asociada.
*/

import { ExpectedImpactBadge } from "./ExpectedImpactBadge";
import { RecommendationEvidenceList } from "./RecommendationEvidenceList";
import type { Recommendation } from "../types/recommendations.types";

interface RecommendationCardProps {
    readonly recommendation: Recommendation;
    readonly isMain?: boolean;
}

export function RecommendationCard({ recommendation, isMain = false }: RecommendationCardProps) {
    return (
        <article className={isMain ? "recommendationCard recommendationCard--main" : "recommendationCard"}>
            <header className="recommendationCard__header">
                <div>
                    <p>{recommendation.priority}</p>
                    <h2>{isMain ? "Main recommendation" : "Recommended action"}</h2>
                    <span>{recommendation.reason}</span>
                </div>
                <strong>{recommendation.status}</strong>
            </header>
            <section className="recommendationCard__action">
                <small>Suggested action</small>
                <p>{recommendation.suggestedAction}</p>
            </section>

            <ExpectedImpactBadge impact={recommendation.expectedImpact} />

            <section className="recommendationCard__meta">
                <span>Field: {recommendation.fieldId}</span>
                <span>Zone: {recommendation.zoneId ?? "N/A"}</span>
                <span>Created: {formatShortDate(recommendation.createdAt)}</span>
            </section>
            <section className="recommendationCard__evidence">
                <h3>Evidence</h3>
                <RecommendationEvidenceList evidence={recommendation.evidence} />
            </section>
        </article>
    );
}


function formatShortDate(value: string): string {
    return new Intl.DateTimeFormat("es-NI", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}