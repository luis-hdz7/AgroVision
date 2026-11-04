import { useEffect, useState } from "react";

import { MetricCard } from "../../../shared/components/ui/MetricCard";
import { Panel } from "../../../shared/components/ui/Panel";
import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

import { getDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard.types";

import "../dashboard.css";

import warningAlertIcon from "../../../assets/icons/warning-icon.svg";
import bugIcon from "../../../assets/icons/bug-icon.svg";
import hidricStressIcon from "../../../assets/icons/hidric-stress-icon.svg";
import nitrogenIcon from "../../../assets/icons/nitrogen-icon.svg";
import irrigationIcon from "../../../assets/icons/water-icon.svg";
import protectionIcon from "../../../assets/icons/protection-icon.svg";
import infoIcon from "../../../assets/icons/info-icon2.svg";
import arrowRightIcon from "../../../assets/icons/arrow-icon.png";
import arrow2RightIcon from "../../../assets/icons/arrow2-icon.png";
import img1 from "../../../assets/images/image-mock-plant1.jfif";
import img2 from "../../../assets/images/image-mock-plant2.jpg";
import img3 from "../../../assets/images/image-mock-plant3.png";
import img4 from "../../../assets/images/image-mock-plant4.png";
import aiRecomIcon from "../../../assets/icons/ai-recommendation-icon.svg";
import newEvidenceIcon from "../../../assets/icons/new-evidence-icon.svg";
import alertDiamIcon from "../../../assets/icons/alert-diamond-icon.svg";
import newSourceIcon from "../../../assets/icons/new-source-icon.svg";
import waterIcon from "../../../assets/icons/water-icon.svg";
import plantaImg from "../../../assets/icons/plantaDs.png";

// librerias de recharts
import { Area, AreaChart, Pie, PieChart, ResponsiveContainer } from "recharts";
// Compartimos el mapa GIS utilizado por MappingPage.
import { MappingGIS } from "../../mapping/components/MappingGIS";
// Utilizamos la iconografía compartida del mapa.
import { GisIcon } from "../../mapping/components/GisIcon";
// Tipamos la información recibida al seleccionar una zona.
import type { SelectedZoneData } from "../../mapping/layers/interactionLayer";

export function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Conservamos la zona seleccionada para resaltarla y abrir su detalle en Mapping.
  const [selectedMapZone, setSelectedMapZone] =
    useState<SelectedZoneData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setErrorMessage(null);
      } catch {
        setErrorMessage("No fue posible cargar Dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <section className="avState">
        <strong>Cargando Dashboard</strong>
        <p>Preparando inteligencia agrícola.</p>
      </section>
    );
  }

  if (errorMessage || !dashboardData) {
    return (
      <section className="avState">
        <strong>Dashboard no disponible</strong>
        <p>{errorMessage}</p>
      </section>
    );
  }

  const { summary } = dashboardData;
  const mainAlert = summary.alerts.criticalAlerts; // [0] si solo quiero mostrar una sola alerta
  const recommendation = summary.recommendations.mainRecommendation;
  const zoneId = summary.intelligence.mostAffectedZoneId ?? "zone-03";

  /* Datos de prueba para Salud general. */
  const saludDetails = [
    { label: "Excelente", value: "18%", color: "#22c55e" },
    { label: "Buena", value: "60%", color: "#a3e635" },
    { label: "Regular", value: "16%", color: "#eab308" },
    { label: "Mala", value: "6%", color: "#ef4444" },
  ];

  /* Datos de prueba para Alertas activas. */
  const alertasDetails = [
    { label: "Críticas", value: 2, color: "#ef4444" },
    { label: "Altas", value: 3, color: "#f97316" },
    { label: "Medias", value: 2, color: "#eab308" },
  ];

  /*
   * Diseño visual de las tres alertas con tipado explícito.
   * Cada posición corresponde a un icono diferente y metadatos de la maqueta.
   */
  const alertVisuals: Array<{
    icon: string;
    circleClass: string;
    subtitle: string;
    timeLabel: string;
  }> = [
    {
      icon: bugIcon, // Alta presión de plaga
      circleClass: "alertIconCircle alertIconCircle--bug",
      subtitle: "Lote 12A • Maíz",
      timeLabel: "Hoy, 08:15",
    },
    {
      icon: hidricStressIcon, // Estrés hídrico severo
      circleClass: "alertIconCircle alertIconCircle--water",
      subtitle: "Lote 7B • Soja",
      timeLabel: "Hoy, 07:40",
    },
    {
      icon: warningAlertIcon, // Riesgo de enfermedad
      circleClass: "alertIconCircle alertIconCircle--warning",
      subtitle: "Lote 3C • Trigo",
      timeLabel: "Ayer, 18:30",
    },
    {
    icon: hidricStressIcon, // Cambia aquí el icono
    circleClass: 'alertIconCircle alertIconCircle--water', // Cambia aquí el color
    subtitle: 'Lote 7B • Soja',
    timeLabel: 'Hoy, 07:40',
  },
  ];

  /* Muestra como máximo tres alertas críticas. */
  
/**
 * Alertas críticas del Dashboard.
 *
 * Si PostgreSQL devuelve solamente una alerta,
 * agregamos otra simulada para completar el diseño.
 *
 * Si ya existen dos o más alertas reales,
 * no añadimos la simulada.
 */
const criticalAlerts = [
  ...summary.alerts.criticalAlerts.slice(0, 3),

  ...(summary.alerts.criticalAlerts.length === 1
    ? [
        {
          ...summary.alerts.criticalAlerts[0],
          id: "alert-dashboard-simulada-002",
          title: "Riesgo de enfermedad foliar (simulado)",
          message: "Se recomienda realizar una inspección preventiva del cultivo.",
        },
      ]
    : []),
].slice(0, 3);
               

  return (
    <section className="avScreen dashboardFigma">                              
      <h1 className="avScreenTitle">Resumen del cultivo</h1>

      <section className="avMetricGrid">
        <MetricCard
          title="Salud general"
          value={summary.healthScore}
          valueSuffix="%"
          description="Salud moderada"
          progress={summary.healthScore}
          tone="LIME"
          details={saludDetails}
          subBadge={
            <span>
              vs. semana anterior <b style={{ color: "#22c55e" }}>↑ 6%</b>
            </span>
          }
        />

        <MetricCard
          title="Alertas activas"
          value={summary.alerts.active}
          description="Requieren atención"
          tone="AMBER"
          details={alertasDetails}
          actionLabel="Ver todas las alertas"
        />

        <MetricCard
          title="Recomendaciones urgentes"
          value={summary.recommendations.urgent}
          description="pendientes"
          tone="TEAL"
          progress={90}
          icon={
            <img
              src={plantaImg}
              alt=""
              aria-hidden="true"
              style={{ width: "4.3rem", height: "4.3rem", objectFit: "contain" }}
            />
          }
          actionLabel="Ver recomendaciones"
        />
      </section>

      <section className="dashboardFigma__main">
        <div className="dashboardFigma__left">
          {/* Presentamos una instancia compacta del mismo GIS utilizado por MappingPage. */}
          <Panel
            title="Mapa / Zonas"
            showInfo={false}
            className="dashboardGisPanel"
          >
            {/* El contenedor proporciona la altura del mapa dentro del Dashboard. */}
            <div className="dashboardGisPanel__map">
              <MappingGIS
                variant="compact"
                selectedZoneId={selectedMapZone?.zoneId ?? zoneId}
                onZoneSelect={setSelectedMapZone}
              >
                {/* Identificamos la finca y el origen de las geometrías disponibles. */}
                <div className="dashboardGisPanel__context gisGlass">
                  <GisIcon name="location" />

                  <span>
                    Finca 001
                    <small>Geometrías de demostración</small>
                  </span>
                </div>
              </MappingGIS>
            </div>

            {/* La información inferior refleja la selección realizada sobre el mapa. */}
            <footer className="dashboardGisPanel__footer">
              <span>
                <strong>
                  {selectedMapZone?.properties.name ?? "Explora tus zonas"}
                </strong>

                <small>
                  {selectedMapZone
                    ? "Zona seleccionada en el mapa"
                    : "Selecciona una zona para ver su análisis"}
                </small>
              </span>

              {/* Conservamos la zona seleccionada al abrir el explorador completo. */}
              <a
                href={`/mapping?zone=${encodeURIComponent(selectedMapZone?.zoneId ?? zoneId)}`}
                className="dashboardActionButton avActionButton"
              >
                <span>Abrir GIS</span>

                {/* Reutilizamos el icono de flecha que ya importaste en tu segundo Dashboard. */}
                <img
                  src={arrow2RightIcon}
                  alt=""
                  aria-hidden="true"
                  className="dashboardActionButton__arrow"
                />
              </a>
            </footer>
          </Panel>

          <div className="dashboardFigma__insights">
            <Panel title="Capa satelital simulada" showCardTag>
              <div className="satelliteMiniGrid">
                {/* <SatelliteMetric label="NDVI" value={summary.vegetation.ndvi?.toFixed(2) ?? "—"} status={summary.vegetation.vigorLevel} /> */}
                <SatelliteMetric
                  label="NDVI"
                  value="0.72"
                  status={summary.vegetation.vigorLevel}
                />
                <SatelliteMetric label="NDWI" value="0.45" status="↑ 0.03" />
                <SatelliteMetric label="GNDVI" value="0.38" status="↑ 0.04" />
                {/* <SatelliteMetric label="SAVI" value="0.61" status="↑ 0.02" /> */}
              </div>

              <footer className="dashboardPanelFooter">
                {/* <span className="avFooterMetaText">Última actualización: {formatTime(summary.lastUpdatedAt)}</span> */}
                <span className="avFooterMetaText">
                  Sentinel-2 • 18 May 2025
                </span>
                <button
                  className="dashboardActionButton avActionButton"
                  type="button"
                >
                  <span>Ver detalles</span>
                  <img
                    src={arrow2RightIcon}
                    alt=""
                    aria-hidden="true"
                    className="dashboardActionButton__arrow"
                  />
                </button>
              </footer>
            </Panel>

            {/* <Panel title="Zone Insight" showCardTag>
              <div className="zoneInsightRows">
                <InfoRow label="Zona" value={zoneId} />
                <InfoRow label="Score de riesgo" value={formatRisk(summary.intelligence.dominantRisk)} highlight />
                <InfoRow label="Evidencia principal" value={recommendation.evidence[0]?.source ?? "—"} />
                <InfoRow label="Acción sugerida" value={recommendation.suggestedAction} />
              </div>
              <button className="avTextAction zoneInsightAction" type="button">Ver detalle de la zona →</button>
            </Panel> */}

            <Panel title="Zone Insight" showCardTag>
              <div className="zoneInsightRows">
                <ZoneInsightDonut criticalZones={3} totalZones={18} />
                <div className="zoneInsightRows avZoneInsightRowsExtended">
          
                  <InfoRow label="Score de riesgo" value="5" />{' '}
                  {/* highlight activa el color de riesgo */}
                  <InfoRow label="Evidencia principal" value="10" />
                  <InfoRow label="Acción sugerida" value="3" />
                </div>
              </div>
              <footer
                className="dashboardPanelFooter justify-end"
                style={{ marginTop: "12px" }}
              >
                <button
                  className="dashboardActionButton avActionButton"
                  type="button"
                >
                  <span>Ver insights</span>
                  <img
                    src={arrow2RightIcon}
                    alt=""
                    aria-hidden="true"
                    className="dashboardActionButton__arrow"
                  />
                </button>
              </footer>
            </Panel>

            {/* <Panel title="Evidencias show" showCardTag>
              <div className="avEvidenceGrid">
                {recommendation.evidence.slice(0, 4).map((evidence, index) => {
                  const localPics = [img1, img2, img3, img4];
                  const currentImage = localPics[index] || evidence.source; // Fallback a img1 si no hay suficiente evidencia

                  return (
                    <div 
                      key={`${evidence.source}-${evidence.metric}`}
                      className="avEvidenceItem"
                      style={{ backgroundImage: currentImage ?`url(${currentImage})` : "linear-gradient(135deg, #15803d 0%, #166534 100%)"}}
                      title={`${evidence.source}: ${evidence.metric}`}
                      />
                  );
                })}
              </div>

              <footer className="dashboardPanelFooter justify-end" style={{ marginTop: '12px' }}>
                <button className="avTextAction" type="button">Ver todas</button>
              </footer>
            </Panel> */}
            <Panel title="Evidencias" showCardTag>
              <div className="avEvidenceGrid">
                {/* 
                  Creamos un arreglo estático con tus 4 referencias locales.
                  Esto garantiza que el bucle itere exactamente 4 veces pase lo que pase con los datos externos.
                */}
                {[img1, img2, img3, img4].map((currentImage, index) => {
                  // Extraemos datos de soporte del servidor si existen en esa posición
                  const evidenceData = recommendation.evidence[index];

                  return (
                    <div
                      key={
                        evidenceData
                          ? `${evidenceData.source}-${index}`
                          : `fallback-pic-${index}`
                      }
                      className="avEvidenceItem"
                      style={{
                        // Forzamos el uso de tu imagen local importada. Si no existe, aplica el gradiente.
                        backgroundImage: currentImage
                          ? `url(${currentImage})`
                          : "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                      }}
                      title={
                        evidenceData
                          ? `${evidenceData.source}: ${evidenceData.metric}`
                          : "Evidencia de campo"
                      }
                    />
                  );
                })}
              </div>

              <footer
                className="dashboardPanelFooter justify-end"
                style={{ marginTop: "12px" }}
              >
                <button
                  className="dashboardActionButton avActionButton"
                  type="button"
                >
                  <span>Ver todas</span>
                  <img
                    src={arrow2RightIcon}
                    alt=""
                    aria-hidden="true"
                    className="dashboardActionButton__arrow"
                  />
                </button>
              </footer>
            </Panel>
          </div>
        </div>

        {/* <div className="dashboardFigma__right">
          <Panel title="Resumen prescriptivo" showCardTag>
            <div className="prescriptiveRows">
              <SummaryRow label="Riesgo dominante" value={formatRisk(summary.intelligence.dominantRisk)} badge="DANGER" />
              <SummaryRow label="Causa probable" value={summary.intelligence.prescriptiveSummary} />
              <SummaryRow label="Acción recomendada" value={recommendation.suggestedAction} />
              <SummaryRow label="Impacto esperado" value={recommendation.expectedImpact.description} />
            </div>
          </Panel>

          <Panel title="Alertas críticas" showCardTag>
            <div className="avCompactList">
              {criticalAlerts.map((alert, index) => {
                const visual = alertVisuals[index];

                return (
                  <div key={alert.id} className="avCompactRow">
                    <div className="avCompactRow__main">
                      <span className={visual.circleClass}>
                        <img src={visual.icon} alt="" className="alertIcon" />
                      </span>

                      <div className="avCompactRow__copy">
                        <strong>{alert.title}</strong>
                      </div>
                    </div>

                    <StatusBadge tone={alert.severity === "CRITICAL" ? "DANGER" : "WARNING"}>
                      {alert.severity === "CRITICAL" ? "Alto" : "Media"}
                    </StatusBadge>
                  </div>
                );
              })}
            </div>

            <button type="button" className="avTextAction dashboardCenteredAction">Ver todas las alertas →</button>
          </Panel>
        </div> */}
        <div className="dashboardFigma__right">
          {/* NUEVO DISEÑO DEL RESUMEN PRESCRIPTIVO */}
          <Panel
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span>Resumen prescriptivo</span>
                <img src={infoIcon} alt="" className="avPanel__infoIcon" />

                {/* <button className="dashboardActionButton avActionButton" type="button">
                  <span>Ver detalles</span>
                  <img
                    src={arrow2RightIcon}
                    alt=""
                    aria-hidden="true"
                    className="dashboardActionButton__arrow"
                  />
                </button> */}
              </div>
            }
            showCardTag
          >
            <div className="avPrescriptiveModule">
              {/* FILA 1: NITRÓGENO */}
              <div className="avPrescriptiveRow">
                <div className="avPrescriptiveRow__left">
                  <span className="avPrescriptiveRow__circle avPrescriptiveRow__circle--green">
                    <img src={nitrogenIcon} alt="" />
                  </span>
                  <div className="avPrescriptiveRow__meta">
                    <strong>Nitrógeno</strong>
                    <span className="action-tag">Aplicar</span>
                  </div>
                </div>
                <div className="avPrescriptiveRow__right">
                  <span className="primary-value">
                    32 <small>kg/ha</small>
                  </span>
                  <span className="secondary-value percent-up">
                    +12% vs. rec. base
                  </span>
                </div>
              </div>

              {/* FILA 2: RIEGO */}
              <div className="avPrescriptiveRow">
                <div className="avPrescriptiveRow__left">
                  <span className="avPrescriptiveRow__circle avPrescriptiveRow__circle--blue">
                    <img src={irrigationIcon} alt="" />
                  </span>
                  <div className="avPrescriptiveRow__meta">
                    <strong>Riego</strong>
                    <span className="action-tag">Programar</span>
                  </div>
                </div>
                <div className="avPrescriptiveRow__right">
                  <span className="primary-value">
                    18 <small>mm</small>
                  </span>
                  <span className="secondary-value">Próx. 48 h</span>
                </div>
              </div>

              {/* FILA 3: PROTECCIÓN */}
              <div className="avPrescriptiveRow">
                <div className="avPrescriptiveRow__left">
                  <span className="avPrescriptiveRow__circle avPrescriptiveRow__circle--orange">
                    <img src={protectionIcon} alt="" />
                  </span>
                  <div className="avPrescriptiveRow__meta">
                    <strong>Protección</strong>
                    <span className="action-tag">Monitorear</span>
                  </div>
                </div>
                <div className="avPrescriptiveRow__right">
                  <span className="primary-value">
                    2 <small>áreas</small>
                  </span>
                  <span className="secondary-value risk-high">Riesgo alto</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* NUEVO DISEÑO OPERATIVO DE ALERTAS CRÍTICAS */}
          <Panel
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span>Alertas críticas</span>

                {/* <button type="button" className="avPanelHeaderAction">Ver todas</button> */}
                <button
                  className="dashboardActionButton avActionButton"
                  type="button"
                >
                  <span>Ver todas</span>
                  <img
                    src={arrow2RightIcon}
                    alt=""
                    aria-hidden="true"
                    className="dashboardActionButton__arrow"
                  />
                </button>
              </div>
            }
            showCardTag
          >
            <div className="avCompactList">
              {criticalAlerts.map((alert, index) => {
                const visual = alertVisuals[index] || alertVisuals[0];

                return (
                  <div key={alert.id} className="avCompactRow">
                    <div className="avCompactRow__main">
                      <span className={visual.circleClass}>
                        <img src={visual.icon} alt="" className="alertIcon" />
                      </span>

                      <div className="avCompactRow__copy">
                        <strong>{alert.title}</strong>
                        <span className="avCompactRow__subtitle">
                          {visual.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="avCompactRow__rightSide">
                      <time className="avCompactRow__time">
                        {visual.timeLabel}
                      </time>
                      <span className="avCompactRow__arrow">
                        <img src={arrowRightIcon} alt="flecha de dirección" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </section>

      <section className="dashboardFigma__bottom">
        <Panel title="Actividad reciente">
          <div className="dashboardTimeline">
            {mainAlert &&
              mainAlert
                .slice(0, 3)
                .map((alert) => (
                  <TimelineItem
                    key={alert.id}
                    time={formatTime(alert.createdAt)}
                    text={`Alerta crítica: ${alert.title}`}
                    status="Máxima"
                    tone="DANGER"
                    icon={alertDiamIcon}
                    iconTone="DANGER"
                  />
                ))}

            <TimelineItem
              time="Hoy"
              text="Nueva evidencia registrada"
              status="Sistema"
              tone="LIME"
              icon={newEvidenceIcon}
              iconTone="INFO"
            />

            <TimelineItem
              time="Ayer"
              text={`Recomendación generada: ${recommendation.suggestedAction}`}
              status="AgroVision AI"
              tone="INFO"
              icon={aiRecomIcon}
              iconTone="LIME"
            />

            <TimelineItem
              time="Ayer"
              text="Registro de campo actualizado"
              status="Productor"
              tone="SUCCESS"
              icon={newSourceIcon}
              iconTone="SUCCESS"
            />
          </div>

          <button
            type="button"
            className="dashboardActionButton dashboardActionButton--center avActionButton"
          >
            <span>Ver toda la actividad</span>
            <img
              src={arrow2RightIcon}
              alt=""
              aria-hidden="true"
              className="dashboardActionButton__arrow"
            />
          </button>
        </Panel>

        <Panel title="Próximas acciones">
          <div className="nextActionList">
            <NextAction
              text={recommendation.suggestedAction}
              date="Hoy"
              priority="Alta"
              icon={hidricStressIcon}
              iconTone="GREEN"
            />

            <NextAction
              text={`Monitorear ${zoneId} en 48 h`}
              date="48 h"
              priority="Alta"
              icon={waterIcon}
              iconTone="BLUE"
            />

            <NextAction
              text="Revisar trampas y muestreo de plagas"
              date="Próximo control"
              priority="Media"
              icon={bugIcon}
              iconTone="AMBER"
            />

            <NextAction
              text="Registrar observaciones de campo"
              date="Pendiente"
              priority="Baja"
              icon={newSourceIcon}
              iconTone="AMBER"
            />
          </div>

          <button
            type="button"
            className="dashboardActionButton dashboardActionButton--center avActionButton"
          >
            <span>Ver todas las acciones</span>
            <img
              src={arrow2RightIcon}
              alt=""
              aria-hidden="true"
              className="dashboardActionButton__arrow"
            />
          </button>
        </Panel>
      </section>
    </section>
  );
}

/* ===========================================================
   COMPONENTE — MÉTRICA SATELITAL
   =========================================================== */

// function SatelliteMetric({
//   label,
//   value,
//   status,
// }: {
//   readonly label: string;
//   readonly value: string;
//   readonly status: string;
// }) {
//   return (
//     <article className="satelliteMetric">
//       <strong>{label}</strong>
//       <b>{value}</b>
//       <span>{status}</span>
//       <div className="satelliteSparkline" />

//     </article>
//   );
// }

function SatelliteMetric({
  label,
  value,
  status,
}: {
  readonly label: string;
  readonly value: string;
  readonly status: string;
}) {
  const metricHistory: Record<string, Array<{ value: number }>> = {
    NDVI: [
      { value: 0.52 },
      { value: 0.57 },
      { value: 0.55 },
      { value: 0.62 },
      { value: 0.6 },
      { value: 0.67 },
      { value: 0.72 },
    ],

    NDWI: [
      { value: 0.31 },
      { value: 0.3 },
      { value: 0.10 },
      { value: 0.42 },
      { value: 0.4 },
      { value: 0.11 },
      { value: 0.9 },
    ],
    GNDVI: [
      { value: 0.13 },
      { value: 0.4 },
      { value: 0.32 },
      { value: 0.21 },
      { value: 0.6 },
      { value: 0.22 },
      { value: 0.1 },
    ],
    SAVI: [
      { value: 0.4 },
      { value: 0.14 },
      { value: 0.25 },
      { value: 0.13 },
      { value: 0.24 },
      { value: 0.57 },
      { value: 0.31 },
    ],
  };

  const chartData = metricHistory[label];

  const hasRealChart =
    label === "NDVI" ||
    label === "NDWI" ||
    label === "GNDVI" ||
    label === "SAVI";

  return (
    <article className="satelliteMetric">
      <strong>{label}</strong>

      <b>{value}</b>

      <span>{status}</span>

      {hasRealChart && chartData ? (
        <div className="satelliteMetric__chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 3,
                right: 1,
                bottom: 0,
                left: 1,
              }}
            >
              <defs>
                <linearGradient
                  id={`satellite-gradient-${label}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#30b76a" stopOpacity={0.42} />

                  <stop offset="100%" stopColor="#30b76a" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke="#30b76a"
                strokeWidth={1.7}
                fill={`url(#satellite-gradient-${label})`}
                dot={false}
                activeDot={false}
                isAnimationActive={true}
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="satelliteSparkline" />
      )}
    </article>
  );
}

/* ===========================================================
   COMPONENTE — DONUT ZONE INSIGHT
   =========================================================== */

function ZoneInsightDonut({
  criticalZones,
  totalZones,
}: {
  readonly criticalZones: number;
  readonly totalZones: number;
}) {
  const safeTotal = Math.max(totalZones, 1);
  const safeCritical = Math.min(Math.max(criticalZones, 0), safeTotal);

  const stableZones = safeTotal - safeCritical;

  const donutData = [
    {
      name: "Zonas críticas",
      value: safeCritical,
      fill: "#a7d91e",
    },
    {
      name: "Otras zonas",
      value: stableZones,
      fill: "#d4ded8",
    },
  ];

  return (
    <div className="zoneInsightDonut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={donutData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            cornerRadius={6}
            isAnimationActive={true}
            animationDuration={750}
            animationBegin={100}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="zoneInsightDonut__center">
        <strong>{safeCritical}</strong>
        <span>Zonas críticas</span>
      </div>
    </div>
  );
}

/* ===========================================================
   COMPONENTE — FILA DE INFORMACIÓN
   =========================================================== */

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly highlight?: boolean;
}) {
  return (
    <div
      className="figmaInfoRow"
      style={{ display: "flex", justifyContent: "flex-start" }}
    >
      <span>{label}</span>
      <strong className={highlight ? "is-highlighted" : ""}>{value}</strong>
    </div>
  );
}

/* ===========================================================
   COMPONENTE — TIMELINE
   =========================================================== */

type TimelineIconTone = "DANGER" | "INFO" | "LIME" | "SUCCESS";

function TimelineItem({
  time,
  text,
  status,
  tone,
  icon,
  iconTone,
}: {
  readonly time: string;
  readonly text: string;
  readonly status: string;
  readonly tone: "DANGER" | "LIME" | "INFO" | "SUCCESS";
  readonly icon: string;
  readonly iconTone: TimelineIconTone;
}) {
  return (
    <div className="dashboardTimeline__item">
      <span
        className={`dashboardTimeline__icon dashboardTimeline__icon--${iconTone.toLowerCase()}`}
        aria-hidden="true"
      >
        <img src={icon} alt="" />
      </span>

      <div className="dashboardTimeline__content">
        <p>{text}</p>
        <time>{time}</time>
      </div>

      <StatusBadge tone={tone}>{status}</StatusBadge>
    </div>
  );
}

/* ===========================================================
   COMPONENTE — PRÓXIMA ACCIÓN
   =========================================================== */

type NextActionIconTone = "GREEN" | "BLUE" | "AMBER" | "TEAL";

function NextAction({
  text,
  date,
  priority,
  icon,
  iconTone,
}: {
  readonly text: string;
  readonly date: string;
  readonly priority: "Alta" | "Media" | "Baja";
  readonly icon: string;
  readonly iconTone: NextActionIconTone;
}) {
  return (
    <div className="nextAction">
      <span
        className={`nextAction__icon nextAction__icon--${iconTone.toLowerCase()}`}
        aria-hidden="true"
      >
        <img src={icon} alt="" />
      </span>

      <div className="nextAction__content">
        <p>{text}</p>
        <span>{date}</span>
      </div>

      <StatusBadge
        tone={
          priority === "Alta"
            ? "DANGER"
            : priority === "Media"
              ? "WARNING"
              : "SUCCESS"
        }
      >
        {priority}
      </StatusBadge>

      <input type="checkbox" aria-label={text} className="nextAction__check" />
    </div>
  );
}

/* ===========================================================
   HELPERS
   =========================================================== */

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("es-NI", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
