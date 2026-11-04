/** Notificación efímera para invalidar consumidores después de un POST confirmado. */

import type { CropType } from "../../crops/types/cropProfile.types";

export interface VisionAnalysisConfirmedEvent {
  readonly inspectionId: string;
  readonly fieldId: string;
  readonly cropType: CropType;
  readonly zoneId: string | null;
  readonly createdAt: string;
}

type VisionAnalysisConfirmedListener = (event: VisionAnalysisConfirmedEvent) => void;

const listeners = new Set<VisionAnalysisConfirmedListener>();

export function subscribeToVisionAnalysisConfirmed(
  listener: VisionAnalysisConfirmedListener,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishVisionAnalysisConfirmed(event: VisionAnalysisConfirmedEvent): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch {
      // Un consumidor no puede transformar un POST ya confirmado en un fallo.
    }
  }
}
