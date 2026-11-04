
/**
 * AgroVision Intelligence
 * Ampliación cartográfica de parcelas.
 *
 * Conserva las tres parcelas existentes y agrega
 * geometrías de referencia para field-004 a field-006.
 *
 * IMPORTANTE:
 * Las coordenadas son geometrías de demostración,
 * no levantamientos topográficos certificados.
 *
 * Los indicadores y análisis NO se generan aquí:
 * deben proceder de PostgreSQL.
 */

import {
  agroVisionField01,
  agroVisionField02,
  agroVisionField03,
  agroVisionZone01,
  agroVisionZone02,
  agroVisionZone03,
  agroVisionZone04,
  agroVisionZone05,
  agroVisionZone06,
} from "./mappingGeoData";

import type {
  FieldFeature,
  FieldFeatureCollection,
  ZoneFeature,
  ZoneFeatureCollection,
} from "../types/mappingGeo.types";
import { relocateDemoRing } from "./demoLocation";

type Ring = number[][];

function fieldId(number: number): string {
  return `field-${String(number).padStart(3, "0")}`;
}

function zoneId(number: number): string {
  return `zone-${String(number).padStart(2, "0")}`;
}

/** Construye únicamente geometría y propiedades base. */
function createField(
  id: number,
  name: string,
  ring: Ring,
): FieldFeature {
  return {
    type: "Feature",
    id: fieldId(id),
    geometry: {
      type: "Polygon",
      coordinates: [relocateDemoRing(ring)],
    },
    properties: {
      farmId: "farm-001",
      fieldId: fieldId(id),
      name,
      status: "ACTIVE",
    },
  };
}

function createZone(
  id: number,
  parentField: number,
  name: string,
  ring: Ring,
): ZoneFeature {
  return {
    type: "Feature",
    id: zoneId(id),
    geometry: {
      type: "Polygon",
      coordinates: [relocateDemoRing(ring)],
    },
    properties: {
      zoneId: zoneId(id),
      fieldId: fieldId(parentField),
      name,
      status: "ACTIVE",
    },
  };
}

/**
 * Field 004
 * Referencia cartográfica del lote de yuca.
 */
const A = [-87.1299, 12.6238];
const B = [-87.1290, 12.62305];
const C = [-87.1279, 12.62275];
const D = [-87.1275, 12.62375];
const M = [-87.1277, 12.62325];

export const agroVisionField04 = createField(
  4,
  "Lote Sur · Yuca",
  [A, B, C, D, A],
);

/**
 * Field 005
 * Referencia cartográfica del lote de quequisque.
 */
const E = [-87.1274, 12.62365];
const F = [-87.1270, 12.6224];
const G = [-87.1254, 12.62235];
const H = [-87.1249, 12.62315];

export const agroVisionField05 = createField(
  5,
  "Lote Húmedo · Quequisque",
  [E, F, G, H, E],
);

/**
 * Field 006
 * Referencia cartográfica del lote de sorgo y maní.
 */
const I = [-87.1246, 12.62315];
const J = [-87.1236, 12.6229];
const K = [-87.12225, 12.62325];
const L = [-87.1221, 12.6237];

export const agroVisionField06 = createField(
  6,
  "Lote Rotación · Sorgo y maní",
  [I, J, K, L, I],
);

/**
 * Subdivisiones espaciales.
 *
 * Cada zoneId es único en todo el catálogo.
 * No se asignan riesgos ni métricas inventadas.
 */

export const agroVisionZone07 = createZone(
  7, 4, "Zona G", [A, B, C, A],
);

export const agroVisionZone08 = createZone(
  8, 4, "Zona H", [A, C, M, A],
);

export const agroVisionZone09 = createZone(
  9, 4, "Zona I", [A, M, D, A],
);

export const agroVisionZone10 = createZone(
  10, 5, "Zona J", [E, F, G, E],
);

export const agroVisionZone11 = createZone(
  11, 5, "Zona K", [E, G, H, E],
);

export const agroVisionZone12 = createZone(
  12, 6, "Zona L", [I, J, K, I],
);

export const agroVisionZone13 = createZone(
  13, 6, "Zona M", [I, K, L, I],
);

/**
 * Catálogos extendidos.
 *
 * Todos los lotes y zonas se desplazan juntos hacia
 * la ubicación rural aproximada del demo.
 */

export const expandedAgroVisionFields:
  FieldFeatureCollection = {
    type: "FeatureCollection",
    features: [
      agroVisionField01,
      agroVisionField02,
      agroVisionField03,
      agroVisionField04,
      agroVisionField05,
      agroVisionField06,
    ],
  };

export const expandedAgroVisionZones:
  ZoneFeatureCollection = {
    type: "FeatureCollection",
    features: [
      agroVisionZone01,
      agroVisionZone02,
      agroVisionZone03,
      agroVisionZone04,
      agroVisionZone05,
      agroVisionZone06,
      agroVisionZone07,
      agroVisionZone08,
      agroVisionZone09,
      agroVisionZone10,
      agroVisionZone11,
      agroVisionZone12,
      agroVisionZone13,
    ],
  };
