/**
 * =========================================
 * ReportRiskSummary
 * =========================================
 *
 * Resumen de riesgo del reporte.
 *
 * Finalidad:
 * - mostrar riesgo final;
 * - mostrar health score;
 * - mostrar campo, zona y cultivo;
 * - resumir la causa principal.
*/

import type { PrescriptiveReport } from "../types/reports.types";

interface ReportRiskSummaryProps {
  readonly report: PrescriptiveReport;
}

export function ReportRiskSummary({ report }: ReportRiskSummaryProps) {
    return (
        <section className="reportRiskSummary">
            <article className={`reportRiskBox reportRiskBox--${report.finalRiskLevel.toLowerCase()}`}>
                <span>Final risk level</span>
                <strong>{report.finalRiskLevel}</strong>
            </article>

            <article className="reportRiskBox">
                <span>Health score</span>
                <strong>{report.healthScore}%</strong>
            </article>

            <article className="reportRiskBox">
                <span>Crop type</span>
                <strong>{report.cropType}</strong>
            </article>

            <article className="reportRiskBox">
                <span>Zone</span>
                <strong>{report.zoneId}</strong>
            </article>

            <article className="reportRiskSummary__cause">
                <span>Main cause</span>
                <p>{report.mainCause}</p>
            </article>
        </section>
    );
}

