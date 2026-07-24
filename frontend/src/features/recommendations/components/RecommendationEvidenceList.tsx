/**
 * =========================================
 * RecommendationEvidenceList
 * =========================================
 *
 * Lista visual de evidencia asociada a una recomendación.
 *
 * Finalidad:
 * - mostrar de dónde sale la recomendación;
 * - evidenciar métricas, fuente y estado;
 * - mantener trazabilidad técnica para demo.
*/

import type { EvidenceItem } from "../types/recommendations.types";

interface RecommendationEvidenceListProps {
    readonly evidence: ReadonlyArray<EvidenceItem>;
}

export function RecommendationEvidenceList({ evidence }: RecommendationEvidenceListProps) {
    if (evidence.length === 0) {
        return (
            <section className="recommendationEvidenceList">
                <p className="recommendationEvidenceList__empty">No evidence available.</p>
            </section>
        );
    }

    return (
        <section className="recommendationEvidenceList" aria-labe="Evidence list">
            {evidence.map((item) => (
                <EvidenceItemCard 
                 key={`${item.source}-${String(item.value ?? "none")}`} 
                 evidence={item} />
            ))}
        </section>
    );
}

interface EvidenceItemCardProps {
    readonly evidence: EvidenceItem;
}

function EvidenceItemCard({ evidence }: EvidenceItemCardProps) {
    return (
        <article className={`recommendationEvidenceItem recommendationEvidenceItem--${evidence.status.toLowerCase()}`}>
            <strong>{evidence.source}</strong>
            <span>
                {evidence.metric}: {String(evidence.value ?? "N/A")}
                {evidence.unit ? ` ${evidence.unit}` : ""}
            </span>
            <small>{evidence.explanation}</small>
        </article>
    );
}