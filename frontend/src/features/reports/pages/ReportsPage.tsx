/**
 * =========================================
 * ReportsPage
 * =========================================
 *
 * Pantalla funcional de reportes prescriptivos.
 *
 * Finalidad:
 * - eliminar placeholder de /reports;
 * - mostrar reporte de zone-03;
 * - demostrar trazabilidad completa;
 * - soportar loading, error y fallback controlado.
 */

import { useEffect, useState } from "react";
import { PrescriptiveReportCard } from "../components/PrescriptiveReportCard";
import { ReportActionsPanel } from "../components/ReportActionsPanel";
import { ReportEvidenceTimeline } from "../components/ReportEvidenceTimeline";
import { ReportRiskSummary } from "../components/ReportRiskSummary";
import { getPrescriptiveReportByZone } from "../services/reportsService";
import type { ReportsData } from "../types/reports.types";
import "../reports.css";

const DEFAULT_REPORT_ZONE_ID = "zone-03";

export function ReportsPage() {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carga el reporte prescriptivo principal de demo.
  // El service decide si usa backend real o fallback.
  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getPrescriptiveReportByZone(DEFAULT_REPORT_ZONE_ID);

        setReportsData(data);
        setErrorMessage(null);
      } catch {
        setErrorMessage("No se pudo cargar el reporte prescriptivo.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadReport();
  }, []);

  return (
    <section className="reportsPage" aria-labelledby="reports-title">
      <header className="reportsHero">
        <div>
          <p className="reportsHero__eyebrow">Reporte prescriptivo</p>

          <h1 id="reports-title">Trazabilidad por zona crítica</h1>

          <span>
            Reporte técnico para zone-03 con riesgo final, evidencia
            multifuente, alertas, recomendaciones y acciones operativas.
          </span>
        </div>
      </header>

      {isLoading && (
        <section className="reportsState">
          <p>Cargando reporte prescriptivo...</p>
        </section>
      )}

      {errorMessage && (
        <section className="reportsState reportsState--error">
          <p>{errorMessage}</p>
        </section>
      )}

      {!isLoading && !errorMessage && reportsData && (
        <>
          <ReportRiskSummary report={reportsData.report} />

          <PrescriptiveReportCard report={reportsData.report} />

          <ReportEvidenceTimeline evidence={reportsData.report.evidence} />

          <ReportActionsPanel
            actionsTaken={reportsData.report.actionsTaken}
            pendingActions={reportsData.report.pendingActions}
          />
        </>
      )}
    </section>
  );
}