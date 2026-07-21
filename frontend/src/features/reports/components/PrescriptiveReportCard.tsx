/**
 * =========================================
 * PrescriptiveReportCard
 * =========================================
 *
 * Card principal del reporte prescriptivo.
 *
 * Finalidad:
 * - mostrar resumen del reporte;
 * - mostrar alertas activas;
 * - mostrar recomendaciones;
 * - agrupar narrativa técnica principal.
 */

import type {
  PrescriptiveReport,
  ReportAlert,
  ReportRecommendation,
} from "../types/reports.types";

interface PrescriptiveReportCardProps {
  readonly report: PrescriptiveReport;
}

export function PrescriptiveReportCard({ report }: PrescriptiveReportCardProps) {
    return (
        <article className="prescriptiveReportCard">
            <header className="prescriptiveReportCard__header">
                <div>
                    <p>Prescriptive report</p>
                    <h2>{report.zoneId} · {report.cropType}</h2>
                    <span>{report.summary}</span>
                </div>
                <strong>{report.finalRiskLevel}</strong>
            </header>

            <section className="reportSplitGrid">
                <section className="reportPanel">
                    <header>
                        <p>Active alerts</p>
                        <h2>{report.activeAlerts.length} alerts</h2>
                    </header>

                    <div className="reportCompactList">
                        {report.activeAlerts.map((alert) => (
                        <AlertItem key={alert.id} alert={alert} />
                        ))}
                    </div>
                </section>

                <section className="reportPanel">
                    <header>
                        <p>Recommendations</p>
                        <h2>{report.recommendations.length} actions</h2>
                    </header>

                    <div className="reportCompactList">
                        {report.recommendations.map((recommendation) => (
                        <RecommendationItem
                            key={recommendation.id}
                            recommendation={recommendation}
                        />
                        ))}
                    </div>
                </section>
            </section>
        </article>
    );
}

interface AlertItemProps {
  readonly alert: ReportAlert;
}

function AlertItem({ alert }: AlertItemProps) {
    return (
        <article className={`reportCompactItem reportCompactItem--${alert.severity.toLowerCase()}`}>
            <strong>{alert.title}</strong>
            <span>{alert.message}</span>
            <small>{alert.recommendedAction}</small>
        </article>
    );
}

interface RecommendationItemProps {
  readonly recommendation: ReportRecommendation;
}

function RecommendationItem({ recommendation }: RecommendationItemProps) {
    return (
        <article className="reportCompactItem">
            <strong>{recommendation.priority}</strong>
            <span>{recommendation.suggestedAction}</span>
            <small>{recommendation.expectedImpact.description}</small>
        </article>
    );
}