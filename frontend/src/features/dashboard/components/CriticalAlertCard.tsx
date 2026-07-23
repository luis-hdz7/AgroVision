/**
 * =========================================
 * CriticalAlertCard
 * =========================================
 *
 * Card para mostrar la alerta crítica principal.
 *
 * Finalidad:
 * - mostrar título de alerta;
 * - mostrar severidad;
 * - mostrar acción recomendada;
 * - mostrar evidencia que respalda la alerta.
*/

import type { DashboardSummary } from "../types/dashboard.types";
import { EvidenceBadge } from "./EvidenceBadge";
import { RiskPill } from "./RiskPill";

type CriticalAlert = DashboardSummary["alerts"]["criticalAlerts"][number];

interface CriticalAlertCardProps {
    readonly alert: CriticalAlert;
}

/**
 * Renderiza una alerta crítica del dashboard.
 *
 * Funcionamiento:
 * - recibe una alerta ya seleccionada por DashboardPage;
 * - muestra severidad mediante RiskPill;
 * - recorre evidence para mostrar cada evidencia con EvidenceBadge.
*/

export function CriticalAlertCard({ alert }: CriticalAlertCardProps) {
    return (
        <article className="dashboardPanel dashboardPanel--alert">
            <header>
                <p>Alerta crítica</p>
                <h2>{alert.title}</h2>
            </header>
            <RiskPill riskLevel={alert.severity} />
            <span>{alert.recommendedAction}</span>
            
            <div className="dashboardEvidenceList">
                {alert.evidence.map((evidence) => (
                <EvidenceBadge
                    key={`${alert.id}-${evidence.source}-${evidence.metric}`}
                    evidence={evidence}
                />
                ))}
            </div>
        </article>
    );
}