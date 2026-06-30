//caberecera genral del proyecto, posible espacio futuro para el apartado de perfil 

interface TopbarProps {
    readonly activeLabel: string;
}

export function Topbar({activeLabel}: TopbarProps) {
    return (
        <header className="topbar" aria-label="cabecera">
            <div>
                <p className="topbar_eyebrow">{activeLabel}</p>
                <h1>AgroVision Intelligence</h1>
                <span>Vista base del sistema para monitoreo agrícola, estado de finca, salud de cultivos, alertas y recomendaciones inteligentes.</span>
            </div>

            <div className="topbar__profile" aria-label="Perfil del ususario en el futuro">
                <div className="topbar__profile">Usuario</div>
                <span>Perfil User</span>
            </div>
        </header>
    );
}