
/**
 * =========================================
 * AgroVision Intelligence
 * Global Fields Context
 * =========================================
 *
 * Fuente de datos:
 * Neon -> PostgreSQL -> Prisma -> Express
 *      -> fieldsService -> React Context
 *
 * Responsabilidades:
 * - Consultar las parcelas una sola vez.
 * - Compartir las parcelas con toda la aplicación.
 * - Mantener el ID de la parcela seleccionada.
 * - Permitir actualizar las parcelas.
 * - Controlar estados de carga y error.
 *
 * No utiliza datos simulados.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getFields } from "../services/fieldsServices";
import type { Field } from "../types/field.types";
import {
  FieldsContext,
  type FieldsContextValue,
} from "./fieldsContextStore";

interface FieldsProviderProps {
  readonly children: ReactNode;
}

/**
 * Proveedor principal de parcelas.
 *
 * Se monta una vez en App.tsx y permanece
 * disponible mientras se navega por AgroVision.
 */

export function FieldsProvider({
  children,
}: FieldsProviderProps) {
  const [fields, setFields] = useState<Field[]>([]);

  const [selectedFieldId, setSelectedFieldId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  // Invalida resultados anteriores incluso antes del siguiente render.
  const requestVersion = useRef(0);

  /**
   * Consulta las parcelas desde el backend.
   *
   * La petición se cancela si el proveedor
   * se desmonta o comienza una actualización.
   */
  useEffect(() => {
    const controller = new AbortController();
    const currentVersion = ++requestVersion.current;

    async function loadFields(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getFields(controller.signal);

        if (
          controller.signal.aborted ||
          currentVersion !== requestVersion.current
        ) return;

        setFields(data);

        // Si la parcela seleccionada ya no existe,
        // regresamos a "Todos los campos".
        setSelectedFieldId((currentId) => {
          if (currentId === null) return null;

          const exists = data.some(
            (field) => field.id === currentId
          );

          return exists ? currentId : null;
        });

      } catch (cause: unknown) {
        if (
          controller.signal.aborted ||
          currentVersion !== requestVersion.current
        ) return;

        setError(
          cause instanceof Error
            ? cause.message
            : "No fue posible obtener las parcelas."
        );

      } finally {
        if (
          !controller.signal.aborted &&
          currentVersion === requestVersion.current
        ) {
          setIsLoading(false);
        }
      }
    }

    void loadFields();

    return () => controller.abort();
  }, [reloadKey]);

  /**
   * Selección global de parcela.
   *
   * No admite identificadores inexistentes.
   */
  const selectField = useCallback(
    (id: number | null): void => {
      if (id === null) {
        setSelectedFieldId(null);
        return;
      }

      if (
        !Number.isInteger(id) ||
        !fields.some((field) => field.id === id)
      ) {
        console.warn(
          "[AgroVision] Parcela no disponible:",
          id
        );
        return;
      }

      setSelectedFieldId(id);
    },
    [fields]
  );

  /**
   * Actualiza el listado desde PostgreSQL.
   */
  const reloadFields = useCallback((): void => {
    requestVersion.current += 1;
    setReloadKey((current) => current + 1);
  }, []);

  /**
   * Obtiene el objeto completo seleccionado.
   */
  const selectedField = useMemo(
    () =>
      fields.find(
        (field) => field.id === selectedFieldId
      ) ?? null,
    [fields, selectedFieldId]
  );

  /**
   * Evita recrear el valor del Context
   * cuando sus dependencias no cambian.
   */
  const contextValue = useMemo<FieldsContextValue>(
    () => ({
      fields,
      selectedFieldId,
      selectedField,
      isLoading,
      error,
      selectField,
      reloadFields,
    }),
    [
      fields,
      selectedFieldId,
      selectedField,
      isLoading,
      error,
      selectField,
      reloadFields,
    ]
  );

  return (
    <FieldsContext.Provider value={contextValue}>
      {children}
    </FieldsContext.Provider>
  );
}
