/**
 * =========================================
 * GIS Demo Data
 * =========================================
 *
 * Datos GeoJSON iniciales utilizados por el sistema GIS.
 *
 * Responsabilidad:
 * - representar una finca y sus fields;
 * - representar las zonas agrícolas de cada field;
 * - proporcionar geometrías y propiedades descriptivas;
 * - exponer las colecciones utilizadas por geojson.ts.
 *
 * Modelo geográfico:
 * Los fields están contenidos en la finca y sus interiores
 * son disjuntos. Las zonas subdividen su field correspondiente
 * y pueden compartir límites con las zonas vecinas.
 *
 * Identificación:
 * feature.id coincide con el identificador lógico de la entidad.
 * zone-01, zone-02 y zone-03 pertenecen a field-001 y corresponden
 * a los identificadores del conjunto analítico demo del backend.
 *
 * Datos analíticos:
 * El adaptador de ZoneInsight incorpora riesgo, salud,
 * diagnóstico y recomendaciones a partir de sus resultados.
 *
 * Estos datos son sintéticos y sirven para:
 * - desarrollo;
 * - pruebas visuales;
 * - integración del mapa;
 * - demostraciones del MVP.
 *
 * Las áreas son aproximaciones calculadas desde los polígonos
 * y redondeadas a metros cuadrados. Las coordenadas representan
 * geometrías de demostración.
 *
 * =========================================
 */

// Importamos los contratos GIS.
import type { FarmFeature, FieldFeature, ZoneFeature, FarmFeatureCollection, FieldFeatureCollection, ZoneFeatureCollection } from "../types/mappingGeo.types";
import { relocateDemoPolygon } from "./demoLocation";

/**
 * =========================================
 * FARM DEMO
 * =========================================
 */

// Definimos la finca principal utilizada en la demostración.
export const agroVisionFarm: FarmFeature = {
    // Tipo oficial de objeto GeoJSON.
    type: "Feature",
    // Identificador espacial único de la finca.
    id: "farm-001",
    // Geometría de la finca.
    geometry: {
        // La finca se representa como un Polygon.
        type: "Polygon",
        // Coordenadas del perímetro de la finca.
        coordinates: [
            [
                // Punto suroeste.
                [-87.1324, 12.6248],
                // Punto oeste superior.
                [-87.1321, 12.6289],
                // Punto noroeste.
                [-87.1274, 12.6302],
                // Punto norte central.
                [-87.1231, 12.6294],
                // Punto noreste.
                [-87.1207, 12.6268],
                // Punto sureste.
                [-87.1215, 12.6229],
                // Punto sur central.
                [-87.1266, 12.6218],
                // Cerramos nuevamente el Polygon.
                [-87.1324, 12.6248],
            ],
        ],
    },
    // Propiedades descriptivas de la finca.
    properties: {
        // ID utilizado por AgroVision.
        farmId: "farm-001",
        // Usuario propietario de la finca.
        ownerId: 101,
        // Nombre visible en la interfaz.
        name: "Finca 001",
        // Ubicación textual de referencia.
        location: "Chinandega, Nicaragua",
        // Área aproximada calculada desde el polígono.
        totalAreaSquareMeters: 886984,
        // Fecha de creación del registro.
        createdAt: "2026-09-15T08:00:00Z",
    },
};

/**
 * =========================================
 * FIELD 01
 * =========================================
 */

// Primer field agrícola de la finca.
export const agroVisionField01: FieldFeature = {
    // Tipo oficial de Feature GeoJSON.
    type: "Feature",
    // Identificador espacial del field.
    id: "field-001",
    // Geometría del field.
    geometry: {
        type: "Polygon",
        // Perímetro contenido en la finca.
        coordinates: [
            [
                [-87.1317, 12.625],
                [-87.1306, 12.6242],
                [-87.1273, 12.6244],
                [-87.1269, 12.6279],
                [-87.1283, 12.6288],
                [-87.1314, 12.628],
                [-87.1317, 12.625],
            ],
        ],
    },
    // Propiedades agrícolas del field.
    properties: {
        // Finca a la que pertenece.
        farmId: "farm-001",
        // ID único del field.
        fieldId: "field-001",
        // Nombre visible.
        name: "Lote Norte",
        // Área aproximada calculada desde el polígono.
        areaSquareMeters: 216814,
        // Tipo de suelo registrado.
        soilType: "Franco arcilloso",
        // Sistema de irrigación.
        irrigationType: "Goteo",
        // Estado operativo.
        status: "ACTIVE",
        // Fecha de creación.
        createdAt: "2026-09-16T08:00:00Z",
    },
};

/**
 * =========================================
 * FIELD 02
 * =========================================
 */

// Segundo field agrícola de la finca.
export const agroVisionField02: FieldFeature = {
    type: "Feature",
    // Identificador espacial del field.
    id: "field-002",
    // Geometría del field.
    geometry: {
        type: "Polygon",
        // Perímetro contenido en la finca.
        coordinates: [
            [
                [-87.1268, 12.628],
                [-87.1265, 12.6242],
                [-87.1243, 12.6234],
                [-87.122, 12.624],
                [-87.1221, 12.6278],
                [-87.1244, 12.6288],
                [-87.1268, 12.628],
            ],
        ],
    },
    // Propiedades agrícolas del field.
    properties: {
        // Finca propietaria.
        farmId: "farm-001",
        // Identificador del field.
        fieldId: "field-002",
        // Nombre visible.
        name: "Lote Central",
        // Área aproximada calculada desde el polígono.
        areaSquareMeters: 255061,
        // Tipo de suelo.
        soilType: "Franco limoso",
        // Sistema de irrigación.
        irrigationType: "Aspersión",
        // Estado operativo.
        status: "ACTIVE",
        // Fecha de creación.
        createdAt: "2026-09-16T08:15:00Z",
    },
};

/**
 * =========================================
 * FIELD 03
 * =========================================
 */

// Tercer field agrícola de la finca.
export const agroVisionField03: FieldFeature = {
    type: "Feature",
    // Identificador espacial.
    id: "field-003",
    // Geometría contenida en la finca después de retirar el solapamiento con field-002.
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.12502, 12.628593333333],
                [-87.1244, 12.6288],
                [-87.1221, 12.6278],
                [-87.122002713488, 12.62410311253],
                [-87.1219, 12.6241],
                [-87.122, 12.6277],
                [-87.121765384615, 12.627954166667],
                [-87.123056179775, 12.62935252809],
                [-87.124, 12.6295],
                [-87.12502, 12.628593333333],
            ],
        ],
    },
    // Propiedades del field.
    properties: {
        // Finca asociada.
        farmId: "farm-001",
        // Identificador del field.
        fieldId: "field-003",
        // Nombre visible conservado del conjunto demo original.
        name: "Lote Sur",
        // Área aproximada calculada desde la geometría corregida.
        areaSquareMeters: 30952,
        // Tipo de suelo.
        soilType: "Franco arenoso",
        // Sistema de irrigación.
        irrigationType: "Goteo",
        // Estado operativo.
        status: "ACTIVE",
        // Fecha de creación.
        createdAt: "2026-09-16T08:30:00Z",
    },
};

/**
 * =========================================
 * ZONE 01
 * =========================================
 */

// Primera subdivisión de field-001, vinculada con zone-01 del backend.
export const agroVisionZone01: ZoneFeature = {
    type: "Feature",
    // Identificador espacial de la zona.
    id: "zone-01",
    // Geometría espacial de la zona.
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.1317, 12.625],
                [-87.1306, 12.6242],
                [-87.1273, 12.6244],
                [-87.127147619048, 12.625733333333],
                [-87.131626666667, 12.625733333333],
                [-87.1317, 12.625],
            ],
        ],
    },
    // Propiedades descriptivas de la zona.
    properties: {
        // Identificador lógico de la zona.
        zoneId: "zone-01",
        // Field padre.
        fieldId: "field-001",
        // Nombre visible.
        name: "Zona A",
        // Estado operativo.
        status: "ACTIVE",
    },
};

/**
 * =========================================
 * ZONE 02
 * =========================================
 */

// Segunda subdivisión de field-001, vinculada con zone-02 del backend.
export const agroVisionZone02: ZoneFeature = {
    type: "Feature",
    id: "zone-02",
    // Geometría espacial.
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.131626666667, 12.625733333333],
                [-87.127147619048, 12.625733333333],
                [-87.126972380952, 12.627266666667],
                [-87.131473333333, 12.627266666667],
                [-87.131626666667, 12.625733333333],
            ],
        ],
    },
    // Propiedades de la zona.
    properties: {
        // Identificador.
        zoneId: "zone-02",
        // Field padre.
        fieldId: "field-001",
        // Nombre.
        name: "Zona B",
        // Estado actual.
        status: "ACTIVE",
    },
};

/**
 * =========================================
 * ZONE 03
 * =========================================
 */

// Tercera subdivisión de field-001, vinculada con zone-03 del backend.
export const agroVisionZone03: ZoneFeature = {
    type: "Feature",
    id: "zone-03",
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.131473333333, 12.627266666667],
                [-87.126972380952, 12.627266666667],
                [-87.1269, 12.6279],
                [-87.1283, 12.6288],
                [-87.1314, 12.628],
                [-87.131473333333, 12.627266666667],
            ],
        ],
    },
    properties: {
        zoneId: "zone-03",
        fieldId: "field-001",
        name: "Zona C",
        status: "ACTIVE",
    },
};

/**
 * =========================================
 * ZONE 04
 * =========================================
 */

// Primera subdivisión geográfica de field-002.
export const agroVisionZone04: ZoneFeature = {
    type: "Feature",
    id: "zone-04",
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.12665, 12.6261],
                [-87.1265, 12.6242],
                [-87.1243, 12.6234],
                [-87.122, 12.624],
                [-87.122055263158, 12.6261],
                [-87.12665, 12.6261],
            ],
        ],
    },
    properties: {
        zoneId: "zone-04",
        fieldId: "field-002",
        name: "Zona D",
        status: "ACTIVE",
    },
};

/**
 * =========================================
 * ZONE 05
 * =========================================
 */

// Segunda subdivisión geográfica de field-002.
export const agroVisionZone05: ZoneFeature = {
    type: "Feature",
    id: "zone-05",
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-87.1268, 12.628],
                [-87.12665, 12.6261],
                [-87.122055263158, 12.6261],
                [-87.1221, 12.6278],
                [-87.1244, 12.6288],
                [-87.1268, 12.628],
            ],
        ],
    },
    properties: {
        zoneId: "zone-05",
        fieldId: "field-002",
        name: "Zona E",
        status: "ACTIVE",
    },
};

/**
 * =========================================
 * ZONE 06
 * =========================================
 */

// Zona que ocupa el perímetro completo de field-003.
export const agroVisionZone06: ZoneFeature = {
    type: "Feature",
    id: "zone-06",
    geometry: {
        type: "Polygon",
        // Copiamos los anillos y sus coordenadas para mantener una geometría independiente del field.
        coordinates: agroVisionField03.geometry.coordinates.map((ring) => ring.map((coordinate) => [...coordinate])),
    },
    properties: {
        zoneId: "zone-06",
        fieldId: "field-003",
        name: "Zona F",
        status: "ACTIVE",
    },
};

// Todas las entidades demo se mueven juntas; también la zona 06, copiada del lote 03.
for (const feature of [
    agroVisionFarm,
    agroVisionField01, agroVisionField02, agroVisionField03,
    agroVisionZone01, agroVisionZone02, agroVisionZone03,
    agroVisionZone04, agroVisionZone05, agroVisionZone06,
]) {
    feature.geometry.coordinates = relocateDemoPolygon(feature.geometry.coordinates);
}

/**
 * =========================================
 * FARM COLLECTION
 * =========================================
 */

// Creamos la colección GeoJSON de fincas.
export const agroVisionFarms: FarmFeatureCollection = {
    type: "FeatureCollection",
    // Lista de fincas.
    features: [agroVisionFarm],
};

/**
 * =========================================
 * FIELD COLLECTIONS
 * =========================================
 */

// Creamos la colección GeoJSON de fields.
export const agroVisionFields: FieldFeatureCollection = {
    type: "FeatureCollection",
    // Fields disponibles.
    features: [agroVisionField01, agroVisionField02, agroVisionField03],
};

/**
 * =========================================
 * ZONE COLLECTION
 * =========================================
 */

// Creamos la colección GeoJSON de zonas.
export const agroVisionZones: ZoneFeatureCollection = {
    type: "FeatureCollection",
    // Zonas agrícolas.
    features: [agroVisionZone01, agroVisionZone02, agroVisionZone03, agroVisionZone04, agroVisionZone05, agroVisionZone06],
};

