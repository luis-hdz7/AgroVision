# Landing de AgroVision

La página pública está en `/`; el sistema existente sigue disponible en `/dashboard` y sus otras rutas. Las imágenes proceden de los recursos del proyecto y se presentan como vistas de referencia, sin afirmar que son capturas de datos en vivo.

## Puesta en marcha

Desde `backend`, con `DATABASE_URL` configurada:

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

En otra terminal, desde `frontend`:

```bash
npm run dev
```

El proxy existente de Vite dirige `/api` al backend. En Azure, usar la configuración de Nginx de la guía de despliegue. Compilar el frontend con `npm run build` y publicar su `dist`.

## Solicitudes

`POST /api/demo-requests` acepta un objeto estricto con nombre, correo, organización opcional, mensaje y `consent: "true"`. Los textos se normalizan con `trim`; una organización ausente o vacía se guarda como `null`. La base genera el identificador, `createdAt` y `consentAt`.

El backend devuelve 201 y `{ id }` únicamente después de terminar la escritura. El frontend valida el estado, el JSON y que el ID sea un entero PostgreSQL positivo antes de mostrar éxito. La petición tiene un límite de 15 segundos, se cancela al desmontar la página y bloquea envíos simultáneos del mismo formulario. Ante error conserva los campos; un timeout o fallo de red se describe como envío no confirmado porque el cliente no puede saber si el servidor alcanzó a escribir.

No se envían correos automáticamente ni se agenda una cita. Tampoco existe administración o listado público de solicitudes.

No se incluye una ruta pública para listar solicitudes. El panel administrativo con autenticación es un componente pendiente. Mientras se implementa, las solicitudes pueden consultarse mediante acceso autorizado a PostgreSQL:

```sql
SELECT id, name, email, organization, message, "createdAt"
FROM demo_requests ORDER BY "createdAt" DESC;
```

## Revisión manual

1. Abrir `/` en escritorio y móvil: verificar navegación por secciones y acceso al dashboard.
2. Intentar enviar campos vacíos, correo inválido o sin consentimiento: no debe registrarse la solicitud.
3. Enviar datos válidos con la migración aplicada: comprobar HTTP 201 y registro en PostgreSQL.
4. Detener el backend: debe aparecer un mensaje de error, sin confirmación de guardado.
5. Navegar con teclado y comprobar los mensajes del formulario y los enlaces.

## Pruebas del flujo

Desde `backend`:

```bash
npx tsx --test tests/demo-requests.test.cjs
npx tsx --test ../frontend/tests/demoRequestService.test.mjs
```

La persistencia real requiere una PostgreSQL aislada y `TEST_DATABASE_URL` explícita:

```bash
npx tsx --test tests/demo-requests.integration.test.cjs
```

La prueba de integración relee mediante otro cliente Prisma y limpia exclusivamente los IDs creados por su ejecución. Una prueba omitida por falta de conexión no acredita persistencia.
