# Recuperación del historial Vision

`VisionAiPage` consulta los GET de `vision_analysis_records` sin iniciar una inferencia. Solo existe un contexto de lectura cuando la parcela seleccionada coincide con `TRAINED_CROP_CONTEXT`; su identidad combina `fieldId`, `cropType` y la zona efectiva. Una vista sin zona envía `unassignedOnly=true`.

El hook `useVisionHistory` carga la primera página, abre su primer detalle, conserva cursores opacos, deduplica páginas y cancela solicitudes al cambiar de contexto. Versiones independientes protegen listado, paginación y detalle. Antes de un POST se invalida el detalle pendiente; después de un POST confirmado se antepone el resultado y se refresca el listado sin convertir un fallo de lectura en fallo de inferencia.

La galería muestra una tarjeta por análisis cargado y obtiene cada fotografía desde `/api/vision/analyses/:inspectionId/image` con `fieldId`. Las imágenes se solicitan al aproximarse al viewport; un registro anterior sin archivo muestra **Imagen no archivada** y una descarga fallida ofrece reintento. La previsualización `blob:` se reserva al POST recién confirmado y nunca se reutiliza para otro análisis. Todas las señales del detalle seleccionado permanecen accesibles, sin el antiguo corte de cuatro elementos. No se utiliza `localStorage` ni un mock como respaldo.

## Comprobación manual

1. Iniciar el backend validado del bloque 1.
2. Iniciar Vite con `/api/vision` dirigido a ese backend; si usa otro origen, definir temporalmente `VITE_VISION_API_BASE_URL` en el proceso.
3. Apagar el AI Service y seleccionar `field-001`, `ORANGE`, `zone-03`.
4. Abrir Vision y confirmar en Network un GET de listado y otro de detalle, sin POST.
5. Abrir una tarjeta anterior, comprobar fotografía, fecha, clase, versión y todas sus señales; cargar páginas adicionales si existe cursor.
6. Cambiar parcela, cultivo o zona y confirmar que no queda visible el resultado anterior.
7. Forzar un error de lectura y usar **Reintentar**; debe distinguirse de un historial vacío.
8. Para probar un análisis nuevo, encender el AI Service y confirmar que el POST exitoso aparece en la tabla sin ser sobrescrito por un GET tardío.

La interacción concurrente del navegador queda como comprobación manual porque el proyecto no incluye jsdom ni infraestructura de pruebas de componentes React. Las pruebas aisladas cubren construcción de URLs, validación, cursor, errores y cancelación del cliente.

## Consumidor de Dashboard

`analyzeVisionImage` publica una notificación en memoria únicamente después de validar un POST exitoso. La notificación contiene identidad y contexto, pero no sustituye a PostgreSQL: `useDashboardVisionEvidence` vuelve a consultar la primera página del historial con `limit=4` y sin filtros de cultivo o zona.

Dashboard consulta al montar y al cambiar la parcela global. Un evento solo invalida el contexto cuyo `fieldId` coincide; las solicitudes anteriores se abortan y además se descartan mediante una versión local. Al desmontar se cancelan la lectura y la suscripción. Si el evento ocurrió mientras Dashboard no estaba montado, la consulta de montaje recupera igualmente el dato persistido.

El panel conserva estados separados para seleccionar parcela, carga, vacío, error y datos. Cada tarjeta usa `inspectionId`, `hasImage` y el endpoint binario del mismo registro. La actividad reciente reutiliza el primer elemento de esa consulta; no crea una segunda lectura ni mezcla evidencia de recomendaciones. Alertas, riesgo, recomendaciones y el mock general de Dashboard no se invalidan en este bloque.

Pruebas aisladas:

```powershell
node --experimental-strip-types --test frontend/tests/vision-history.test.mjs frontend/tests/dashboard-vision-evidence.test.mjs
```
