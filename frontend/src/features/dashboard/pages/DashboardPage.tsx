// Archivo encargado de mostrar la pantalla principal de la app

/**
 * =========================================
 * DashboardPage
 * =========================================
 *
 * Pantalla base del Dashboard principal.
 *
 * Finalidad:
 * - mostrar inteligencia agrícola multifuente;
 * - consumir los datos desde service y no desde mock directamente;
 * - respetar el contrato de datos;
 * - representar los riesgos, evidencias y acciones recomendadas.
 * - ps: dejar la pantalla lista para conectar el backend real después.
 * 
*/


import { useEffect , useState } from "react";
import { getDashboardData } from "../services/dashboardService";
// import { dashboardMock } from "../services/dashboardMock";
import type { DashboardData, EvidenceItem, RiskLevel } from "../types/dashboard.types";
import "../dashboard.css";


export function DashboardPage() {

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

 //carga los datos desde el Service
 // La pagina no debe saber si vienen de backend o de mock local
  useEffect(() => {
    async function loadDashboard() {
      try {
        // Si no hay errores, cargamos los datos desde el backend
          const data  = await getDashboardData();

          setDashboardData(data);
          setErrorMessage(null);
      } 
      // Si hay un error, mostramos un mensaje de error
      catch {
          setErrorMessage("Error al intentar cargar datos en dashboard");
      } 
      // Finalmente, dejamos de mostrar el loading
      finally {
          setIsLoading(false)
      }
    }
    // llamada al loadDashboard cuando se inicializa la pagina
    void loadDashboard();
  }, []);

  /** Verificaciones de estado */ 
  if (isLoading) {
    return (
      <section className="dashboardPage">
          <div className="dashboardState">
              <p>Cargando...</p>
          </div>
      </section>
    );
  }

  //Si no hay datos, informamos mediante un mensaje de error
  if (errorMessage || !dashboardData) {
    return (
      <section className="dashboardPage">
          <div className="dashboardState daashboardSate--error">
              <p>{errorMessage ?? "No hay datos disponibles."}</p>
          </div>
      </section>
    );
  }

  const { summary } = dashboardData;
  const mainAlert = summary.alerts.criticalAlerts[0];
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
          <small>NDVI (simulado): {summary.vegetation.ndvi ?? "N/A"}</small>
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
              <EvidenceBadge key={`${evidence.source}-${evidence.metric}`} evidence={evidence} />
            ))}
          </div>
        </article>

        <article className="dashboardPanel">
          <header>
            <p>Recomendación principal</p>
            <h2>{mainRecommendation.priority}</h2>
          </header>

          <strong>{mainRecommendation.suggestedAction}</strong>
          <span>{mainRecommendation.reason}</span>

          <footer>
            <small>{mainRecommendation.expectedImpact.impactArea}</small>
            <p>{mainRecommendation.expectedImpact.description}</p>
          </footer>
        </article>

        <article className="dashboardPanel">
          <header>
            <p>Vegetación simulada</p>
            <h2>{summary.vegetation.vigorLevel}</h2>
          </header>

          <strong>
            {summary.vegetation.anomalyDetected
              ? "Anomalía detectada"
              : "Sin anomalía relevante"}
          </strong>

          <span>{summary.vegetation.explanation}</span>
        </article>

        <article className="dashboardPanel">
          <header>
            <p>Análisis IA visual</p>
            <h2>{summary.vision.lastPrediction}</h2>
          </header>

          <strong>{Math.round(summary.vision.confidence * 100)}% confianza</strong>
          <span>{summary.vision.explanation}</span>
        </article>

        {mainAlert && (
          <article className="dashboardPanel dashboardPanel--alert">
            <header>
              <p>Alerta crítica</p>
              <h2>{mainAlert.title}</h2>
            </header>

            <RiskPill riskLevel={mainAlert.severity} />

            <span>{mainAlert.recommendedAction}</span>

            <div className="dashboardEvidenceList">
              {mainAlert.evidence.map((evidence) => (
                <EvidenceBadge
                  key={`${mainAlert.id}-${evidence.source}-${evidence.metric}`}
                  evidence={evidence}
                />
              ))}
            </div>
          </article>
        )}
      </section>
    </section>
  );
}

// Componentes auxiliares para evidencias y riesgos

interface EvidenceBadgeProps {
  readonly evidence: EvidenceItem;
}


function EvidenceBadge({ evidence }: EvidenceBadgeProps) {
  return (
    <article className={`evidenceBadge evidenceBadge--${evidence.status.toLowerCase()}`}>
      <strong>{evidence.source}</strong>
      <span>
        {evidence.metric}: {String(evidence.value ?? "N/A")}
        {evidence.unit ? ` ${evidence.unit}` : ""}
      </span>
      <small>{evidence.explanation}</small>
    </article>
  );
}

// Componente para mostrar el nivel de riesgo
interface RiskPillProps {
  readonly riskLevel: RiskLevel;
}


function RiskPill({ riskLevel }: RiskPillProps) {
  return (
    <span className={`riskPill riskPill--${riskLevel.toLowerCase()}`}>
      {riskLevel}
    </span>
  );
}

// Función auxiliar para formatear el texto de un riesgo en forma legible, reemplazando guiones bajos por espacios
function formatRiskLabel(risk: string): string {
  return risk.replaceAll("_", " ");
}

/** Siemper cumpliendose el flujo principal de: DashboardPage → dashboardService → dashboardAdapter → dashboardMock */