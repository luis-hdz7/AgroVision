/**
 * =========================================
 * SimulationControls
 * =========================================

 * Controles visuales de simulación.

 * Día 1:
 * - solo botones conectados a funciones placeholder.

 * Día 3:
 * - estos botones controlarán el playback real.
 * =========================================
*/

interface SimulationControlsProps {
    readonly onStart: () => void;
    readonly onReset: () => void;
}

export function SimulationControls({onStart, onReset}: SimulationControlsProps) {
    return (
        <div className="simulationControls panelGlass">
            <button type="button" className="simulationButton primary" onClick={onStart}>Iniciar simulación</button>
            <button type="button" className="simulationButton secondary" onClick={onReset}>Reiniciar simulación</button>
        </div>
    );
}


