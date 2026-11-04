/**
 * =========================================
 * Mapping Engine
 * =========================================
 *
 * Coordinador del ciclo de vida de las capas agrícolas.
 *
 * Responsabilidad:
 * - aplicar los snapshots geográficos y analíticos;
 * - mantener el orden de representación;
 * - coordinar visibilidad, selección, popup y rover;
 * - restaurar las capas al cargar otro estilo;
 * - liberar sus recursos al finalizar la sesión.
 * =========================================
 */

// Importamos los contratos de la instancia cartográfica y su popup.
import type { Map, Popup } from "maplibre-gl";

// Consumimos los contratos compartidos de geometrías, recorridos e identificadores de capas.
import type {
  FieldFeatureCollection,
  MapLayerId,
  MapLineFeature,
  ZoneFeatureCollection,
} from "../types/mappingGeo.types";

// Importamos el contrato del análisis que se vinculará con las zonas.
import type { ZoneInsight } from "../types/zoneInsight.types";

// Consumimos las operaciones de registro, limpieza y visibilidad de los fields.
import { addFieldLayer, removeFieldLayer, setFieldLayerVisibility, FIELD_FILL_LAYER_ID } from "../layers/fieldLayer";

// Consumimos las operaciones de representación de las zonas.
import { addZoneLayer, removeZoneLayer, setZoneLayerVisibility } from "../layers/zoneLayer";

// Conectamos la selección de zonas con su capa auxiliar de interacción.
import { setupZoneInteractions, removeZoneInteractionLayer, ZONE_INTERACTION_LAYER_ID } from "../layers/interactionLayer";

// Compartimos el contrato que recibe el consumidor al seleccionar una zona.
import type { SelectedZoneData } from "../layers/interactionLayer";

// Consumimos la configuración WMS y las operaciones de la capa Sentinel-2.
import {
  addSentinel2Layer,
  removeSentinel2Layer,
  setSentinel2Visibility,
  buildSentinel2WmsUrl,
} from "../layers/satelliteLayer";

// Consumimos las operaciones NDVI y su identificador para ordenar los raster.
import { addNdviLayer, removeNdviLayer, setNdviVisibility, NDVI_LAYER_ID, buildNdviWmsUrl } from "../layers/ndviLayer";

// Consuminos operaciones GNDVI 
import { addGndviLayer, removeGndviLayer, setGndviVisibility, GNDVI_LAYER_ID, buildGndviWmsUrl, } from "../layers/gndviLayer";

// Consumimos las operaciones NDWI.
import { addNdwiLayer, removeNdwiLayer, setNdwiVisibility, NDWI_LAYER_ID, buildNdwiWmsUrl } from "../layers/ndwiLayer";

// Consumimos las operaciones de instalación, actualización y limpieza del heatmap de riesgo.
import {
  addRiskHeatmapLayer,
  updateRiskHeatmapData,
  removeRiskHeatmapLayer,
  setRiskHeatmapVisibility,
  RISK_HEATMAP_SOURCE_ID,
} from "../layers/riskHeatmapLayer";

// Gestionamos el recorrido mediante las operaciones públicas de la capa de trayectoria.
import { addTrajectoryLayer, removeTrajectoryLayer, setTrajectoryVisibility } from "../layers/trajectoryLayer";

// Conectamos la representación del rover con su controlador de movimiento.
import { addRoverLayer, createRoverController, removeRoverLayer, ROVER_LAYER_ID } from "../layers/roverLayer";

// Tipamos el controlador de animación perteneciente a este mapa.
import type { RoverController } from "../layers/roverLayer";

// Vinculamos los análisis con sus geometrías mediante el adaptador compartido.
import { enrichZonesWithInsights } from "./zoneInsightMapAdapter";

// Reutilizamos la construcción del contenido DOM y la apertura de los popups.
import { createZonePopupElement, openZonePopup } from "../utils/zonePopup";

// Compartimos el progreso simulado del controlador con los consumidores del motor.
import type { RoverProgress } from "../layers/roverLayer";





// Selección inicial compartida por el motor y sus componentes.
export const DEFAULT_GIS_LAYERS: ReadonlySet<MapLayerId> = new Set([
  "base", "fields", "zones", "riskHeatmap", "trajectory", "rover",
]);

/** Snapshot inmutable que consume el coordinador. */
export interface MappingEngineData {
  // Colección de campos agrícolas que representará el mapa.
  readonly fields: FieldFeatureCollection;

  // Geometrías y propiedades descriptivas de las zonas.
  readonly zones: ZoneFeatureCollection;

  // Resultados analíticos utilizados para complementar las propiedades geográficas.
  readonly insights?: readonly ZoneInsight[];

  // Recorrido disponible; null permite retirar la trayectoria y el rover.
  readonly trajectory?: MapLineFeature | null;

  // Selección de capas visibles; su ausencia utiliza la selección inicial compartida.
  readonly activeLayers?: ReadonlySet<MapLayerId>;

  // El movimiento se habilita explícitamente; su valor predeterminado es false.
  readonly animateRover?: boolean;
}

/** Eventos de integración con el consumidor. */
export interface MappingEngineCallbacks {
  // Comunica la zona seleccionada con sus propiedades vigentes.
  readonly onZoneSelect?: (zone: SelectedZoneData) => void;

    // Entrega avance, longitud de ruta y estado del rover.
    readonly onRoverProgress?: (progress: RoverProgress) => void;

  // Comunica los análisis que carecen de una geometría compatible.
  readonly onUnmatchedInsights?: (zoneIds: readonly string[]) => void;

  // Entrega al consumidor los errores gestionados por el coordinador.
  readonly onError?: (error: Error) => void;
}

/** Operaciones públicas de una sesión GIS. */
export interface MappingEngine {
  // Aplica el siguiente snapshot conservando la instancia cartográfica.
  update(data: MappingEngineData): void;

  // Devuelve las capas disponibles según los datos y la configuración WMS.
  getAvailableLayers(): ReadonlySet<MapLayerId>;

  // Finaliza la sesión y libera sus recursos GIS.
  destroy(): void;
}

// Cada mapa posee un coordinador para los IDs GIS del proyecto.
const owners = new WeakSet<Map>();

/** Catálogo disponible según los datos y la configuración WMS. */
export function getAvailableMappingLayers(data: Pick<MappingEngineData, "trajectory">): ReadonlySet<MapLayerId> {
  // Las capas geográficas principales forman el catálogo mínimo.
  const ids: MapLayerId[] = ["base", "fields", "zones", "riskHeatmap"];

  // Un recorrido disponible habilita las opciones de trayectoria y rover.
  if (data.trajectory) ids.push("trajectory", "rover");

  // Una URL WMS configurada habilita las opciones satelitales.
  if (buildSentinel2WmsUrl()) ids.push("satellite");
  if (buildNdviWmsUrl()) ids.push("ndvi");
  if (buildGndviWmsUrl()) ids.push("gndvi");
  if (buildNdwiWmsUrl()) ids.push("ndwi");

  // Entregamos un conjunto independiente para cada consulta de disponibilidad.
  return new Set(ids);
}

/** Crea una sesión sobre una instancia cuyo estilo ya está cargado. */
export function createMappingEngine(
  map: Map,
  initialData: MappingEngineData,
  callbacks: MappingEngineCallbacks = {},
): MappingEngine {
  // Verificamos que otro coordinador no esté administrando los mismos IDs GIS.
  if (owners.has(map)) throw new Error("El mapa ya posee un MappingEngine.");

  // Registramos la propiedad de esta sesión sobre la instancia cartográfica.
  owners.add(map);

  // Conservamos el snapshot recibido más recientemente.
  let data = initialData;

  // Recordamos el snapshot aplicado para identificar cambios por referencia.
  let appliedData: MappingEngineData | null = null;

  // Compartimos las zonas vigentes entre representación, selección y popup.
  let zones = initialData.zones;

  // Identificamos una sesión finalizada para ignorar operaciones posteriores.
  let disposed = false;

  // Conservamos la función que libera los listeners de interacción.
  let cleanInteractions: (() => void) | null = null;

  // Cada motor administra su propio controlador de movimiento.
  let rover: RoverController | null = null;

  // Conservamos la ventana informativa actualmente abierta.
  let popup: Popup | null = null;

  // Relacionamos la ventana informativa con la identidad de la zona seleccionada.
  let selectedZoneId: string | null = null;

  // Los errores asíncronos pertenecen únicamente a una sesión vigente.
  const reportError = (error: unknown): void => {
    // Normalizamos el fallo y notificamos al consumidor mientras la sesión permanezca activa.
    if (!disposed) callbacks.onError?.(error instanceof Error ? error : new Error(String(error)));
  };

  // Centralizamos el cierre del popup y la limpieza de sus referencias.
  const closePopup = (): void => {
    // Retiramos la ventana informativa cuando está disponible.
    popup?.remove();

    // Liberamos la referencia a la ventana retirada.
    popup = null;

    // Liberamos la identidad asociada con esa ventana.
    selectedZoneId = null;
  };

  // Sincronizamos la selección lógica con la visibilidad de los layers.
  const applyVisibility = (): void => {
    // Utilizamos la selección recibida o el conjunto inicial del proyecto.
    const visible = data.activeLayers ?? DEFAULT_GIS_LAYERS;

    // Sincronizamos el relleno y el perímetro de los fields.
    setFieldLayerVisibility(map, visible.has("fields"));

    // Sincronizamos el relleno y el perímetro de las zonas.
    setZoneLayerVisibility(map, visible.has("zones"));

    // Sincronizamos la visualización del heatmap de riesgo.
    setRiskHeatmapVisibility(map, visible.has("riskHeatmap"));

    // Sincronizamos la línea de trayectoria y su halo.
    setTrajectoryVisibility(map, visible.has("trajectory"));

    // La selección sigue la visibilidad de las zonas.
    if (map.getLayer(ZONE_INTERACTION_LAYER_ID)) {
      // Mostramos la superficie de interacción únicamente cuando las zonas están visibles.
      map.setLayoutProperty(ZONE_INTERACTION_LAYER_ID, "visibility", visible.has("zones") ? "visible" : "none");
    }

    // Ocultar las zonas también cierra su información seleccionada.
    if (!visible.has("zones")) closePopup();

    // Sentinel queda debajo de NDVI incluso si el usuario activa NDVI primero.
    if (visible.has("satellite")) {
      // Utilizamos NDVI como referencia cuando existe; de otro modo utilizamos los fields.
      const beforeId =
        [NDVI_LAYER_ID, GNDVI_LAYER_ID, NDWI_LAYER_ID].find((layerId) => Boolean(map.getLayer(layerId)))
        ?? FIELD_FILL_LAYER_ID;

      // Instalamos Sentinel respetando la referencia de inserción elegida.
      addSentinel2Layer(map, beforeId);
    }

    // Instalamos NDVI debajo de los polígonos agrícolas cuando se solicita.
    if (visible.has("ndvi")) addNdviLayer(map, FIELD_FILL_LAYER_ID);

    if (visible.has("gndvi")) addGndviLayer(map, FIELD_FILL_LAYER_ID);

    if (visible.has("ndwi")) addNdwiLayer(map, FIELD_FILL_LAYER_ID);

    // Aplicamos la visibilidad del raster satelital instalado.
    setSentinel2Visibility(map, visible.has("satellite"));

    // Aplicamos la visibilidad del índice de vegetación instalado.
    setNdviVisibility(map, visible.has("ndvi"));

    setGndviVisibility(map, visible.has("gndvi"));

    setNdwiVisibility(map, visible.has("ndwi"));

    // Ocultar el rover pausa el movimiento y conserva su posición.
    if (map.getLayer(ROVER_LAYER_ID)) {
      // Sincronizamos la representación puntual del vehículo con la selección del usuario.
      map.setLayoutProperty(ROVER_LAYER_ID, "visibility", visible.has("rover") ? "visible" : "none");
    }

    // Reanudamos el movimiento cuando coinciden visibilidad y animación habilitada.
    if (visible.has("rover") && data.animateRover) rover?.resume();
    // Pausamos el controlador conservando la posición alcanzada.
    else rover?.pause();
  };

  // Aplicamos los cambios del snapshot recibido por el consumidor.
  const update = (nextData: MappingEngineData): void => {
    // Finalizamos la operación cuando la sesión ya fue cerrada.
    if (disposed) return;

    // Conservamos los datos vigentes para futuras actualizaciones y recargas de estilo.
    data = nextData;

    // Solo transmitimos las colecciones cuyas referencias cambiaron.
    // Identificamos cambios en la colección de fields.
    const fieldsChanged = appliedData?.fields !== data.fields;

    // Recalculamos las zonas cuando cambian sus geometrías o sus análisis.
    const zonesChanged = appliedData?.zones !== data.zones || appliedData?.insights !== data.insights;

    // El montaje inicial o una nueva referencia de trayectoria requieren sincronizar el recorrido.
    const routeChanged = !appliedData || appliedData.trajectory !== data.trajectory;

    // El registro idempotente incorpora o actualiza los fields modificados.
    if (fieldsChanged) addFieldLayer(map, data.fields);

    // Actualizamos conjuntamente las zonas y su representación analítica.
    if (zonesChanged) {
      // Vinculamos las geometrías con el snapshot completo de análisis disponible.
      const enriched = enrichZonesWithInsights(data.zones, data.insights ?? []);

      // Compartimos las propiedades enriquecidas con las capas y las interacciones.
      zones = enriched.zones;

      // Registramos o actualizamos la representación de las zonas.
      addZoneLayer(map, zones);

      // addRiskHeatmapLayer instala recursos; una fuente existente recibe setData.
      // Identificamos si la fuente ya existe antes de garantizar su instalación.
      const hadHeatmapSource = Boolean(map.getSource(RISK_HEATMAP_SOURCE_ID));

      // Garantizamos que la fuente y el layer del heatmap estén registrados.
      addRiskHeatmapLayer(map, zones);

      // Actualizamos la fuente existente y comunicamos un posible rechazo asíncrono.
      if (hadHeatmapSource) void updateRiskHeatmapData(map, zones).catch(reportError);

      // Entregamos las identidades analíticas que el adaptador no pudo vincular.
      callbacks.onUnmatchedInsights?.(enriched.unmatchedZoneIds);
    }

    // Sincronizamos los recursos del recorrido cuando cambia su referencia.
    if (routeChanged) {
      // Una trayectoria disponible permite representar el recorrido y su vehículo.
      if (data.trajectory) {
        // addTrajectoryLayer también actualiza la fuente existente.
        addTrajectoryLayer(map, data.trajectory, ZONE_INTERACTION_LAYER_ID);

        // Obtenemos el punto inicial del recorrido recibido.
        const first = data.trajectory.geometry.coordinates[0];

        // Registramos la posición inicial mediante una tupla longitud-latitud.
        if (first) addRoverLayer(map, [first[0], first[1]]);

        // Creamos el controlador y conectamos sus métricas con la sesión GIS.
        if (!rover) {
        rover = createRoverController(map, undefined, (progress) => {
            // Entregamos métricas únicamente mientras esta sesión permanezca activa.
            if (!disposed) callbacks.onRoverProgress?.(progress);
        });
        }

        // Iniciamos el recorrido correspondiente a la nueva trayectoria.
        rover.start(data.trajectory);

        // Conservamos la interacción encima del rover al incorporar una ruta.
        if (map.getLayer(ZONE_INTERACTION_LAYER_ID)) map.moveLayer(ZONE_INTERACTION_LAYER_ID);
      } else {
        // Finalizamos la animación cuando se retira el recorrido.
        rover?.destroy();

        // Liberamos la referencia al controlador anterior.
        rover = null;

        // Retiramos la representación del vehículo y su fuente.
        removeRoverLayer(map);

        // Retiramos la línea, el halo y la fuente de trayectoria.
        removeTrajectoryLayer(map);
      }
    }

    // Un popup abierto recibe el mismo snapshot analítico que las capas.
    if (zonesChanged && popup && selectedZoneId) {
      // Buscamos la zona seleccionada dentro del snapshot enriquecido vigente.
      const selected = zones.features.find((zone) => zone.properties.zoneId === selectedZoneId);

      // Reemplazamos el contenido conservando la ventana informativa abierta.
      if (selected) popup.setDOMContent(createZonePopupElement(selected.properties));
      // Cerramos la ventana cuando la zona dejó de estar disponible.
      else closePopup();
    }

    // Aplicamos la selección de capas y el estado de movimiento del rover.
    applyVisibility();

    // Recordamos el snapshot aplicado para comparar la siguiente actualización.
    appliedData = data;
  };

  // Instalamos los recursos iniciales o reconstruimos la sesión sobre otro estilo cartográfico.
  const install = (): void => {
    // Finalizamos la operación cuando la sesión ya fue cerrada.
    if (disposed) return;

    // Retiramos los listeners de interacción pertenecientes a la instalación anterior.
    cleanInteractions?.();

    // Liberamos la referencia a la limpieza ya ejecutada.
    cleanInteractions = null;

    // El snapshot inicial registra las capas en su orden cartográfico.
    // Invalidamos la referencia aplicada para sincronizar todos los datos de la instalación.
    appliedData = null;

    // Registramos las capas utilizando el snapshot vigente.
    update(data);

    // Conectamos la selección y conservamos su función de limpieza.
    cleanInteractions = setupZoneInteractions(map, {
      onZoneSelect: (selection) => {
        // La selección utiliza las propiedades vigentes mientras se actualiza el render.
        const feature = zones.features.find((zone) => zone.properties.zoneId === selection.zoneId);

        // Finalizamos la selección cuando la zona ya no pertenece al snapshot.
        if (!feature) return;

        // Cerramos la ventana anterior antes de abrir otra selección.
        closePopup();

        // Registramos la identidad que recibirá futuras actualizaciones del popup.
        selectedZoneId = selection.zoneId;

        // Abrimos la información en las coordenadas de la interacción.
        const nextPopup = openZonePopup(map, selection.coordinates, feature.properties);

        // Conservamos esta instancia como ventana vigente de la sesión.
        popup = nextPopup;

        // El cierre manual también libera la selección asociada con este popup.
        nextPopup.on("close", () => {
          // Comprobamos que el cierre corresponda a la ventana todavía vigente.
          if (popup === nextPopup) {
            // Liberamos la referencia de la ventana cerrada.
            popup = null;

            // Liberamos la identidad asociada con esa ventana.
            selectedZoneId = null;
          }
        });

        // Entregamos la selección con las propiedades del snapshot analítico actual.
        callbacks.onZoneSelect?.({ ...selection, properties: feature.properties });
      },
    });

    // La capa de interacción acaba de incorporarse al estilo.
    applyVisibility();
  };

  // Restauramos los recursos GIS después de cargar otro estilo cartográfico.
  const reloadStyle = (): void => {
    // Cerramos la selección vinculada con los recursos del estilo anterior.
    closePopup();

    try {
      // Reconstruimos las capas y sus listeners utilizando los datos vigentes.
      install();
    } catch (error) {
      // Comunicamos un posible fallo de reconstrucción al consumidor.
      reportError(error);
    }
  };

  // Finalizamos los recursos de sesión cuando se elimina la instancia de MapLibre.
  const onRemove = (): void => {
    // La comprobación permite ejecutar la limpieza una sola vez.
    if (disposed) return;

    // Marcamos el cierre antes de liberar los recursos de la sesión.
    disposed = true;

    // Finalizamos los frames y los recursos del controlador de movimiento.
    rover?.destroy();

    // Liberamos la referencia al controlador.
    rover = null;

    // Retiramos la ventana informativa y su identidad asociada.
    closePopup();

    // Retiramos los listeners de selección e interacción.
    cleanInteractions?.();

    // Liberamos la referencia a la función de limpieza.
    cleanInteractions = null;

    // Retiramos la escucha de reconstrucción de capas.
    map.off("style.load", reloadStyle);

    // Retiramos la escucha de eliminación del mapa.
    map.off("remove", onRemove);

    // Liberamos el registro de propiedad del coordinador.
    owners.delete(map);
  };

  // Exponemos una limpieza idempotente de los recursos administrados por el motor.
  const destroy = (): void => {
    // Finalizamos cuando otra ruta de cierre ya liberó la sesión.
    if (disposed) return;

    // Liberamos primero la animación, los eventos y la ventana informativa.
    onRemove();

    // Retiramos las capas consumidoras antes de sus fuentes.
    // Retiramos la capa auxiliar que depende de la fuente de zonas.
    removeZoneInteractionLayer(map);

    // Retiramos la representación del vehículo y su fuente.
    removeRoverLayer(map);

    // Retiramos el recorrido, su halo y su fuente.
    removeTrajectoryLayer(map);

    // Retiramos la representación analítica del riesgo.
    removeRiskHeatmapLayer(map);

    // Retiramos los polígonos de zona y su fuente.
    removeZoneLayer(map);

    // Retiramos los polígonos de field y su fuente.
    removeFieldLayer(map);

    // Retiramos el raster NDVI instalado por la sesión.
    removeNdwiLayer(map);
    removeGndviLayer(map);
    removeNdviLayer(map);

    // Retiramos el raster Sentinel instalado por la sesión.
    removeSentinel2Layer(map);
  };

  // Escuchamos la disponibilidad de otro estilo para reconstruir sus capas GIS.
  map.on("style.load", reloadStyle);

  // Vinculamos la eliminación del mapa con el cierre de esta sesión.
  map.on("remove", onRemove);

  try {
    // Ejecutamos la instalación inicial después de registrar los eventos del motor.
    install();
  } catch (error) {
    // Liberamos los recursos incorporados antes del fallo de instalación.
    destroy();

    // Propagamos el error para que el consumidor gestione la creación fallida.
    throw error;
  }

  // Entregamos las operaciones públicas; la disponibilidad utiliza siempre los datos vigentes.
  return { update, getAvailableLayers: () => getAvailableMappingLayers(data), destroy };
}

/**
 * DOCUMENTACIÓN DE INTEGRACIÓN
 *
 * Creación: proporcionar un mapa cargado, un snapshot y callbacks opcionales.
 * Propiedad: la sesión administra los IDs GIS de las capas importadas.
 * Cada instancia de MapLibre admite un MappingEngine activo.
 *
 * Orden visual, de abajo hacia arriba:
 * Sentinel-2, NDVI, fields, zonas, riesgo, trayectoria, rover e interacción.
 * Los raster se instalan al activarse por primera vez. Su disponibilidad
 * indica configuración WMS; la respuesta del proveedor determina la carga.
 *
 * Actualización: entregar nuevas referencias para datos modificados.
 * El adaptador enlaza análisis y geometrías mediante zoneId y fieldId.
 * Cambiar visibilidad conserva fuentes, geometrías y posición del rover.
 * Cambiar la trayectoria reinicia su recorrido; null retira ruta y rover.
 *
 * Eventos: onZoneSelect entrega propiedades analíticas vigentes.
 * onUnmatchedInsights identifica análisis sin una geometría compatible.
 * onError recibe fallos gestionados por el coordinador.
 *
 * Recarga: style.load reinstala las capas con el último snapshot.
 * La selección se cierra y el rover reinicia su recorrido.
 * La sesión de Geoman tiene un ciclo de vida propio administrado por su hook.
 *
 * Cierre: destroy retira listeners, animación, popup, capas y fuentes.
 * El evento remove libera la sesión cuando se destruye el mapa completo.
 * Ambas rutas de cierre son idempotentes.
 */