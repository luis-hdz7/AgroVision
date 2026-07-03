/**
 * =========================================
 * VisionResultCard
 * =========================================
 *
 * Card para el resultado del análisis visual.
 *
 * Finalidad:
 * - mostrar predicción, confianza y métricas;
 * - explicar evidencia visual;
 * - mostrar las acciones recomendadas.
 */

import type { VisionInspection } from "../types/visionAi.types";

interface VisionResultCardProps {
    readonly result: VisionInspection;
}

export function VisionResultCard({ result }: VisionResultCardProps) {
    return (
        <article className="visionResultCard">
            <header className="visionResultCard__header">
                <div>
                    <p>Prediction</p>
                    <h2>{formatPrediction(result.prediction)}</h2>
                    <span>{Math.round(result.confidence * 100)}% confidence</span>
                </div>
                <strong>{result.cropType}</strong>
            </header>

            <section className="visionResultCard__metrics">
                <MetricBox
                    label="Green coverage"
                    value={formatMetric(result.visualMetrics.greenCoveragePercentage, "%")}
                />

                    <MetricBox
                    label="Dry area"
                    value={formatMetric(result.visualMetrics.dryAreaPercentage, "%")}
                />

                    <MetricBox
                    label="Chlorosis"
                    value={formatBoolean(result.visualMetrics.chlorosisSuspected)}
                />

                    <MetricBox
                    label="Leaf spot"
                    value={formatBoolean(result.visualMetrics.leafSpotSuspected)}
                />
            </section>

            <section className="visionResultCard__section">
                <h3>Explanation</h3>
                <p>{result.explanation}</p>
            </section>

            <section className="visionResultCard__section">
                <h3>Recommended action</h3>
                <p>{result.recommendedAction}</p>
            </section>

            <section className="visionResultCard__section">
                <h3>Evidence</h3>

                <div className="visionEvidenceList">
                    {result.evidence.map((item) => (
                        <article
                            key={`${item.source}-${item.metric}`}
                            className={`visionEvidenceItem visionEvidenceItem--${item.status.toLowerCase()}`}
                        >
                        <strong>{item.metric}</strong>
                        <span>
                            {String(item.value ?? "N/A")}
                            {item.unit ? ` ${item.unit}` : ""}
                        </span>
                        <small>{item.explanation}</small>
                        </article>
                    ))}
                </div>
            </section>
        </article>
    );
}

interface MetricBoxProps {
    readonly label: string;
    readonly value: string;
}

function MetricBox({ label, value }: MetricBoxProps) {
    return (
        <article className="visionMetricBox">
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    )
}

// Función auxiliar para formatear el texto de una 2predicción" en forma legible, reemplazando guiones bajos por espacios
function formatPrediction(prediction: string): string {
    return prediction.replaceAll("_", " ");
}

function formatMetric(value: number | null | undefined, unit: string): string {
    if (value === null || value === undefined) return "N/A";
    
    return `${value} ${unit}`;
}

function formatBoolean(value: boolean | null | undefined): string {
    if (value === null || value === undefined) return "N/A";
    
    return value ? "YES" : "NO";
}

