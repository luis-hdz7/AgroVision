/**
 * =========================================
 * RiskPill
 * =========================================
 *
 * Componente visual para mostrar nivel de riesgo.
 *
 * Finalidad:
 * - representar LOW, MEDIUM, HIGH o CRITICAL;
 * - mantener la clase CSS dinámica según el nivel;
 * - evitar repetir el mismo JSX en DashboardPage u otros componentes.
*/

import type { RiskLevel } from "../types/dashboard.types";

interface RiskPillProps {
  readonly riskLevel: RiskLevel;
}

/**
 * Renderiza una etiqueta visual de riesgo.
 *
 * Funcionamiento:
 * - recibe riskLevel como valor técnico;
 * - convierte el valor a minúscula para construir la clase CSS;
 * - muestra el texto original sin modificar el dato.
*/

export function RiskPill({ riskLevel }: RiskPillProps) {
    // Se usa para aplicar clases como riskPill--high o riskPill--critical.
    const riskClassName = riskLevel.toLowerCase();

    return (
        <span className={`riskPill riskPill--${riskClassName}`}>
        {riskLevel}
        </span>
    );
}