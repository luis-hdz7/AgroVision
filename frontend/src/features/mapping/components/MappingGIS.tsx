/**
 * =========================================
 * MappingGIS
 * =========================================
 *
 * Componente de composición del sistema GIS de AgroVision.
 *
 * Responsabilidad:
 * - conectar mapa, datos geográficos y análisis;
 * - presentar controles de capas y navegación;
 * - habilitar la edición de borradores bajo configuración;
 * - comunicar selección, cambios y errores al consumidor.
 * =========================================
 */

// Importamos estado visual, referencias memorizadas y sincronización con eventos del mapa.
import { useEffect, useId, useMemo, useState } from "react";
// Tipamos los paneles y contenidos flotantes proporcionados por cada página.
import type { ReactNode } from "react";
// Compartimos los iconos vectoriales de las herramientas.
import { GisIcon } from "./GisIcon";
// Consumimos el identificador oficial de la fuente utilizada para seleccionar zonas.
import { ZONE_INTERACTION_SOURCE_ID } from "../layers/interactionLayer";
// Tipamos la colección de borradores emitida por el editor.
import type { FeatureCollection } from "geojson";
// Compartimos el contrato de la instancia cartográfica.
import type { Map } from "maplibre-gl";
// Calculamos el encuadre de los fields y la longitud de las líneas de medición.
import { length } from "@turf/turf";
// Compartimos el encuadre que reserva el espacio real de las herramientas visibles.
import { fitGisGeometry } from "../utils/gisCamera";

// Consumimos el componente que administra el contenedor y la instancia de MapLibre.
import { AgroMap } from "./AgroMap";
// Consumimos el selector de visibilidad de capas.
import { MapLayerControl } from "./MapLayerControl";
// Consumimos las acciones visuales de navegación.
import { MapToolbar } from "./MapToolbar";

// Conectamos los snapshots de React con el coordinador GIS.
import { useMappingLayers } from "../hooks/useMappingLayers";
// Consultamos los análisis cuando el consumidor solicita carga automática.
import { useZoneInsights } from "../hooks/useZoneInsights";
// Administramos la sesión opcional de edición de borradores.
import { useGeoman } from "../hooks/useGeoman";

// Consumimos las colecciones predeterminadas desde su punto de salida compartido.
import { fieldsGeoJSON, zonesGeoJSON } from "../utils/geojson";
// Utilizamos el recorrido de demostración como valor inicial.
import { agroVisionRoverTrajectory } from "../data/roverTrajectoryData";
// Compartimos con el motor la selección inicial y las reglas de disponibilidad.
import { DEFAULT_GIS_LAYERS, getAvailableMappingLayers } from "../services/mappingEngine";
// Tipamos el snapshot que recibirá el coordinador.
import type { MappingEngineData } from "../services/mappingEngine";
// Compartimos las métricas del controlador con la página consumidora.
import type { RoverProgress } from "../layers/roverLayer";



// Consumimos los contratos comunes de geometrías e identificadores de capas.
import type {
  FieldFeatureCollection,
  ZoneFeatureCollection,
  MapLineFeature,
  MapLayerId,
} from "../types/mappingGeo.types";

// Tipamos los resultados analíticos proporcionados por el consumidor.
import type { ZoneInsight } from "../types/zoneInsight.types";
// Compartimos el contrato público de selección de una zona.
import type { SelectedZoneData } from "../layers/interactionLayer";

// Cargamos los estilos de mapa, controles, editor y popups.
import "../mappingGis.css";

// Una lista vacía permite utilizar análisis proporcionados por el consumidor.
const NO_ZONE_IDS: readonly string[] = [];
// Colección inicial utilizada cuando el consumidor no controla los borradores.
const EMPTY_DRAFT: FeatureCollection = { type: "FeatureCollection", features: [] };

/** Configuración pública del componente GIS. */
export interface MappingGISProps {
  // Workspace presenta un inspector; compact conserva una vista de resumen.
  readonly variant?: "workspace" | "compact";
  // Contenido del inspector contextual, definido por la página consumidora.
  readonly sidePanel?: ReactNode;
  // Contenido flotante sobre el mapa, como filtros y métricas de la finca.
  readonly children?: ReactNode;
  // Identificador seleccionado desde el mapa, el inspector o una navegación previa.
  readonly selectedZoneId?: string | null;
  // Permite proporcionar los fields de la finca representada.
  readonly fields?: FieldFeatureCollection;
  // Permite proporcionar las zonas relacionadas con esos fields.
  readonly zones?: ZoneFeatureCollection;
  // null representa una vista sin trayectoria ni rover.
  readonly trajectory?: MapLineFeature | null;
  // undefined consulta el backend; un array utiliza el snapshot recibido.
  readonly insights?: readonly ZoneInsight[];
  // Configura el servidor para la consulta automática de análisis.
  readonly apiBaseUrl?: string;
  // Controla la presentación del selector y la navegación.
  readonly showControls?: boolean;
  // Configura la interacción de la cámara y la disponibilidad de edición.
  readonly interactive?: boolean;
  // Solicita la sesión de dibujo y edición de borradores.
  readonly enableEditing?: boolean;
  // Controla el movimiento del rover de la vista.
  readonly animateRover?: boolean;

  // Permite que la página conserve y restaure los borradores del editor.
  readonly draft?: FeatureCollection;
  // Entrega las métricas de la simulación al inspector de la página.
  readonly onRoverProgress?: (progress: RoverProgress) => void;

  // Entrega al consumidor la selección de una zona.
  readonly onZoneSelect?: (zone: SelectedZoneData) => void;
  // Entrega las identidades analíticas sin una geometría compatible.
  readonly onUnmatchedInsights?: (zoneIds: readonly string[]) => void;
  // Comunica que la instancia cartográfica terminó de cargar.
  readonly onMapReady?: (map: Map) => void;
  // Entrega la colección completa de borradores después de un cambio.
  readonly onDraftChange?: (draft: FeatureCollection) => void;
  // Comunica los errores operativos al consumidor.
  readonly onError?: (error: Error) => void;
}

/** Configuración de la sesión visual de edición. */
interface GeometryEditorProps {
  // Instancia cartográfica donde se monta el editor.
  readonly map: Map | null;

  // Borradores conservados en memoria por la composición o su consumidor.
  readonly draft: FeatureCollection;

  // Entrega la colección completa después de modificar geometrías.
  readonly onDraftChange?: (draft: FeatureCollection) => void;

  // Comunica errores de las herramientas de edición.
  readonly onError: (error: Error) => void;
}

/** Presenta las herramientas y restaura los borradores al abrir el editor. */
function GeometryEditor({ map, draft, onDraftChange, onError }: GeometryEditorProps) {
  // Explicamos la interacción de la herramienta seleccionada.
  const [instruction, setInstruction] = useState("Selecciona una herramienta de dibujo.");

  // Conectamos Geoman con el mapa y con la colección conservada.
  const editing = useGeoman(map, {
    enabled: true,
    initialDraft: draft,
    onError,
    onChange: onDraftChange,
  });

  // Las rutas del rover utilizan su propia métrica en el inspector.
  const lines = draft.features.filter(
    (feature) => feature.geometry.type === "LineString"
      && feature.properties?.gisPurpose !== "ROVER_ROUTE",
  );

  // Sumamos las líneas auxiliares de medición disponibles.
  const meters = lines.length
    ? lines.reduce((total, feature) => total + length(feature, { units: "meters" }), 0)
    : null;

  // Mostramos instrucciones después de activar correctamente una herramienta.
  const activate = (action: () => Promise<void>, message: string): void => {
    void action().then(() => setInstruction(message)).catch(onError);
  };

  return (
    <div className="mappingGis__editing" role="group" aria-label="Edición de geometría">
      {/* Creamos un polígono de borrador. */}
      <button
        type="button"
        disabled={!editing.isReady}
        onClick={() => activate(editing.drawZone, "Marca los vértices y haz doble click para terminar la zona.")}
      >
        Dibujar zona
      </button>

      {/* Creamos un punto de muestreo. */}
      <button
        type="button"
        disabled={!editing.isReady}
        onClick={() => activate(editing.drawSamplingPoint, "Pulsa sobre el mapa para colocar un punto de muestreo.")}
      >
        Punto de muestreo
      </button>

      {/* Creamos una línea auxiliar de medición. */}
      <button
        type="button"
        disabled={!editing.isReady}
        onClick={() => activate(editing.drawMeasurement, "Marca los puntos y haz doble click para terminar la medición.")}
      >
        Medir distancia
      </button>

      {/* Creamos una línea identificada como ruta del rover. */}
      <button
        type="button"
        disabled={!editing.isReady}
        onClick={() => activate(editing.drawRoverRoute, "Dibuja la ruta y haz doble click para asignarla al rover.")}
      >
        Ruta del rover
      </button>

      {/* Modificamos los vértices de las geometrías existentes. */}
      <button
        type="button"
        disabled={!editing.isReady || !draft.features.length}
        onClick={() => activate(editing.edit, "Arrastra los vértices de los borradores para modificarlos.")}
      >
        Editar borradores
      </button>

      {/* Activamos la eliminación individual mediante interacción sobre el mapa. */}
      <button
        type="button"
        disabled={!editing.isReady || !draft.features.length}
        onClick={() => activate(editing.remove, "Pulsa el punto, la línea o el polígono que quieres eliminar.")}
      >
        Eliminar uno
      </button>

      {/* Retiramos todos los dibujos de la colección local. */}
      <button
        type="button"
        disabled={!editing.isReady || !draft.features.length}
        onClick={() => activate(editing.clearAll, "Borradores eliminados. Puedes comenzar otro dibujo.")}
      >
        Limpiar dibujos
      </button>

      {/* Finalizamos la herramienta conservando las geometrías completadas. */}
      <button
        type="button"
        disabled={!editing.isReady}
        onClick={() => activate(editing.cancel, "Herramienta finalizada; los dibujos completados se conservan.")}
      >
        Cancelar
      </button>

      {/* Presentamos la longitud total de las mediciones auxiliares. */}
      {meters !== null && <output aria-live="polite">{meters.toFixed(1)} m</output>}

      {/* Anunciamos las instrucciones correspondientes a la herramienta activa. */}
      <p className="mappingGis__editingHint" role="status">{instruction}</p>
    </div>
  );
}

export function MappingGIS({
  draft: externalDraft,
  onRoverProgress,
  variant = "workspace",
  sidePanel,
  children,
  selectedZoneId,
  fields = fieldsGeoJSON,
  zones = zonesGeoJSON,
  trajectory = agroVisionRoverTrajectory,
  insights,
  apiBaseUrl = "",
  showControls = true,
  interactive = true,
  enableEditing = false,
  animateRover = true,
  onZoneSelect,
  onUnmatchedInsights,
  
  onMapReady,
  onDraftChange,
  // Conectamos el callback de errores recibido por el componente.
  onError,
}: MappingGISProps) {
  // Identificamos el panel de esta instancia para asociarlo con su botón accesible.
  const panelId = useId();
  // Conservamos borradores locales para los consumidores que no controlan la colección.
  const [localDraft, setLocalDraft] = useState<FeatureCollection>(EMPTY_DRAFT);
  // La colección controlada por la página tiene prioridad sobre la colección local.
  const draft = externalDraft ?? localDraft;

  // Cada vista administra su panel flotante independientemente de otras instancias.
  const [isPanelOpen, setIsPanelOpen] = useState(variant === "workspace");
  // El inspector y el catálogo comparten un panel con navegación explícita.
  const [panelTab, setPanelTab] = useState<"details" | "layers">(sidePanel ? "details" : "layers");
  // Conservamos la instancia cargada que utilizarán el motor y los controles.
  const [map, setMap] = useState<Map | null>(null);
  // Cada montaje recibe su propia copia de la selección inicial de capas.
  const [activeLayers, setActiveLayers] = useState<ReadonlySet<MapLayerId>>(
    () => new Set(DEFAULT_GIS_LAYERS),
  );
  // Representamos la inclinación actual en el estado visual del toolbar.
  const [isTilted, setIsTilted] = useState(false);
  // Conservamos el último mensaje operativo para presentarlo al usuario.
  const [errorMessage, setErrorMessage] = useState("");

  // El hook consulta el backend cuando el consumidor utiliza insights=undefined.
  const zoneIds = useMemo(() => zones.features.map((zone) => zone.properties.zoneId), [zones]);
  // Una lista vacía permite utilizar un snapshot externo sin solicitar análisis adicionales.
  const analysis = useZoneInsights(insights === undefined ? zoneIds : NO_ZONE_IDS, apiBaseUrl);

  // Compartimos un snapshot estable con el coordinador.
  const data = useMemo<MappingEngineData>(
    () => ({
      fields,
      zones,
      trajectory,
      // Seleccionamos el snapshot externo o el resultado de la consulta automática.
      insights: insights ?? analysis.insights,
      activeLayers,
      animateRover,
    }),
    [fields, zones, trajectory, insights, analysis.insights, activeLayers, animateRover],
  );

  // Calculamos el catálogo con las mismas reglas que utiliza el motor.
  const availableLayers = getAvailableMappingLayers(data);

  // Compartimos una única ruta de presentación y notificación de errores.
  const reportError = (error: Error): void => {
    // Actualizamos el mensaje visible para esta composición.
    setErrorMessage(error.message);
    // Entregamos también el error al callback del consumidor.
    onError?.(error);
  };

 // Sincronizamos las capas y comunicamos los eventos de la sesión.
  useMappingLayers(map, data, {
    // Entregamos el avance del rover sin modificar las geometrías.
    onRoverProgress,

    onZoneSelect: (zone) => {
      // Abrimos el inspector cuando la página proporciona información contextual.
      if (sidePanel) {
        setPanelTab("details");
        setIsPanelOpen(true);
      }

      // Entregamos la selección al consumidor.
      onZoneSelect?.(zone);
    },

    // Conservamos la comunicación de análisis incompatibles y errores.
    onUnmatchedInsights,
    onError: reportError,
  });

  useEffect(() => {
    // Esperamos una instancia disponible antes de registrar sus eventos.
    if (!map) return;

    // La inclinación visual refleja también los gestos nativos del mapa.
    const syncPitch = (): void => setIsTilted(map.getPitch() > 0);
    // Liberamos la referencia al eliminar ese mapa y conservamos una instancia posterior.
    const clearMap = (): void => setMap((current) => (current === map ? null : current));

    // Escuchamos los cambios de inclinación producidos por gestos o animaciones.
    map.on("pitch", syncPitch);
    // Escuchamos la eliminación de esta instancia cartográfica.
    map.on("remove", clearMap);

    return () => {
      // Retiramos la escucha de inclinación perteneciente a esta sesión.
      map.off("pitch", syncPitch);
      // Retiramos la escucha de eliminación perteneciente a esta sesión.
      map.off("remove", clearMap);
    };
  }, [map]);

  useEffect(() => {
    // La selección externa utiliza la misma fuente y el mismo estado visual del mapa.
    if (!map || selectedZoneId === undefined) return;

    const applySelection = (): void => {
      // El motor registra la fuente durante la carga y la restaura al cambiar de estilo.
      if (!map.getSource(ZONE_INTERACTION_SOURCE_ID)) return;
      for (const zone of zones.features) {
        map.setFeatureState(
          { source: ZONE_INTERACTION_SOURCE_ID, id: zone.properties.zoneId },
          {
            selected: zone.properties.zoneId === selectedZoneId,
          },
        );
      }
    };

    // Aplicamos el snapshot vigente y escuchamos la recuperación del estilo.
    applySelection();
    map.on("style.load", applySelection);
    return () => {
      map.off("style.load", applySelection);
    };
  }, [map, zones, selectedZoneId, data]);

  // Compartimos el mismo encuadre con filtros y selección de MappingPage.
  const fitFields = (instance: Map): void => {
    // La carga y el restablecimiento aplican la vista inicial inmediatamente.
    fitGisGeometry(instance, fields, 0);
  };

  // Alternamos una capa dentro de la selección lógica de esta composición.
  const toggleLayer = (layerId: MapLayerId): void => {
    // Conservamos la cartografía base como parte permanente de la selección.
    if (layerId === "base") return;

    // Una selección nueva mantiene el contrato de snapshots inmutables.
    setActiveLayers((current) => {
      // Copiamos el conjunto para conservar el estado anterior de React.
      const next = new Set(current);

      // Desactivamos una capa que ya estaba seleccionada.
      if (next.has(layerId)) next.delete(layerId);
      // Activamos una capa que todavía no estaba seleccionada.
      else next.add(layerId);

      // Publicamos una nueva referencia que sincronizará el coordinador.
      return next;
    });
  };

  // Conectamos la instancia cargada con el resto de la composición.
  const handleMapReady = (instance: Map): void => {
    // Entregamos la instancia a los hooks y controles del siguiente render.
    setMap(instance);

    try {
      // Encuadramos los fields recibidos por el componente.
      fitFields(instance);
      // Inicializamos el indicador visual con la inclinación real del mapa.
      setIsTilted(instance.getPitch() > 0);
      // Comunicamos la disponibilidad al consumidor del componente.
      onMapReady?.(instance);
    } catch (error) {
      // Normalizamos y presentamos un posible fallo del proceso de disponibilidad.
      reportError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <section className={`mappingGis mappingGis--${variant}`} aria-label="Mapa agrícola GIS">
      {/* El canvas ocupa toda la superficie y los controles se superponen al mapa. */}
      <div className="mappingGis__map">
        <AgroMap
          interactive={interactive}
          showNavigationControl={true}
          showScaleControl={showControls}
          onMapReady={handleMapReady}
          onMapError={reportError}
        />
      </div>

      {/* Cada página proporciona su contexto sin administrar el ciclo de vida cartográfico. */}
      <div className="mappingGis__overlays">{children}</div>

      {/* El panel puede cerrarse para disponer de la superficie completa del mapa. */}
      {showControls && !isPanelOpen && (
        <button
          className="mappingGis__panelTrigger gisGlass"
          type="button"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => setIsPanelOpen(true)}
        >
          <GisIcon name="layers" /> {variant === "compact" ? "Capas" : "Explorar mapa"}
        </button>
      )}

      {showControls && isPanelOpen && (
        <aside className="mappingGis__dock gisGlass" id={panelId} aria-label="Inspector del mapa">
          {/* Los botones de vista mantienen accesibles sus respectivos paneles. */}
          <div className="mappingGis__dockHeader">
            <div className="mappingGis__tabs" role="group" aria-label="Vista del inspector">
              {sidePanel && (
                <button
                  type="button"
                  aria-pressed={panelTab === "details"}
                  onClick={() => setPanelTab("details")}
                >
                  Mi finca
                </button>
              )}
              <button
                type="button"
                aria-pressed={panelTab === "layers"}
                onClick={() => setPanelTab("layers")}
              >
                <GisIcon name="layers" /> Capas
              </button>
            </div>
            <button
              type="button"
              className="gisIconButton"
              aria-label="Cerrar inspector del mapa"
              aria-expanded={true}
              aria-controls={panelId}
              onClick={() => setIsPanelOpen(false)}
            >
              <GisIcon name="close" />
            </button>
          </div>
          {/* La altura del contenido se adapta al viewport y conserva desplazamiento propio. */}
          <div className="mappingGis__dockBody">
            {panelTab === "details" && sidePanel ? (
              sidePanel
            ) : (
              <MapLayerControl
                activeLayers={activeLayers}
                availableLayers={availableLayers}
                onToggle={toggleLayer}
                showTitle={false}
              />
            )}
          </div>
        </aside>
      )}

      {/* Todas las acciones de navegación actúan sobre esta instancia cartográfica. */}
      {showControls && interactive && map && (
        <MapToolbar
          onZoomIn={() => map.zoomIn()}
          onZoomOut={() => map.zoomOut()}
          onResetNorth={() => map.resetNorth()}
          onResetView={() => fitFields(map)}
          isTilted={isTilted}
          onToggleTilt={() => map.easeTo({ pitch: map.getPitch() > 0 ? 0 : 50 })}
        />
      )}

      {/* Los dibujos se conservan en la composición aunque el editor se cierre. */}
      {enableEditing && interactive && (
        <GeometryEditor
          map={map}
          draft={draft}
          onDraftChange={(nextDraft) => {
            // Actualizamos la colección local cuando la página no controla los borradores.
            if (externalDraft === undefined) setLocalDraft(nextDraft);

            // Comunicamos el nuevo snapshot a la página.
            onDraftChange?.(nextDraft);
          }}
          onError={reportError}
        />
      )}
      {/* Las notificaciones ocupan una única región y permiten seguir usando el mapa. */}
      <div className="mappingGis__feedback" aria-live="polite">
        {!map && !errorMessage && <p role="status">Preparando mapa…</p>}
        {insights === undefined && analysis.isLoading && <p role="status">Cargando análisis…</p>}
        {insights === undefined && analysis.failures.length > 0 && (
          <p role="status">{analysis.failures.length} zonas sin análisis disponible.</p>
        )}
        {errorMessage && <p role="alert">No se pudo cargar un recurso del mapa. Comprueba tu conexión.</p>}
      </div>
    </section>
  );
}

/**
 * DOCUMENTACIÓN DE INTEGRACIÓN
 *
 * MappingPage utiliza variant="workspace" y proporciona un sidePanel con
 * información de la finca. Dashboard utiliza variant="compact". Ambos
 * consumen la misma instancia base, catálogo y motor de capas GIS.
 *
 * El mapa ocupa el contenedor completo. children agrega contexto flotante;
 * sidePanel agrega información de dominio al inspector. Los controles de
 * capas, navegación, edición y notificaciones pertenecen a MappingGIS.
 * Cada montaje conserva su mapa, panel, selección de capas y rover.
 *
 * fields, zones y trajectory son snapshots espaciales inmutables.
 * trajectory=null presenta una vista sin recorrido. selectedZoneId sincroniza
 * la selección recibida desde listas, enlaces o eventos del mapa.
 * insights=undefined consulta el backend; un array utiliza análisis externos.
 * apiBaseUrl configura el origen de la consulta automática.
 *
 * onZoneSelect comunica la identidad y las propiedades de una zona.
 * onMapReady entrega la instancia disponible. onError entrega el fallo
 * operativo completo; la región visual presenta un mensaje breve.
 * onUnmatchedInsights permite detectar análisis sin geometría compatible.
 *
 * enableEditing monta una sesión de Geoman. onDraftChange entrega los
 * borradores completos para validación y persistencia por el consumidor.
 * La medición suma los LineString en metros. Cancelar finaliza el modo
 * activo y conserva los borradores completados durante esa sesión.
 * animateRover controla el movimiento simulado de forma independiente.
 *
 * El encuadre deja espacio al inspector en escritorio. En móvil el panel
 * se convierte en una hoja inferior que puede cerrarse desde su encabezado.
 * mappingGis.css organiza superficie, controles, páginas y popups.
 */
