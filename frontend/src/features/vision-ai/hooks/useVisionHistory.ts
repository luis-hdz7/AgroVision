/**
 * Coordina historial y detalle Vision para un contexto agrícola exacto.
 * Cancela lecturas obsoletas, pagina sin duplicados y nunca ejecuta inferencias.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiGetError } from "../../../shared/api/apiClient";
import {
  getVisionAnalysisDetail,
  getVisionHistory,
} from "../services/visionAIService";
import type {
  VisionAnalysisResult,
  VisionHistoryItem,
  VisionHistoryPage,
  VisionHistoryStatus,
  VisionInspection,
} from "../types/visionAI.types";
import type { CropType } from "../../crops/types/cropProfile.types";

const HISTORY_PAGE_LIMIT = 20;

export interface VisionHistoryContext {
  readonly fieldId: string;
  readonly cropType: CropType;
  readonly zoneId: string | null;
}

interface HistorySnapshot {
  readonly key: string;
  readonly status: VisionHistoryStatus;
  readonly page: VisionHistoryPage;
  readonly error: string | null;
}

interface DetailSnapshot {
  readonly key: string;
  readonly status: VisionHistoryStatus;
  readonly result: VisionAnalysisResult | null;
  readonly error: string | null;
}

const EMPTY_PAGE: VisionHistoryPage = { items: [], nextCursor: null };

export function useVisionHistory(
  context: VisionHistoryContext | null,
  onDetailLoaded: (result: VisionAnalysisResult) => void,
  onDetailFailed: (message: string) => void,
) {
  const fieldId = context?.fieldId ?? null;
  const cropType = context?.cropType ?? null;
  const zoneId = context?.zoneId ?? null;
  const key = fieldId && cropType
    ? `${fieldId}\u0000${cropType}\u0000${zoneId ?? "<unassigned>"}`
    : "<inactive>";

  const [history, setHistory] = useState<HistorySnapshot>({
    key: "<inactive>", status: "INACTIVE", page: EMPTY_PAGE, error: null,
  });
  const [detail, setDetail] = useState<DetailSnapshot>({
    key: "<inactive>", status: "INACTIVE", result: null, error: null,
  });
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [paginationError, setPaginationError] = useState<string | null>(null);

  const listController = useRef<AbortController | null>(null);
  const pageController = useRef<AbortController | null>(null);
  const detailController = useRef<AbortController | null>(null);
  const listVersion = useRef(0);
  const pageVersion = useRef(0);
  const detailVersion = useRef(0);

  const openDetail = useCallback(async (inspectionId: string): Promise<void> => {
    if (!fieldId || !cropType) return;
    detailController.current?.abort();
    const controller = new AbortController();
    detailController.current = controller;
    const version = ++detailVersion.current;
    setSelectedInspectionId(inspectionId);
    setDetail({ key, status: "LOADING", result: null, error: null });

    try {
      const result = await getVisionAnalysisDetail(inspectionId, fieldId, controller.signal);
      if (controller.signal.aborted || version !== detailVersion.current) return;
      const inspection = result.inspection;
      if (inspection.cropType !== cropType || (inspection.zoneId ?? null) !== zoneId) {
        throw new Error("El análisis no pertenece al cultivo y zona activos.");
      }
      setDetail({ key, status: "READY", result, error: null });
      onDetailLoaded(result);
    } catch (cause: unknown) {
      if (isExpectedCancellation(cause) || version !== detailVersion.current) return;
      const message = getErrorMessage(cause);
      setDetail({ key, status: "ERROR", result: null, error: message });
      onDetailFailed(message);
    }
  }, [cropType, fieldId, key, onDetailFailed, onDetailLoaded, zoneId]);

  const loadFirstPage = useCallback(async (): Promise<void> => {
    listController.current?.abort();
    pageController.current?.abort();
    detailController.current?.abort();
    ++pageVersion.current;
    ++detailVersion.current;
    setIsLoadingMore(false);
    setPaginationError(null);
    setSelectedInspectionId(null);
    setDetail({ key, status: "INACTIVE", result: null, error: null });

    if (!fieldId || !cropType) {
      setHistory({ key, status: "INACTIVE", page: EMPTY_PAGE, error: null });
      return;
    }

    const controller = new AbortController();
    listController.current = controller;
    const version = ++listVersion.current;
    setHistory({ key, status: "LOADING", page: EMPTY_PAGE, error: null });

    try {
      const page = await getVisionHistory({
        fieldId, cropType, zoneId, limit: HISTORY_PAGE_LIMIT,
      }, controller.signal);
      if (controller.signal.aborted || version !== listVersion.current) return;
      if (page.items.length === 0) {
        setHistory({ key, status: "EMPTY", page, error: null });
        return;
      }
      setHistory({ key, status: "READY", page, error: null });
      await openDetail(page.items[0].inspectionId);
    } catch (cause: unknown) {
      if (isExpectedCancellation(cause) || version !== listVersion.current) return;
      setHistory({
        key, status: "ERROR", page: EMPTY_PAGE, error: getErrorMessage(cause),
      });
    }
  }, [cropType, fieldId, key, openDetail, zoneId]);

  useEffect(() => {
    const kickoff = window.setTimeout(() => void loadFirstPage(), 0);
    return () => {
      window.clearTimeout(kickoff);
      listController.current?.abort();
      pageController.current?.abort();
      detailController.current?.abort();
    };
  }, [loadFirstPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    const visible = history.key === key ? history : null;
    if (!fieldId || !cropType || !visible?.page.nextCursor || isLoadingMore) return;
    pageController.current?.abort();
    const controller = new AbortController();
    pageController.current = controller;
    const version = ++pageVersion.current;
    const cursor = visible.page.nextCursor;
    setIsLoadingMore(true);
    setPaginationError(null);

    try {
      const nextPage = await getVisionHistory({
        fieldId, cropType, zoneId, limit: HISTORY_PAGE_LIMIT, cursor,
      }, controller.signal);
      if (controller.signal.aborted || version !== pageVersion.current) return;
      setHistory((current) => {
        if (current.key !== key) return current;
        const known = new Set(current.page.items.map((item) => item.inspectionId));
        const appended = nextPage.items.filter((item) => !known.has(item.inspectionId));
        return {
          key,
          status: "READY",
          page: { items: [...current.page.items, ...appended], nextCursor: nextPage.nextCursor },
          error: null,
        };
      });
    } catch (cause: unknown) {
      if (isExpectedCancellation(cause) || version !== pageVersion.current) return;
      setPaginationError(getErrorMessage(cause));
    } finally {
      if (version === pageVersion.current) setIsLoadingMore(false);
    }
  }, [cropType, fieldId, history, isLoadingMore, key, zoneId]);

  const invalidateDetail = useCallback((): void => {
    detailController.current?.abort();
    ++detailVersion.current;
    setDetail({ key, status: "INACTIVE", result: null, error: null });
  }, [key]);

  const beginPost = useCallback((): void => {
    // Una primera página tardía no debe iniciar un detalle durante una inferencia nueva.
    listController.current?.abort();
    detailController.current?.abort();
    ++listVersion.current;
    ++detailVersion.current;
    setDetail({ key, status: "INACTIVE", result: null, error: null });
  }, [key]);

  const refreshAfterPost = useCallback(async (inspection: VisionInspection): Promise<void> => {
    if (!fieldId || !cropType) return;
    const item = toHistoryItem(inspection);
    setSelectedInspectionId(inspection.inspectionId);
    setHistory((current) => ({
      key,
      status: "READY",
      page: {
        items: [item, ...current.key === key
          ? current.page.items.filter((entry) => entry.inspectionId !== item.inspectionId)
          : []],
        nextCursor: current.key === key ? current.page.nextCursor : null,
      },
      error: null,
    }));

    listController.current?.abort();
    const controller = new AbortController();
    listController.current = controller;
    const version = ++listVersion.current;
    try {
      const page = await getVisionHistory({
        fieldId, cropType, zoneId, limit: HISTORY_PAGE_LIMIT,
      }, controller.signal);
      if (controller.signal.aborted || version !== listVersion.current) return;
      const refreshedItems = [
        item,
        ...page.items.filter((entry) => entry.inspectionId !== item.inspectionId),
      ];
      setHistory({
        key,
        status: "READY",
        page: { items: refreshedItems, nextCursor: page.nextCursor },
        error: null,
      });
      setPaginationError(null);
    } catch (cause: unknown) {
      if (isExpectedCancellation(cause) || version !== listVersion.current) return;
      setPaginationError(`El análisis fue guardado, pero no se pudo refrescar el historial. ${getErrorMessage(cause)}`);
    }
  }, [cropType, fieldId, key, zoneId]);

  const visibleHistory = history.key === key ? history : {
    key, status: "INACTIVE" as const, page: EMPTY_PAGE, error: null,
  };
  const visibleDetail = detail.key === key ? detail : {
    key, status: "INACTIVE" as const, result: null, error: null,
  };

  return {
    status: visibleHistory.status,
    items: visibleHistory.page.items,
    nextCursor: visibleHistory.page.nextCursor,
    error: visibleHistory.error,
    detailStatus: visibleDetail.status,
    detailResult: visibleDetail.result,
    detailError: visibleDetail.error,
    selectedInspectionId,
    isLoadingMore,
    paginationError,
    retry: loadFirstPage,
    openDetail,
    loadMore,
    invalidateDetail,
    beginPost,
    refreshAfterPost,
  };
}

function toHistoryItem(inspection: VisionInspection): VisionHistoryItem {
  return {
    inspectionId: inspection.inspectionId,
    fieldId: inspection.fieldId,
    zoneId: inspection.zoneId ?? null,
    cropType: inspection.cropType,
    prediction: inspection.prediction,
    detectedClass: inspection.detectedClass,
    confidence: inspection.confidence,
    modelId: inspection.modelId,
    modelVersion: inspection.modelVersion,
    // El POST solo responde cuando el análisis y su fotografía quedaron confirmados.
    hasImage: true,
    createdAt: inspection.createdAt,
  };
}

function isExpectedCancellation(cause: unknown): boolean {
  return cause instanceof ApiGetError && cause.code === "CANCELLED";
}

function getErrorMessage(cause: unknown): string {
  return cause instanceof Error
    ? cause.message
    : "No fue posible consultar el historial Vision.";
}

/** La página integra este hook con el contexto exacto y mantiene separado el POST. */
