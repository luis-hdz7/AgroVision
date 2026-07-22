from pydantic import BaseModel
from typing import List, Optional, Literal

class VisionAnalyzeRequest(BaseModel):
    
    #Solicitud para realizar un análisis visual preliminar.
    #En esta primera versión recibe la referenciade una imagen (ruta, nombre o identificador).
    image: str

class VisionEvidence(BaseModel):
    # Evidencia utilizada para respaldar la predicción.

    metric: str
    value: str
    explanation: str

class VisionAnalyzeResponse(BaseModel):
    # Resultado del análisis visual preliminar.

    prediction: Literal[
        "HEALTHY",
        "WATER_STRESS",
        "CHLOROSIS",
        "DRY_AREA",
        "LEAF_SPOT",
        "UNKNOWN",
    ]

    confidence: float
    metrics: List[str]
    evidence: List[VisionEvidence]
    explanation: str
    recommendation: str