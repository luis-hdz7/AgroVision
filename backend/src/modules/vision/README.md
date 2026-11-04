# Vision

## Responsabilidad

Recibir una imagen desde el frontend, validar el multipart, enviarla al AI Service y normalizar el resultado técnico como `VisionAnalyzeResponse`.

## Endpoint

`POST /api/vision/analyze` utiliza `multipart/form-data`.

Campos:

- `image`: archivo obligatorio JPEG, PNG o WebP; máximo 10 MB.
- `cropType`: tipo de cultivo obligatorio.
- `fieldId`: identificador obligatorio del campo actual.
- `zoneId`: identificador opcional de zona.
- `imageFileName`: metadato opcional; el backend utiliza como fuente de verdad el nombre del archivo recibido.

## Flujo

```text
Route -> multipart middleware -> Controller -> Zod -> Service
      -> AI_SERVICE_URL/vision/analyze -> normalización
      -> vision_analysis_records -> ApiResponse
```

El backend no analiza píxeles ni decide cómo cargar el futuro modelo. Esa responsabilidad pertenece al AI Service.

## Respuesta normalizada

La propiedad `data` de `ApiResponse` contiene `inspectionId`, contexto de Field/Zone/Crop, predicción, confianza, métricas visuales, explicación, acción recomendada, evidencia y fecha ISO.

## Errores

- `400`: multipart o metadatos inválidos.
- `413`: imagen mayor de 10 MB.
- `415`: formato o contenido no admitido.
- `422`: validación rechazada por el AI Service.
- `502`: AI Service inaccesible o contrato de respuesta inválido.
- `504`: timeout del AI Service.

Todos los errores generados por este módulo utilizan `fail()` y nunca devuelven HTML.

## Lectura del historial persistido

Los GET históricos leen exclusivamente `vision_analysis_records`; no ejecutan una inferencia, no escriben registros y no consultan `vision_inspections`:

- `GET /api/vision/analyses?fieldId=field-001`
- `GET /api/vision/analyses/:inspectionId?fieldId=field-001`
- `GET /api/vision/analyses/:inspectionId/image?fieldId=field-001`

El listado admite `cropType`, `zoneId`, `unassignedOnly=true`, `limit` (1 a 100, predeterminado 20) y el `cursor` opaco devuelto por la página anterior. `zoneId` selecciona una zona textual exacta; sin filtro se incluyen todas las zonas y los registros sin zona. `unassignedOnly=true` selecciona únicamente `zoneId IS NULL` y no puede combinarse con `zoneId`. El texto `null` es un identificador literal, no un valor nulo.

`fieldId` conserva su identidad textual: `1`, `field-001` y `field-0001` pueden representar el mismo número, pero consultan identidades históricas distintas. Este bloque no homologa variantes. En la futura recuperación de la pantalla deberá utilizarse exactamente el identificador con el que se guardó el análisis.

El orden es `createdAt DESC, inspectionId DESC`. Cada consulta obtiene como máximo `limit + 1` filas; el cursor contiene fecha, identificador y contexto de filtros validados. Un cursor de otros filtros recibe 400. Un análisis nuevo aparece al refrescar la primera página, sin modificar las páginas que ya se recorrieron con su cursor.

El listado devuelve solo el resumen técnico y `hasImage`; comprueba la existencia de la relación sin seleccionar el binario. El detalle devuelve el `VisionAnalyzeResponse` completo originalmente guardado, incluidos versión del modelo, métricas `null` y fecha. El JSON se valida en ejecución y debe ser coherente con las columnas `inspectionId`, `fieldId`, `zoneId`, `cropType` y `createdAt`; un registro inválido produce 500, sin reparación o respuesta parcial.

Ambos GET responden `Cache-Control: no-store`. Los errores de entrada son 400, un detalle ajeno o inexistente es 404, la indisponibilidad identificada de PostgreSQL es 503 y un contrato histórico inválido o fallo inesperado es 500. La API conserva el modelo de acceso actual del router: `fieldId` limita el contexto de lectura, pero no constituye autenticación ni separación de permisos por productor.

El endpoint `/image` devuelve los bytes originales con su MIME, `Content-Length`, `Cache-Control: private, no-store` y `X-Content-Type-Options: nosniff`. Exige el mismo `fieldId`, responde 404 si el análisis es ajeno o no tiene archivo y no ejecuta IA ni escrituras.

## Verificación del historial

Desde la raíz del repositorio:

```powershell
npm --prefix backend run build
npm --prefix backend run vision:test
npx tsx --test backend/tests/vision-history.test.cjs
npx tsx --test backend/tests/vision-images.test.cjs
npx tsx --test backend/tests/vision-history.integration.test.cjs
```

La integración exige `TEST_DATABASE_URL` apuntando a PostgreSQL aislado y se omite explícitamente cuando falta; nunca utiliza `DATABASE_URL` como alternativa.

## Registro

Cada respuesta exitosa se guarda en `vision_analysis_records` y su fotografía original en `vision_analysis_images` mediante una única escritura anidada de Prisma. La migración aditiva `20261104090000_vision_analysis_images` conserva los registros anteriores sin fotografía. El tamaño, MIME, firma binaria y SHA-256 se calculan desde el `Buffer` multipart real. Si cualquiera de los dos registros falla, la API responde 503 y no afirma éxito. `fieldId` conserva el identificador de la interfaz demo; este registro no modifica la tabla agronómica `vision_inspections`.

El AI Service requiere estar activo en `AI_SERVICE_URL`. La disponibilidad de pesos por cultivo se consulta en `/models/status`; un cultivo sin modelo real devuelve 503, no una predicción simulada.
