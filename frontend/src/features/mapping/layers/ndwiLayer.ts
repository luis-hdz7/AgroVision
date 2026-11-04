/**
 * =========================================
 * NDWI Layer
 * =========================================
 * Raster NDWI de humedad vegetal servido por
 * Copernicus Sentinel Hub WMS.
 */

import type { Map, RasterLayerSpecification, RasterSourceSpecification } from "maplibre-gl";
import { buildCopernicusWmsUrl } from "../utils/copernicusWms";

export const NDWI_SOURCE_ID = "agrovision-ndwi-source";
export const NDWI_LAYER_ID = "agrovision-ndwi-layer";
export const NDWI_WMS_LAYER = "NDWI";

const TILE_SIZE = 256;
const MIN_ZOOM = 6;
const MAX_ZOOM = 18;
const MAX_CLOUD_COVERAGE = 20;
const DEFAULT_OPACITY = 0.72;

export const buildNdwiWmsUrl = (): string | null =>
  buildCopernicusWmsUrl(NDWI_WMS_LAYER, TILE_SIZE, MAX_CLOUD_COVERAGE);

const createNdwiSource = (): RasterSourceSpecification | null => {
  const url = buildNdwiWmsUrl();
  if (!url) return null;

  return {
    type: "raster",
    tiles: [url],
    tileSize: TILE_SIZE,
    minzoom: MIN_ZOOM,
    maxzoom: MAX_ZOOM,
  };
};

const createNdwiLayer = (): RasterLayerSpecification => ({
  id: NDWI_LAYER_ID,
  type: "raster",
  source: NDWI_SOURCE_ID,
  paint: {
    "raster-opacity": DEFAULT_OPACITY,
    "raster-resampling": "linear",
  },
  layout: { visibility: "visible" },
});

export const addNdwiLayer = (map: Map, beforeLayerId?: string): boolean => {
  if (!map.getSource(NDWI_SOURCE_ID)) {
    const source = createNdwiSource();
    if (!source) return false;
    map.addSource(NDWI_SOURCE_ID, source);
  }

  if (map.getLayer(NDWI_LAYER_ID)) return false;

  map.addLayer(
    createNdwiLayer(),
    beforeLayerId && map.getLayer(beforeLayerId) ? beforeLayerId : undefined,
  );

  return true;
};

export const setNdwiVisibility = (map: Map, visible: boolean): void => {
  if (!map.getLayer(NDWI_LAYER_ID)) return;
  map.setLayoutProperty(NDWI_LAYER_ID, "visibility", visible ? "visible" : "none");
};

export const removeNdwiLayer = (map: Map): void => {
  if (map.getLayer(NDWI_LAYER_ID)) map.removeLayer(NDWI_LAYER_ID);
  if (map.getSource(NDWI_SOURCE_ID)) map.removeSource(NDWI_SOURCE_ID);
};