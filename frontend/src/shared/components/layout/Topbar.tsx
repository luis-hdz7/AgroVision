
// /**
//  * =========================================
//  * AgroVision Intelligence - Topbar
//  * =========================================
//  *
//  * Cabecera global del sistema.
//  *
//  * Funcionalidades:
//  * - Buscador contextual.
//  * - Selector de parcelas desde PostgreSQL.
//  * - Selector de períodos.
//  * - Notificaciones.
//  * - Menú de perfil.
//  *
//  * Integración:
//  * Topbar
//  *   ↓
//  * fieldsService.ts
//  *   ↓
//  * apiClient.ts
//  *   ↓
//  * GET /api/fields
//  *   ↓
//  * Express + Prisma + PostgreSQL
//  *
//  * Se conserva la estructura visual original.
//  * =========================================
//  */

// import { useEffect, useState } from "react";

// import searchIcon from "../../../assets/icons/search-icon.svg";
// import fieldIcon from "../../../assets/icons/all-field-icon.svg";
// import calendarIcon from "../../../assets/icons/calendar-icon.svg";
// import notificationIcon from "../../../assets/icons/bell-ring.svg";
// import profileImage from "../../../assets/images/foto-perfil-example.png";

// // Servicio real de parcelas
// import { getFields } from "../../../features/fields/services/fieldsServices";

// // Contrato tipado de PostgreSQL
// import type { Field } from "../../../features/fields/types/field.types";

// interface TopbarProps {
//   readonly activeLabel: string;
// }

// type ActivePopover =
//   | "FIELD"
//   | "DATE"
//   | "NOTIFICATIONS"
//   | "PROFILE"
//   | null;

// /**
//  * Formatea el ID numérico de Prisma
//  * al identificador visual de AgroVision.
//  */
// function formatFieldId(id: number): string {
//   return `field-${String(id).padStart(3, "0")}`;
// }

// export function Topbar({ activeLabel }: TopbarProps) {

//   /**
//    * =========================================
//    * Estados generales
//    * =========================================
//    */

//   const [activePopover, setActivePopover] =
//     useState<ActivePopover>(null);

//   const [selectedDate, setSelectedDate] =
//     useState("12 – 18 May 2025");

//   /**
//    * =========================================
//    * Estados de parcelas reales
//    * =========================================
//    *
//    * fields:
//    * Registros recibidos desde PostgreSQL.
//    *
//    * selectedField:
//    * Parcela seleccionada por el usuario.
//    * null significa "Todos los campos".
//    */

//   const [fields, setFields] =
//     useState<Field[]>([]);

//   const [selectedField, setSelectedField] =
//     useState<Field | null>(null);

//   const [fieldsLoading, setFieldsLoading] =
//     useState(true);

//   const [fieldsError, setFieldsError] =
//     useState<string | null>(null);

//   /**
//    * =========================================
//    * Carga de parcelas desde PostgreSQL
//    * =========================================
//    *
//    * Se ejecuta cuando Topbar se monta.
//    *
//    * AbortController evita actualizar
//    * el componente después de desmontarlo.
//    */

//   useEffect(() => {
//     const controller = new AbortController();

//     async function loadFields(): Promise<void> {
//       setFieldsLoading(true);
//       setFieldsError(null);

//       try {
//         const data = await getFields(controller.signal);

//         if (controller.signal.aborted) {
//           return;
//         }

//         setFields(data);

//       } catch (error: unknown) {

//         if (controller.signal.aborted) {
//           return;
//         }

//         const message =
//           error instanceof Error
//             ? error.message
//             : "No fue posible cargar las parcelas.";

//         setFieldsError(message);

//       } finally {

//         if (!controller.signal.aborted) {
//           setFieldsLoading(false);
//         }
//       }
//     }

//     void loadFields();

//     return () => {
//       controller.abort();
//     };
//   }, []);

//   /**
//    * =========================================
//    * Control de popovers
//    * =========================================
//    */

//   function togglePopover(
//     popover: Exclude<ActivePopover, null>
//   ): void {
//     setActivePopover((currentPopover) =>
//       currentPopover === popover ? null : popover
//     );
//   }

//   /**
//    * =========================================
//    * Selección de parcela
//    * =========================================
//    *
//    * Conserva el objeto Field real,
//    * incluyendo su ID de PostgreSQL.
//    *
//    * Por ahora la selección es local
//    * a Topbar. Posteriormente puede
//    * sincronizarse con el estado global.
//    */

//   function handleSelectField(
//     field: Field | null
//   ): void {
//     setSelectedField(field);
//     setActivePopover(null);
//   }

//   /**
//    * =========================================
//    * Selección de período
//    * =========================================
//    */

//   function handleSelectDate(
//     dateRange: string
//   ): void {
//     setSelectedDate(dateRange);
//     setActivePopover(null);
//   }

//   /**
//    * =========================================
//    * Render
//    * =========================================
//    */

//   return (
//     <header className="topbar">

//       {/* =====================================
//           BUSCADOR
//           ===================================== */}

//       <div className="topbar__searchContainer">

//         <label className="topbar__search">

//           <img
//             src={searchIcon}
//             alt=""
//             className="topbar__searchIcon"
//           />

//           <input
//             type="search"
//             placeholder={getSearchPlaceholder(activeLabel)}
//             aria-label="Buscar"
//           />

//         </label>

//       </div>

//       <div className="topbar__actions">

//         {/* =====================================
//             SELECTOR DE PARCELAS REALES
//             ===================================== */}

//         <div className="topbar__popoverAnchor">

//           <button
//             type="button"
//             className={`topbar__selectButton ${
//               activePopover === "FIELD" ? "is-open" : ""
//             }`}
//             onClick={() => togglePopover("FIELD")}
//             aria-expanded={activePopover === "FIELD"}
//           >

//             <img
//               src={fieldIcon}
//               alt=""
//               className="topbar__buttonIcon"
//             />

//             <span>
//               {selectedField?.name ?? "Todos los campos"}
//             </span>

//             <span className="topbar__chevron" />

//           </button>

//           {activePopover === "FIELD" && (

//             <div className="topbar__popover">

//               <span className="topbar__popoverHeader">
//                 Seleccionar campo
//               </span>

//               {/* Opción general */}

//               <button
//                 type="button"
//                 onClick={() => handleSelectField(null)}
//               >
//                 <span>Todos los campos</span>
//               </button>

//               {/* Cargando datos */}

//               {fieldsLoading && (

//                 <span role="status">
//                   Cargando parcelas...
//                 </span>

//               )}

//               {/* Error de conexión */}

//               {!fieldsLoading && fieldsError && (

//                 <span role="alert">
//                   No se pudieron cargar las parcelas:
//                   {" "}{fieldsError}
//                 </span>

//               )}

//               {/* Base de datos sin parcelas */}

//               {!fieldsLoading &&
//                 !fieldsError &&
//                 fields.length === 0 && (

//                   <span>
//                     No hay parcelas registradas.
//                   </span>

//                 )}

//               {/* =================================
//                   PARCELAS DESDE POSTGRESQL
//                   ================================= */}

//               {!fieldsLoading &&
//                 !fieldsError &&
//                 fields.map((field) => (

//                   <button
//                     key={field.id}
//                     type="button"
//                     onClick={() => handleSelectField(field)}
//                     aria-pressed={
//                       selectedField?.id === field.id
//                     }
//                   >

//                     <span>
//                       {field.name}
//                     </span>

//                     <small>
//                       {formatFieldId(field.id)}
//                     </small>

//                   </button>

//                 ))}

//             </div>

//           )}

//         </div>

//         {/* =====================================
//             SELECTOR DE PERÍODOS / FECHAS
//             ===================================== */}

//         <div className="topbar__popoverAnchor">

//           <button
//             type="button"
//             className={`topbar__selectButton ${
//               activePopover === "DATE" ? "is-open" : ""
//             }`}
//             onClick={() => togglePopover("DATE")}
//           >

//             <img
//               src={calendarIcon}
//               alt=""
//               className="topbar__inlineIcon"
//             />

//             <span>{selectedDate}</span>

//             <span className="topbar__chevron" />

//           </button>

//           {activePopover === "DATE" && (

//             <div className="topbar__popover topbar__popover--date">

//               <span className="topbar__popoverHeader">
//                 Periodo de análisis
//               </span>

//               <button
//                 type="button"
//                 onClick={() => handleSelectDate("Hoy")}
//               >
//                 Hoy
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   handleSelectDate("Últimos 7 días")
//                 }
//               >
//                 Últimos 7 días
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   handleSelectDate("12 – 18 May 2025")
//                 }
//               >
//                 12 – 18 May 2025
//               </button>

//             </div>

//           )}

//         </div>

//         {/* =====================================
//             NOTIFICACIONES
//             ===================================== */}

//         <div className="topbar__popoverAnchor">

//           <button
//             type="button"
//             className="topbar__iconButton"
//             aria-label="Notificaciones"
//             onClick={() => togglePopover("NOTIFICATIONS")}
//           >

//             <img
//               src={notificationIcon}
//               alt=""
//               className="topbar__iconSlot"
//             />

//             <span className="topbar__notificationBadge">
//               3
//             </span>

//           </button>

//           {activePopover === "NOTIFICATIONS" && (

//             <div className="topbar__popover topbar__popover--notifications">

//               <span className="topbar__popoverHeader">
//                 Notificaciones recientes
//               </span>

//               <article className="topbar__notificationItem">

//                 <span className="topbar__notificationDot" />

//                 <div>

//                   <b>
//                     Zona crítica requiere revisión
//                   </b>

//                   <small>
//                     zone-03 · field-001
//                   </small>

//                 </div>

//               </article>

//             </div>

//           )}

//         </div>

//         {/* =====================================
//             MENÚ DE PERFIL
//             ===================================== */}

//         <div className="topbar__popoverAnchor">

//           <button
//             type="button"
//             className="topbar__profileButton"
//             onClick={() => togglePopover("PROFILE")}
//           >

//             <div className="topbar__avatar">

//               <img
//                 src={profileImage}
//                 alt="Juan Pérez"
//               />

//             </div>

//             <div className="topbar__profileData">

//               <strong>
//                 Juan Pérez
//               </strong>

//               <small>
//                 Productor
//               </small>

//             </div>

//             <span className="topbar__chevron" />

//           </button>

//           {activePopover === "PROFILE" && (

//             <div className="topbar__popover topbar__popover--profile">

//               <div className="topbar__profileMenuHeader">

//                 <strong>
//                   Juan Pérez
//                 </strong>

//                 <span>
//                   juan.perez@agrovision.com
//                 </span>

//               </div>

//               <button
//                 type="button"
//                 onClick={() => setActivePopover(null)}
//               >
//                 Mi Perfil
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setActivePopover(null)}
//               >
//                 Configuración
//               </button>

//               <hr className="topbar__popoverDivider" />

//               <button
//                 type="button"
//                 className="topbar__logoutBtn"
//                 onClick={() => setActivePopover(null)}
//               >
//                 Cerrar sesión
//               </button>

//             </div>

//           )}

//         </div>

//       </div>

//       {/* =====================================
//           CIERRE DE POPOVERS
//           ===================================== */}

//       {activePopover && (

//         <button
//           type="button"
//           className="topbar__dismiss"
//           aria-label="Cerrar menú"
//           onClick={() => setActivePopover(null)}
//         />

//       )}

//     </header>
//   );
// }

// /**
//  * =========================================
//  * Placeholder contextual
//  * =========================================
//  */

// function getSearchPlaceholder(
//   activeLabel: string
// ): string {

//   if (activeLabel === "Alertas")
//     return "Buscar alertas...";

//   if (activeLabel === "Reportes")
//     return "Buscar reportes, campos o descripciones...";

//   if (activeLabel === "Mapping")
//     return "Buscar en el mapa...";

//   if (activeLabel === "Cultivos")
//     return "Buscar en AgroVision...";

//   if (activeLabel === "Vision AI")
//     return "Buscar en AgroVision...";

//   if (activeLabel === "Cuaderno de campo")
//     return "Buscar en AgroVision...";

//   return "Buscar en AgroVision...";
// }


/**
 * =========================================
 * AgroVision Intelligence - Topbar
 * =========================================
 *
 * Cabecera principal.
 *
 * Integraciones:
 * - Selector global de parcelas.
 * - Datos persistidos en PostgreSQL.
 * - Buscador contextual.
 * - Fechas, notificaciones y perfil.
 *
 * El selector comparte su estado con
 * todas las páginas mediante FieldsContext.
 */

import { useState } from "react";

import searchIcon from "../../../assets/icons/search-icon.svg";
import fieldIcon from "../../../assets/icons/all-field-icon.svg";
import calendarIcon from "../../../assets/icons/calendar-icon.svg";
import notificationIcon from "../../../assets/icons/bell-ring.svg";
import profileImage from "../../../assets/images/foto-perfil-example.png";

import { useFields } from "../../../features/fields/context/useFields";

interface TopbarProps {readonly activeLabel: string;}

type ActivePopover =
  | "FIELD"
  | "DATE"
  | "NOTIFICATIONS"
  | "PROFILE"
  | null;

/**
 * ID visual utilizado por AgroVision.
 *
 * PostgreSQL utiliza el ID numérico real.
 */
function formatFieldId(id: number): string {
  return `field-${String(id).padStart(3, "0")}`;
}

export function Topbar({ activeLabel }: TopbarProps) {
  /**
   * Estados visuales locales.
   */
  const [activePopover, setActivePopover] =
    useState<ActivePopover>(null);

  const [selectedDate, setSelectedDate] =
    useState("12 – 18 May 2025");

  /**
   * =========================================
   * Contexto global
   * =========================================
   *
   * Las parcelas ya fueron consultadas
   * desde FieldsProvider.
   *
   * Topbar NO repite la petición HTTP.
   */
  const {
    fields,
    selectedFieldId,
    selectedField,
    isLoading: fieldsLoading,
    error: fieldsError,
    selectField,
    reloadFields,
  } = useFields();

  /**
   * Desplegables.
   */
  function togglePopover(
    popover: Exclude<ActivePopover, null>
  ): void {
    setActivePopover(
      (current) => current === popover ? null : popover
    );
  }

  /**
   * Actualiza la parcela global.
   *
   * Todos los componentes que utilicen
   * useFields() reciben el nuevo ID.
   */
  function handleSelectField(
    fieldId: number | null
  ): void {
    selectField(fieldId);
    setActivePopover(null);
  }

  /**
   * Selector de período.
   */
  function handleSelectDate(
    dateRange: string
  ): void {
    setSelectedDate(dateRange);
    setActivePopover(null);
  }

  return (
    <header className="topbar">

      {/* =====================================
          BUSCADOR
          ===================================== */}

      <div className="topbar__searchContainer">
        <label className="topbar__search">
          <img
            src={searchIcon}
            alt=""
            className="topbar__searchIcon"
          />

          <input
            type="search"
            placeholder={getSearchPlaceholder(activeLabel)}
            aria-label="Buscar"
          />
        </label>
      </div>

      <div className="topbar__actions">

        {/* =====================================
            SELECTOR GLOBAL DE PARCELAS
            ===================================== */}

        <div className="topbar__popoverAnchor">

          <button
            type="button"
            className={`topbar__selectButton ${
              activePopover === "FIELD" ? "is-open" : ""
            }`}
            onClick={() => togglePopover("FIELD")}
            aria-expanded={activePopover === "FIELD"}
          >
            <img
              src={fieldIcon}
              alt=""
              className="topbar__buttonIcon"
            />

            <span>
              {selectedField?.name ?? "Todos los campos"}
            </span>

            <span className="topbar__chevron" />
          </button>

          {activePopover === "FIELD" && (
            <div className="topbar__popover">

              <span className="topbar__popoverHeader">
                Seleccionar campo
              </span>

              {/* Selección general */}

              <button
                type="button"
                onClick={() => handleSelectField(null)}
                aria-pressed={selectedFieldId === null}
              >
                <span>Todos los campos</span>
              </button>

              {/* Estado de carga */}

              {fieldsLoading && fields.length === 0 && (
                <span role="status">
                  Cargando parcelas...
                </span>
              )}

              {fieldsLoading && fields.length > 0 && (
                <span role="status">
                  Actualizando parcelas...
                </span>
              )}

              {/* Error de conexión */}

              {fieldsError && (
                <>
                  <span role="alert">
                    {fields.length > 0
                      ? "No se pudieron actualizar las parcelas. Mostrando el último listado disponible:"
                      : "No se pudieron cargar las parcelas:"}
                    {" "}{fieldsError}
                  </span>

                  <button
                    type="button"
                    onClick={reloadFields}
                  >
                    {fields.length > 0 ? "Actualizar" : "Reintentar"}
                  </button>
                </>
              )}

              {/* No hay datos */}

              {!fieldsLoading &&
                !fieldsError &&
                fields.length === 0 && (
                  <span>
                    No hay parcelas registradas.
                  </span>
                )}

              {/* Parcelas reales de PostgreSQL */}

              {fields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() =>
                      handleSelectField(field.id)
                    }
                    aria-pressed={
                      selectedFieldId === field.id
                    }
                  >
                    <span>{field.name}</span>

                    <small>
                      {formatFieldId(field.id)}
                    </small>
                  </button>
                ))}

              {!fieldsLoading && !fieldsError && (
                <button type="button" onClick={reloadFields}>
                  Actualizar parcelas
                </button>
              )}

            </div>
          )}
        </div>

        {/* =====================================
            SELECTOR DE FECHAS
            ===================================== */}

        <div className="topbar__popoverAnchor">

          <button
            type="button"
            className={`topbar__selectButton ${
              activePopover === "DATE" ? "is-open" : ""
            }`}
            onClick={() => togglePopover("DATE")}
          >
            <img
              src={calendarIcon}
              alt=""
              className="topbar__inlineIcon"
            />

            <span>{selectedDate}</span>

            <span className="topbar__chevron" />
          </button>

          {activePopover === "DATE" && (
            <div className="topbar__popover topbar__popover--date">

              <span className="topbar__popoverHeader">
                Periodo de análisis
              </span>

              <button
                type="button"
                onClick={() => handleSelectDate("Hoy")}
              >
                Hoy
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectDate("Últimos 7 días")
                }
              >
                Últimos 7 días
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectDate("12 – 18 May 2025")
                }
              >
                12 – 18 May 2025
              </button>

            </div>
          )}
        </div>

        {/* =====================================
            NOTIFICACIONES
            ===================================== */}

        <div className="topbar__popoverAnchor">

          <button
            type="button"
            className="topbar__iconButton"
            aria-label="Notificaciones"
            onClick={() => togglePopover("NOTIFICATIONS")}
          >
            <img
              src={notificationIcon}
              alt=""
              className="topbar__iconSlot"
            />

            <span className="topbar__notificationBadge">
              3
            </span>
          </button>

          {activePopover === "NOTIFICATIONS" && (
            <div className="topbar__popover topbar__popover--notifications">

              <span className="topbar__popoverHeader">
                Notificaciones recientes
              </span>

              <article className="topbar__notificationItem">
                <span className="topbar__notificationDot" />

                <div>
                  <b>
                    Zona crítica requiere revisión
                  </b>

                  <small>
                    zone-03 · field-001
                  </small>
                </div>
              </article>

            </div>
          )}
        </div>

        {/* =====================================
            PERFIL DE USUARIO
            ===================================== */}

        <div className="topbar__popoverAnchor">

          <button
            type="button"
            className="topbar__profileButton"
            onClick={() => togglePopover("PROFILE")}
          >
            <div className="topbar__avatar">
              <img
                src={profileImage}
                alt="Juan Pérez"
              />
            </div>

            <div className="topbar__profileData">
              <strong>Juan Pérez</strong>
              <small>Productor</small>
            </div>

            <span className="topbar__chevron" />
          </button>

          {activePopover === "PROFILE" && (
            <div className="topbar__popover topbar__popover--profile">

              <div className="topbar__profileMenuHeader">
                <strong>Juan Pérez</strong>

                <span>
                  juan.perez@agrovision.com
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActivePopover(null)}
              >
                Mi Perfil
              </button>

              <button
                type="button"
                onClick={() => setActivePopover(null)}
              >
                Configuración
              </button>

              <hr className="topbar__popoverDivider" />

              <button
                type="button"
                className="topbar__logoutBtn"
                onClick={() => setActivePopover(null)}
              >
                Cerrar sesión
              </button>

            </div>
          )}
        </div>

      </div>

      {/* =====================================
          CIERRE DE DESPLEGABLES
          ===================================== */}

      {activePopover && (
        <button
          type="button"
          className="topbar__dismiss"
          aria-label="Cerrar menú"
          onClick={() => setActivePopover(null)}
        />
      )}

    </header>
  );
}

/**
 * =========================================
 * Buscador contextual
 * =========================================
 */
function getSearchPlaceholder(
  activeLabel: string
): string {
  if (activeLabel === "Alertas")
    return "Buscar alertas...";

  if (activeLabel === "Reportes")
    return "Buscar reportes, campos o descripciones...";

  if (activeLabel === "Mapping")
    return "Buscar en el mapa...";

  if (activeLabel === "Cultivos")
    return "Buscar en AgroVision...";

  if (activeLabel === "Vision AI")
    return "Buscar en AgroVision...";

  if (activeLabel === "Cuaderno de campo")
    return "Buscar en AgroVision...";

  return "Buscar en AgroVision...";
}

