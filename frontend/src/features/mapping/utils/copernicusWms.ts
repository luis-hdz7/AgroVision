/**
 * =========================================
 * Copernicus WMS
 * =========================================
 *
 * Constructor compartido de URLs WMS para las capas raster
 * de Copernicus Data Space Sentinel Hub.
 *
 * Responsabilidad:
 * - leer la configuración pública de la instancia;
 * - construir una solicitud GetMap consistente;
 * - incorporar el producto, tamaño y nubosidad solicitados;
 * - proporcionar la plantilla espacial utilizada por MapLibre.
 *
 * Consumidores:
 * satelliteLayer.ts y ndviLayer.ts.
 *
 * =========================================
 */

/**
 * Construye una plantilla WMS compatible con los tiles de MapLibre.
 *
 * @param layer Nombre del producto habilitado en la instancia.
 * @param tileSize Ancho y alto de la imagen solicitada, en píxeles.
 * @param cloudCoverage Porcentaje máximo de nubosidad.
 * @returns Plantilla WMS o null cuando falta el Instance ID.
 */
export function buildCopernicusWmsUrl(layer: string, tileSize: number, cloudCoverage: number): string | null {
    // Leemos la variable pública de Vite y normalizamos los espacios exteriores.
    const instanceId = (import.meta.env.VITE_COPERNICUS_SENTINEL_INSTANCE_ID ?? "").trim();
    if (!instanceId) return null;

    // Construimos los parámetros comunes a los productos raster.
    const params = new URLSearchParams({ 
        SERVICE: "WMS", 
        VERSION: "1.1.1", 
        REQUEST: "GetMap", 
        LAYERS: layer, 
        STYLES: "", 
        FORMAT: "image/png", 
        TRANSPARENT: "true", 
        SHOWLOGO: "false",
        SRS: "EPSG:3857", 
        WIDTH: String(tileSize), 
        HEIGHT: String(tileSize), 
        MAXCC: String(cloudCoverage) });

    // Añadimos el placeholder espacial literalmente para que MapLibre pueda sustituirlo.
    return `https://sh.dataspace.copernicus.eu/ogc/wms/${encodeURIComponent(instanceId)}?${params.toString()}&BBOX={bbox-epsg-3857}`;
}

/**
 * =========================================
 * DOCUMENTACIÓN DEL MÓDULO
 * =========================================
 *
 * 1. PROPÓSITO ARQUITECTÓNICO
 *
 * Centraliza la construcción de solicitudes WMS que antes
 * estaba repetida en satelliteLayer.ts y ndviLayer.ts.
 *
 * Cada capa conserva sus identificadores, producto, zoom,
 * opacidad y configuración visual. Este constructor reúne
 * el endpoint y los parámetros comunes del servicio.
 *
 * 2. CONTRATO DE ENTRADA
 *
 * layer:
 * Nombre exacto de la capa configurada en la instancia WMS.
 * Los consumidores actuales utilizan NATURAL-COLOR y NDVI.
 *
 * tileSize:
 * Dimensión cuadrada de la imagen solicitada.
 * Los consumidores actuales proporcionan 256 píxeles.
 * Este valor debe coincidir con tileSize de la fuente raster.
 *
 * cloudCoverage:
 * Porcentaje máximo de nubosidad utilizado por el servicio.
 * Los consumidores actuales proporcionan 20.
 *
 * Los consumidores proporcionan valores válidos para su producto.
 * La disponibilidad de cada producto depende de la configuración
 * de la instancia de Copernicus.
 *
 * 3. CONFIGURACIÓN DE LA INSTANCIA
 *
 * VITE_COPERNICUS_SENTINEL_INSTANCE_ID identifica la instancia
 * WMS utilizada por ambas capas.
 *
 * Vite incorpora esta variable pública al frontend.
 * El identificador forma parte de las URLs solicitadas
 * por el navegador.
 *
 * Cuando la variable está ausente o contiene únicamente espacios,
 * la función devuelve null. Las capas consumidoras utilizan
 * este resultado para representar la falta de configuración.
 *
 * 4. SOLICITUD GENERADA
 *
 * SERVICE=WMS:
 * Selecciona el servicio cartográfico.
 *
 * VERSION=1.1.1 y REQUEST=GetMap:
 * Definen la versión y la operación utilizadas.
 *
 * LAYERS:
 * Selecciona el producto indicado por el consumidor.
 *
 * STYLES:
 * Conserva el estilo predeterminado mediante un valor vacío.
 *
 * FORMAT=image/png y TRANSPARENT=true:
 * Solicitan una imagen PNG con transparencia.
 *
 * SRS=EPSG:3857:
 * Utiliza coordenadas proyectadas compatibles con los tiles
 * del mapa en Web Mercator.
 *
 * WIDTH y HEIGHT:
 * Establecen las dimensiones de la imagen.
 *
 * MAXCC:
 * Define el filtro de nubosidad solicitado.
 *
 * BBOX:
 * Define la extensión espacial de cada tile.
 *
 * 5. SUSTITUCIÓN ESPACIAL
 *
 * La cadena {bbox-epsg-3857} se añade después de serializar
 * los demás parámetros para conservar sus llaves literales.
 *
 * MapLibre sustituye esa cadena por la extensión de cada tile
 * al realizar las solicitudes de imágenes.
 *
 * URLSearchParams codifica los demás valores de la consulta,
 * mientras encodeURIComponent protege el segmento de la instancia.
 *
 * 6. CONTRATO DE SALIDA E INTEGRACIÓN
 *
 * Una cadena indica que existe configuración suficiente para
 * construir la plantilla. La descarga de imágenes ocurre después,
 * cuando MapLibre consume la fuente raster.
 *
 * La respuesta WMS proporciona imágenes del producto configurado.
 * Los errores de red o del servicio se gestionan mediante el
 * ciclo de eventos de la instancia cartográfica.
 *
 * El constructor conserva los parámetros existentes. La selección
 * temporal depende de la configuración vigente del servicio.
 *
 * =========================================
 */