# 🌱 AgroVision

**AgroVision** es una plataforma tecnológica orientada al monitoreo inteligente de cultivos, combinando software, análisis de datos, visualización técnica y simulación de inspección agrícola mediante un robot de reconocimiento.

El proyecto nace como una solución de hackathon enfocada en apoyar la agricultura moderna mediante herramientas digitales que permitan observar, analizar y representar información relevante del terreno, los cultivos y el estado general de una zona agrícola.

---

## 🚀 Visión del Proyecto

La agricultura necesita herramientas más accesibles, visuales y automatizadas para tomar mejores decisiones.

**AgroVision** propone una plataforma donde productores, técnicos o investigadores puedan visualizar información del cultivo, inspeccionar zonas del terreno y analizar datos simulados o reales provenientes de sensores, sistemas de monitoreo o robots agrícolas.

El objetivo no es reemplazar al agricultor, sino darle una herramienta más clara, técnica y útil para entender qué está ocurriendo en el campo.

---

## 🎯 Objetivo General

Desarrollar una plataforma web capaz de representar información agrícola de forma visual, organizada e intuitiva, integrando módulos de monitoreo, simulación, análisis y control para apoyar la toma de decisiones en entornos agrícolas.

---

## 🧩 Módulos Principales

AgroVision está pensado como un sistema modular. Cada módulo puede evolucionar de forma independiente y luego integrarse dentro de una misma plataforma.

---

### 📊 Dashboard General

Panel principal donde se presenta información resumida del sistema.

Puede incluir:

```text
- Estado general del cultivo
- Indicadores clave
- Alertas
- Métricas recientes
- Resumen de inspección
- Accesos rápidos a módulos
```

---

### 🌾 Monitoreo de Cultivos

Módulo orientado a representar el estado de los cultivos mediante datos visuales y métricas.

Puede mostrar:

```text
- Humedad del suelo
- Temperatura
- Estado general del cultivo
- Nivel de riesgo
- Condiciones ambientales
- Historial de mediciones
```

---

### 🤖 Rover Mapping System

Módulo de mapeo 2D donde se simula la inspección de un terreno mediante un rover agrícola.

Este módulo permite visualizar:

```text
- Posición del robot
- Trayectoria recorrida
- Ruta pendiente
- Plantas detectadas
- Obstáculos detectados
- Barrido tipo LiDAR simulado
- Nube de puntos simulada
- Métricas de inspección
- Resumen final del recorrido
```

> Actualmente este módulo funciona como una simulación técnica para demo.
> No representa todavía SLAM real, GPS real, LiDAR físico ni navegación autónoma completa.

---

### 🧠 Procesamiento y Análisis

Capa lógica encargada de procesar los datos recibidos desde mocks, sensores o servicios externos.

Puede encargarse de:

```text
- Normalización de coordenadas
- Cálculo de progreso de inspección
- Detección de eventos
- Cálculo de distancias
- Validación de datos
- Preparación de respuestas para frontend
```

---

### 🔌 API Backend

El backend expone servicios para que el frontend pueda consumir datos organizados.

Endpoints principales del módulo Mapping:

```http
GET /api/mapping/simulation
GET /api/mapping/playback
GET /api/mapping/summary
```

Estos endpoints permiten obtener:

```text
- Datos completos de simulación
- Frames de reproducción
- Resumen final de inspección
```

---

## 🏗️ Arquitectura General

Flujo conceptual del sistema:

```text
Datos simulados / sensores / servicios externos
        ↓
Backend API
        ↓
Procesamiento lógico
        ↓
Contratos de datos
        ↓
Frontend
        ↓
Visualización e interacción
```

Flujo del módulo Mapping:

```text
Dataset del rover
        ↓
Mapping Service
        ↓
Mapping Engine
        ↓
API Response
        ↓
Mapping Adapter
        ↓
Interfaz visual
        ↓
Render 2D del terreno
```

---

## 🛠️ Tecnologías Utilizadas

El proyecto puede integrar distintas tecnologías según el módulo.

### Backend

```text
- Node.js
- Express
- TypeScript
- Prisma
```

### Frontend

```text
- React
- TypeScript
- CSS modular
- SVG para visualización técnica
```

### Herramientas de desarrollo

```text
- Git
- GitHub
- GitKraken
- VS Code
- npm
```

---


## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/luis-hdz7/AgroVision.git
cd AgroVision
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Compilar el proyecto:

```bash
npm run build
```

Ejecutar versión compilada:

```bash
npm start
```

---

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto cuando se requiera conexión a base de datos u otros servicios.

Ejemplo:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/agrovision"
```

> No subir archivos `.env` al repositorio.

---

## 📡 Endpoints Actuales

### Mapping Simulation

```http
GET /api/mapping/simulation
```

Devuelve los datos principales de simulación del rover.

---

### Mapping Playback

```http
GET /api/mapping/playback
```

Devuelve frames de reproducción para representar el movimiento del rover.

---

### Mapping Summary

```http
GET /api/mapping/summary
```

Devuelve un resumen final de la inspección.

---

## 🧪 Validación del Proyecto

Antes de subir cambios al repositorio, ejecutar:

```bash
npm install
npm run build
npm run dev
```

Verificar manualmente:

```text
- El backend inicia correctamente
- No hay errores de TypeScript
- Los endpoints responden
- No se sube node_modules
- No se sube dist
- No se sube .env
```

---

## 👥 Roles del Equipo

### Frontend

Responsable de:

```text
- Interfaz visual
- Dashboard
- Componentes
- Visualización de datos
- Experiencia de usuario
- Integración con API
```

### Backend

Responsable de:

```text
- API
- Rutas
- Controladores
- Servicios
- Procesamiento lógico
- Validación de datos
- Contratos de respuesta
```

### Datos / Simulación

Responsable de:

```text
- Datasets simulados
- Trayectorias
- Plantas
- Obstáculos
- Eventos
- Métricas base
```

---

## 🌐 Alcance Actual

AgroVision se encuentra en una fase de prototipo funcional para hackathon.

Actualmente se trabaja con datos simulados, pero la arquitectura está pensada para evolucionar hacia:

```text
- Sensores reales
- Rover físico
- Datos en tiempo real
- Base de datos persistente
- Reportes históricos
- Monitoreo avanzado de cultivos
```

---

## ⚠️ Limitaciones Actuales

El sistema aún no implementa:

```text
- SLAM real
- GPS real
- LiDAR físico
- Navegación autónoma real
- Procesamiento de imágenes real
- Persistencia completa en base de datos
- Monitoreo en producción
```

Estas limitaciones son normales para la fase actual del proyecto.

---

## 🔮 Próximas Mejoras

Posibles mejoras futuras:

```text
- Integrar sensores reales
- Conectar rover físico
- Agregar WebSockets para datos en tiempo real
- Guardar inspecciones en base de datos
- Generar reportes PDF
- Agregar autenticación de usuarios
- Crear historial de cultivos
- Implementar análisis de salud vegetal
- Integrar visión por computadora
- Mejorar el sistema de alertas
```

---


## 🧠 Propósito Final

AgroVision busca demostrar cómo la tecnología puede mejorar la observación, análisis y toma de decisiones en agricultura.

El proyecto combina visualización, simulación, datos y arquitectura web para construir una base sólida hacia un sistema agrícola inteligente, escalable y útil en entornos reales.
