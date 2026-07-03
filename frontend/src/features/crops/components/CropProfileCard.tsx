/**
 * =========================================
 * CropProfileCard
 * =========================================
 *
 * Card visual de perfil de cultivo.
 *
 * Finalidad:
 * - mostrar el contexto agrícola del cultivo;
 * - listar riesgos, métricas y enfoque de análisis;
 * - exponer una recomendación base sin ejecutar lógica de backend. (al menos en esta etapa del proyecyo )
 
*/


import type { CropProfile } from "../types/cropProfile.types";

interface CropProfileCardProps {
    readonly cropProfile: CropProfile;
}

export function CropProfileCard({ cropProfile }: CropProfileCardProps) {

    const primaryRecommendation = cropProfile.recommendationTemplates.inspection;

    return (
        <article className="cropProfileCard">
            <header className="cropProfileCard__header">
                <div>
                    <p>{cropProfile.cropType}</p>
                    <h2>{cropProfile.displayName}</h2>
                    <span>{cropProfile.scientificName ?? "Scientific name unavailable"}</span>
                </div>

                    <strong>{cropProfile.mainRisks.length} risks</strong>
            </header>

            <section className="cropProfileCard__section">
                <h3>Analysis focus</h3>

                <div className="cropProfileCard__chips">
                    {cropProfile.analysisFocus.map((focus) => (
                        <span key={focus}>{focus}</span>
                    ))}
                </div>
            </section>

             <section className="cropProfileCard__section">
                <h3>Main risks</h3>

                <div className="cropProfileCard__chips cropProfileCard__chips--risk">
                    {cropProfile.mainRisks.map((risk) => (
                        <span key={risk}>{risk}</span>
                    ))}
                </div>
            </section>

            <section className="cropProfileCard__section">
                <h3>Preferred metrics</h3>

                <div className="cropProfileCard__metrics">
                    {cropProfile.preferredMetrics.map((metric) => (
                        <span key={metric}>{metric}</span>
                    ))}
                </div>
            </section>

            <footer className="cropProfileCard__footer">
                <small>Base recommendation</small>
                <p>{primaryRecommendation}</p>
            </footer>
        </article>
    );
}