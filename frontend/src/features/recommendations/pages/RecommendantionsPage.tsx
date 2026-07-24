/**
 * =========================================
 * RecommendationsPage
 * =========================================
 *
 * Pantalla funcional de recomendaciones prescriptivas.
 *
 * Finalidad:
 * - eliminar placeholder de /recommendations;
 * - consumir recomendaciones desde service;
 * - mostrar razón, acción sugerida, impacto y evidencia;
 * - soportar loading, error y empty state.
 */

import { useEffect, useState } from "react";
import { RecommendationCard } from "../components/RecommendationCard";
import { getRecommendationsData } from "../services/recommendationsService";
import type { RecommendationsData } from "../types/recommendations.types";
import "../recommendations.css";

export function RecommendationsPage() {
    
    const [recommendationsData, setRecommendationsData] = useState<RecommendationsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Carga recomendaciones desde service, el service decide si usa backend real o fallback.
    useEffect(() => {
        async function loadRecommendations() {
            try {
                const data = await getRecommendationsData();
                setRecommendationsData(data);
                setErrorMessage(null);
            } catch {
                setErrorMessage("No se pudieron cargar las recomendaciones.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadRecommendations();
    }, []);

    return (
        <section
        className="recommendationsPage"
        aria-labelledby="recommendations-title"
        >
            <header className="recommendationsHero">
                <div>
                    <p className="recommendationsHero__eyebrow">
                        Recomendaciones prescriptivas
                    </p>
                    <h1 id="recommendations-title">Acciones Agrícolas</h1>
                    <span>
                        Cada recomendación conecta razón, acción sugerida, impacto esperado
                        y evidencia multifuente para apoyar decisiones técnicas.
                    </span>
                </div>
            </header>

            {isLoading && (
                <section className="recommendationsState">
                    <p>Cargando recomendaciones prescriptivas...</p>
                </section>
            )}

            {errorMessage && (
                <section className="recommendationsState recommendationsState--error">
                    <p>{errorMessage}</p>
                </section>
            )}

            {!isLoading && !errorMessage && recommendationsData && (
                <>
                <section
                    className="recommendationsSummaryGrid"
                    aria-label="Recommendations summary"
                >
                    <article>
                        <span>Recomendaciones totales</span>
                        <strong>{recommendationsData.recommendations.length}</strong>
                    </article>
                    <article>
                        <span>Urgente</span>
                        <strong>{recommendationsData.totalUrgent}</strong>
                    </article>
                    <article>
                        <span>Prioridad máxima</span>
                        <strong>{recommendationsData.totalHighPriority}</strong>
                    </article>
                </section>

                {recommendationsData.mainRecommendation && (
                    <RecommendationCard
                    recommendation={recommendationsData.mainRecommendation}
                    isMain/>
                )}

                {recommendationsData.recommendations.length === 0 ? (
                    <section className="recommendationsState">
                        <p>No hay recomendaciones disponibles.</p>
                    </section>
                ) : (
                    <section
                    className="recommendationsGrid"
                    aria-label="Recommendations list">
                    {recommendationsData.recommendations.map((recommendation) => (
                        <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}/>
                    ))}
                    </section>
                )}
                </>
            )}
        </section>
    );
}