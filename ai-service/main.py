from fastapi import FastAPI
from app.schemas import VisionAnalizeRequest, VisionAnalyzeResponse
from app.visionAnalyser import analyze_image

app = FastAPI()

@app.get("/health")

def check_health():
    return {
        "status": "UP"
    }

#lo que llega al body se convierte en un objeto visionanalyzerequest
@app.post("/vision/analyze", response_model = VisionAnalyzeResponse)
def analyze(request: VisionAnalizeRequest):
    return analyze_image(request)

