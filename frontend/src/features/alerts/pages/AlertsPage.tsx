/**
 * =========================================
 * AlertsPage
 * =========================================
 *
 * Pantalla funcional de alertas prescriptivas.
 *
 * Finalidad:
 * - consumir alertas desde service;
 * - mostrar evidencia y acción recomendada;
 * - soportar loading, error y empty state.
*/

import { useEffect, useState } from "react";
import { AlertCard } from "../components/AlertCard";
import { getAlertsData } from "../services/alertsService";
import type { AlertsData } from "../types/alerts.types";
import "../alerts.css";

export function AlertsPage() {
    const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //carga alertas desde service, el service decide si usa backend real o fallback local.
    useEffect(() => {
        async function loadAlerts() {
            try {
                const data = await getAlertsData();
                setAlertsData(data);
                setErrorMessage(null);
            } catch {
                setErrorMessage("No se pudieron cargar las alertas.");
            } finally {
                setIsLoading(false);
            }
        }
        void loadAlerts();
    }, []);

    return (
        <section className="alertsPage" aria-labelledby="alerts-title">
            <header className="alertsHero">
                <div>
                    <p className="alertsHero__eyebrow">Alertas prescriptivas</p>

                    <h1 id="alerts-title">Riesgos con evidencia accionable</h1>

                    <span>
                        Cada alerta muestra severidad, zona afectada, evidencia técnica y
                        una acción recomendada para responder de forma defendible.
                    </span>
                </div>
            </header>

            {isLoading && (
                <section className="alertsState">
                    <p>Cargando alertas prescriptivas...</p>
                </section>
            )}

            {errorMessage && (
                <section className="alertsState alertsState--error">
                    <p>{errorMessage}</p>
                </section>
            )}

            {!isLoading && !errorMessage && alertsData && (
                <>
                    <section className="alertsSummaryGrid" aria-label="Alerts summary">
                        <article>
                            <span>Active alerts</span>
                            <strong>{alertsData.totalActive}</strong>
                        </article>
                        <article>
                            <span>Critical / High</span>
                            <strong>{alertsData.totalCritical}</strong>
                        </article>
                        <article>
                            <span>Generated at</span>
                            <strong>{formatShortDate(alertsData.generatedAt)}</strong>
                        </article>
                    </section>

                    {alertsData.alerts.length === 0 ? (
                        <section className="alertsState">
                            <p>No hay alertas disponibles.</p>
                        </section>
                    ) : (
                        <section className="alertsGrid" aria-label="Alerts list">
                        {alertsData.alerts.map((alert) => (
                            <AlertCard key={alert.id} alert={alert} />
                        ))}
                        </section>
                    )}
                </>
            )}
        </section>
    );
}


function formatShortDate(value: string): string {
    return new Intl.DateTimeFormat("es-NI", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}
