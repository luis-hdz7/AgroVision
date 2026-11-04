# Sección 04 — Lectura de parcelas

## Flujo

La lectura sigue `PostgreSQL → Prisma FieldService → GET /api/fields → apiGet → fieldsServices → FieldsProvider → Topbar`. No existen mocks de respaldo ni consultas adicionales desde Topbar.

Los tres GET conservados son:

- `GET /api/fields`.
- `GET /api/fields/:id`.
- `GET /api/fields/farm/:farmId`.

Cada parcela expone `id`, `farmId`, `name`, `areaSquareMeters`, `soilType`, `irrigationType`, `status` y `createdAt`. Las colecciones mantienen orden ascendente por ID; Decimal se serializa como número y la fecha como ISO.

## Cliente y validación

`apiGet` mantiene su firma de uno o dos argumentos y admite una configuración opcional para pruebas. Su timeout predeterminado es 15 segundos y cubre tanto los headers como la lectura JSON. Combina cancelación externa con un controlador propio, libera temporizador/listener y distingue timeout, cancelación, red, HTTP, JSON y contrato inválido.

`fieldsServices` valida IDs PostgreSQL, superficie `Decimal(12,2)`, fecha ISO, textos y colecciones completas. Rechaza IDs duplicados y nunca descarta filas defectuosas ni convierte errores en `[]`.

## Contexto, selección y actualización

Existe un único `FieldsProvider`, montado sobre la aplicación operativa. `null` representa “Todos los campos”. Una actualización conserva la selección si el ID continúa presente y vuelve a `null` solo cuando una respuesta válida confirma su ausencia. Un error conserva el último listado y la selección.

`reloadFields` invalida inmediatamente la ejecución anterior. Solo la versión vigente puede cambiar datos, error o carga. Topbar muestra carga inicial, actualización, vacío válido y error. Si falla una actualización con datos previos, los mantiene visibles con el aviso “Mostrando el último listado disponible”. No hay polling ni persistencia en `localStorage`.

## Consumidores revisados

- Topbar selecciona el ID global sin repetir la consulta.
- MappingPage y FieldAwareMappingGIS combinan registros persistidos con geometrías existentes.
- VisionAiPage utiliza la parcela seleccionada y sus estados de carga/error.
- Otros módulos que todavía mantienen datasets o geometrías propias deben abordarse en sus secciones; esta sección no inventa coordenadas ni sustituye todos los mocks.

## Pruebas

```bash
cd backend
npx tsx --test tests/fields.test.cjs
npx tsx --test ../frontend/tests/apiClient.test.mjs ../frontend/tests/fieldsServices.test.mjs
npx tsx --test tests/fields-read.integration.test.cjs
```

La última prueba requiere `TEST_DATABASE_URL` hacia PostgreSQL aislado. Crea usuario, fincas y parcelas ficticias, contrasta HTTP con otro cliente Prisma y elimina únicamente sus IDs. La comprobación visual del contexto y Topbar requiere navegador y no queda acreditada por una compilación.

## Límites

No se añadieron escrituras, paginación, caché persistente, reintentos automáticos, geometrías, polling ni sincronización total de todos los módulos.
