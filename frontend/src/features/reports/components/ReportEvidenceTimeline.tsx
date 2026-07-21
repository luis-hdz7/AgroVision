/**
 * =========================================
 * ReportEvidenceTimeline
 * =========================================
 *
 * Timeline de evidencia del reporte.
 *
 * Finalidad:
 * - mostrar trazabilidad técnica;
 * - explicar fuente, métrica, valor y estado;
 * - demostrar que la recomendación no sale de un dato aislado.
*/

import type { EvidenceItem } from "../types/reports.types";

interface ReportEvidenceTimelineProps {
  readonly evidence: ReadonlyArray<EvidenceItem>;
}

export function ReportEvidenceTimeline({  evidence }: ReportEvidenceTimelineProps) {
    if (evidence.length === 0) {
        return (
            <section className="reportPanel">
                <header>
                    <p>Evidence timeline</p>
                    <h2>Sin evidencia disponible</h2>
                </header>
            </section>
        );
    }

    return (
        <section className="reportPanel">
            <header>
                <p>Evidence timeline</p>
                <h2>Trazabilidad multifuente</h2>
            </header>

            <div className="reportEvidenceTimeline">
                {evidence.map((item) => (
                <article
                    key={`${item.source}-${item.metric}-${String(item.value ?? "none")}`}
                    className={`reportEvidenceItem reportEvidenceItem--${item.status.toLowerCase()}`}
                >
                    <div>
                        <strong>{item.source}</strong>
                        <span>{item.capturedAt ? formatShortDate(item.capturedAt) : "No date"}</span>
                    </div>

                    <h3>
                        {item.metric}: {String(item.value ?? "N/A")}
                        {item.unit ? ` ${item.unit}` : ""}
                    </h3>
                    <p>{item.explanation}</p>
                </article>
                ))}
            </div>
        </section>
    );
}


function formatShortDate(value: string): string {
    return new Intl.DateTimeFormat("es-NI", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}