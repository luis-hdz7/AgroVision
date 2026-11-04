/** Historial Vision independiente del resto de estados y mocks de Dashboard. */

import { useCallback, useEffect, useState } from "react";

import { ApiGetError } from "../../../shared/api/apiClient.ts";
import {
  subscribeToVisionAnalysisConfirmed,
  type VisionAnalysisConfirmedEvent,
} from "../../vision-ai/services/visionAnalysisEvents.ts";
import { getVisionHistory } from "../../vision-ai/services/visionAIService.ts";
import type {
  VisionHistoryItem,
  VisionHistoryPage,
} from "../../vision-ai/types/visionAI.types";

export type DashboardVisionEvidenceStatus =
  | "SELECT_FIELD"
  | "LOADING"
  | "READY"
  | "EMPTY"
  | "ERROR";

export interface DashboardVisionEvidenceState {
  readonly status: DashboardVisionEvidenceStatus;
  readonly items: ReadonlyArray<VisionHistoryItem>;
  readonly error: string | null;
}

type HistoryLoader = (
  fieldId: string,
  signal: AbortSignal,
) => Promise<VisionHistoryPage>;

type EventSubscriber = (
  listener: (event: VisionAnalysisConfirmedEvent) => void,
) => () => void;

const SELECT_FIELD_STATE: DashboardVisionEvidenceState = {
  status: "SELECT_FIELD",
  items: [],
  error: null,
};

/** Coordinador exportado para comprobar cancelación, eventos y desmontaje sin DOM. */
export class DashboardVisionEvidenceController {
  private fieldId: string | null = null;
  private request: AbortController | null = null;
  private requestVersion = 0;
  private unsubscribe: (() => void) | null = null;
  private disposed = false;
  private readonly onState: (state: DashboardVisionEvidenceState) => void;
  private readonly load: HistoryLoader;
  private readonly subscribe: EventSubscriber;

  public constructor(
    onState: (state: DashboardVisionEvidenceState) => void,
    load: HistoryLoader = loadFieldHistory,
    subscribe: EventSubscriber = subscribeToVisionAnalysisConfirmed,
  ) {
    this.onState = onState;
    this.load = load;
    this.subscribe = subscribe;
  }

  public mount(fieldId: string | null): void {
    this.unsubscribe = this.subscribe((event) => {
      if (event.fieldId === this.fieldId) void this.refresh();
    });
    this.setFieldId(fieldId);
  }

  public setFieldId(fieldId: string | null): void {
    if (this.disposed) return;
    this.fieldId = fieldId;
    this.cancelCurrentRequest();
    if (!fieldId) {
      this.onState(SELECT_FIELD_STATE);
      return;
    }
    void this.refresh();
  }

  public async refresh(): Promise<void> {
    const fieldId = this.fieldId;
    if (this.disposed || !fieldId) return;
    this.request?.abort();
    const request = new AbortController();
    this.request = request;
    const version = ++this.requestVersion;
    this.onState({ status: "LOADING", items: [], error: null });

    try {
      const page = await this.load(fieldId, request.signal);
      if (!this.isCurrent(fieldId, request, version)) return;
      this.onState({
        status: page.items.length === 0 ? "EMPTY" : "READY",
        items: page.items,
        error: null,
      });
    } catch (cause: unknown) {
      if (!this.isCurrent(fieldId, request, version) || isCancellation(cause)) return;
      this.onState({
        status: "ERROR",
        items: [],
        error: cause instanceof Error
          ? cause.message
          : "No fue posible consultar las evidencias Vision.",
      });
    }
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelCurrentRequest();
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  private cancelCurrentRequest(): void {
    ++this.requestVersion;
    this.request?.abort();
    this.request = null;
  }

  private isCurrent(
    fieldId: string,
    request: AbortController,
    version: number,
  ): boolean {
    return !this.disposed
      && !request.signal.aborted
      && this.request === request
      && this.fieldId === fieldId
      && this.requestVersion === version;
  }
}

export function useDashboardVisionEvidence(fieldId: string | null) {
  const [state, setState] = useState<DashboardVisionEvidenceState>(SELECT_FIELD_STATE);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const controller = new DashboardVisionEvidenceController(setState);
    controller.mount(fieldId);
    return () => controller.dispose();
  }, [fieldId, retryVersion]);

  const retry = useCallback(() => {
    setRetryVersion((current) => current + 1);
  }, []);

  return { ...state, retry };
}

async function loadFieldHistory(fieldId: string, signal: AbortSignal): Promise<VisionHistoryPage> {
  return getVisionHistory({ fieldId, limit: 4 }, signal);
}

function isCancellation(cause: unknown): boolean {
  return cause instanceof ApiGetError && cause.code === "CANCELLED";
}
