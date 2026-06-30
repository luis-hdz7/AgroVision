// Archivo encargado de crear laas rutas bases de la app

/**
 * =========================================
 * AppRouter
 * =========================================
 *
 * Router base del frontend
 *
 * Finalidad:
 * - definir las rutas principales del sistema;
 * - abrir la app directamente en /dashboard;
 * - permitir navegación base sin instalar librerías;
 * - mostrar placeholders en módulos aún no implementados.
 *
 * Rutas requeridas:
 * - /dashboard
 * - /crops
 * - /alerts
 * - /recommendations
 * - /reports
 * 
*/

//import { useEffect, useState } from "react";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";

/** AppRouterPath  define las rutas permitidsas.
 * 
 * así se evita navegar por rutas no existentes de forma accidental.
*/

export type AppRoutePath = 
  | "/dashboard"
  | "/crops"
  | "/alerts"
  | "/recommendations"
  | "/reports";


/** RouteDefinition define cada ruta base del sistema. 
 * 
 * * label:
 * Texto para el botón de navegación.
 *
 * * title:
 * Título mostrado en placeholder.
 *
 * * description:
 * Explica para qué servirá ese módulo.
*/

export interface RouteDefinition {
    readonly path: AppRoutePath;
    readonly label: string;
    readonly title: string;
    readonly description: string;
}


/** Ruta base/principal del sistema 
 * 
 * Si el usuario entra a "/" "/123" o un a ruta no valida, será redirigido a /dashboard
*/
export const DEFAULT_ROUTE = "/dashboard";


/** Rutas principales del sistema */
export const ROUTES : ReadonlyArray<RouteDefinition> = [
    {
        path: "/dashboard",
        label: "Dashboard",
        title: "Dashboard",
        description: "Pantalla principal del sistema",
    },
    {
        path: "/crops",
        label: "Cultivos",
        title: "Cultivos",
        description: "Módulo para ciclos de cultivo, estaddo fenológico y salud agricola", 
    }, 
    {
        path: "/alerts",
        label: "Alertas",
        title: "Alertas",
        description: "Módulo para eventos criticos, evidencias, y acciones recomendadas",
    },
    {
        path: "/recommendations",
        label: "Recomendaciones",
        title: "Recomendaciones",
        description: "Módulos para acciones inteligentes basadas en sensores, visión y analisis de datos",
    },
    {
        path: "/reports",
        label: "Reportes",
        title: "Reportes",
        description: "Módulo para informes y reportes técnicos, productivos y ejecutivos",
    }
];

export  function AppRouter({activePath } : {readonly activePath : AppRoutePath}) {
    // // activePath gusrda la ruta actual
    // const [activePath, setActivePath] = useState<AppRoutePath>(
    //     getRouteFromPathname(window.location.pathname)
    // );

    /** useEffect para sincronizar el router con el navegador.
     * 
     * * Hace 3 cosas:
     * 1. Corrige rutas invalidas hacia dashboard.
     * 2. Permite usar el botón atrás/adelante
     * 3. Mantiene activePath actualizado   
    */

    // useEffect(() => {
    //     if (!isValidRoutePath(window.location.pathname)) {
    //         window.history.replaceState(null, "", DEFAULT_ROUTE);
    //         setActivePath(DEFAULT_ROUTE);
    //     }

    //     function handlePopState() {
    //         setActivePath(getRouteFromPathname(window.location.pathname));
    //     }
        
    //     window.addEventListener("popstate", handlePopState);

    //     return () => {
    //         window.removeEventListener("popstate", handlePopState);
    //     };
        
    // },[]);


    /** navigateTo cambia de ruta sin recargar la página 
     * 
     * pushState actualiza la url
     * setActivePath actualiza la pantalla visible
    */

    // function navigateTo(path: AppRoutePath) {
    //     window.history.pushState(null, "", path);
    //     setActivePath(path);
    // }
    
    const activeRoute = getRouteDefinition(activePath);

    return (
        <>
            {/* <nav className = "appRouteNav" aria-label="Rutas principales">
                {ROUTES.map((route) => (
                    <button
                        key={route.path}
                        type="button"
                        className={
                            activePath === route.path ? "appRouteNav__item appRouteNav__item--active" 
                            : "appRouteNav__item"
                        }
                        onClick={() => navigateTo(route.path)}
                    >
                        {route.label}
                    </button>
                ))}
            </nav> */}

            <main className="appRouteContent">
                {activePath === "/dashboard" ? (
                    <DashboardPage />
                ) : ( 
                    <RoutePlaceholder
                    title={activeRoute.title}
                    description={activeRoute.description}
                    />
                )}
            </main>
        </>
    );
}


interface RoutePlaceholderProps {
    readonly title: string;
    readonly description: string;
}


/**
 * Placeholder temporal.
 *
 * Sirve para demostrar que las rutas existen,
 * sin inventar páginas completas todavía.
*/

function RoutePlaceholder({title, description}: RoutePlaceholderProps) {
    return  (
        <section className="routePlaceholder">
            <p>Módulo en preparación</p>
            <h1>{title}</h1>
            <span>{description}</span>
        </section>
    );
}


/**
 * Obtiene la ruta actual del navegador.
 *
 * Si la ruta es válida, la devuelve, si no es válida, devuelve /dashboard
*/

export function getRouteFromPathname(pathname: string): AppRoutePath {
  if (ROUTES.some((route) => route.path === pathname)) {
    return pathname as AppRoutePath;
  }

  return DEFAULT_ROUTE;
}

/**
 * Valida si una ruta pertenece a las rutas permitidas.
 *
 * TypeScript usa "path is AppRoutePath" para entender que
 * después de validar, path ya es una ruta segura.
*/

// function isValidRoutePath(path: string): path is AppRoutePath {
//     return ROUTES.some((route) => route.path === path);
// }

/**
 * Devuelve la difinicion completa de una ruta 
 * 
 * Si algo falla, retorna la primera ruta, osea:  dashboard
*/

function getRouteDefinition(path: AppRoutePath): RouteDefinition {
    return ROUTES.find((route) => route.path === path) ?? ROUTES[0];
}