/**
 * =========================================
 * VisionEvidenceGallery
 * =========================================
 *
 * Galería visual de evidencias detectadas
 * durante el análisis de Vision AI.
 *
 * Finalidad:
 * - representar las evidencias reales recibidas;
 * - reutilizar la imagen original como referencia visual;
 * - mostrar regiones de análisis de forma intuitiva;
 * - mantener trazabilidad entre evidencia y predicción;
 * - evitar lógica visual extensa dentro de VisionAiPage.
 *
 * IMPORTANTE:
 * - NO ejecuta inferencia;
 * - NO modifica resultados;
 * - NO genera evidencias nuevas;
 * - utiliza únicamente VisionInspection.evidence.
 * =========================================
 */

import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

import type {
  VisionEvidenceItem,
  VisionEvidenceStatus,
  VisionInspection,
} from "../types/visionAI.types";


/* ===========================================================
   PROPS
   =========================================================== */

interface VisionEvidenceGalleryProps {
  readonly inspection: VisionInspection;
  readonly previewUrl: string | null;
}


/* ===========================================================
   COMPONENTE PRINCIPAL
   =========================================================== */

export function VisionEvidenceGallery({
  inspection,
  previewUrl,
}: VisionEvidenceGalleryProps) {
  const evidence =
    inspection.evidence;

  if (evidence.length === 0) {
    return (
      <VisionEvidenceEmpty />
    );
  }

  return (
    <div
      className="visionEvidenceGallery"
      aria-label="Evidencias visuales detectadas"
    >
      {evidence.map(
        (item, index) => (
          <VisionEvidenceCard
            key={`${item.metric}-${index}`}
            evidence={item}
            previewUrl={previewUrl}
            index={index}
            confidence={
              normalizeConfidence(
                inspection.confidence,
              )
            }
          />
        ),
      )}
    </div>
  );
}


/* ===========================================================
   CARD DE EVIDENCIA
   =========================================================== */

interface VisionEvidenceCardProps {
  readonly evidence: VisionEvidenceItem;
  readonly previewUrl: string | null;
  readonly index: number;
  readonly confidence: number;
}

function VisionEvidenceCard({
  evidence,
  previewUrl,
  index,
  confidence,
}: VisionEvidenceCardProps) {
  return (
    <article className="visionEvidenceCard">

      {/* =====================================
          REFERENCIA VISUAL
          ===================================== */}

      <div className="visionEvidenceCard__media">

        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            aria-hidden="true"
            className={[
              "visionEvidenceCard__image",
              `visionEvidenceCard__image--${index + 1}`,
            ].join(" ")}
          />
        ) : (
          <div
            className="visionEvidenceCard__placeholder"
            aria-hidden="true"
          >
            <EvidenceIcon />
          </div>
        )}


        {/* Número de evidencia */}

        <b>
          {index + 1}
        </b>


        {/* Overlay de región */}

        <span
          className={[
            "visionEvidenceCard__focus",
            `visionEvidenceCard__focus--${index + 1}`,
          ].join(" ")}
          aria-hidden="true"
        />

      </div>


      {/* =====================================
          INFORMACIÓN
          ===================================== */}

      <div className="visionEvidenceCard__body">

        <div className="visionEvidenceCard__top">

          <span>
            EV-
            {String(index + 1).padStart(
              2,
              "0",
            )}
          </span>

          <StatusBadge
            tone={getEvidenceTone(
              evidence.status,
            )}
          >
            {formatEvidenceStatus(
              evidence.status,
            )}
          </StatusBadge>

        </div>


        {/* Región */}

        <strong>
          {getEvidenceRegion(index)}
        </strong>


        {/* Métrica */}

        <div className="visionEvidenceCard__metric">

          <span>
            {formatMetricName(
              evidence.metric,
            )}
          </span>

          <b>
            {formatEvidenceValue(
              evidence,
            )}
          </b>

        </div>


        {/* Explicación */}

        <p title={evidence.explanation}>
          {evidence.explanation}
        </p>


        {/* Footer */}

        <footer>

          <div>
            <span>
              Fuente
            </span>

            <strong>
              Vision AI
            </strong>
          </div>


          <div>
            <span>
              Confianza
            </span>

            <strong>
              {confidence}%
            </strong>
          </div>

        </footer>

      </div>

    </article>
  );
}


/* ===========================================================
   EMPTY
   =========================================================== */

function VisionEvidenceEmpty() {
  return (
    <div className="visionCompactEmpty">

      <span
        className="visionCompactEmpty__icon"
        aria-hidden="true"
      >
        <EvidenceIcon />
      </span>

      <strong>
        Sin evidencias disponibles
      </strong>

      <p>
        El análisis se completó, pero no se
        recibieron evidencias visuales asociadas.
      </p>

    </div>
  );
}


/* ===========================================================
   ICONO
   =========================================================== */

function EvidenceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m7 16 3.3-3.5 2.3 2.2 2.4-2.7 2 2.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="15.5"
        cy="9"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}


/* ===========================================================
   HELPERS — STATUS
   =========================================================== */

function getEvidenceTone(
  status: VisionEvidenceStatus,
):
  | "SUCCESS"
  | "WARNING"
  | "DANGER" {
  if (status === "NORMAL") {
    return "SUCCESS";
  }

  if (status === "CRITICAL") {
    return "DANGER";
  }

  return "WARNING";
}


function formatEvidenceStatus(
  status: VisionEvidenceStatus,
): string {
  if (status === "NORMAL") {
    return "Normal";
  }

  if (status === "WATCH") {
    return "Vigilancia";
  }

  if (status === "CRITICAL") {
    return "Crítica";
  }

  return "Advertencia";
}


/* ===========================================================
   HELPERS — REGIÓN
   =========================================================== */

function getEvidenceRegion(
  index: number,
): string {
  if (index === 0) {
    return "Región prioritaria";
  }

  if (index === 1) {
    return "Cobertura vegetal";
  }

  if (index === 2) {
    return "Área de contraste";
  }

  return "Señal complementaria";
}


/* ===========================================================
   HELPERS — MÉTRICAS
   =========================================================== */

function formatMetricName(
  value: string,
): string {
  const normalized =
    value
      .replaceAll("_", " ")
      .replace(
        /([a-z])([A-Z])/g,
        "$1 $2",
      );

  return normalized
    .toLowerCase()
    .replace(
      /^\w/,
      (character) =>
        character.toUpperCase(),
    );
}


function formatEvidenceValue(
  evidence: VisionEvidenceItem,
): string {
  if (
    evidence.value === null ||
    evidence.value === undefined
  ) {
    return "N/D";
  }

  const value =
    typeof evidence.value ===
    "boolean"
      ? evidence.value
        ? "Sí"
        : "No"
      : String(evidence.value);

  return evidence.unit
    ? `${value} ${evidence.unit}`
    : value;
}


/* ===========================================================
   HELPER — CONFIANZA
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
