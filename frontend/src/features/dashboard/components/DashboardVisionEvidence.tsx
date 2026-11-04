/** Tarjetas del archivo Vision; cada fotografía pertenece a su propio análisis. */

import { useState } from "react";

import { getVisionAnalysisImageUrl } from "../../vision-ai/services/visionAIService.ts";
import type { VisionHistoryItem } from "../../vision-ai/types/visionAI.types";
import { formatVisionFinding } from "../../vision-ai/utils/visionLabels";
import type {
  DashboardVisionEvidenceState,
} from "../hooks/useDashboardVisionEvidence";

interface DashboardVisionEvidenceProps extends DashboardVisionEvidenceState {
  readonly onRetry: () => void;
}

export function DashboardVisionEvidence({
  status,
  items,
  error,
  onRetry,
}: DashboardVisionEvidenceProps) {
  if (status !== "READY") {
    const copy = getStateCopy(status, error);
    return (
      <div className={`dashboardEvidenceState is-${status.toLowerCase()}`}>
        <strong>{copy.title}</strong>
        <span>{copy.description}</span>
        {status === "ERROR" && (
          <button type="button" className="avTextAction" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="avEvidenceGrid">
      {items.map((item) => (
        <DashboardVisionEvidenceCard key={item.inspectionId} item={item} />
      ))}
    </div>
  );
}

function DashboardVisionEvidenceCard({ item }: { readonly item: VisionHistoryItem }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  return (
    <article className="avEvidenceItem" title={formatVisionFinding(item)}>
      {item.hasImage && !failed && (
        <img
          key={attempt}
          src={getVisionAnalysisImageUrl(item.inspectionId, item.fieldId)}
          alt={`Evidencia del análisis ${item.inspectionId}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}

      {!item.hasImage && (
        <span className="avEvidenceItem__imageState">Imagen no archivada</span>
      )}

      {failed && (
        <span className="avEvidenceItem__imageState">
          Error al descargar la foto
          <button
            type="button"
            onClick={() => {
              setAttempt((current) => current + 1);
              setFailed(false);
            }}
          >
            Reintentar
          </button>
        </span>
      )}

      <div className="avEvidenceItem__copy">
        <strong>{formatVisionFinding(item)}</strong>
        <span>{formatDateTime(item.createdAt)} · {formatConfidence(item.confidence)}%</span>
      </div>
    </article>
  );
}

function getStateCopy(
  status: DashboardVisionEvidenceState["status"],
  error: string | null,
): { readonly title: string; readonly description: string } {
  if (status === "SELECT_FIELD") {
    return {
      title: "Selecciona una parcela",
      description: "El archivo visual se consulta para una parcela concreta.",
    };
  }
  if (status === "LOADING") {
    return { title: "Cargando evidencias", description: "Consultando el historial Vision." };
  }
  if (status === "ERROR") {
    return { title: "Evidencias no disponibles", description: error ?? "Falló la consulta Vision." };
  }
  return {
    title: "Sin análisis registrados",
    description: "Esta parcela todavía no tiene evidencias Vision guardadas.",
  };
}

function formatConfidence(value: number): number {
  return Math.round(value <= 1 ? value * 100 : value);
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-NI", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
