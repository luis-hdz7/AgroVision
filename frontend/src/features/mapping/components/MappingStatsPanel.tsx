/**
 * =========================================
 * MappingStatsPanel
 * =========================================
 *
 * Panel lateral de telemetría.

 * Responsabilidad de Frontend 1:
 * Mostrar datos resumidos del rover y del mapeo.
 
 * No calcula lógica pesada. Solo transforma datos ya listos
 * en tarjetas visuales.
 * =========================================
*/

import type { RenderSimulationData } from "../types/mappingRender.types";


interface MappingStatsPanelProps {
    readonly data:  RenderSimulationData;
}

export function MappingStatsPanel({data}: MappingStatsPanelProps) {
    const detectedPlantPercentage =
        data.plants.length > 0 ? Math.round((data.stats.plantsDetected / data.plants.length) * 100) : 0;
    
    const metrics = [
        {
            label: "Batería",
            value: `${data.rover.battery}%`,
            helper: "Rover operativo",
            percent: data.rover.battery,
        },
        {
            label: "Plantas",
            value: `${data.stats.plantsDetected}/${data.plants.length}`,
            helper: "Clusters detectados",
            percent: detectedPlantPercentage,
        },
        {
            label: "Obstáculos",
            value: String(data.stats.obstaclesDetected),
            helper: "Alertas activas",
            percent: Math.min(data.stats.obstaclesDetected * 25, 100),
        },
        {
            label: "Recorrido",
            value: `${data.stats.distanceTraveled}m`,
            helper: "Distancia simulada",
            percent: data.stats.inspectedPercentage,
        },
    ];

    return (
        <section className="statsPanel panelGlass">
            <div className="sidePanelHeader">
                <div>
                    <p className="panelKicker">Estado</p>
                    <h2>Telemetría</h2>
                </div>
                <span className="statusPill">{data.rover.status}</span>
            </div>
            <div className="metricsGrid">
                {metrics.map((metric) => (
                    <article key={metric.label} className="metricCard">
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                        <small>{metric.helper}</small>

                        <div className="meterTrack">
                            <span
                                className="meterFill"
                                style={{ width: `${metric.percent}%` }}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}