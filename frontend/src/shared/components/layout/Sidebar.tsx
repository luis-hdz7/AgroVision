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

export function Sidebar({ activePath, onNavigate}: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">AV</div>

                <div>
                    <strong>AgroVision</strong>
                    <span>Intelligence</span>
                </div>
            </div>

            <nav className="sidebar__nav" aria-label="Navegación principal">
                {ROUTES.map((route) => {
                    const isActive = route.path === activePath;

                    return (
                        <button
                            key={route.path}
                            type="button"
                            className={isActive ? "sidebar__link is-active" : "sidebar__link"}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => onNavigate(route.path)}
                            >
                                <span className="sidebar__icon">{getRouteIcon(route.path)}</span>
                                <span>{route.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar__footer">
                <small>AgroVision Intelligence</small>
                <strong>Prescriptive MVP</strong>
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

    


