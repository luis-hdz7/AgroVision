/**
 * =========================================
 *  GIS Types
 * =========================================
 *
 * Contratos TypeScript para el sistema GIS real de AgroVision.
 *
 * Responsabilidad:
 * Definir la estructura geográfica utilizada por:
 * - farms;
 * - fields;
 * - zones;
 * - sensores;
 * - puntos de muestreo;
 * - trayectorias;
 * - futuras capas GIS.
 *
 * Flujo conceptual:
 *
 * PostgreSQL + PostGIS
 *        ↓
 *        API
 *        ↓
 *      GeoJSON
 *        ↓
 * mappingGeo.types.ts
 *        ↓
 *      MapLibre
 * =========================================
*/

// importamos los tipos oficiales de GeoJSON
// Feature representa una geometría acompañada de propiedades.
// FeatureCollection representa un conjunto de Features.
import type { Feature, FeatureCollection, LineString, Point, Polygon} from "geojson";

// Los IDs del ERD oficial son integer, pero durante la transición del mock/API podemos recibir strings como "field-001".
export type GISId= number | string;

/**
 * =========================================
 * Coordenadas
 * =========================================
 */

export type LngLat = [number, number];

/**
 * =========================================
 * Riesgo GIS
 * =========================================
 */

// Valores utilizados para clasificar visualmente las zonas agrícolas.
export type GISRiskLevel = | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * =========================================
 * Estado GIS
 * =========================================
 */

// Estado general que puede utilizar
// una entidad geográfica del sistema.
export type GISStatus = | "ACTIVE" | "INACTIVE" | "OFFLINE" | "MAINTENANCE";

/**
 * =========================================
 * Farm Properties
 * =========================================
 *
 * Propiedades asociadas a la tabla "farms"
 * de nuestro ERD.
 */

// Información descriptiva de una finca.
export interface FarmFeatureProperties {
  readonly farmId: GISId;
  // ID del usuario propietario.
  readonly ownerId: GISId;
  // Nombre visible de la finca.
  readonly name: string;
  // Ubicación textual registrada en la BD.
  readonly location?: string | null;
  // Área total de la finca en metros cuadrados.
  readonly totalAreaSquareMeters?: number | null;
  // Fecha de creación.
  readonly createdAt?: string | null;
}

/**
 * =========================================
 * Field Properties
 * =========================================
 *
 * Propiedades asociadas a la tabla "fields".
 */

// Información descriptiva de un campo agrícola.
export interface FieldFeatureProperties {
  readonly farmId: GISId;
  // ID único del field.
  readonly fieldId: GISId;
  // Nombre visible del field.
  readonly name: string;
  // Área calculada o registrada en metros cuadrados.
  readonly areaSquareMeters?: number | null;
  // Tipo de suelo.
  readonly soilType?: string | null;
  // Sistema de irrigación.
  readonly irrigationType?: string | null;
  // Estado operativo del field.
  readonly status?: string | null;
  // Fecha de creación.
  readonly createdAt?: string | null;
}

/**
 * =========================================
 * Zone Properties
 * =========================================
 *
 * Las zonas no aparecen como tabla propia en el ERD actual.
 *
 * Actualmente se identifican mediante "zoneId" en varias entidades analíticas.
 * Este contrato prepara esa zona geográfica para convertirse posteriormente en una entidad espacial persistente.
 */

// Información asociada a una zona agrícola.
export interface ZoneFeatureProperties {
  readonly zoneId: string;
  // Field al que pertenece la zona.
  readonly fieldId: GISId;
  // Nombre visible.
  readonly name: string;
  // Crop asociado cuando exista.
  readonly cropId?: GISId | null;
  // Riesgo final producido por ZoneInsight.
  readonly riskLevel?: GISRiskLevel | null;
  // Puntuación sanitaria de la zona.
  readonly healthScore?: number | null;
  // Resultado analítico opcional; la geometría base permanece independiente.
  readonly mainCause?: string | null;
  readonly summary?: string | null;
  readonly recommendedAction?: string | null;
  readonly generatedAt?: string | null;
  // Estado actual de la zona.
  readonly status?: string | null;
}

/**
 * =========================================
 * Point Properties
 * =========================================
 *
 * Contrato genérico para elementos puntuales representados dentro del mapa.
 */

// Tipos de puntos que AgroVision podrá renderizar.
export type MapPointKind = | "SENSOR" | "SAMPLING_POINT" | "ALERT" | "INSPECTION" | "ROVER" | "EVENT" | "FIELD_ANALYST";

// Propiedades comunes de un punto geográfico.
export interface MapPointFeatureProperties {
  // Identificador del punto.
  readonly pointId: GISId;
  // Field asociado cuando corresponda.
  readonly fieldId?: GISId | null;
  // Zona asociada cuando corresponda.
  readonly zoneId?: string | null;
  // Tipo de punto.
  readonly kind: MapPointKind;
  // Nombre visible.
  readonly name?: string | null;
  // Estado del punto.
  readonly status?: string | null;
}

/**
 * =========================================
 * Route Properties
 * =========================================
 *
 * Propiedades de líneas geográficas como:
 * - trayectoria del rover;
 * - caminos internos;
 * - rutas planificadas.
 */

// Tipos de líneas utilizadas por AgroVision.
export type MapLineKind = | "ROVER_TRAJECTORY" | "PLANNED_ROUTE" | "INTERNAL_PATH" | "IRRIGATION_ROUTE";

// Propiedades de una línea GIS.
export interface MapLineFeatureProperties {
  readonly routeId: GISId;
  // Field relacionado.
  readonly fieldId?: GISId | null;
  // Zona relacionada.
  readonly zoneId?: string | null;
  // Tipo de línea.
  readonly kind: MapLineKind;
  // Nombre visible.
  readonly name?: string | null;
  // Distancia total de la línea en metros.
  readonly distanceMeters?: number | null;
}

/**
 * =========================================
 * Feature Types
 * =========================================
 *
 * Aquí conectamos geometría + propiedades.
 */

// La finca, field y zonas siempre serán representadan espacialmente como Polygon.
export type FarmFeature = Feature<Polygon, FarmFeatureProperties>;

export type FieldFeature = Feature<Polygon, FieldFeatureProperties>;

export type ZoneFeature = Feature<Polygon, ZoneFeatureProperties>;

// Sensores, alertas y puntos de muestreo se representan mediante Point.
export type MapPointFeature = Feature<Point, MapPointFeatureProperties>;

// Las trayectorias y caminos se representan mediante LineString.
export type MapLineFeature = Feature<LineString, MapLineFeatureProperties>;

/**
 * =========================================
 * Feature Collections
 * =========================================
 *
 * Agrupaciones GeoJSON listas para ser entregadas a MapLibre.
 */

// Colección de fincas.
export type FarmFeatureCollection = FeatureCollection< Polygon, FarmFeatureProperties >;

// Colección de fields.
export type FieldFeatureCollection = FeatureCollection< Polygon, FieldFeatureProperties >;

// Colección de zonas.
export type ZoneFeatureCollection = FeatureCollection< Polygon, ZoneFeatureProperties >;

// Colección de puntos.
export type MapPointFeatureCollection = FeatureCollection< Point, MapPointFeatureProperties >;

// Colección de rutas.
export type MapLineFeatureCollection = FeatureCollection< LineString, MapLineFeatureProperties >;

/**
 * =========================================
 * AgroVision GIS Feature Union
 * =========================================
 *
 * Unión de todas las entidades geográficas que actualmente contempla el núcleo GIS.
 */

// Permite tratar diferentes tipos de entidades como Features GIS de AgroVision.
export type AgroVisionGISFeature = | FarmFeature | FieldFeature | ZoneFeature | MapPointFeature | MapLineFeature;

/**
 * =========================================
 * AgroVision GIS Feature Collection
 * =========================================
 */

// Colección genérica capaz de almacenar diferentes tipos de geometrías.
// Se utilizará para estructuras mixtas cuando sea necesario.
export type AgroVisionGISFeatureCollection = FeatureCollection< Point | LineString | Polygon, FarmFeatureProperties | FieldFeatureProperties | ZoneFeatureProperties | MapPointFeatureProperties | MapLineFeatureProperties >;

/**
 * =========================================
 * Map Layer IDs
 * =========================================
 *
 * Identificadores lógicos de las capas que tendremos en el selector GIS.
 */

// Capas que el usuario podrá activar o desactivar progresivamente.
export type MapLayerId = "base" | "fields" | "zones" | "riskHeatmap" | "trajectory" | "rover" | "satellite" | "ndvi" | "gndvi" | "ndwi";

/**
 * =========================================
 * Map View State
 * =========================================
 *
 * Estado mínimo necesario para controlar la cámara del mapa.
*/

// Estado espacial actual de la cámara.
export interface MapViewState {
  // Centro geográfico actual.
  readonly center: LngLat;
  // Nivel de zoom.
  readonly zoom: number;
  // Inclinación de la cámara.
  readonly pitch: number;
  // Rotación de la cámara.
  readonly bearing: number;
}


/**              GIS
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      POINT    LINESTRING   POLYGON
        │         │           │
      sensor    rover       field
      alert     route       zone
      sample    path        farm */