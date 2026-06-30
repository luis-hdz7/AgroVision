// Navegación lateral reutilizable


/**
 * =========================================
 * Sidebar
 * =========================================
 *
 * Navegación lateral principal
 *
 * Finalidad:
 * - permitir moverse entre las secciones principales 
 * - mantener la navegación separada de la lógica del router
 * - marcar visualmente la secion activa 
 * 
 *
 * este componente no sabe de datos agrícolas, solo recibe items de navegación
*/

import  { ROUTES, type AppRoutePath,} from "../../../app/AppRouter";

interface SidebarProps {
    readonly activePath: AppRoutePath;
    readonly onNavigate: (path : AppRoutePath) => void;
}

export function Sidebar({ onNavigate}: SidebarProps) {
    return (
        <aside className="agroSidebar" aria-label="Navegación lateral">
            <header className="agroSidebar__brand">
                <div className="agroSidebar__logo" aria-hidden="true">AV-I</div>
                <div>
                    <strong>AgroVision Intelligence</strong>

                </div>
            </header>
            <nav className="agroSidebar__nav" aria-label="secciones principales">
                {ROUTES.map((route) => {
                    const isActive = route.path === route.path;
                    return (
                        <button 
                            key={route.path}
                            type="button"
                            className={isActive ? "sidebar__link is-active" : "sidebar__link"}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => onNavigate(route.path)}
                        >
                            <span className="sidebar__icon">{getRouteIcon(route.path)} </span>
                            <span>{route.label}</span> 
                        </button>
                    );
                })}
            </nav>
            <div className="sidebar__footer">
                <small>Frontend /UI base</small>
                <strong>Díia 2 + Día 3</strong>
            </div>
        </aside>

    );
}

//iconos simples por ruta, se ponen aquí por que solo son decoración 
function getRouteIcon(path: AppRoutePath): string {
    if (path === "/dashboard") return "▦";
    if (path === "/crops") return "♧";
    if (path === "/alerts") return "△";
    if (path === "/recommendations") return "✦";
    if (path === "/reports") return "▤";

    return "•";
}

    


