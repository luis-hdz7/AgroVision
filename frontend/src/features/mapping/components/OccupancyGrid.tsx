/**
 * =========================================
 * OccupancyGrid Component
 * =========================================
 *
 * Capa base del mapa técnico.
 *
 * Su responsabilidad:
 * - dibujar el plano XY;
 * - mostrar líneas menores y mayores;
 * - simular el espacio donde el rover está mapeando;
 * - dar sensación de sistema robótico, no de dibujo decorativo.
 *
 * Por qué existe:
 * Separar el grid del canvas principal evita que
 * TerrainCanvas se vuelva gigante y difícil de mantener.
 * =========================================
 */

const MINOR_LINES = Array.from({ length: 21 }, (_, index) => index * 5);
const MAJOR_LINES = Array.from({ length: 11 }, (_, index) => index * 10);

/**
 * Líneas diagonales suaves que simulan hileras o corredores
 * por donde el rover puede desplazarse.
 *
 * No representan un mapa real todavía. Son contexto visual
 * para que el usuario entienda que hay un ambiente escaneado.
 */
const ROW_GUIDES = [
  { x1: 12, y1: 28, x2: 88, y2: 18 },
  { x1: 12, y1: 40, x2: 88, y2: 30 },
  { x1: 12, y1: 52, x2: 88, y2: 42 },
  { x1: 12, y1: 64, x2: 88, y2: 54 },
  { x1: 12, y1: 76, x2: 88, y2: 66 },
];

export function OccupancyGrid() {
  return (
    <g className="occupancyGrid" aria-hidden="true">
      <rect x="6" y="6" width="88" height="88" rx="2.4" className="gridFrame" />

      <g className="minorGrid">
        {MINOR_LINES.map((value) => (
          <g key={`minor-${value}`}>
            <line x1={value} y1="6" x2={value} y2="94" />
            <line x1="6" y1={value} x2="94" y2={value} />
          </g>
        ))}
      </g>

      <g className="majorGrid">
        {MAJOR_LINES.map((value) => (
          <g key={`major-${value}`}>
            <line x1={value} y1="6" x2={value} y2="94" />
            <line x1="6" y1={value} x2="94" y2={value} />
          </g>
        ))}
      </g>

      <g className="rowGuides">
        {ROW_GUIDES.map((row, index) => (
          <line
            key={`row-${index}`}
            x1={row.x1}
            y1={row.y1}
            x2={row.x2}
            y2={row.y2}
          />
        ))}
      </g>

      <line x1="10" y1="90" x2="90" y2="90" className="axisLine" />
      <line x1="10" y1="90" x2="10" y2="10" className="axisLine" />

      <text x="91" y="92" className="axisLabel">
        x[m]
      </text>

      <text x="7.5" y="9" className="axisLabel axisLabel--y">
        y[m]
      </text>

      <circle cx="10" cy="90" r="1" className="originPoint" />

      <text x="12" y="88" className="originLabel">
        origin
      </text>
    </g>
  );
}