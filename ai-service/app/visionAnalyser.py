from app.schemas import (
    VisionAnalyzeRequest,VisionAnalyzeResponse,VisionEvidence
)

def analyze_image(request: VisionAnalyzeRequest) -> VisionAnalyzeResponse:
    # Realiza un análisis visual preliminar basado enlógica simple.
    # Este módulo sirve como demostración de la arquitectura del AI Service.
    # No representa un modelo de inteligencia artificial entrenado.

    image_name = request.image.lower()

    if "dry" in image_name:
        prediction = "DRY_AREA"
        confidence = 0.91
        explanation = "Visual patterns compatible with dry areas were detected."
        recommendation = "Inspect irrigation coverage and verify soil moisture."

    elif "chlorosis" in image_name:
        prediction = "CHLOROSIS"
        confidence = 0.89
        explanation = "Yellowing patterns compatible with chlorosis were detected."
        recommendation = "Evaluate nutrient availability and inspect affected plants."

    elif "spot" in image_name:
        prediction = "LEAF_SPOT"
        confidence = 0.86
        explanation = "Leaf spot patterns were identified during visual inspection."
        recommendation = "Perform field inspection and evaluate disease presence."

    elif "water" in image_name:
        prediction = "WATER_STRESS"
        confidence = 0.93
        explanation = "Visual indicators suggest possible water stress."
        recommendation = "Increase irrigation and monitor vegetation health."

    elif "healthy" in image_name:
        prediction = "HEALTHY"
        confidence = 0.97
        explanation = "No significant visual anomalies were detected."
        recommendation = "Continue regular monitoring."

    else:
        prediction = "UNKNOWN"
        confidence = 0.50
        explanation = "The image does not provide enough information for classification."
        recommendation = "Perform a manual field inspection."

    evidence = [
        VisionEvidence(metric = "visual_pattern", value = prediction, explanation = explanation,)
    ]

    return VisionAnalyzeResponse(prediction = prediction, confidence = confidence, metrics = ["visual_pattern"], evidence = evidence, explanation = explanation, recommendation = recommendation,)