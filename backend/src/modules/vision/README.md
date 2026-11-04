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

## Registro

Cada respuesta exitosa se guarda en `vision_analysis_records` (migración `20261015190000_vision_analysis_records`) con el contrato completo, cultivo, campo, zona, nombre de archivo y SHA-256 de la imagen. No se almacena la fotografía. Si falla el guardado, la API responde 503 en vez de afirmar que el análisis quedó registrado. `fieldId` conserva el identificador de la interfaz demo; este registro no modifica la tabla agronómica `vision_inspections`.

El AI Service requiere estar activo en `AI_SERVICE_URL`. La disponibilidad de pesos por cultivo se consulta en `/models/status`; un cultivo sin modelo real devuelve 503, no una predicción simulada.
