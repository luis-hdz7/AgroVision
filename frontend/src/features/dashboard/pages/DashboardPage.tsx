// Archivo encargado de mostrar la pantalla principal de la app.

/**
* =========================================
* DashboardPage
* =========================================
*
* Pantalla principal del dashboard prescriptivo.
*
* Finalidad:
* - mostrar inteligencia agrícola multifuente;
* - consumir datos desde dashboardService;
* - mantener flujo Page → Service → Adapter → Mock fallback;
* - delegar secciones visuales a componentes reutilizables;
* 
* Regla:
* DashboardPage coordina datos y layout general.
* Los detalles visuales deben vivir en components/.
*/

import { useEffect, useState } from "react";
import { CriticalAlertCard } from "../components/CriticalAlertCard";
import { EvidenceBadge } from "../components/EvidenceBadge";
import { MainRecommendationCard } from "../components/MainRecommendationCard";
import { VegetationSummaryCard } from "../components/VegetationSummaryCard";
import { VisionSummaryCard } from "../components/VisionSummaryCard";
import { getDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard.types";
import "../dashboard.css";

export function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

/**
 * Carga inicial del dashboard.
 *
 * Funcionamiento:
 * - llama getDashboardData();
 * - el service decide si usa backend, adapter o mock fallback;
 * - si carga bien, guarda datos en estado;
 * - si falla, guarda mensaje controlado de error;
 * - siempre apaga loading al finalizar.
 */
  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setErrorMessage(null);
      } catch {
        setErrorMessage("Error al intentar cargar datos en dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    // Se usa void para indicar que no esperamos la promesa en el render.
    void loadDashboard();
  }, []);

/**
 * Estado de carga.
 *
 * Se muestra antes de que exista dashboardData.
 */
  if (isLoading) {
    return (
      <section className="dashboardPage">
        <div className="dashboardState">
          <p>Cargando dashboard prescriptivo...</p>
        </div>
      </section>
    );
  }

/**
 * Estado de error o data inexistente.
 *
 * Corrige el typo anterior:
 * daashboardSate--error → dashboardState--error
*/
  if (errorMessage || !dashboardData) {
    return (
      <section className="dashboardPage">
        <div className="dashboardState dashboardState--error">
          <p>{errorMessage ?? "No hay datos disponibles."}</p>
        </div>
      </section>
    );
  }

  // Data principal ya validada.
  const { summary } = dashboardData;

  // La alerta principal se toma como la primera alerta crítica disponible.
  const mainAlert = summary.alerts.criticalAlerts[0];

  // La recomendación principal viene definida por el contrato del dashboard.
  const mainRecommendation = summary.recommendations.mainRecommendation;

  return (
    <section className="dashboardPage" aria-labelledby="dashboard-title">
      <header className="dashboardHero">
        <div className="dashboardHero__content">
          <p className="dashboardHero__eyebrow">Dashboard prescriptivo</p>

          <h1 id="dashboard-title">Inteligencia agrícola multifuente</h1>
          <span>
            AgroVision fusiona evidencia visual, clima, sensores, historial,
            mapping y capa satelital simulada para explicar riesgos y sugerir
            acciones concretas.
          </span>
        </div>

        <aside className="dashboardHero__status">
          <span>Riesgo dominante</span>

          <strong>{formatRiskLabel(summary.intelligence.dominantRisk)}</strong>
          <small>
            Zona afectada:{" "}
            {summary.intelligence.mostAffectedZoneId ?? "Sin zona definida"}
          </small>
        </aside>
      </header>

      <section className="dashboardMetricGrid" aria-label="Resumen ejecutivo">
        <article className="dashboardMetricCard dashboardMetricCard--risk">
          <span>Salud general</span>
          <strong>{summary.healthScore}%</strong>
          <small>{summary.farm.name}</small>
        </article>

        <article className="dashboardMetricCard">
          <span>Cultivos críticos</span>
          <strong>{summary.crops.critical}</strong>
          <small>
            {summary.crops.warning} en observación · {summary.crops.total} total
          </small>
        </article>

        <article className="dashboardMetricCard">
          <span>Alertas activas</span>
          <strong>{summary.alerts.active}</strong>
          <small>
            {summary.alerts.critical} críticas · {summary.alerts.warning} warning
          </small>
        </article>

        <article className="dashboardMetricCard">
          <span>Capa satelital</span>
          <strong>{summary.intelligence.satelliteLayerStatus}</strong>
          <small>NDVI simulado: {summary.vegetation.ndvi ?? "N/A"}</small>
        </article>
      </section>

      <section className="dashboardMainGrid">
        <article className="dashboardPanel dashboardPanel--wide">
          <header>
            <p>Resumen prescriptivo</p>
            <h2>Qué está pasando y qué hacer</h2>
          </header>

          <p className="dashboardPanel__summary">
            {summary.intelligence.prescriptiveSummary}
          </p>

          <div className="dashboardEvidenceGrid">
            {mainRecommendation.evidence.map((evidence) => (
              <EvidenceBadge
                key={`${evidence.source}-${evidence.metric}`}
                evidence={evidence}
              />
            ))}
          </div>
        </article>

        <MainRecommendationCard recommendation={mainRecommendation} />

        <VegetationSummaryCard vegetation={summary.vegetation} />

        <VisionSummaryCard vision={summary.vision} />

        {mainAlert && <CriticalAlertCard alert={mainAlert} />}
      </section>
    </section>
  );
}

/**
 * Convierte un valor técnico en texto legible.
 *
 * Ejemplo:
 * WATER_STRESS → WATER STRESS
 *
 * No modifica el dato original; solo transforma la vista.
*/

function formatRiskLabel(risk: string): string {
  return risk.replaceAll("_", " ");
}