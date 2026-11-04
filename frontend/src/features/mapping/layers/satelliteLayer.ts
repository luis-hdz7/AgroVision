/**
 * =========================================
 * Sentinel-2 Layer
 * =========================================
 *
 * Capa satelital de AgroVision utilizando Sentinel-2
 * mediante Copernicus Data Space Sentinel Hub WMS.
 *
 * Responsabilidad:
 * - definir la fuente raster del producto NATURAL-COLOR;
 * - registrar la imagen satelital en MapLibre;
 * - controlar su visibilidad;
 * - liberar la capa y su fuente.
 *
 * Integración:
 * copernicusWms.ts construye la plantilla de solicitudes.
 * El consumidor proporciona un mapa con el estilo cargado
 * y puede indicar una capa de referencia para ordenar el raster.
 *
 * Configuración requerida:
 * VITE_COPERNICUS_SENTINEL_INSTANCE_ID.
 *
 * =========================================
 */

// Importamos los tipos necesarios desde MapLibre.
import type { Map, RasterLayerSpecification, RasterSourceSpecification } from "maplibre-gl";

// Consumimos el constructor WMS compartido.
import { buildCopernicusWmsUrl } from "../utils/copernicusWms";

// =========================================
// IDS
// =========================================

// ID estable utilizado por la fuente raster.
export const SENTINEL2_SOURCE_ID = "agrovision-sentinel2-source";

// ID estable utilizado por la capa visual.
export const SENTINEL2_LAYER_ID = "agrovision-sentinel2-layer";

// =========================================
// CONFIGURATION
// =========================================

// Nombre de la capa satelital configurada en la instancia WMS.
export const SENTINEL2_WMS_LAYER = "NATURAL-COLOR";

// Porcentaje máximo de nubosidad permitido.
export const SENTINEL2_MAX_CLOUD_COVERAGE = 20;

// Tamaño estándar de los tiles raster.
export const SENTINEL2_TILE_SIZE = 256;

// Límites de zoom configurados para la fuente raster.
export const SENTINEL2_MIN_ZOOM = 6;
export const SENTINEL2_MAX_ZOOM = 18;

// =========================================
// WMS URL
// =========================================

/**
 * Construye la plantilla WMS del producto NATURAL-COLOR.
 *
 * @returns Plantilla de tiles o null cuando falta la configuración.
 */
export const buildSentinel2WmsUrl = (): string | null => buildCopernicusWmsUrl(SENTINEL2_WMS_LAYER, SENTINEL2_TILE_SIZE, SENTINEL2_MAX_CLOUD_COVERAGE);

// =========================================
// SOURCE
// =========================================

/**
 * Crea la definición raster utilizada como fuente de Sentinel-2.
 *
 * @returns Fuente raster o null cuando falta la configuración.
 */
export const createSentinel2Source = (): RasterSourceSpecification | null => {
    // Construimos la URL WMS.
    const wmsUrl = buildSentinel2WmsUrl();
    if (!wmsUrl) return null;

    // Devolvemos la configuración de la fuente raster.
    return {
        type: "raster",
        // MapLibre sustituirá el BBOX de cada tile.
        tiles: [wmsUrl],
        // Coincide con las dimensiones solicitadas al WMS.
        tileSize: SENTINEL2_TILE_SIZE,
        minzoom: SENTINEL2_MIN_ZOOM,
        maxzoom: SENTINEL2_MAX_ZOOM,
    };
};

// =========================================
// LAYER
// =========================================

/** Crea la definición visual de la capa Sentinel-2. */
export const createSentinel2Layer = (): RasterLayerSpecification => {
    return {
        id: SENTINEL2_LAYER_ID,
        type: "raster",
        source: SENTINEL2_SOURCE_ID,
        paint: {
            // Mostramos el color natural sin mezclarlo con el mapa base.
            "raster-opacity": 1,
            // Elevamos ligeramente las sombras y el contraste sin alterar otros rasters (NDVI).
            "raster-brightness-min": 0.09,
            "raster-contrast": 0.08,
            "raster-saturation": 0.06,
            // La interpolación evita bordes pixelados; no añade resolución al satélite.
            "raster-resampling": "linear",
        },
        // La capa comienza visible cuando se agrega.
        layout: {
            visibility: "visible",
        },
    };
};

// =========================================
// ADD LAYER
// =========================================

/**
 * Registra la fuente y la capa Sentinel-2.
 *
 * Reutiliza la fuente registrada y conserva una capa existente.
 * La descarga de imágenes se realiza posteriormente por MapLibre.
 *
 * @param map Instancia activa con el estilo cargado.
 * @param beforeLayerId Capa existente antes de la cual insertar el raster.
 * @returns true cuando registra la capa; false si ya existe o falta configuración.
 */
export const addSentinel2Layer = (map: Map, beforeLayerId?: string): boolean => {
    // Creamos la fuente cuando todavía falta su registro.
    if (!map.getSource(SENTINEL2_SOURCE_ID)) {
        const source = createSentinel2Source();
        if (!source) return false;

        map.addSource(SENTINEL2_SOURCE_ID, source);
    }

    // Conservamos la capa visual cuando ya está registrada.
    if (map.getLayer(SENTINEL2_LAYER_ID)) return false;

    // Creamos la configuración visual.
    const layer = createSentinel2Layer();

    // Utilizamos la referencia cuando existe; en otro caso insertamos al final del estilo.
    map.addLayer(layer, beforeLayerId && map.getLayer(beforeLayerId) ? beforeLayerId : undefined);

    return true;
};

// =========================================
// VISIBILITY
// =========================================

/**
 * Establece la visibilidad de la capa registrada.
 *
 * @param map Instancia activa de MapLibre.
 * @param visible true muestra el raster; false lo oculta.
 */
export const setSentinel2Visibility = (map: Map, visible: boolean): void => {
    // Comprobamos que la capa esté registrada.
    if (!map.getLayer(SENTINEL2_LAYER_ID)) return;

    // Aplicamos el valor de visibilidad esperado por MapLibre.
    map.setLayoutProperty(SENTINEL2_LAYER_ID, "visibility", visible ? "visible" : "none");
};

// =========================================
// TOGGLE
// =========================================

/** Alterna la visibilidad de Sentinel-2, incluyendo la visibilidad predeterminada del estilo. */
export const toggleSentinel2Visibility = (map: Map): void => {
    if (!map.getLayer(SENTINEL2_LAYER_ID)) return;

    // Consultamos la visibilidad actual.
    const visibility = map.getLayoutProperty(SENTINEL2_LAYER_ID, "visibility");

    // Una capa oculta pasa a visible; la visibilidad explícita o predeterminada pasa a oculta.
    const nextVisible = visibility === "none";
    setSentinel2Visibility(map, nextVisible);
};

// =========================================
// REMOVE
// =========================================

/** Libera primero la capa Sentinel-2 y después su fuente raster. */
export const removeSentinel2Layer = (map: Map): void => {
    // Eliminamos primero la capa visual.
    if (map.getLayer(SENTINEL2_LAYER_ID)) {
        map.removeLayer(SENTINEL2_LAYER_ID);
    }

    // Eliminamos después la fuente raster.
    if (map.getSource(SENTINEL2_SOURCE_ID)) {
        map.removeSource(SENTINEL2_SOURCE_ID);
    }
};
