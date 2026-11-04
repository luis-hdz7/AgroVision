/**
 * =========================================
 * VisionAiPage
 * =========================================
 *
 * Módulo principal de análisis visual de AgroVision.
 *
 * Objetivos de esta versión:
 * - mantener el flujo real de Vision AI;
 * - convertir el área de análisis en un canvas protagonista;
 * - aplicar una arquitectura visual similar a Mapping GIS;
 * - mostrar controles y métricas como overlays flotantes;
 * - disponer de un inspector lateral plegable;
 * - mostrar telemetría visual del proceso mediante Recharts;
 * - iluminar el canvas durante el análisis;
 * - conservar evidencia e historial;
 * - mantener estados seguros mientras el backend responde.
 *
 * IMPORTANTE:
 * - NO modifica POST /api/vision/analyze;
 * - conserva el POST y su contrato VisionInspection;
 * - añade lectura validada del historial persistido;
 * - NO reemplaza resultados reales con datos inventados.
 *
 * La gráfica inferior representa únicamente progreso visual
 * del procesamiento de la interfaz mientras esperamos el
 * resultado del servicio. Cuando el backend exponga streaming,
 * podrá alimentarse directamente con esos datos.
 * =========================================
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "../../../shared/components/ui/MetricCard";
import { Panel } from "../../../shared/components/ui/Panel";
import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

import { getCropProfiles } from "../../crops/services/cropProfilesService";

import type {
  CropProfile,
  CropType,
} from "../../crops/types/cropProfile.types";

import { VisionResultCard } from "../components/VisionResultCard";

import {
  analyzeVisionImage,
  getVisionAnalysisImageUrl,
  VisionRequestError,
} from "../services/visionAIService";

import type {
  VisionAnalysisResult,
  VisionAnalysisStatus,
  VisionHistoryItem,
  VisionInspection,
} from "../types/visionAI.types";
import { formatVisionFinding } from "../utils/visionLabels";
import { useVisionHistory } from "../hooks/useVisionHistory";

// Consumimos las parcelas y la selección que ya comparte la barra superior.
import { useFields } from "../../fields/context/useFields";

import "../vision-ai.css";


/* ===========================================================
   CONSTANTES
   =========================================================== */

/**
 * Caso oficial utilizado actualmente por la demo.
 */

const DEFAULT_ZONE_ID = "zone-03";

// Contexto de la demo para los dos cultivos que tienen pesos reales instalados.
const TRAINED_CROP_CONTEXT: Partial<Record<CropType, { fieldId: string; zones: readonly string[] }>> = {
  ORANGE: { fieldId: "field-001", zones: ["zone-03", "zone-02", "zone-01"] },
  CORN: { fieldId: "field-002", zones: ["zone-04", "zone-05"] },
};

function getConfiguredCropType(fieldId: string | null): CropType | null {
  if (!fieldId) return null;
  const configured = Object.entries(TRAINED_CROP_CONTEXT).find(
    ([, context]) => context?.fieldId === fieldId,
  );
  return configured ? configured[0] as CropType : null;
}

const MAX_IMAGE_BYTES =
  10 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);


function VisionArchivedPhoto({ item, ordinal }: {
  readonly item: VisionHistoryItem;
  readonly ordinal: number;
}) {
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!item.hasImage || shouldLoad) return;
    const target = mediaRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "160px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [item.hasImage, shouldLoad]);

  return (
    <div ref={mediaRef} className="visionEvidenceCard__media">
      {item.hasImage && shouldLoad && !failed && (
        <img
          key={attempt}
          src={getVisionAnalysisImageUrl(item.inspectionId, item.fieldId)}
          alt={`Fotografía archivada del análisis ${item.inspectionId}`}
          className="visionEvidenceCard__image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      {!item.hasImage && (
        <span className="visionEvidenceCard__mediaState">Imagen no archivada</span>
      )}
      {item.hasImage && !shouldLoad && (
        <span className="visionEvidenceCard__mediaState">Fotografía pendiente de carga</span>
      )}
      {failed && (
        <span className="visionEvidenceCard__mediaState">
          No se pudo descargar
          <button
            type="button"
            onClick={() => {
              setAttempt((current) => current + 1);
              setFailed(false);
            }}
          >
            Reintentar
          </button>
        </span>
      )}
      <b>{ordinal}</b>
    </div>
  );
}


/* ===========================================================
   TELEMETRÍA VISUAL
   =========================================================== */

/**
 * Punto utilizado por la gráfica de progreso.
 *
 * No representa una métrica calculada por el modelo.
 * Es únicamente telemetría visual de la ejecución
 * del flujo desde la interfaz.
 */
interface VisionTimelinePoint {
  readonly sample: number;
  readonly value: number;
}


/* ===========================================================
   PÁGINA PRINCIPAL
   =========================================================== */

/** Asigna una identidad independiente al espacio de análisis de cada parcela. */
export function VisionAiPage() {
  const { selectedField } = useFields();

  // Cambiar la parcela reinicia los estados locales del espacio de análisis.
  return <VisionAiWorkspace key={selectedField?.id ?? "no-field"} />;
}

/** Contiene los controles, estados y operaciones del análisis visual. */
function VisionAiWorkspace() {
    // Leemos la misma selección de parcela utilizada por el resto de la aplicación.
  const { selectedField, isLoading: areFieldsLoading, error: fieldsError } = useFields();

  // selectedField pertenece al listado de parcelas obtenido desde el backend.
  const selectedFieldId = selectedField?.id ?? null;

  // Conservamos el formato GIS admitido por el servicio de Vision.
  const selectedFieldCode = selectedFieldId === null
    ? null
    : `field-${String(selectedFieldId).padStart(3, "0")}`;
  const initialCropType = getConfiguredCropType(selectedFieldCode) ?? "ORANGE";
  // Descarta respuestas antiguas si cambia la imagen, el cultivo o la zona.
  const analysisRequestId = useRef(0);
  /* -----------------------------------------
     Perfiles agrícolas
     ----------------------------------------- */

  const [profiles, setProfiles] =
    useState<ReadonlyArray<CropProfile>>([]);

  const [
    selectedCropType,
    setSelectedCropType,
  ] =
    useState<CropType>(initialCropType);

  const [
    selectedZoneId,
    setSelectedZoneId,
  ] =
    useState(TRAINED_CROP_CONTEXT[initialCropType]?.zones[0] ?? DEFAULT_ZONE_ID);

    // Este catálogo mantiene la configuración existente de los modelos de la demo.
  const selectedCropContext = TRAINED_CROP_CONTEXT[selectedCropType];

    // Ofrecemos las zonas de referencia únicamente para la parcela configurada.
    // Otras parcelas podrán analizarse sin asignarles una zona de la demo.
  const availableZoneIds = selectedCropContext && selectedCropContext.fieldId === selectedFieldCode ? selectedCropContext.zones : [];
  const effectiveZoneId = availableZoneIds.includes(selectedZoneId) ? selectedZoneId : null;
  const historyContext = useMemo(() => {
    if (!selectedFieldCode || selectedCropContext?.fieldId !== selectedFieldCode) return null;
    return {
      fieldId: selectedFieldCode,
      cropType: selectedCropType,
      zoneId: effectiveZoneId,
    };
  }, [effectiveZoneId, selectedCropContext, selectedCropType, selectedFieldCode]);

  /* -----------------------------------------
     Imagen
     ----------------------------------------- */

  const [
    imagePreviewUrl,
    setImagePreviewUrl,
  ] =
    useState<string | null>(null);


  /* -----------------------------------------
     Resultado
     ----------------------------------------- */

  const [
    analysisResult,
    setAnalysisResult,
  ] =
    useState<VisionAnalysisResult | null>(
      null,
    );

  const [
    analysisStatus,
    setAnalysisStatus,
  ] =
    useState<VisionAnalysisStatus>(
      "IDLE",
    );

  const [
    feedbackMessage,
    setFeedbackMessage,
  ] =
    useState<string | null>(null);


  /* -----------------------------------------
     Inspector visual
     ----------------------------------------- */

  const [
    isInspectorOpen,
    setIsInspectorOpen,
  ] =
    useState(true);


  /* -----------------------------------------
     Progreso visual de análisis
     ----------------------------------------- */

  const [
    analysisProgress,
    setAnalysisProgress,
  ] =
    useState(0);

  const [
    analysisTimeline,
    setAnalysisTimeline,
  ] =
    useState<
      ReadonlyArray<VisionTimelinePoint>
    >([
      {
        sample: 0,
        value: 0,
      },
    ]);

  const handleHistoryDetailLoaded = useCallback((result: VisionAnalysisResult): void => {
    // Un detalle recuperado invalida cualquier presentación anterior y no reutiliza su foto.
    ++analysisRequestId.current;
    setAnalysisResult(result);
    setImagePreviewUrl(null);
    setAnalysisStatus("RESULT");
    setAnalysisProgress(100);
    setAnalysisTimeline([{ sample: 0, value: 100 }]);
    setFeedbackMessage(null);
    setIsInspectorOpen(true);
  }, []);

  const handleHistoryDetailFailed = useCallback((message: string): void => {
    setAnalysisResult(null);
    setAnalysisStatus("ERROR");
    setAnalysisProgress(0);
    setFeedbackMessage(message);
  }, []);

  const visionHistory = useVisionHistory(
    historyContext,
    handleHistoryDetailLoaded,
    handleHistoryDetailFailed,
  );


  /* =========================================================
     CARGA DE PERFILES
     ========================================================= */

  useEffect(() => {
    async function loadProfiles() {
      try {
        const data =
          await getCropProfiles();

        setProfiles(data);
      } catch {
        setFeedbackMessage(
          "No se pudieron cargar los perfiles agrícolas.",
        );
      }
    }

    void loadProfiles();
  }, []);


  /* =========================================================
     LIBERACIÓN DE PREVIEW
     ========================================================= */

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(
          imagePreviewUrl,
        );
      }
    };
  }, [imagePreviewUrl]);


  /* =========================================================
     ANIMACIÓN VISUAL DURANTE ANÁLISIS
     =========================================================
     Mantiene la interfaz viva mientras esperamos backend.

     NO pretende representar progreso interno real del modelo.

     El servicio actual devuelve la respuesta completa al final.
     Cuando exista streaming real, esta misma visualización
     puede alimentarse con eventos del AI Service.
     ========================================================= */

  useEffect(() => {
    if (
      analysisStatus !== "ANALYZING"
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setAnalysisProgress(
          (currentProgress) => {
            const nextProgress =
              getNextAnalysisProgress(
                currentProgress,
              );

            setAnalysisTimeline(
              (currentTimeline) => [
                ...currentTimeline,
                {
                  sample:
                    currentTimeline.length,
                  value: nextProgress,
                },
              ].slice(-22),
            );

            return nextProgress;
          },
        );
      }, 140);

    return () => {
      window.clearInterval(interval);
    };
  }, [analysisStatus]);


  /* =========================================================
     COMPLETAR TELEMETRÍA
     ========================================================= */

  useEffect(() => {
    if (analysisStatus !== "RESULT") {
      return;
    }

  }, [analysisStatus]);


  /* =========================================================
     EJECUTAR ANÁLISIS
     ========================================================= */

    async function runAnalysis(file: File, fileName: string): Promise<void> {
    // Cada ejecución recibe una identidad que permite descartar respuestas antiguas.
    const requestId = ++analysisRequestId.current;
    // El POST nuevo tiene prioridad sobre cualquier detalle histórico pendiente.
    visionHistory.beginPost();

    /**
     * Limpiamos el resultado anterior para que
     * durante un nuevo análisis nunca aparezcan
     * datos pertenecientes a otra imagen.
     */
    setAnalysisResult(null);

    setAnalysisProgress(8);

    setAnalysisTimeline([
      { sample: 0, value: 3 },
      { sample: 1, value: 8 },
    ]);

    setAnalysisStatus("ANALYZING");
    setFeedbackMessage(null);
    setIsInspectorOpen(true);

    try {
      // Esperamos a disponer del contexto real de parcelas.
      if (areFieldsLoading) {
        throw new VisionRequestError("Espera a que termine la carga de parcelas.");
      }

      if (fieldsError !== null) {
        throw new VisionRequestError("No fue posible cargar las parcelas. Actualiza su listado e inténtalo de nuevo.");
      }

      // Una selección global de todos los campos no identifica una parcela concreta.
      if (selectedFieldCode === null) {
        throw new VisionRequestError("Selecciona una parcela en la barra superior antes de analizar una imagen.");
      }

      // Conservamos los modelos habilitados actualmente en esta pantalla.
      if (!selectedCropContext) {
        throw new VisionRequestError("El cultivo seleccionado no tiene un modelo configurado en esta pantalla.");
      }

      // Enviamos una zona únicamente cuando pertenece al contexto de referencia disponible.
      const zoneId = availableZoneIds.includes(selectedZoneId) ? selectedZoneId : null;

      const result = await analyzeVisionImage({
        cropType: selectedCropType,
        fieldId: selectedFieldCode,
        zoneId,
        imageFileName: fileName,
        imageFile: file,
      });

      // Un cambio de imagen, cultivo, zona o parcela invalida la presentación anterior.
      if (requestId !== analysisRequestId.current) return;

      setAnalysisResult(result);
      setAnalysisProgress(100);

      setAnalysisTimeline((currentTimeline) => [
        ...currentTimeline,
        { sample: currentTimeline.length, value: 100 },
      ].slice(-22));

      setAnalysisStatus("RESULT");
      // El POST ya fue confirmado; un fallo posterior solo afecta la lectura del historial.
      void visionHistory.refreshAfterPost(result.inspection);
    } catch (error: unknown) {
      // Una solicitud anterior tampoco debe sobrescribir el estado con un error tardío.
      if (requestId !== analysisRequestId.current) return;

      setAnalysisStatus("ERROR");
      setAnalysisProgress(0);
      setAnalysisTimeline([{ sample: 0, value: 0 }]);

      setFeedbackMessage(
        error instanceof VisionRequestError
          ? error.message
          : "No fue posible completar el análisis visual.",
      );
    }
  }

  /* =========================================================
     SELECCIÓN DE IMAGEN
     ========================================================= */

  function handleImageChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    // Permite volver a analizar el mismo archivo después de un error.
    event.target.value = "";
    ++analysisRequestId.current;
    setImagePreviewUrl(null);
    setAnalysisProgress(0);


    /* ---------------------------------------
       Validación de formato
       --------------------------------------- */

    if (
      !SUPPORTED_IMAGE_TYPES.has(
        file.type,
      )
    ) {
      setAnalysisResult(null);

      setAnalysisStatus("ERROR");

      setFeedbackMessage(
        "Selecciona una imagen JPEG, PNG o WebP.",
      );

      event.target.value = "";

      return;
    }


    /* ---------------------------------------
       Validación de tamaño
       --------------------------------------- */

    if (
      file.size >
      MAX_IMAGE_BYTES
    ) {
      setAnalysisResult(null);

      setAnalysisStatus("ERROR");

      setFeedbackMessage(
        "La imagen supera el límite permitido de 10 MB.",
      );

      event.target.value = "";

      return;
    }


    /* ---------------------------------------
       Preview
       --------------------------------------- */

    if (imagePreviewUrl) {
      URL.revokeObjectURL(
        imagePreviewUrl,
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreviewUrl(
      previewUrl,
    );


    /* ---------------------------------------
       Análisis automático
       --------------------------------------- */

    void runAnalysis(
      file,
      file.name,
    );
  }


  /* =========================================================
     CAMBIO DE CULTIVO
     ========================================================= */

  function handleCropChange(
    event:
      ChangeEvent<HTMLSelectElement>,
  ) {
    const cropType = event.target.value as CropType;
    setSelectedCropType(cropType);
    setSelectedZoneId(TRAINED_CROP_CONTEXT[cropType]?.zones[0] ?? DEFAULT_ZONE_ID);

    resetAnalysis();
  }


  /* =========================================================
     CAMBIO DE ZONA
     ========================================================= */

  function handleZoneChange(
    event:
      ChangeEvent<HTMLSelectElement>,
  ) {
    setSelectedZoneId(
      event.target.value,
    );

    resetAnalysis();
  }


  /* =========================================================
     RESET VISUAL
     ========================================================= */

  // Reiniciamos la presentación e invalidamos las respuestas de solicitudes anteriores.
  function resetAnalysis(): void {
    ++analysisRequestId.current;
    visionHistory.invalidateDetail();

    setAnalysisResult(null);
    setImagePreviewUrl(null);
    setAnalysisStatus("IDLE");
    setAnalysisProgress(0);
    setAnalysisTimeline([{ sample: 0, value: 0 }]);
    setFeedbackMessage(null);
  }

  function handleOpenHistoryItem(inspectionId: string): void {
    ++analysisRequestId.current;
    setAnalysisResult(null);
    setImagePreviewUrl(null);
    setAnalysisStatus("IDLE");
    setAnalysisProgress(0);
    setFeedbackMessage("Cargando análisis guardado...");
    void visionHistory.openDetail(inspectionId);
  }

  // Invalidamos las respuestas pendientes cuando se desmonta este espacio de análisis.
  useEffect(() => {
    const requestTracker = analysisRequestId;

    return () => {
      // La petición puede terminar en el servidor, pero su respuesta queda descartada aquí.
      ++requestTracker.current;
    };
  }, []);

  /* =========================================================
     DATOS DERIVADOS
     ========================================================= */

    // Presentamos únicamente un resultado correspondiente a la parcela seleccionada.
  const inspection = analysisResult?.inspection.fieldId === selectedFieldCode ? analysisResult.inspection : null;

  const confidencePercentage =
    inspection
      ? normalizeConfidence(
          inspection.confidence,
        )
      : 0;

  const detectedAnomalies =
    inspection &&
    inspection.prediction !==
      "HEALTHY" &&
    inspection.prediction !==
      "UNKNOWN"
      ? 1
      : 0;

  const analysisStage =
    getAnalysisStage(
      analysisProgress,
      analysisStatus,
    );


  return (
    <section className="avScreen visionFigma">

      {/* =====================================================
          TÍTULO
          ===================================================== */}

      <h1 className="avScreenTitle">
        Vision AI
      </h1>


      {/* =====================================================
          KPI SUPERIORES
          =====================================================
          Se conservan las MetricCard originales del módulo.
          ===================================================== */}

      <section className="avMetricGrid">

        <MetricCard
          title="Imágenes analizadas"
          value={
            inspection
              ? "100%"
              : "0%"
          }
          description={
            inspection
              ? "1 imagen analizada. Imagen procesada correctamente."
              : "Esperando imagen para análisis."
          }
          progress={
            inspection
              ? 100
              : analysisProgress
          }
          actionLabel="Ver todas las imágenes"
        />

        <MetricCard
          title="Anomalías detectadas"
          value={
            inspection
              ? "100%"
              : "0%"
          }
          description={
            detectedAnomalies
              ? "1 anomalía detectada. Patrón de estrés identificado."
              : "Sin anomalías confirmadas."
          }
          progress={
            detectedAnomalies
              ? 100
              : 0
          }
          tone="AMBER"
          actionLabel="Ver listado de anomalías"
        />

        <MetricCard
          title="Nivel de confianza"
          value={`${confidencePercentage}%`}
          description="Predicción"
          progress={
            confidencePercentage
          }
          tone="TEAL"
          actionLabel="Ver nivel de confianza promedio"
        />

      </section>


      {/* =====================================================
          WORKSPACE
          ===================================================== */}

      <section
        className={
          isInspectorOpen
            ? "visionFigma__workspace"
            : "visionFigma__workspace is-inspector-collapsed"
        }
      >

        {/* ===================================================
            COLUMNA PRINCIPAL
            =================================================== */}

        <div className="visionFigma__left">

          {/* ===============================================
              CANVAS PRINCIPAL
              =============================================== */}

          <Panel
            title="Carga y análisis de imagen"
            showInfo={false}
            className="visionHeroPanel"
          >

            <div
              className={[
                "visionAnalysisStage",
                analysisStatus ===
                "ANALYZING"
                  ? "is-analyzing"
                  : "",
                inspection
                  ? "has-result"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >

              {/* ===========================================
                  IMAGEN AGRÍCOLA
                  =========================================== */}

              <VisionImagePreview
                previewUrl={
                  imagePreviewUrl
                }
                inspection={
                  inspection
                }
                status={
                  analysisStatus
                }
                progress={
                  analysisProgress
                }
                stage={
                  analysisStage
                }
              />


              {/* ===========================================
                  CONTROLES FLOTANTES
                  =========================================== */}

              <div className="visionFigma__controls visionGlass">

                <label>

                  <span>
                    Cultivo
                  </span>

                  <select
                    value={
                      selectedCropType
                    }
                    onChange={
                      handleCropChange
                    }
                  >

                    {profiles.length ===
                      0 && (
                      <option value="ORANGE">
                        Naranjo
                      </option>
                    )}

                    {profiles.map(
                      (profile) => (
                        <option
                          key={
                            profile.cropType
                          }
                          value={
                            profile.cropType
                          }
                          disabled={!TRAINED_CROP_CONTEXT[profile.cropType]}
                        >
                          {
                            profile.displayName
                          }
                          {!TRAINED_CROP_CONTEXT[profile.cropType] && " (sin modelo)"}
                        </option>
                      ),
                    )}

                  </select>

                </label>


                <label>
                  <span>Zona</span>

                  <select
                    value={availableZoneIds.includes(selectedZoneId) ? selectedZoneId : ""}
                    onChange={handleZoneChange}
                    disabled={availableZoneIds.length === 0}
                  >
                    {/* Indicamos que esta parcela no dispone de zonas configuradas en la pantalla. */}
                    {availableZoneIds.length === 0 && (
                      <option value="">Sin zona configurada</option>
                    )}

                    {/* Conservamos las zonas de referencia del contexto correspondiente. */}
                    {availableZoneIds.map((zoneId) => (
                      <option key={zoneId} value={zoneId}>
                        Zona {zoneId.slice(-2)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="visionUploadButton">

                  <span
                    className="visionUploadButton__icon"
                    aria-hidden="true"
                  >
                    <UploadIcon />
                  </span>

                  <strong>
                    {analysisStatus === "ANALYZING"
                      ? "Analizando..."
                      : areFieldsLoading
                        ? "Cargando parcelas..."
                        : fieldsError !== null
                          ? "Parcelas no disponibles"
                          : selectedFieldCode === null
                            ? "Elige una parcela"
                            : "Subir imagen"}
                  </strong>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    // La carga requiere una parcela concreta y un contexto disponible.
                    disabled={
                      analysisStatus === "ANALYZING"
                      || areFieldsLoading
                      || fieldsError !== null
                      || selectedFieldCode === null
                    }
                    onChange={
                      handleImageChange
                    }
                  />

                </label>

              </div>


              {/* ===========================================
                  RESUMEN INFERIOR FLOTANTE
                  =========================================== */}

              <div className="visionCanvasStats">

                <VisionCanvasStat
                  icon={
                    <ScanIcon />
                  }
                  label="Predicción"
                  value={
                    inspection
                      ? formatVisionFinding(inspection)
                      : analysisStatus ===
                          "ANALYZING"
                        ? "Procesando"
                        : "Pendiente"
                  }
                  tone={
                    detectedAnomalies
                      ? "WARNING"
                      : "GREEN"
                  }
                />

                <VisionCanvasStat
                  icon={
                    <ActivityIcon />
                  }
                  label="Confianza"
                  value={
                    inspection
                      ? `${confidencePercentage}%`
                      : analysisStatus ===
                          "ANALYZING"
                        ? `${analysisProgress}%`
                        : "—"
                  }
                  tone="TEAL"
                />

                <VisionCanvasStat
                  icon={
                    <ZoneIcon />
                  }
                  label="Zona analizada"
                  value={
                    formatZone(
                      effectiveZoneId,
                    )
                  }
                  tone="GREEN"
                />

              </div>

            </div>


            {/* =============================================
                TELEMETRÍA / GRÁFICA
                ============================================= */}

            <VisionAnalysisTimeline
              status={
                analysisStatus
              }
              progress={
                analysisProgress
              }
              stage={
                analysisStage
              }
              data={
                analysisTimeline
              }
            />

          </Panel>


          {/* ===============================================
              EVIDENCIAS VISUALES
              =============================================== */}

          <Panel
            title="Evidencias visuales"
            showInfo={false}
            className="visionEvidencePanel"
          >

            {visionHistory.items.length > 0 ? (
              <>
                <div className="visionEvidenceGallery">
                  {visionHistory.items.map((historyItem, index) => (
                    <article
                      key={historyItem.inspectionId}
                      className="visionEvidenceCard"
                      aria-current={historyItem.inspectionId === visionHistory.selectedInspectionId
                        ? "true"
                        : undefined}
                    >
                      <VisionArchivedPhoto item={historyItem} ordinal={index + 1} />

                      <div className="visionEvidenceCard__body">
                        <div className="visionEvidenceCard__top">
                          <span>{formatDateTime(historyItem.createdAt)}</span>
                          <StatusBadge tone={getPredictionTone(historyItem.prediction)}>
                            {historyItem.prediction === "HEALTHY" ? "Normal" : "Advertencia"}
                          </StatusBadge>
                        </div>

                        <strong>{formatVisionFinding(historyItem)}</strong>
                        <p>{formatCrop(historyItem.cropType)} · {formatZone(historyItem.zoneId)}</p>

                        <footer>
                          <span>Confianza {normalizeConfidence(historyItem.confidence)}%</span>
                          <button
                            type="button"
                            className="avTextAction avActionButton"
                            onClick={() => handleOpenHistoryItem(historyItem.inspectionId)}
                          >
                            Abrir análisis
                          </button>
                        </footer>
                      </div>
                    </article>
                  ))}
                </div>

                {inspection && inspection.evidence.length > 0 && (
                  <div className="visionEvidenceSignals" aria-label="Señales del análisis seleccionado">
                    <strong>Señales del análisis seleccionado</strong>
                    <ul>
                      {inspection.evidence.map((evidence, index) => (
                        <li key={`${evidence.metric}-${index}`}>
                          <span>{evidence.metric}</span>
                          <b>{formatEvidenceStatus(evidence.status)}</b>
                          <p>{evidence.explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="visionCompactEmpty">

                <span
                  className="visionCompactEmpty__icon"
                  aria-hidden="true"
                >
                  <ScanIcon />
                </span>

                <strong>
                  Evidencia pendiente
                </strong>

                <p>
                  Selecciona una imagen para generar regiones y señales visuales.
                </p>

              </div>
            )}

          </Panel>

        </div>


        {/* ===================================================
            INSPECTOR LATERAL
            =================================================== */}

        {isInspectorOpen ? (
          <aside className="visionFigma__right visionInspector">

            {/* =============================================
                HEADER DEL INSPECTOR
                ============================================= */}

            <div className="visionInspector__header">

              <div>

                <span
                  className="visionInspector__headerIcon"
                  aria-hidden="true"
                >
                  <InspectorIcon />
                </span>

                <div>
                  <small>
                    INSPECTOR
                  </small>

                  <strong>
                    Análisis visual
                  </strong>
                </div>

              </div>


              <div className="visionInspector__actions">

                {analysisResult && (
                  <span
                    className={[
                      "visionInspector__source",
                      analysisResult.source ===
                      "BACKEND"
                        ? "is-live"
                        : "is-fallback",
                    ].join(" ")}
                  >
                    {analysisResult.source ===
                    "BACKEND"
                      ? "Backend"
                      : "Respaldo"}
                  </span>
                )}


                <button
                  type="button"
                  className="visionInspector__close"
                  aria-label="Cerrar inspector"
                  onClick={() =>
                    setIsInspectorOpen(
                      false,
                    )
                  }
                >
                  ×
                </button>

              </div>

            </div>


            {/* =============================================
                CONTENIDO
                ============================================= */}

            <div className="visionInspector__body">

              {inspection && analysisResult ? (
                <VisionResultCard
                  result={inspection}
                  source={analysisResult.source}
                  fallbackReason={analysisResult.fallbackReason}
                />
              ) : (
                <VisionResultPlaceholder
                  status={analysisStatus}
                  message={feedbackMessage}
                  progress={analysisProgress}
                />
              )}

            </div>

          </aside>
        ) : (
          <button
            type="button"
            className="visionInspectorTrigger visionGlass"
            onClick={() =>
              setIsInspectorOpen(
                true,
              )
            }
          >
            <InspectorIcon />

            <span>
              Abrir inspector
            </span>
          </button>
        )}

      </section>


      {/* =====================================================
          HISTORIAL
          ===================================================== */}

      <Panel
        title="Historial de análisis"
        showInfo={false}
        className="visionHistoryPanel"
      >

        {visionHistory.items.length > 0 ? (
          <div className="avTableWrap">

            <table className="avTable visionHistoryTable">

              <thead>
                <tr>
                  <th>
                    Fecha y hora
                  </th>

                  <th>
                    Cultivo
                  </th>

                  <th>
                    Zona
                  </th>

                  <th>
                    Predicción
                  </th>

                  <th>
                    Confianza
                  </th>

                  <th>
                    Severidad
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Analizado por
                  </th>
                </tr>
              </thead>


              <tbody>

                {visionHistory.items.map((historyItem) => {
                  const historyConfidence = normalizeConfidence(historyItem.confidence);
                  const isSelected = historyItem.inspectionId === visionHistory.selectedInspectionId;
                  return (
                <tr key={historyItem.inspectionId} aria-selected={isSelected}>

                  <td>
                    {formatDateTime(
                      historyItem.createdAt,
                    )}
                  </td>

                  <td>
                    {formatCrop(
                      historyItem.cropType,
                    )}
                  </td>

                  <td>
                    {formatZone(
                      historyItem.zoneId,
                    )}
                  </td>

                  <td className="visionHistoryPrediction">
                    <button
                      type="button"
                      className="avTextAction avActionButton"
                      onClick={() => handleOpenHistoryItem(historyItem.inspectionId)}
                      disabled={isSelected && visionHistory.detailStatus === "LOADING"}
                      aria-label={`Abrir análisis ${historyItem.inspectionId}`}
                    >
                      {formatVisionFinding(historyItem)}
                      {isSelected ? " · Seleccionado" : " · Abrir"}
                    </button>
                  </td>

                  <td>

                    <div className="visionConfidenceCell">

                      <span>
                        {
                          historyConfidence
                        }
                        %
                      </span>

                      <i>
                        <b
                          style={{
                            width: `${historyConfidence}%`,
                          }}
                        />
                      </i>

                    </div>

                  </td>

                  <td>
                    —
                  </td>

                  <td>
                    <StatusBadge
                      tone={getPredictionTone(
                        historyItem.prediction,
                      )}
                    >
                      {historyItem.prediction ===
                      "HEALTHY"
                        ? "Normal"
                        : "Advertencia"}
                    </StatusBadge>
                  </td>

                  <td>
                    Vision AI
                  </td>

                </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        ) : (
          <div className="visionCompactEmpty">

            <span
              className="visionCompactEmpty__icon"
              aria-hidden="true"
            >
              <HistoryIcon />
            </span>

            <strong>
              {visionHistory.status === "INACTIVE"
                ? "Selecciona una parcela y contexto configurados"
                : visionHistory.status === "LOADING"
                  ? "Cargando historial"
                  : visionHistory.status === "ERROR"
                    ? "No fue posible cargar el historial"
                    : "Sin análisis registrados"}
            </strong>

            <p>
              {visionHistory.error
                ?? "Los análisis guardados aparecerán aquí sin ejecutar una inferencia nueva."}
            </p>

            {visionHistory.status === "ERROR" && (
              <button
                type="button"
                className="avTextAction avActionButton"
                onClick={() => void visionHistory.retry()}
              >
                Reintentar
              </button>
            )}

          </div>
        )}


        {visionHistory.paginationError && (
          <p role="alert">{visionHistory.paginationError}</p>
        )}

        {visionHistory.nextCursor && (
          <button
            type="button"
            className="avTextAction visionCenteredAction avActionButton"
            onClick={() => void visionHistory.loadMore()}
            disabled={visionHistory.isLoadingMore}
          >
            {visionHistory.isLoadingMore ? "Cargando..." : "Cargar más"}
          </button>
        )}

      </Panel>

    </section>
  );
}


/* ===========================================================
   COMPONENTE — PREVIEW PRINCIPAL
   =========================================================== */

/**
 * Canvas visual.
 *
 * Durante el análisis:
 * - ilumina la superficie;
 * - muestra línea de escaneo;
 * - presenta loader;
 * - oculta regiones definitivas.
 *
 * Después:
 * - presenta zonas de evidencia.
 */
function VisionImagePreview({
  previewUrl,
  inspection,
  status,
  progress,
  stage,
}: {
  readonly previewUrl:
    | string
    | null;

  readonly inspection:
    | VisionInspection
    | null;

  readonly status:
    VisionAnalysisStatus;

  readonly progress:
    number;

  readonly stage:
    string;
}) {
  return (
    <div
      className={[
        "visionImagePreview",

        previewUrl
          ? "has-image"
          : "",

        status ===
        "ANALYZING"
          ? "is-analyzing"
          : "",

        inspection
          ? "has-result"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* -------------------------------------
          Imagen
          ------------------------------------- */}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Imagen agrícola seleccionada para análisis visual"
        />
      )}


      {/* -------------------------------------
          Empty
          ------------------------------------- */}

      {!previewUrl && (
        <div className="visionImagePreview__empty">

          <span aria-hidden="true">
            <ScanIcon />
          </span>

          <strong>
            Imagen agrícola
          </strong>

          <small>
            Sube una imagen para iniciar el análisis preliminar.
          </small>

        </div>
      )}


      {/* -------------------------------------
          Escaneo activo
          ------------------------------------- */}

      {status ===
        "ANALYZING" &&
        previewUrl && (
          <>
            <div className="visionImagePreview__scanBeam" />

            <div className="visionAnalysisLoader visionGlass">

              <span className="visionAnalysisLoader__spinner">
                <VisionSpinner />
              </span>

              <div>
                <small>
                  ANALIZANDO
                </small>

                <strong>
                  {stage}
                </strong>
              </div>

              <b>
                {progress}%
              </b>

            </div>
          </>
        )}


      {/* -------------------------------------
          Evidencias después del análisis
          ------------------------------------- */}

      {previewUrl &&
        inspection && (
          <>
            <div className="visionImagePreview__marker visionImagePreview__marker--one">
              1
            </div>

            <div className="visionImagePreview__marker visionImagePreview__marker--two">
              2
            </div>

            <div className="visionImagePreview__marker visionImagePreview__marker--three">
              3
            </div>


            <div className="visionImagePreview__area visionImagePreview__area--one" />

            <div className="visionImagePreview__area visionImagePreview__area--two" />

            <div className="visionImagePreview__area visionImagePreview__area--three" />
          </>
        )}


      {/* -------------------------------------
          Herramientas visuales
          ------------------------------------- */}

      <div className="visionImagePreview__mapControls">

        <button
          type="button"
          aria-label="Acercar"
        >
          +
        </button>

        <button
          type="button"
          aria-label="Alejar"
        >
          −
        </button>

        <button
          type="button"
          aria-label="Ajustar imagen"
        >
          <FitIcon />
        </button>

      </div>


      {/* -------------------------------------
          Etiqueta de resultado
          ------------------------------------- */}

      {inspection && (
        <span className="visionImagePreview__file">
          {formatVisionFinding(inspection)}
        </span>
      )}

    </div>
  );
}


/* ===========================================================
   COMPONENTE — STAT DEL CANVAS
   =========================================================== */

function VisionCanvasStat({
  icon,
  label,
  value,
  tone,
}: {
  readonly icon:
    React.ReactNode;

  readonly label:
    string;

  readonly value:
    string;

  readonly tone:
    "GREEN" |
    "TEAL" |
    "WARNING";
}) {
  return (
    <article
      className={`visionCanvasStat visionCanvasStat--${tone.toLowerCase()}`}
    >

      <span
        className="visionCanvasStat__icon"
        aria-hidden="true"
      >
        {icon}
      </span>

      <div>

        <span>
          {label}
        </span>

        <strong
          title={value}
        >
          {value}
        </strong>

      </div>

    </article>
  );
}


/* ===========================================================
   COMPONENTE — GRÁFICA DE PROCESAMIENTO
   =========================================================== */

/**
 * Utiliza Recharts real.
 *
 * El gráfico se alimenta progresivamente mientras
 * analysisStatus === ANALYZING.
 *
 * Actualmente representa avance visual de ejecución.
 * No se presenta como una métrica científica del modelo.
 */
function VisionAnalysisTimeline({
  status,
  progress,
  stage,
  data,
}: {
  readonly status:
    VisionAnalysisStatus;

  readonly progress:
    number;

  readonly stage:
    string;

  readonly data:
    ReadonlyArray<VisionTimelinePoint>;
}) {
  return (
    <section
      className={[
        "visionAnalysisChart",
        `visionAnalysisChart--${status.toLowerCase()}`,
      ].join(" ")}
    >

      <header className="visionAnalysisChart__header">

        <div>

          <span
            className="visionAnalysisChart__icon"
            aria-hidden="true"
          >
            <ActivityIcon />
          </span>

          <div>

            <small>
              TELEMETRÍA DE PROCESAMIENTO
            </small>

            <strong>
              Actividad de análisis
            </strong>

          </div>

        </div>


        <div className="visionAnalysisChart__status">

          <span
            className={
              status ===
              "ANALYZING"
                ? "is-live"
                : ""
            }
          />

          <div>

            <small>
              {stage}
            </small>

            <strong>
              {progress}%
            </strong>

          </div>

        </div>

      </header>


      <div className="visionAnalysisChart__body">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={[...data]}
            margin={{
              top: 10,
              right: 6,
              bottom: 0,
              left: 6,
            }}
          >

            <defs>

              <linearGradient
                id="visionAnalysisGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#15b7a9"
                  stopOpacity={0.62}
                />

                <stop
                  offset="55%"
                  stopColor="#a7d91e"
                  stopOpacity={0.30}
                />

                <stop
                  offset="100%"
                  stopColor="#a7d91e"
                  stopOpacity={0.03}
                />

              </linearGradient>

            </defs>


            <CartesianGrid
              vertical={false}
              stroke="rgba(61, 93, 76, 0.13)"
              strokeDasharray="4 5"
            />


            <XAxis
              dataKey="sample"
              hide
            />


            <YAxis
              domain={[0, 100]}
              hide
            />


            <Tooltip
              cursor={{
                stroke:
                  "rgba(21, 91, 68, 0.25)",
                strokeDasharray:
                  "4 4",
              }}
            />


            <Area
              type="monotone"
              dataKey="value"
              stroke="#15b7a9"
              strokeWidth={2.6}
              fill="url(#visionAnalysisGradient)"
              dot={{
                r: 2.6,
                fill:
                  "#a7d91e",
                stroke:
                  "#ffffff",
                strokeWidth:
                  1.4,
              }}
              activeDot={{
                r: 4.8,
                fill:
                  "#15b7a9",
                stroke:
                  "#ffffff",
                strokeWidth:
                  2,
              }}
              isAnimationActive
              animationDuration={180}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}


/* ===========================================================
   COMPONENTE — PLACEHOLDER DEL INSPECTOR
   =========================================================== */

function VisionResultPlaceholder({
  status,
  message,
  progress,
}: {
  readonly status:
    VisionAnalysisStatus;

  readonly message:
    string | null;

  readonly progress:
    number;
}) {
  return (
    <>

      {/* -------------------------------------
          Resultado
          ------------------------------------- */}

      <Panel
        title="Resultado preliminar"
        showInfo={false}
      >

        <div className="visionResultRows visionResultRows--placeholder">

          <ResultPlaceholderRow
            label="Predicción"
          />

          <ResultPlaceholderRow
            label="Confianza"
          />

          <ResultPlaceholderRow
            label="Cultivo"
          />

          <ResultPlaceholderRow
            label="Zona analizada"
          />

          <ResultPlaceholderRow
            label="Estado"
          />

        </div>

      </Panel>


      {/* -------------------------------------
          Métricas
          ------------------------------------- */}

      <Panel
        title="Resultados del análisis"
        showInfo={false}
      >

        {status ===
        "ANALYZING" ? (
          <div className="visionMetricsAnalyzing">

            <span className="visionMetricsAnalyzing__orb">
              <VisionSpinner />
            </span>

            <strong>
              Procesando imagen
            </strong>

            <p>
              Clasificando la hoja y calculando puntuaciones del modelo.
            </p>

            <div className="visionMetricsAnalyzing__progress">

              <i>
                <b
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </i>

              <span>
                {progress}%
              </span>

            </div>

          </div>
        ) : (
          <div className="visionMetricsPlaceholder">

            <ScanIcon />

            <strong>
              {status === "ERROR" ? "Métricas no disponibles" : "Sin métricas todavía"}
            </strong>

            <span>
              {status === "ERROR" ? "El análisis no terminó; revisa el aviso inferior." : "Esperando análisis visual."}
            </span>

          </div>
        )}

      </Panel>


      {/* -------------------------------------
          Notice
          ------------------------------------- */}

      <div
        className={`visionPreliminaryNotice visionPreliminaryNotice--${status.toLowerCase()}`}
      >

        <span aria-hidden="true">

          {status ===
          "ANALYZING" ? (
            <VisionSpinner />
          ) : (
            <ScanIcon />
          )}

        </span>

        <div>

          <strong>
            {status ===
            "ANALYZING"
              ? "Procesando imagen"
              : status ===
                  "ERROR"
                ? "Análisis no disponible"
                : "Resultado preliminar"}
          </strong>

          <p>
            {message ??
              (
                status ===
                "ANALYZING"
                  ? "Vision AI está evaluando la imagen seleccionada."
                  : "Selecciona una imagen para generar un análisis visual preliminar."
              )}
          </p>

        </div>

      </div>

    </>
  );
}


/* ===========================================================
   COMPONENTE — ROW PLACEHOLDER
   =========================================================== */

function ResultPlaceholderRow({
  label,
}: {
  readonly label:
    string;
}) {
  return (
    <div>

      <strong>
        {label}
      </strong>

      <span>
        —
      </span>

    </div>
  );
}


/* ===========================================================
   ICONOS INLINE
   ===========================================================
   Se mantienen dentro del componente para no introducir
   nuevas dependencias ni rutas de assets en esta etapa.
   =========================================================== */

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15V4m0 0L8 8m4-4 4 4M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ScanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
}


function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ZoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="10"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function FitIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function InspectorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 4v16M13 9h4M13 13h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 8v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


/**
 * Loader SVG utilizado durante inferencia.
 *
 * La rotación y el glow los controlará vision-ai.css.
 */
function VisionSpinner() {
  return (
    <svg
      className="visionSpinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.22"
      />

      <path
        d="M12 4a8 8 0 0 1 8 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}


/* ===========================================================
   HELPERS — PROGRESO
   =========================================================== */

/**
 * Incremento deliberadamente rápido.
 *
 * Se detiene alrededor de 94% mientras espera
 * el resultado real del servicio.
 *
 * De esta forma:
 * - nunca afirma que el modelo terminó antes de hacerlo;
 * - la demo mantiene sensación de respuesta inmediata.
 */
function getNextAnalysisProgress(
  current:
    number,
): number {
  if (current >= 94) {
    return 94;
  }

  if (current < 28) {
    return Math.min(
      current + 8,
      94,
    );
  }

  if (current < 58) {
    return Math.min(
      current + 5,
      94,
    );
  }

  if (current < 82) {
    return Math.min(
      current + 3,
      94,
    );
  }

  return Math.min(
    current + 1,
    94,
  );
}


/**
 * Etapas puramente visuales del proceso.
 */
function getAnalysisStage(
  progress:
    number,

  status:
    VisionAnalysisStatus,
): string {
  if (status === "RESULT") {
    return "Análisis completado";
  }

  if (status === "ERROR") {
    return "Proceso detenido";
  }

  if (status === "IDLE") {
    return "Listo para analizar";
  }

  if (progress < 24) {
    return "Preparando imagen";
  }

  if (progress < 48) {
    return "Extrayendo regiones";
  }

  if (progress < 70) {
    return "Evaluando señales";
  }

  if (progress < 88) {
    return "Clasificando patrones";
  }

  return "Consolidando resultado";
}


/* ===========================================================
   HELPERS — DATOS
   =========================================================== */

function normalizeConfidence(
  value:
    number,
): number {
  return Math.round(
    value <= 1
      ? value * 100
      : value,
  );
}


function formatCrop(
  value:
    string,
): string {
  if (value === "CORN") {
    return "Maíz";
  }

  if (value === "ORANGE") {
    return "Naranjo";
  }

  if (value === "RED_BEAN") {
    return "Frijol rojo";
  }

  if (value === "CASSAVA") {
    return "Yuca";
  }

  if (value === "QUEQUISQUE") {
    return "Quequisque";
  }

  if (value === "SORGHUM") {
    return "Sorgo";
  }

  return value.replaceAll(
    "_",
    " ",
  );
}


function formatZone(
  value?:
    string | null,
): string {
  if (!value) {
    return "—";
  }

  return value.replace(
    "zone-",
    "Zona ",
  );
}


function formatEvidenceStatus(
  status:
    string,
): string {
  if (status === "NORMAL") {
    return "Normal";
  }

  if (status === "WATCH") {
    return "Vigilancia";
  }

  if (status === "CRITICAL") {
    return "Crítica";
  }

  return "Advertencia";
}


function getPredictionTone(
  prediction:
    string,
):
  | "SUCCESS"
  | "WARNING"
  | "DANGER" {
  if (
    prediction === "HEALTHY"
  ) {
    return "SUCCESS";
  }

  if (
    prediction === "UNKNOWN"
  ) {
    return "WARNING";
  }

  return "WARNING";
}


function formatDateTime(
  value:
    string,
): string {
  return new Intl.DateTimeFormat(
    "es-NI",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );
}
