/**
 * =========================================
 * VisionAiPage
 * =========================================
 *
 * Es la pantalla base de Vision AI.
 *
 * Finalidad:
 * - permitir seleccionar cultivo;
 * - simular subida de imagen;
 * - ejecutar análisis visual mock vía service;
 * - mostrar predicción, confianza, métricas y recomendación.
*/

import { useEffect, useState } from "react";
import { getCropProfiles } from "../../crops/services/cropProfilesService";
import type { CropProfile, CropType } from "../../crops/types/cropProfile.types";
import { VisionResultCard } from "../components/VisionResultCard";
import { analyzeVisionImage } from "../services/visionAIService";
import type { VisionInspection } from "../types/visionAi.types";
import "../vision-ai.css";

export function VisionAiPage() {
   const [profiles, setProfiles] = useState<ReadonlyArray<CropProfile>>([]);
   const [selectedCropType, setSelectedCropType] = useState<CropType>("ORANGE");
   const [imageFileName, setImageFileName] = useState("orange-zone-03.jpg");
   const [result, setResult] = useState<VisionInspection | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);

   // Carga los perfiles de cultivo para alimentar el sector de cultivos.

    useEffect(() => {
      async function loadProfiles() {
        const data = await getCropProfiles();
        setProfiles(data);
      }

      void loadProfiles();

    }, []);

    async function handleAnalyze() {
      setIsAnalyzing(true);

      try {
        const analysis = await analyzeVisionImage({
          cropType: selectedCropType,
          fieldId: "field-001",
          zoneId: "zone-03",
          imageFileName,
        });

        setResult(analysis);
      } finally {
        setIsAnalyzing(false);
      }
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
       const file = event.target.files?.[0];

       if (!file) return;

       setImageFileName(file.name);
    }

    return (
        <section className="visionAiPage" aria-labelledby="vision-ai-title">
            <header className="visionAiHero">
                <div>
                    <p className="visionAiHero__eyebrow">Vision AI</p>
                    <h1 id="vision-ai-title">Análisis visual preliminar</h1>
                    <span>
                       Simula el flujo de imagen, cultivo, predicción, confianza, métricas
                       visuales y recomendación asociada. No representa diagnóstico
                       definitivo.
                    </span>
                </div>
            </header>

            <section className="visionAiGrid">
                <article className="visionAiPanel">
                    <header>
                       <p>Input visual</p>
                       <h2>Simular análisis</h2>
                    </header>

                    <label className="visionAiField">
                        <span>Crop type</span>

                        <select
                        value={selectedCropType}
                        onChange={(event) =>
                            setSelectedCropType(event.target.value as CropType)
                        }>
                           {profiles.map((profile) => (
                              <option key={profile.cropType} value={profile.cropType}>
                                {profile.displayName} — {profile.cropType}
                              </option>
                            ))}
                        </select>
                    </label>

                    <label className="visionAiField">
                        <span>Image file</span>

                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>

                    <div className="visionAiMockPreview">
                        <span>Selected file</span>
                        <strong>{imageFileName}</strong>
                        <small>Mock upload. No real image processing yet.</small>
                    </div>

                    <button
                      type="button"
                      className="visionAiButton"
                      disabled={isAnalyzing}
                      onClick={handleAnalyze}
                    >
                      {isAnalyzing ? "Analyzing..." : "Run mock analysis"}
                    </button>
                </article>

                {result ? (
                <VisionResultCard result={result} />) : (
                    <article className="visionAiEmptyState">
                       <p>Esperando análisis visual</p>
                       <span>
                        Selecciona un cultivo, simula una imagen y ejecuta el análisis
                        mock.
                       </span>
                    </article>
                )} 
            </section>
        </section>
    );


}