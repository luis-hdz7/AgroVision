/**
 * =========================================
 * VisionResultCard
 * =========================================
 *
 * Card principal para presentar el resultado
 * técnico generado por Vision AI.
 *
 * Finalidad:
 * - mostrar la predicción principal;
 * - mostrar el nivel de confianza;
 * - identificar cultivo y zona;
 * - representar métricas visuales;
 * - mostrar señales detectadas;
 * - explicar el resultado;
 * - presentar la acción recomendada;
 * - indicar si el resultado proviene del backend
 *   o del mecanismo fallback.
 *
 * IMPORTANTE:
 * - este componente NO ejecuta inferencia;
 * - NO modifica datos recibidos;
 * - NO genera métricas artificiales;
 * - únicamente representa el contrato
 *   VisionInspection existente.
 * =========================================
 */

import { Panel } from "../../../shared/components/ui/Panel";
import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

import type {
  VisionAnalysisSource,
  VisionInspection,
  VisionPrediction,
} from "../types/visionAI.types";
import { formatVisionClassName, formatVisionFinding } from "../utils/visionLabels";


/* ===========================================================
   PROPS
   =========================================================== */

interface VisionResultCardProps {
  readonly result: VisionInspection;
  readonly source: VisionAnalysisSource;
  readonly fallbackReason?: string | null;
}


/* ===========================================================
   COMPONENTE PRINCIPAL
   =========================================================== */

export function VisionResultCard({
  result,
  source,
  fallbackReason,
}: VisionResultCardProps) {
  const confidencePercentage =
    normalizeConfidence(result.confidence);

  /**
   * Se normaliza a string para evitar conflictos de narrowing
   * cuando TypeScript trabaja con contratos generados o tipos
   * sincronizados desde distintos módulos.
   */
  const isFallback =
    String(source) === "FALLBACK";

  const predictionTone =
    getPredictionTone(result.prediction);

  const statusLabel =
    getPredictionStatusLabel(
      result.prediction,
    );

  const hasVisualMetrics = Object.values(result.visualMetrics).some(
    (value) => value !== null && value !== undefined,
  );


  return (
    <>

      {/* =====================================================
          RESULTADO PRELIMINAR
          ===================================================== */}

      <Panel
        title="Resultado preliminar"
        showInfo={false}
      >
        <div
          className="visionResultRows"
          aria-label="Resumen del análisis visual"
        >

          <ResultRow
            label="Predicción"
            value={formatVisionFinding(result)}
          />


          <ResultRow
            label="Confianza"
            value={`${confidencePercentage}%`}
          />

          <ResultRow
            label="Clase detectada"
            value={formatVisionClassName(result.detectedClass)}
          />


          <ResultRow
            label="Cultivo"
            value={formatCrop(
              result.cropType,
            )}
          />


          <ResultRow
            label="Zona analizada"
            value={formatZone(
              result.zoneId,
            )}
          />


          {/* ---------------------------------
              Estado semántico
              --------------------------------- */}

          <div className="visionResultRow">

            <strong>
              Estado
            </strong>

            <StatusBadge
              tone={predictionTone}
            >
              {statusLabel}
            </StatusBadge>

          </div>


          {/* ---------------------------------
              Fuente del análisis
              --------------------------------- */}

          <ResultRow
            label="Fuente"
            value={
              isFallback
                ? "Respaldo local"
                : "Vision AI"
            }
          />


          {/* ---------------------------------
              Evidencias disponibles
              --------------------------------- */}

          <ResultRow
            label="Evidencias"
            value={`${result.evidence.length} señales`}
          />

        </div>
      </Panel>


      {/* Solo se muestran métricas calculadas realmente para esta imagen. */}

      <Panel
        title={hasVisualMetrics ? "Métricas visuales" : "Resultados del modelo"}
        showInfo={false}
      >
        <div
          className="visionMetricRows"
          aria-label="Métricas obtenidas del análisis visual"
        >
          {!hasVisualMetrics && (
            <>
              {result.topClasses.map((item) => (
                <MetricRow
                  key={item.className}
                  label={formatVisionClassName(item.className)}
                  value={item.score * 100}
                  unit="%"
                />
              ))}
              <p className="visionMetricRows__note">
                Puntuaciones softmax de esta imagen; no son precisión estadística ni probabilidades calibradas. La cobertura y las lesiones no se miden con este clasificador.
              </p>
            </>
          )}

          {hasVisualMetrics && (
            <>
          {result.visualMetrics.greenCoveragePercentage != null && <MetricRow
            label="Cobertura verde"
            value={
              result.visualMetrics
                .greenCoveragePercentage
            }
            unit="%"
          />}


          {result.visualMetrics.dryAreaPercentage != null && <MetricRow
            label="Área seca"
            value={
              result.visualMetrics
                .dryAreaPercentage
            }
            unit="%"
          />}


          {result.visualMetrics.chlorosisSuspected != null && <BooleanMetricRow
            label="Clorosis sospechada"
            value={
              result.visualMetrics
                .chlorosisSuspected
            }
          />}


          {result.visualMetrics.leafSpotSuspected != null && <BooleanMetricRow
            label="Manchas foliares"
            value={
              result.visualMetrics
                .leafSpotSuspected
            }
          />}


          {result.visualMetrics.stressPatternDetected != null && <BooleanMetricRow
            label="Patrón de estrés"
            value={
              result.visualMetrics
                .stressPatternDetected
            }
            emphasized
          />}
            </>
          )}

        </div>
      </Panel>


      {/* =====================================================
          ACCIÓN RECOMENDADA
          ===================================================== */}

      <section
        className="visionPreliminaryNotice"
        aria-label="Acción recomendada"
      >

        <span
          className="visionPreliminaryNotice__icon"
          aria-hidden="true"
        >
          <RecommendationIcon />
        </span>


        <div>

          <strong>
            Acción recomendada
          </strong>

          <p>
            {result.recommendedAction}
          </p>

          <small>
            {result.explanation}
          </small>

        </div>

      </section>


      {/* =====================================================
          FALLBACK
          =====================================================
          Solo aparece si el resultado realmente proviene
          del mecanismo de respaldo.
          ===================================================== */}

      {isFallback && (
        <div
          className="visionFallbackNotice"
          role="status"
        >

          <strong>
            Modo de respaldo
          </strong>

          <span>
            {fallbackReason ??
              "Se muestra un resultado local controlado mientras el servicio principal no está disponible."}
          </span>

        </div>
      )}

    </>
  );
}


/* ===========================================================
   COMPONENTE — RESULT ROW
   =========================================================== */

/**
 * Fila compacta del resumen técnico.
 */
function ResultRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="visionResultRow">

      <strong>
        {label}
      </strong>

      <span title={value}>
        {value}
      </span>

    </div>
  );
}


/* ===========================================================
   COMPONENTE — MÉTRICA PORCENTUAL
   =========================================================== */

/**
 * Representa una métrica porcentual del análisis.
 *
 * El valor mostrado y el tamaño de la barra utilizan
 * exactamente el dato recibido desde Vision AI.
 */
function MetricRow({
  label,
  value,
  unit,
}: {
  readonly label: string;
  readonly value?: number | null;
  readonly unit: string;
}) {
  const normalizedValue =
    normalizeMetricPercentage(value);

  const hasValue =
    value !== null &&
    value !== undefined;


  return (
    <div className="visionMetricRow">

      <strong title={label}>
        {label}
      </strong>


      <div
        className="visionMetricProgress"
        aria-hidden="true"
      >
        <i>
          <b
            style={{
              width: `${normalizedValue}%`,
            }}
          />
        </i>
      </div>


      <span>
        {hasValue
          ? `${formatMetricValue(value)}${unit}`
          : "N/D"}
      </span>

    </div>
  );
}


/* ===========================================================
   COMPONENTE — MÉTRICA BOOLEANA
   =========================================================== */

/**
 * Representa las señales booleanas recibidas
 * desde Vision AI.
 *
 * La barra es únicamente una representación visual
 * del estado booleano.
 */
function BooleanMetricRow({
  label,
  value,
  emphasized = false,
}: {
  readonly label: string;
  readonly value?: boolean | null;
  readonly emphasized?: boolean;
}) {
  const percentage =
    value === true
      ? 100
      : value === false
        ? 12
        : 0;


  return (
    <div className="visionMetricRow">

      <strong title={label}>
        {label}
      </strong>


      <div
        className={
          emphasized
            ? "visionMetricProgress is-emphasized"
            : "visionMetricProgress"
        }
        aria-hidden="true"
      >

        <i>
          <b
            style={{
              width: `${percentage}%`,
            }}
          />
        </i>

      </div>


      <span>
        {formatBooleanMetric(value)}
      </span>

    </div>
  );
}


/* ===========================================================
   ICONO — RECOMENDACIÓN
   =========================================================== */

function RecommendationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width="20"
      height="20"
    >

      <path
        d="M12 3a6 6 0 0 0-3.7 10.7c.8.65 1.3 1.35 1.45 2.15h4.5c.15-.8.65-1.5 1.45-2.15A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.8 19h4.4M10.5 16h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M12 6.5v5M9.5 9h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.72"
      />

    </svg>
  );
}


/* ===========================================================
   HELPERS — CONFIANZA
   =========================================================== */

function normalizeConfidence(
  value: number,
): number {
  const normalized =
    value <= 1
      ? value * 100
      : value;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(normalized),
    ),
  );
}


/* ===========================================================
   HELPERS — MÉTRICAS
   =========================================================== */

function normalizeMetricPercentage(
  value?: number | null,
): number {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      value,
    ),
  );
}


function formatMetricValue(
  value: number,
): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1);
}


function formatBooleanMetric(
  value?: boolean | null,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "N/D";
  }

  return value
    ? "Sí"
    : "No";
}


/* ===========================================================
   HELPERS — ESTADO
   =========================================================== */

function getPredictionStatusLabel(
  prediction: VisionPrediction,
): string {
  if (
    prediction === "HEALTHY"
  ) {
    return "Normal";
  }

  if (
    prediction === "UNKNOWN"
  ) {
    return "Revisar";
  }

  return "Advertencia";
}


function getPredictionTone(
  prediction: VisionPrediction,
):
  | "SUCCESS"
  | "WARNING"
  | "DANGER" {
  if (
    prediction === "HEALTHY"
  ) {
    return "SUCCESS";
  }

  if (
    prediction === "UNKNOWN"
  ) {
    return "WARNING";
  }

  return "WARNING";
}


/* ===========================================================
   HELPERS — CULTIVO
   =========================================================== */

function formatCrop(
  value: string,
): string {
  const labels: Record<string, string> = {
    CORN:
      "Maíz",

    MAIZE:
      "Maíz",

    ORANGE:
      "Naranjo",

    RED_BEAN:
      "Frijol rojo",

    BEAN:
      "Frijol",

    CASSAVA:
      "Yuca",

    QUEQUISQUE:
      "Quequisque",

    SORGHUM:
      "Sorgo",

    SOY:
      "Soja",

    SOYBEAN:
      "Soja",
  };


  return (
    labels[value] ??
    value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /^\w/,
        (character) =>
          character.toUpperCase(),
      )
  );
}


/* ===========================================================
   HELPERS — ZONA
   =========================================================== */

function formatZone(
  value?: string | null,
): string {
  if (!value) {
    return "Sin zona";
  }

  return value.replace(
    "zone-",
    "Zona ",
  );
}
