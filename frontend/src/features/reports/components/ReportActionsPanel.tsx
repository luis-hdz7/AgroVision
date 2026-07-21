/**
 * =========================================
 * ReportActionsPanel
 * =========================================
 *
 * Panel de acciones del reporte.
 *
 * Finalidad:
 * - separar acciones tomadas y pendientes;
 * - mostrar responsables;
 * - reforzar trazabilidad operativa.
*/

import type { ReportAction } from "../types/reports.types";

interface ReportActionsPanelProps {
  readonly actionsTaken: ReadonlyArray<ReportAction>;
  readonly pendingActions: ReadonlyArray<ReportAction>;
}

export function ReportActionsPanel({  actionsTaken, pendingActions }: ReportActionsPanelProps) {
    return ( 
        <section className="reportActionsGrid">
            <ActionColumn title="Actions taken" actions={actionsTaken} />
            <ActionColumn title="Pending actions" actions={pendingActions} />
        </section>
    );
}

interface ActionColumnProps {
  readonly title: string;
  readonly actions: ReadonlyArray<ReportAction>;
}

function ActionColumn({ title, actions }: ActionColumnProps) {
    return (
        <article className="reportPanel">
        <header>
            <p>{title}</p>
            <h2>{actions.length} records</h2>
        </header>

        {actions.length === 0 ? (
            <p className="reportActionsEmpty">No action records available.</p>
        ) : (
            <div className="reportActionsList">
            {actions.map((action) => (
                <article
                key={action.id}
                className={`reportActionItem reportActionItem--${action.status.toLowerCase()}`}
                >
                    <div>
                        <strong>{action.title}</strong>
                        <span>{action.status}</span>
                    </div>

                    <p>{action.description}</p>

                    <small>
                        Responsible: {action.responsible ?? "Unassigned"} ·{" "}
                        {formatShortDate(action.registeredAt)}
                    </small>
                </article>
            ))}
            </div>
        )}
        </article>
    );
}

function formatShortDate(value: string): string {
    return new Intl.DateTimeFormat("es-NI", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}