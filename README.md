<p align="center">
  <img src="./frontend/src/assets/logos/logoPrincipal-AgroVision.png" alt="AgroVision Intelligence Logo" width="180" />
</p>

<h1 align="center">🌱 AgroVision Intelligence</h1>

<h3 align="center">
  Plataforma prescriptiva de inteligencia agrícola multifuente para cultivos estratégicos de Nicaragua.
</h3>

<p align="center">
  <strong>De la evidencia multifuente a la acción agrícola inteligente</strong><br>
  <em>Imagen + clima + sensores + historial + mapping + capa satelital simulada → evidencia → riesgo → recomendación accionable.</em>
</p>

<p align="center">
  <a href="https://github.com/luis-hdz7/AgroVision">
    <img src="https://img.shields.io/badge/Hackathon%20Nicaragua-2026-0B7A3B?style=for-the-badge" alt="Hackathon Nicaragua 2026" />
  </a>
  <img src="https://img.shields.io/badge/Categor%C3%ADa-Agropecuario--Libre-2E8B57?style=for-the-badge" alt="Categoría Agropecuario Libre" />
  <img src="https://img.shields.io/badge/Estado-MVP%20en%20desarrollo-F2A900?style=for-the-badge" alt="Estado MVP" />
  <img src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 20+" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111827" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript " />
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.11+" />
  <img src="https://img.shields.io/badge/OpenCV-IA%20Visual-5C3EE8?style=flat-square&logo=opencv&logoColor=white" alt="OpenCV" />
  <img src="https://img.shields.io/badge/PostgreSQL%20%2B%20Prisma-Ready-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL Prisma" />
</p>

<p align="center">
  <strong>Equipo:</strong> AgroVision · <strong>Hackathon Nacional Nicaragua 2026</strong> · <strong>“10 años, Siempre Más Allá”</strong>
</p>

---
<p align="center">...logo...</p>


**Tabla de Contenidos**
- [Desafío del País](#-desafío-del-país)
- [Problema y Propuesta de Valor](#-problema-y-propuesta-de-valor)
- [Arquitectura](#-diagrama-de-arquitectura)
- [Flujo Prescriptivo](#-flujo-prescriptivo-del-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Guía deInstalación](#-guía-de-instalación)
- [Endpoints principales](#-cómo-probar-el-mvp-en-2-minutos)
- [Arquitectura](#-arquitectura-de-carpetas)
- [Contrato de respuesta API](#-contrato-de-respuesta-api)
- [Funcionalidades del MVP](#-funcionalidades-del-mvp)
- [Escalabilidad y Sostenibilidad](#-escalabilidad-y-sostenibilidad-técnica)
- [Alcance y Límites](#-alcance-y-límites-del-mvp)
- [Validación antes de PR](#-validación-antes-de-pull-request)
- [Nuestro Equipo](#-equipo)
<!-- - [Cómo Probar el MVP](#-cómo-probar-el-mvp-en-2-minutos) -->


---

## 🏆 Desafío del País

| Campo | Descripción |
|---|---|
| **Proyecto** | AgroVision Intelligence |
| **Categoría** | Agropecuario-Libre |
| **Equipo** | AgroVision |
| **Repositorio** | `luis-hdz7/AgroVision` |
| **Estado actual** | MVP en desarrollo |
| **Modo de demo actual** | Localhost |
<!-- | **URL demo** | `[INSERTAR URL DEMO]` |
| **Video demo** | `[INSERTAR VIDEO DEMO]` | -->

> AgroVision Intelligence convierte datos agrícolas dispersos en evidencia técnica, riesgo por zona y recomendaciones accionables para pequeños y medianos productores.

---

## 💡 Problema y Propuesta de Valor

### Contexto del problema

En el sector agropecuario nacional, muchos productores toman decisiones críticas con información fragmentada, observación manual y baja trazabilidad. El problema no es únicamente medir datos como temperatura o humedad; el problema real es que esos datos rara vez se convierten en decisiones operativas claras.

| Dolor identificado | Impacto operativo | Respuesta de AgroVision Intelligence |
|---|---|---|
| Detección tardía de estrés vegetal | Pérdida de vigor, bajo rendimiento y reacción fuera de tiempo | Análisis visual preliminar + índices de vegetación simulados + riesgo por zona |
| Datos agrícolas dispersos | Sensores, imágenes, clima e historial no conectan entre sí | Fusión multifuente mediante `EvidenceItem[]` |
| Falta de priorización | El productor no sabe qué zona atender primero | `ZoneInsight` con riesgo, causa principal y acción recomendada |
| Reportes débiles o inexistentes | No queda evidencia de inspecciones, alertas o acciones | Reportes e historial conectados a alertas y recomendaciones |
<!-- | Software agrícola genérico | No considera cultivos estratégicos nacionales | Perfiles de frijol rojo, yuca, quequisque, naranjo, sorgo, maní y cultivo general | -->

### Propuesta de valor

**AgroVision Intelligence** es una plataforma web prescriptiva que integra:

| Fuente | Función dentro del sistema |
|---|---|
| **Imagen del cultivo** | Detectar señales visuales preliminares de estrés, zonas secas, clorosis o manchas foliares |
| **Clima** | Estimar condiciones que elevan riesgo hídrico, térmico o fúngico |
| **Sensores y telemetría** | Incorporar lecturas de campo como humedad, temperatura, pH o variables futuras |
| **Historial agrícola** | Dar contexto a eventos pasados, reportes y evolución por zonas estratégicas |
| **Mapping 2D** | Visualizar trayectoria, detecciones, cobertura y puntos críticos |
| **Capa satelital simulada** | Representar vigor vegetal, NDVI/NDWI/GNDVI simulados y anomalías por zona |

El sistema transforma esa información en:

```text
EvidenceItem[] → RiskAssessment → ZoneInsight → Alert → Recommendation → Report
```

### Principio ético

AgroVision no reemplaza al productor ni al técnico agrícola. Su función es apoyar la toma de decisiones con información organizada, visual, explicable y accionable.

> La IA visual se presenta como detección preliminar de señales compatibles con estrés o deterioro del cultivo. No se presenta como diagnóstico fitosanitario definitivo (al menos no en esta etapa del proyecto).

---

## 🏗️ Diagrama de Arquitectura

```mermaid
flowchart TD
    USER["Usuario<br/>Productor ·  Ing. Agrónomo de Campo · Analista Agrícola"] --> UI["Frontend React + Vite<br/>Dashboard · Mapping · Vision AI · Crops · Alerts · Recommendations"]

    UI --> API["Backend API<br/>Express + TypeScript"]

    API --> APP["App Router API<br/>/api/*"]

    APP --> DASH["Dashboard Module"]
    APP --> CROPS["Crops Module"]
    APP --> MAP["Mapping Module"]
    APP --> VEG["Vegetation Module"]
    APP --> VISION["Vision Module"]
    APP --> ANALYSIS["Analysis Module"]
    APP --> RISK["Risk Module"]
    APP --> ALERTS["Alerts Module"]
    APP --> RECS["Recommendations Module"]
    APP --> REPORTS["Reports Module"]
    APP --> WEATHER["Weather Module"]

    CROPS --> CROP_PROFILES["CropProfile Rules<br/>Cultivos nacionales"]
    MAP --> MAP_ENGINE["Mapping Engine<br/>Trayectoria · Eventos · Detecciones"]
    VEG --> VEG_INDEX["Vegetation Indices<br/>NDVI · NDWI · GNDVI simulados"]
    WEATHER --> WEATHER_DATA["Weather Mock / Future API"]
    VISION --> AI_PROXY["Backend Vision Service"]
    AI_PROXY --> AI_SERVICE["AI Service<br/>FastAPI + OpenCV"]
    AI_SERVICE --> VISUAL_METRICS["VisualMetrics<br/>Predicción · Confianza · Explicación"]

    CROP_PROFILES --> CORE["Analysis Core"]
    MAP_ENGINE --> CORE
    VEG_INDEX --> CORE
    WEATHER_DATA --> CORE
    VISUAL_METRICS --> CORE
    TELEMETRY["Sensors / Telemetry Mock"] --> CORE
    HISTORY["History / Reports"] --> CORE

    CORE --> EVIDENCE["EvidenceItem[]<br/>Fuente · Métrica · Estado · Explicación"]
    EVIDENCE --> RISK
    RISK --> ZONE["ZoneInsight<br/>Riesgo final · Score · Causa · Acción"]
    ZONE --> ALERTS
    ZONE --> RECS
    ZONE --> DASH
    ZONE --> REPORTS

    API --> DB["PostgreSQL + Prisma<br/>Persistencia futura / modelos reales"]
    API --> MOCKS["Mocks de simulación<br/>MVP reproducible"]
```

---

## 🔁 Flujo Prescriptivo del Sistema

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend API
    participant AI as AI Service
    participant R as Risk Engine
    participant D as Dashboard

    U->>F: Sube imagen / consulta dashboard
    F->>B: Solicita análisis o datos prescriptivos
    B->>AI: Envía imagen y CropType
    AI-->>B: VisionPrediction + VisualMetrics + confidence
    B->>B: Normaliza como VisionInspection
    B->>B: Fusiona visión + clima + vegetación + mapping + historial
    B->>R: Envía EvidenceItem[]
    R-->>B: RiskAssessment
    B-->>F: ZoneInsight + Alert + Recommendation
    F-->>D: Renderiza riesgo, evidencia y acción sugerida
```

---

## ⚙️ Stack Tecnológico

| Componente | Tecnología | Justificación Técnica de Eficiencia |
|---|---|---|
| **Frontend** | React 19 + Vite | Permite construir una interfaz modular, rápida y mantenible. Vite acelera el ciclo de desarrollo y reduce fricción en demo. |
| **Lenguaje Frontend** | TypeScript | Reduce incompatibilidades con contratos de datos y evita errores silenciosos entre servicios, adapters y componentes. |
| **Render técnico** | SVG + CSS modular | Ideal para mapping 2D, capas visuales, overlays de riesgo, trayectorias, plantas, obstáculos y puntos críticos. |
| **Backend API** | Node.js + Express + TypeScript | Stack flexible, rápido de auditar y apropiado para endpoints modulares en un hackathon avanzado. |
| **Validación de datos** | Zod | Permite validar contratos, requests y respuestas críticas antes de llegar al frontend. |
| **ORM / Datos** | Prisma + PostgreSQL | Base preparada para persistencia real, relaciones entre cultivos, reportes, alertas, usuarios y zonas agrícolas. |
| **Mocks controlados** | JSON / TypeScript mock services | Permiten simular escenarios agrícolas de forma reproducible mientras se integran sensores o datos reales. |
| **IA visual** | Python + OpenCV | Permite análisis explicable de imágenes usando métricas visuales interpretables y defendibles ante jurado técnico. |
| **AI Service** | FastAPI | Expone análisis visual como microservicio independiente, desacoplado del backend principal. |
| **Contratos** | TypeScript interfaces + Markdown técnico | Crean una fuente de verdad entre backend, frontend e IA para evitar rupturas de integración. |
| **Control de versiones** | Git + GitHub + Pull Requests | Permite trazabilidad, revisión por ramas, control de conflictos y colaboración por módulo. |
| **Diseño de producto** | CSS tokens + componentes reutilizables | Mantiene consistencia visual, escalabilidad de interfaz y velocidad de construcción. |

---

## 🤖 Agente de Inteligencia Artificial

### Rol del agente

El componente de IA de AgroVision se divide en dos capas:

| Capa | Responsabilidad |
|---|---|
| **AI Service** | Procesar imagen, extraer métricas visuales y generar predicción preliminar |
| **Backend Intelligence Layer** | Fusionar la evidencia visual con clima, vegetación simulada, mapping, historial y reglas de cultivo |
| **Risk Engine** | Calcular riesgo final, causa principal y acción recomendada |
| **Recommendation Layer** | Convertir riesgo y evidencia en recomendación accionable |

### Clasificaciones soportadas

```text
HEALTHY
WATER_STRESS
CHLOROSIS
DRY_AREA
LEAF_SPOT
UNKNOWN
```

### Métricas visuales esperadas

| Métrica | Uso |
|---|---|
| `greenCoveragePercentage` | Estimar cobertura verde visible |
| `dryAreaPercentage` | Identificar zonas secas o deterioradas |
| `chlorosisSuspected` | Señal visual preliminar de amarillamiento |
| `leafSpotSuspected` | Señal visual preliminar de manchas foliares |
| `stressPatternDetected` | Indica patrón visual compatible con estrés |
| `confidence` | Nivel de confianza del análisis visual |
| `explanation` | Explicación corta y entendible del resultado |

### Ingeniería de prompts aplicada

AgroVision no depende de un LLM para funcionar. Sin embargo, aplica principios de ingeniería de prompts a nivel de diseño de respuestas, plantillas prescriptivas y comunicación de recomendaciones:

| Patrón | Aplicación en AgroVision |
|---|---|
| **Context grounding** | Toda recomendación se basa en `EvidenceItem[]`, no en texto genérico. |
| **Structured output** | Los servicios devuelven objetos tipados como `VisionInspection`, `ZoneInsight`, `Alert` y `Recommendation`. |
| **Action-first response** | La recomendación prioriza acción sugerida, urgencia e impacto esperado. |
| **Safety framing** | La IA visual se expresa como detección preliminar, evitando diagnósticos definitivos. |
| **Traceability** | Cada alerta conserva fuente, métrica, estado y explicación. |

### Ejemplo de salida IA

```json
{
  "prediction": "WATER_STRESS",
  "confidence": 0.87,
  "visualMetrics": {
    "greenCoveragePercentage": 62,
    "dryAreaPercentage": 21,
    "chlorosisSuspected": false,
    "leafSpotSuspected": false,
    "stressPatternDetected": true
  },
  "explanation": "Se detecta reducción de cobertura verde y presencia moderada de zonas secas."
}
```

### Uso responsable

| Regla | Decisión técnica |
|---|---|
| No diagnóstico definitivo | La IA solo detecta señales visuales compatibles con estrés o deterioro |
| Backend decide riesgo final | El AI Service no genera alertas directamente |
| Evidencia obligatoria | Sin `EvidenceItem[]`, no se genera alerta ni recomendación válida |
| Recursos eficientes | El MVP prioriza OpenCV explicable y reglas ligeras antes de modelos pesados |

---

## 🛠️ Guía de Instalación 

### Requisitos previos

| Herramienta | Versión recomendada | Uso |
|---|---:|---|
| Node.js | `20.x` o superior | Backend y frontend |
| npm | `10.x` o superior | Gestión de dependencias |
| Python | `3.11.x` o superior | AI Service |
| Git | `2.40+` | Control de versiones |
| PostgreSQL | `15+` | Base de datos con Prisma |
| VS Code | Última estable | Desarrollo |
| GitKraken / GitHub Desktop | Opcional | Gestión visual de ramas |

---

### Variables de entorno

Crear los siguientes archivos según el módulo que se va a ejecutar.

#### `.env.example` en raíz

```env
# URL base del backend para referencia general
VITE_API_BASE_URL=http://localhost:3000/api

# URL local del servicio IA
AI_SERVICE_URL=http://localhost:8000

# Entorno de ejecución
NODE_ENV=development
```

#### `backend/.env.example`

```env
# Puerto del backend Express
PORT=3000

# Base de datos PostgreSQL usada por Prisma
# Reemplazar user, password, host, port y database por valores locales
DATABASE_URL="postgresql://user:password@localhost:5432/agrovision"

# URL interna del AI Service
AI_SERVICE_URL=http://localhost:8000

# Entorno del backend
NODE_ENV=development

# Secreto para JWT si se habilita autenticación
JWT_SECRET="replace-with-secure-secret"
```

#### `frontend/.env.example`

```env
# API base consumida por Vite
VITE_API_BASE_URL=http://localhost:3000/api
```

#### `ai-service/.env.example`

```env
# Puerto del servicio IA
AI_SERVICE_PORT=8000

# Entorno del servicio IA
AI_ENV=development

# Ruta local opcional para modelos
MODEL_PATH=./models
```

---

### Instalación local

#### 1. Clonar el repositorio

```bash
git clone https://github.com/luis-hdz7/AgroVision.git
cd AgroVision
```

#### 2. Instalar dependencias del backend

```bash
npm --prefix backend install
```

#### 3. Instalar dependencias del frontend

```bash
npm --prefix frontend install
```

#### 4. Crear entorno virtual para AI Service

```bash
cd ai-service
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux / macOS:

```bash
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
cd ..
```

> Si `requirements.txt` aún no existe, crear primero el archivo dentro de `ai-service/`.

---

### Prisma y base de datos

Desde la raíz:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

> Si se ejecuta únicamente con mocks para demo local, las migraciones pueden omitirse temporalmente.

---

### Levantar servicios

#### Backend

```bash
npm run dev:backend
```

Backend esperado:

```text
http://localhost:3000
```

#### Frontend

En otra terminal:

```bash
npm run dev:frontend
```

Frontend esperado:

```text
http://localhost:5173
```

#### AI Service

En otra terminal:

```bash
cd ai-service
```

Windows:

```bash
.venv\Scripts\activate
```

Linux / macOS:

```bash
source .venv/bin/activate
```

Ejecutar:

```bash
uvicorn main:app --reload --port 8000
```

AI Service esperado:

```text
http://localhost:8000
```

---

### Comandos rápidos del monorepo

| Comando | Uso |
|---|---|
| `npm run dev:backend` | Ejecuta backend Express en desarrollo |
| `npm run build:backend` | Compila backend TypeScript |
| `npm run start:backend` | Ejecuta backend compilado |
| `npm run dev:frontend` | Ejecuta frontend Vite |
| `npm run build:frontend` | Compila frontend para producción |

---

## 📡 Endpoints Principales

| Módulo | Método | Endpoint | Propósito |
|---|---|---|---|
| Mapping | GET | `/api/mapping/simulation` | Datos completos de simulación 2D |
| Mapping | GET | `/api/mapping/playback` | Frames de reproducción |
| Mapping | GET | `/api/mapping/summary` | Resumen final de inspección |
| Crops | GET | `/api/crops/profiles` | Perfiles de cultivos estratégicos |
| Vegetation | GET | `/api/vegetation/indices?fieldId=field-001` | NDVI/NDWI/GNDVI simulados |
| Analysis | GET | `/api/analysis/zone/:zoneId` | Análisis prescriptivo por zona |
| Risk | GET | `/api/risk/field/:fieldId` | Evaluación de riesgo por campo |
| Alerts | GET | `/api/alerts` | Alertas con evidencia |
| Recommendations | GET | `/api/recommendations` | Recomendaciones accionables |
| Vision | POST | `/api/vision/analyze` | Análisis visual desde backend |
| Weather | GET | `/api/weather/current?fieldId=field-001` | Clima simulado o integrable |
| AI Service | POST | `/vision/analyze` | Análisis visual por OpenCV |

---

## 📂 Arquitectura de Carpetas

```text
AgroVision/
│
├── README.md
├── package.json
├── .gitignore
├── .env.example
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma.config.ts
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       │
│       ├── shared/
│       │   ├── responses/
│       │   │   └── apiResponse.ts
│       │   ├── contracts/
│       │   ├── middlewares/
│       │   ├── config/
│       │   ├── types/
│       │   └── utils/
│       │
│       ├── data/
│       │   └── mocks/
│       │
│       └── modules/
│           ├── mapping/
│           ├── dashboard/
│           ├── crops/
│           ├── vegetation/
│           ├── analysis/
│           ├── risk/
│           ├── alerts/
│           ├── recommendations/
│           ├── vision/
│           ├── weather/
│           ├── reports/
│           ├── farms/
│           ├── fields/
│           ├── sensors/
│           ├── telemetry/
│           ├── missions/
│           ├── field-notebook/
│           └── sync/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   │
│   └── src/
│       ├── main.tsx
│       ├── app/
│       ├── shared/
│       │   ├── api/
│       │   ├── components/
│       │   ├── styles/
│       │   ├── types/
│       │   └── utils/
│       │
│       └── features/
│           ├── dashboard/
│           ├── mapping/
│           ├── crops/
│           ├── vision-ai/
│           ├── alerts/
│           ├── recommendations/
│           ├── reports/
│           ├── field-notebook/
│           ├── missions/
│           └── sync-status/
│
├── ai-service/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── schemas.py
│       ├── vision_analyzer.py
│       ├── model_loader.py
│       ├── training/
│       └── utils/
│
├── contracts/
│   ├── AGROVISION_DATA_CONTRACT.md
│   └── AGROVISION_INTELLIGENCE_EXTENSION.md
│
├── docs/
│
└── design/
```

---

## 🔐 Contrato de Respuesta API

Todos los endpoints deben responder con la misma estructura base:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
  timestamp: string;
}
```

### Contratos centrales

| Contrato | Propósito |
|---|---|
| `CropType` | Identifica cultivos estratégicos nacionales |
| `CropProfile` | Define riesgos, métricas y recomendaciones por cultivo |
| `EvidenceItem` | Estandariza la evidencia usada por riesgo, alerta y recomendación |
| `VegetationIndexSnapshot` | Representa NDVI/NDWI/GNDVI simulados e interpretación |
| `VisionInspection` | Normaliza el resultado del análisis visual |
| `RiskAssessment` | Resultado del motor de riesgo |
| `ZoneInsight` | Diagnóstico prescriptivo por zona |
| `Alert` | Alerta con severidad, evidencia y acción |
| `Recommendation` | Acción sugerida con razón e impacto esperado |
| `DashboardIntelligence` | Resumen ejecutivo para dashboard |

---

## 🧭 Funcionalidades del MVP

| Módulo | Funcionalidad |
|---|---|
| Dashboard | Riesgo dominante, zona afectada, recomendación principal y alertas críticas |
| Crops | Perfiles de cultivos estratégicos nacionales |
| Mapping | Simulación 2D del rover, trayectoria, detecciones y resumen |
| Vision AI | Carga de imagen, selección de cultivo, predicción visual y métricas |
| Vegetation | Índices simulados de vigor vegetal por zona |
| Analysis | Fusión multifuente para generar `ZoneInsight` |
| Risk | Motor de riesgo explicable basado en evidencia |
| Alerts | Alertas con fuente, métrica, severidad y acción recomendada |
| Recommendations | Acciones sugeridas con impacto esperado |
| Reports | Trazabilidad de inspecciones, alertas y decisiones |

---

## 🚀 Escalabilidad y Sostenibilidad Técnica

| Fase | Evolución | Resultado esperado |
|---|---|---|
| 1 | Sustituir mocks por datos reales | Sensores, clima, reportes e imágenes persistentes |
| 2 | Validar reglas con técnicos agrícolas | Risk engine ajustado por cultivo y región |
| 3 | Integrar fuentes abiertas | Sentinel/Landsat o API climática cuando el MVP esté validado |
| 4 | Desplegar en nube | Backend, frontend, base de datos y AI Service accesibles públicamente |
| 5 | Escalar a multi-finca | Roles, historial, reportes, alertas y recomendaciones por productor |

---

## ⚠️ Alcance y Límites del MVP

| Punto | Declaración |
|---|---|
| Diagnóstico fitosanitario | No se promete diagnóstico definitivo |
| Satélite real | No se integra Sentinel ni Google Earth Engine en esta versión |
| IA | Se usa como análisis preliminar explicable |
| Mapping | Es simulación técnica visual, no SLAM real |
| Hardware | El MVP no depende de rover de reconocimiento físico o  sensores para demostrar valor |
| Decisión final | La recomendación apoya, no sustituye al productor o técnico |

---

## ✅ Validación antes de Pull Request

```bash
git status --short
npm run build:backend
npm run build:frontend
```

No debe subirse:

```text
node_modules/
dist/
.env
.venv/
__pycache__/
```

Flujo recomendado:

```bash
git checkout master
git pull origin master
git checkout -b feat/nombre-del-cambio
```

Después de trabajar:

```bash
git add ruta-del-cambio
git commit -m "feat(modulo): descripcion clara"
git push -u origin feat/nombre-del-cambio
```

---

## 👥 Equipo 

| Integrante | Rol principal en Hackathon | Responsabilidades clave | GitHub |
|---|---|---|---|
| **Brandon Reynaldo Rodríguez Téllez** | Líder / Coordinador / Diseñador Gráfico / Dev | Coordinación general, diseño visual, experiencia de usuario, frontend, contrato de datos e integración técnica | [@Brando-1510](https://github.com/Brando-1510) |
| **Leonardo Antonio Tellería Trujillo** | Developer | Backend, servicios, endpoints, estructura API, integración técnica | [@LeonardoTelleria](https://github.com/LeonardoTelleria) |
| **Jorge Luis Antón Henández** | Developer | Backend, repositorio principal, módulos técnicos, lógica de análisis y soporte de integración | [@luis-hdz7](https://github.com/luis-hdz7) |
| **Marvin Osvaldo Solís Hernández** | Comunicador | Comunicación estratégica, pitch, narrativa, validación del problema y defensa ante jurado | [@OsvaldoZzz](https://github.com/OsvaldoZzz) |
| **Haryli Marina Téllez Valle** | Mecadóloga | Investigación de mercado, propuesta de valor, estrategia de comercialización y defensa del modelo de negocio | [@](https://github.com/OsvaldoZzz) |


---

## 📬 Contacto

| Responsable | Contacto |
|---|---|
| Brandon Reynaldo Rodríguez Téllez | `brandonbrt2020@gmail.com` |
| Jorge Luis Antón Henández | `luisjorgeantonhernandez@gmail.com` |
| Leonardo Antonio Tellería Trujillo | `telleriatrujilloleonardoanti@gmail.com` |
| Marvin Osvaldo Solis Hernández | `elhh1985@gmail.com` |
| Haryli Marina Téllez Valle | `hmtellezv@gmail.com` |

---

<h3 align="center">AgroVision Intelligence</h3>

<p align="center">
  <strong>No es solo un dashboard agrícola. Es una plataforma prescriptiva que convierte evidencia multifuente en decisiones agrícolas accionables.</strong>
</p>
