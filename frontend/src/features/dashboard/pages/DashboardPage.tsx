// Archivo encargado de mostrar la pantalla principal de la app

/**
 * =========================================
 * DashboardPage
 * =========================================
 *
 * Pantalla base del Dashboard principal.
 *
 * Finalidad:
 * - mostrar la entrada principal del sistema;
 * - colocar las tarjetas requeridas;
 * - respetar el contrato de datos;
 * - dejar la pantalla lista para conectar services después.
 *
 * Contratos revisados:
 * - DashboardSummary
 * - FarmOverview
 * - CropCycle
 * - Alert
 * - Recommendation
 * 
*/

import "../dashboard.css";

/**
 * DashboardPlaceholderCard define una tarjeta base del dashboard.
 *
 * * id:
 * Identificador interno de React para renderizar listas.
 *
 * * title:
 * Nombre visible de la tarjeta.
 *
 * * description:
 * Explica qué mostrará cuando esté conectada al backend.
 *
 * * contractReference:
 * Nombre del contrato que respalda esa tarjeta.
*/

interface DashboardPlaceholderCard {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly contractReference: string;
    readonly preparedFields: ReadonlyArray<string>;
}

/**
 * Tarjetas base del dashboard, muestran las áreas que luego consumirán backend.
*/
const DASHBOARD_CARDS: ReadonlyArray<DashboardPlaceholderCard> = [
  {
    id: "farm-status",
    title: "Estado de finca",
    description:
      "Preparado para mostrar el estado general de la unidad productiva.",
    contractReference: "FarmOverview / DashboardSummary.farm",
    preparedFields: [
      "farm.id",
      "farm.name",
      "farm.totalAreaSquareMeters",
      "systemHealth.status",
      "systemHealth.score",
    ],
  },
  {
    id: "crop-health",
    title: "Salud de cultivos",
    description:
      "Preparado para mostrar conteo de cultivos por estado sanitario.",
    contractReference: "CropCycle / DashboardSummary.crops",
    preparedFields: [
      "crops.total",
      "crops.healthy",
      "crops.watch",
      "crops.warning",
      "crops.critical",
    ],
  },
  {
    id: "active-alerts",
    title: "Alertas activas",
    description:
      "Preparado para mostrar alertas por severidad según el contrato.",
    contractReference: "Alert / DashboardSummary.alerts",
    preparedFields: [
      "alerts.active",
      "alerts.critical",
      "alerts.warning",
      "alerts.info",
    ],
  },
  {
    id: "urgent-recommendations",
    title: "Recomendaciones urgentes",
    description:
      "Preparado para mostrar acciones prioritarias recomendadas.",
    contractReference: "Recommendation / DashboardSummary.recommendations",
    preparedFields: [
      "recommendations.urgent",
      "recommendations.highPriority",
    ],
  },
];

export function DashboardPage() {
    return (
        <section className="dashboardPage" aria-labelledby="dashboard-title">
            <header className="dashboardHero">
                <div>
                    <p className="dashboardHero__eyebrow">Dashboard principal</p>

                    <h1 id="dashboard-title">Dashboard agrícola</h1>

                    <span>
                        Base visual inicial del frontend para monitoreo de finca, salud de
                        cultivos, alertas y recomendaciones inteligentes.
                    </span>
                </div>

                <div className="dashboardHero__status">
                    <strong>Contrato activo</strong>
                    <span>AGROVISION_DATA_CONTRACT.md</span>
                </div>
            </header>

            <section
                className="dashboardCards"
                aria-label="Tarjetas base del dashboard"
            >
                {DASHBOARD_CARDS.map((card) => (
                <article key={card.id} className="dashboardCard">
                    <header>
                        <p>{card.contractReference}</p>
                        <h2>{card.title}</h2>
                    </header>

                    <span>{card.description}</span>

                    <ul>
                    {card.preparedFields.map((field) => (
                        <li key={field}>{field}</li>
                    ))}
                    </ul>
                </article>
                ))}
            </section>
        </section>
    );
}