/**
 * =========================================
 * GNDVI Layer
 * =========================================
 * Raster GNDVI servido por la instancia WMS
 * de Copernicus Sentinel Hub.
 */

import type { Map, RasterLayerSpecification, RasterSourceSpecification } from "maplibre-gl";
import { buildCopernicusWmsUrl } from "../utils/copernicusWms";

export const GNDVI_SOURCE_ID = "agrovision-gndvi-source";
export const GNDVI_LAYER_ID = "agrovision-gndvi-layer";
export const GNDVI_WMS_LAYER = "GNDVI";

const TILE_SIZE = 256;
const MIN_ZOOM = 6;
const MAX_ZOOM = 18;
const MAX_CLOUD_COVERAGE = 20;
const DEFAULT_OPACITY = 0.72;

export const buildGndviWmsUrl = (): string | null =>
  buildCopernicusWmsUrl(GNDVI_WMS_LAYER, TILE_SIZE, MAX_CLOUD_COVERAGE);

const createGndviSource = (): RasterSourceSpecification | null => {
  const url = buildGndviWmsUrl();
  if (!url) return null;

  return {
    type: "raster",
    tiles: [url],
    tileSize: TILE_SIZE,
    minzoom: MIN_ZOOM,
    maxzoom: MAX_ZOOM,
  };
};

const createGndviLayer = (): RasterLayerSpecification => ({
  id: GNDVI_LAYER_ID,
  type: "raster",
  source: GNDVI_SOURCE_ID,
  paint: {
    "raster-opacity": DEFAULT_OPACITY,
    "raster-resampling": "linear",
  },
  layout: { visibility: "visible" },
});

export const addGndviLayer = (map: Map, beforeLayerId?: string): boolean => {
  if (!map.getSource(GNDVI_SOURCE_ID)) {
    const source = createGndviSource();
    if (!source) return false;
    map.addSource(GNDVI_SOURCE_ID, source);
  }

  if (map.getLayer(GNDVI_LAYER_ID)) return false;

  map.addLayer(
    createGndviLayer(),
    beforeLayerId && map.getLayer(beforeLayerId) ? beforeLayerId : undefined,
  );

  return true;
};

export const setGndviVisibility = (map: Map, visible: boolean): void => {
  if (!map.getLayer(GNDVI_LAYER_ID)) return;
  map.setLayoutProperty(GNDVI_LAYER_ID, "visibility", visible ? "visible" : "none");
};

export const removeGndviLayer = (map: Map): void => {
  if (map.getLayer(GNDVI_LAYER_ID)) map.removeLayer(GNDVI_LAYER_ID);
  if (map.getSource(GNDVI_SOURCE_ID)) map.removeSource(GNDVI_SOURCE_ID);
};