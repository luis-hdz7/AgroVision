/**
 * =========================================
 * ExpectedImpactBadge
 * =========================================
 *
 * Badge visual para (impacto esperado).
 *
 * Finalidad:
 * - resumir el área de impacto;
 * - explicar beneficio esperado;
*/

import type { ExpectedImpact } from "../types/recommendations.types";

interface ExpectedImpactBadgeProps {
    readonly impact: ExpectedImpact;
}

export function ExpectedImpactBadge({ impact }: ExpectedImpactBadgeProps) {
    return (
        <article className="expectedImpactBadge">
            <small>Expected impact</small>
            <strong>{formatImpactArea(impact.impactArea)}</strong>
            <p>{impact.description}</p>
        </article>
    );
}

// Formatea el valor técnico solo para lectura visual. esto significa que no cambia el dato original.
function formatImpactArea(value: string): string {
    return value.replaceAll("_", " ");
}

