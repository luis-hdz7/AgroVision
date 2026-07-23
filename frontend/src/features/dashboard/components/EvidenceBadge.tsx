/**
 * =========================================
 * EvidenceBadge
 * =========================================
 *
 * Componente visual para evidencia agrícola.
 *
 * Finalidad:
 * - mostrar fuente de evidencia;
 * - mostrar métrica, valor y unidad;
 * - explicar por qué esa evidencia importa;
 * - reutilizar la misma visualización en dashboard, alertas y recomendaciones. 
*/

import type { EvidenceItem } from "../types/dashboard.types";

interface EvidenceBadgeProps {
  readonly evidence: EvidenceItem;
}

/**
 * Renderiza una evidencia en formato compacto.
 *
 * Funcionamiento:
 * - usa evidence.status para construir una clase visual;
 * - muestra source como origen de evidencia;
 * - muestra metric + value + unit;
 * - muestra explanation como soporte técnico.
*/

export function EvidenceBadge({ evidence }: EvidenceBadgeProps) {
    // Se usa para clases como evidenceBadge--warning o evidenceBadge--critical.
    const statusClassName = evidence.status.toLowerCase();

    // Si value viene null o undefined, se muestra N/A para no romper la UI.
    const readableValue = String(evidence.value ?? "N/A");

    return (
        <article className={`evidenceBadge evidenceBadge--${statusClassName}`}>
            <strong>{evidence.source}</strong>
            <span>
                {evidence.metric}: {readableValue}
                {evidence.unit ? ` ${evidence.unit}` : ""}
            </span>
            <small>{evidence.explanation}</small>
        </article>
    );
}