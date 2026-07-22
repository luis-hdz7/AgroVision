/**
 * =========================================
 * AlertCard
 * =========================================
 *
 * Componente visual para una alerta agrícola.
 *
 * Finalidad:
 * - mostrar severidad;
 * - mostrar zona afectada;
 * - explicar evidencia;
 * - mostrar acción recomendada.
*/

import type { AgriculturalAlert, EvidenceItem } from "../types/alerts.types";

interface AlertCardProps {
    readonly alert: AgriculturalAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
    return (
        <article className={`alertCard alertCard--${alert.severity.toLowerCase()}`}>
            <header className="alertCard__header">
                <div>
                    <p>{alert.type}</p>
                    <h2>{alert.title}</h2>
                    <span>{alert.message}</span>
                </div>

                <strong>{alert.severity}</strong>
            </header>

            <section className="alertCard__meta" aria-label="Alert metadata">
                <span>Field: {alert.fieldId}</span>
                <span>Zone: {alert.zoneId ?? "N/A"}</span>
                <span>Status: {alert.status}</span>
            </section>

            <section className="alertCard__section">
                <h3>Evidence</h3>

                <div className="alertEvidenceList">
                {alert.evidence.map((item) => (
                    <EvidenceItemCard
                    key={`${alert.id}-${item.source}-${item.metric}`}
                    evidence={item}
                    />
                ))}
                </div>
            </section>

            <footer className="alertCard__footer">
                <small>Recommended action</small>
                <p>{alert.recommendedAction}</p>
            </footer>
        </article>
    );
}

interface EvidenceItemCardProps {
    readonly evidence: EvidenceItem;
}

function EvidenceItemCard({ evidence }: EvidenceItemCardProps) {
    return (
        <article className={`alertEvidenceItem alertEvidenceItem--${evidence.status.toLowerCase()}`}>
            <strong>{evidence.source}</strong>
            <span>
                {evidence.metric}: {String(evidence.value ?? "N/A")}
                {evidence.unit ? ` ${evidence.unit}` : ""}
            </span>
            <small>{evidence.explanation}</small>
        </article>
    );
}