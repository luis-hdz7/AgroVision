/**
 * =========================================
 * MapLegend Component
 * =========================================
 
 * Leyenda técnica del render 2D.
 
 * Su responsabilidad:
 * - explicar qué significa cada capa visual;
 * - separar la documentación visual del layout principal;
 * - evitar que MappingRenderDemo tenga demasiado código;
 * - mantener los colores e iconos centralizados.
 
 * Por qué existe:
 * El render SVG tiene muchas capas: trayectoria, nube de puntos,
 * plantas, obstáculos, LiDAR, mediciones y rover. Sin una leyenda,
 * el usuario puede ver algo "bonito", pero no entender qué significa.
 
 * =========================================
*/

interface LegendItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly tone: "cloud" | "path" | "plant" | "obstacle" | "scan" | "rover" | "measure";
}

/**
 * Lista centralizada de capas visibles.
 * Si mañana se agrega otra capa al SVG, se agrega aquí.
*/
const LEGEND_ITEMS: ReadonlyArray<LegendItem> = [
  {
    id: "cloud",
    label: "Nube de puntos",
    description: "Retornos simulados del entorno detectado.",
    tone: "cloud",
  },
  {
    id: "path",
    label: "Trayectoria XY",
    description: "Ruta recorrida y ruta proyectada del rover.",
    tone: "path",
  },
  {
    id: "plant",
    label: "Clusters vegetales",
    description: "Centros estimados de plantas detectadas.",
    tone: "plant",
  },
  {
    id: "obstacle",
    label: "Obstáculos",
    description: "Zonas críticas detectadas en el recorrido.",
    tone: "obstacle",
  },
  {
    id: "scan",
    label: "LiDAR sweep",
    description: "Barrido actual del sensor simulado.",
    tone: "scan",
  },
  {
    id: "rover",
    label: "Rover pose",
    description: "Posición, orientación y frame actual.",
    tone: "rover",
  },
  {
    id: "measure",
    label: "Mediciones",
    description: "Distancias visuales entre elementos clave.",
    tone: "measure",
  },
];


export function MapLegend() {
  return (
    <section className="legendPanel panelGlass" aria-labelledby="map-legend-title">
      <p className="panelKicker">Capas</p>
      <div className="legendHeader">
          <h2 id="map-legend-title">Leyenda técnica</h2>
          <span>{LEGEND_ITEMS.length} capas</span>
      </div>
      <div className="legendList">
        {LEGEND_ITEMS.map((item) => (
            <article key={item.id} className="legendItem">
              <span
                className={`legendSymbol legendSymbol--${item.tone}`}
                aria-hidden="true"
                />
                <div>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                </div>
            </article>
        ))}
      </div>
    </section> 
  );
}