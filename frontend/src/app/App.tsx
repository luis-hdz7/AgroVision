import { useEffect, useState } from "react";
import {
  ROUTES,
  DEFAULT_ROUTE,
  AppRouter,
  getRouteFromPathname,
  type AppRoutePath,
} from "./AppRouter";
import { Sidebar } from "../shared/components/layout/Sidebar";
import { Topbar } from "../shared/components/layout/Topbar";
import "../shared/styles/layout.css";



function App() {
  // activePath representa la ruta actual visible.
  // Se inicializa leyendo la URL del navegador.
  const [activePath, setActivePath] = useState<AppRoutePath>(() =>
    getRouteFromPathname(window.location.pathname)
  );

  // Mantiene sincronizada la URL con el estado interno.
  // También permite usar atrás/adelante del navegador.
  useEffect(() => {
    const initialPath = getRouteFromPathname(window.location.pathname);

    if (window.location.pathname !== initialPath) {
      window.history.replaceState(null, "", DEFAULT_ROUTE);
      setActivePath(DEFAULT_ROUTE);
    }

    function handlePopState() {
      setActivePath(getRouteFromPathname(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Navega sin recargar la página.
  // Esto mantiene el comportamiento SPA básico.
  function handleNavigate(path: AppRoutePath) {
    if (path === activePath) return;

    window.history.pushState(null, "", path);
    setActivePath(path);
  }

  // Obtiene el texto que se mostrará en la Topbar.
  const activeRoute = ROUTES.find((route) => route.path === activePath);

  return (
    <div className="agrovisionApp">
      <Sidebar activePath={activePath} onNavigate={handleNavigate} />

      <section className="agrovisionMain">
        <Topbar activeLabel={activeRoute?.label ?? "Dashboard"} />

        <main className="agrovisionContent">
          <AppRouter activePath={activePath} />
        </main>
      </section>
    </div>
  );
}

export default App;