"""
Analizador visual preliminar.

Este módulo utiliza reglas heurísticas sencillas para simular una inspección visual mediante inteligencia artificial.
Sus predicciones solo pretenden servir como indicio preliminar para el motor de riesgo prescriptivo
y no deben interpretarse como diagnósticos agronómicos definitivos.
"""

from app.schemas import (
    VisionAnalyzeRequest,
    VisionAnalyzeResponse,
    VisionEvidence,
)


def analyze_image(request: VisionAnalyzeRequest) -> VisionAnalyzeResponse:
    """
    Realiza un análisis visual preliminar utilizando reglas heurísticas sencillas.

    Este módulo muestra la arquitectura del Servicio de IA y no constituye
    un modelo de inteligencia artificial entrenado ni un diagnóstico agronómico definitivo.
    """

    image_name = request.image.lower()

    if "dry" in image_name:
        prediction = "DRY_AREA"
        confidence = 0.81
        explanation = (
            "Visual patterns compatible with dry areas were detected. "
            "Field verification is recommended."
        )
        recommendation = (
            "Inspect irrigation coverage and evaluate soil moisture conditions."
        )

    elif "chlorosis" in image_name:
        prediction = "CHLOROSIS"
        confidence = 0.79
        explanation = (
            "Visual patterns compatible with chlorosis were identified. "
            "This preliminary observation should be confirmed in the field."
        )
        recommendation = (
            "Evaluate nutrient availability and inspect affected plants."
        )

    elif "spot" in image_name:
        prediction = "LEAF_SPOT"
        confidence = 0.76
        explanation = (
            "Visual patterns compatible with leaf spot symptoms were detected. "
            "Technical field validation is recommended."
        )
        recommendation = (
            "Inspect affected leaves and evaluate whether additional agronomic assessment is required."
        )

    elif "water" in image_name:
        prediction = "WATER_STRESS"
        confidence = 0.83
        explanation = (
            "Visual signals compatible with water stress were detected. "
            "Field validation is recommended."
        )
        recommendation = (
            "Inspect irrigation conditions and verify soil moisture before applying corrective actions."
        )

    elif "healthy" in image_name:
        prediction = "HEALTHY"
        confidence = 0.84
        explanation = (
            "No significant visual anomalies were detected during the preliminary inspection."
        )
        recommendation = (
            "Continue routine monitoring and periodic field inspections."
        )

    else:
        prediction = "UNKNOWN"
        confidence = 0.62
        explanation = (
            "The available image does not provide sufficient visual information for a preliminary classification."
        )
        recommendation = (
            "Capture a clearer image or perform a manual field inspection."
        )

    metric_map = {
        "HEALTHY": "visual_health",
        "WATER_STRESS": "water_stress_signal",
        "CHLOROSIS": "chlorosis_signal",
        "DRY_AREA": "dry_area_signal",
        "LEAF_SPOT": "leaf_spot_signal",
        "UNKNOWN": "visual_classification",
    }

    metric = metric_map[prediction]

    evidence = [
        VisionEvidence(
            metric=metric,
            value=prediction,
            explanation=explanation,
        )
    ]

    return VisionAnalyzeResponse(
        prediction=prediction,
        confidence=confidence,
        metrics=[metric],
        evidence=evidence,
        explanation=explanation,
        recommendation=recommendation,
    )