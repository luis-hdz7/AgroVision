import type { VisionInspection } from "../types/visionAI.types";

/** Etiquetas visibles sin fusionar enfermedades de cultivos distintos. */
export function formatVisionClassName(className: string): string {
  const labels: Record<string, string> = {
    healthy: "Hoja saludable",
    blight: "Tizón foliar",
    common_rust: "Roya común",
    gray_leaf_spot: "Mancha gris",
    black_spot: "Mancha negra",
    canker: "Cancro cítrico",
    greening: "Greening / HLB",
    melanose: "Melanosis",
    angular_leaf_spot: "Mancha angular",
    bean_rust: "Roya del frijol",
  };
  return labels[className] ?? className.replaceAll("_", " ");
}

export function formatVisionFinding(result: Pick<VisionInspection, "prediction" | "detectedClass">): string {
  return result.prediction === "UNKNOWN"
    ? "No concluyente"
    : formatVisionClassName(result.detectedClass);
}
