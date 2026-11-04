# AgroVision AI Service

## Responsabilidad actual

Recibir una imagen multipart real, validar su tamaño, MIME y firma binaria, y producir el contrato técnico que el backend normaliza para la aplicación.

## Ejecución

```text
python -m uvicorn main:app --host 127.0.0.1 --port 8000

# Iniciamos FastAPI y mantenemos esta terminal abierta.
python -m uvicorn main:app --host 127.0.0.1 --port 8000


```

## Endpoints

- `GET /health`
- `GET /models/status`
- `POST /vision/analyze`

El análisis recibe `image`, `cropType`, `fieldId`, `zoneId` e `imageFileName`. Se admiten JPEG, PNG y WebP de hasta 10 MB.

## Contrato de salida

El servicio devuelve predicción, clase específica, top-3 softmax, versión y arquitectura del modelo, latencia, métricas técnicas, evidencia, explicación y recomendación. Las métricas visuales que el clasificador no calcula son `null`. La envoltura `ApiResponse` y los datos de inspección pertenecen al backend.

## Estado del analizador

`visionAnalyser.py` usa inferencia neuronal real: `CORN` y `ORANGE` disponen de modelos entrenados locales y `RED_BEAN` responde 503 mientras no tenga pesos. El loader verifica integridad, prefiere TorchScript válido, usa el checkpoint registrado como respaldo y mantiene cada modelo en caché. La disponibilidad concreta de esta instalación se consulta con `/models/status`.

## Entrenamiento y registro

`training/` contiene el motor reproducible de EfficientNet-B0, evaluación y exportación. El registro inicial incluye entradas `NOT_TRAINED`; los modelos entrenados se agregan localmente junto a sus checkpoints. El proceso de FastAPI necesita PyTorch/Torchvision instalados en su entorno, aunque permanezcan separados de `requirements.txt`.

Instrucciones: `docs/ai/INFERENCE_INTEGRATION.md`, `docs/ai/TRAINING_GUIDE.md` y `docs/ai/MODEL_REGISTRY.md`.


## Inicilizar servicio IA 
# Iniciamos FastAPI y mantenemos esta terminal abierta.
python -m uvicorn main:app --host 127.0.0.1 --port 8000