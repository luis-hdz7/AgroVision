/**
 * =========================================
 * Weather Modal
 * =========================================
 *
 * Objetivo:
 * - aproximar el modal al dashboard meteorológico de referencia;
 * - izquierda: tarjeta principal + carrusel horario;
 * - derecha: mapa + widgets Recharts + pronóstico diario;
 * - mantener datos reales siempre que existan;
 * - utilizar iconos meteorológicos SVG animados y consistentes.
 * =========================================
 */

import {
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
} from 'react';

import { createPortal } from 'react-dom';

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

import type {
  WeatherConditionKey,
  WeatherData,
  WeatherError,
  WeatherRequestStatus,
} from '../types/weather.types';

/**
 * =========================================
 * Weather Icons
 * =========================================
 *
 * El helper selecciona automáticamente el SVG
 * correspondiente según:
 *
 * - condición meteorológica;
 * - día / noche.
 *
 * Los SVG contienen su propia animación.
 */
import {
  getWeatherIcon,
} from '../utils/weatherIcons';


export interface WeatherModalProps {
  readonly isOpen: boolean;
  readonly status: WeatherRequestStatus;
  readonly data: WeatherData | null;
  readonly error: WeatherError | null;
  readonly onClose: () => void;
  readonly onRetry?: () => void;
}


/**
 * =========================================
 * Hourly Forecast
 * =========================================
 */

type HourlyForecastItem = {
  readonly key: string;
  readonly label: string;
  readonly temperature: number;
  readonly conditionLabel: string;
  readonly conditionKey: WeatherConditionKey;
  readonly precipitationProbability: number;
};


/**
 * =========================================
 * Formateadores
 * =========================================
 */

const NUMBER_FORMAT = new Intl.NumberFormat('es-NI', {
  maximumFractionDigits: 1,
});


function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}


function formatShortHour(
  iso: string,
  timezone?: string,
): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat('es-NI', {
      hour: 'numeric',
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('es-NI', {
      hour: 'numeric',
      hour12: true,
    }).format(date);
  }
}


function formatForecastDate(
  date: string,
): string {
  const [year, month, day] =
    date.split('-').map(Number);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return date;
  }

  const parsedDate = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  return new Intl.DateTimeFormat('es-NI', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(parsedDate);
}


function formatUpdatedAt(
  isoDate: string,
  timezone: string,
): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return 'Hora no disponible';
  }

  try {
    return new Intl.DateTimeFormat('es-NI', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('es-NI', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}


/**
 * =========================================
 * Dirección del viento
 * =========================================
 */

function getWindDirection(
  degrees: number,
): string {
  const directions = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SO',
    'O',
    'NO',
  ] as const;

  const normalizedDegrees =
    ((degrees % 360) + 360) % 360;

  const index =
    Math.round(
      normalizedDegrees / 45,
    ) % directions.length;

  return directions[index];
}


/**
 * =========================================
 * Pronóstico horario
 * =========================================
 *
 * Extraemos hourly desde la respuesta real si existe.
 *
 * Si todavía no viene desde weatherService,
 * generamos temporalmente un fallback visual usando las condiciones actuales.
 *
 * Posteriormente conectaremos hourly directamente
 * desde Open-Meteo.
 * =========================================
 */

function buildHourlyItems(
  data: WeatherData,
): HourlyForecastItem[] {
  const unsafeData = data as WeatherData & {
    hourly?: Array<{
      readonly time?: string;

      readonly temperatureCelsius?: number;

      readonly condition?: {
        readonly key?: WeatherConditionKey;
        readonly label?: string;
      };

      readonly precipitationProbabilityPercentage?: number;
    }>;
  };


  if (
    unsafeData.hourly &&
    unsafeData.hourly.length > 0
  ) {
    return unsafeData.hourly
      .slice(0, 6)
      .map((item, index) => ({
        key:
          item.time ??
          `hourly-${index}`,

        label: item.time
          ? formatShortHour(
              item.time,
              data.location.timezone,
            )
          : `${index + 1} PM`,

        temperature:
          typeof item.temperatureCelsius === 'number'
            ? item.temperatureCelsius
            : data.current.temperatureCelsius,

        conditionLabel:
          item.condition?.label ??
          data.current.condition.label,

        conditionKey:
          item.condition?.key ??
          data.current.condition.key,

        precipitationProbability:
          typeof item.precipitationProbabilityPercentage === 'number'
            ? item.precipitationProbabilityPercentage
            : 0,
      }));
  }


  /**
   * Fallback temporal.
   *
   * Se eliminará cuando hourly forme parte oficial
   * del contrato WeatherData.
   */
  return Array.from(
    { length: 6 },
    (_, index) => ({
      key:
        `fallback-hourly-${index}`,

      label:
        `${11 + index} ${
          11 + index < 12
            ? 'AM'
            : 'PM'
        }`,

      temperature:
        data.current.temperatureCelsius,

      conditionLabel:
        data.current.condition.label,

      conditionKey:
        data.current.condition.key,

      precipitationProbability:
        data.forecast[0]
          ?.precipitationProbabilityMaxPercentage ??
        0,
    }),
  );
}

/**
 * =========================================
 * Índice UV
 * =========================================
 *
 * El valor ya llega normalizado desde
 * weatherService.ts.
 */
function getUvIndex(
  data: WeatherData,
): number {
  return data.current.uvIndex;
}


/**
 * =========================================
 * Progreso solar
 * =========================================
 *
 * Calcula en qué posición se encuentra el sol
 * entre sunrise y sunset.
 *
 * Trabajamos todos los valores como fecha/hora
 * local de la ubicación meteorológica.
 */
function getSunMeta(
  data: WeatherData,
): {
  sunrise: string;
  sunset: string;
  progressPercentage: number;
} {
  const {
    sunrise,
    sunset,
  } = data.astronomy;


  /**
   * Convertimos YYYY-MM-DDTHH:mm a un número
   * comparable SIN alterar la zona horaria.
   */
  function parseLocalTime(
    value: string,
  ): number {
    const [
      datePart,
      timePart,
    ] = value.split('T');


    const [
      year,
      month,
      day,
    ] = datePart
      .split('-')
      .map(Number);


    const [
      hour,
      minute,
    ] = timePart
      .split(':')
      .map(Number);


    return Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
    );
  }


  const sunriseTime =
    parseLocalTime(sunrise);

  const sunsetTime =
    parseLocalTime(sunset);

  const currentTime =
    parseLocalTime(
      data.current.observedAt,
    );


  if (
    sunsetTime <= sunriseTime
  ) {
    return {
      sunrise,
      sunset,
      progressPercentage: 0,
    };
  }


  const total =
    sunsetTime - sunriseTime;


  /**
   * Antes del amanecer = 0%.
   * Después del atardecer = 100%.
   */
  const elapsed = Math.min(
    Math.max(
      currentTime - sunriseTime,
      0,
    ),
    total,
  );


  return {
    sunrise,
    sunset,

    progressPercentage:
      (elapsed / total) * 100,
  };
}

/**
 * =========================================
 * Etiqueta del índice UV
 * =========================================
 */

function getUvLabel(
  uvIndex: number,
): string {
  if (uvIndex <= 2) {
    return 'Bajo';
  }

  if (uvIndex <= 5) {
    return 'Moderado';
  }

  if (uvIndex <= 7) {
    return 'Alto';
  }

  if (uvIndex <= 10) {
    return 'Muy alto';
  }

  return 'Extremo';
}

/**
 * =========================================
 * UV Gauge — Recharts
 * =========================================
 */

function UvGauge({
  value,
}: {
  readonly value: number;
}) {
  const normalizedValue =
    Math.max(
      0,
      Math.min(value, 12),
    );


  const chartData = [
    {
      name: 'uv',
      value: normalizedValue,
      fill: '#f6782f',
    },
  ];


  return (
    <div className="weatherModal__chartWidgetBody">
      <div className="weatherModal__chartCanvas">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RadialBarChart
            cx="50%"
            cy="68%"
            innerRadius="62%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={chartData}
            barSize={10}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 12]}
              angleAxisId={0}
              tick={false}
            />

            <RadialBar
              background={{
                fill:
                  'rgba(255,255,255,0.09)',
              }}
              dataKey="value"
              cornerRadius={999}
            />
          </RadialBarChart>
        </ResponsiveContainer>


        <div className="weatherModal__chartCenter weatherModal__chartCenter--uv">

          <strong>
            {formatNumber(
                normalizedValue,
            )}
          </strong>

          <span>
            {getUvLabel(
              normalizedValue,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}


/**
 * =========================================
 * Sun Gauge — Recharts
 * =========================================
 */

function SunGauge({
  progressPercentage,
  sunrise,
  sunset,
}: {
  readonly progressPercentage: number;
  readonly sunrise: string | null;
  readonly sunset: string | null;
}) {
  const normalizedValue =
    Math.max(
      0,
      Math.min(
        progressPercentage,
        100,
      ),
    );


  const chartData = [
    {
      name: 'sun',
      value: normalizedValue,
      fill: '#f5ed94',
    },
  ];


  const sunriseLabel =
    sunrise
      ? formatShortHour(sunrise)
      : '—';


  const sunsetLabel =
    sunset
      ? formatShortHour(sunset)
      : '—';


  return (
    <div className="weatherModal__chartWidgetBody">
      <div className="weatherModal__chartCanvas">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RadialBarChart
            cx="50%"
            cy="72%"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={chartData}
            barSize={7}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />

            <RadialBar
              background={{
                fill:
                  'rgba(255,255,255,0.09)',
              }}
              dataKey="value"
              cornerRadius={999}
            />
          </RadialBarChart>
        </ResponsiveContainer>


        <div className="weatherModal__chartCenter weatherModal__chartCenter--sun">

          <span>
            {sunriseLabel}
          </span>

          <span>
            {sunsetLabel}
          </span>
        </div>
      </div>
    </div>
  );
}


/**
 * =========================================
 * WeatherModal
 * =========================================
 */

export function WeatherModal({
  isOpen,
  status,
  data,
  error,
  onClose,
  onRetry,
}: WeatherModalProps) {

  const closeButtonRef =
    useRef<
      HTMLButtonElement | null
    >(null);


  /**
   * =========================================
   * Escape + bloqueo del scroll
   * =========================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }


    const previousActiveElement =
      document.activeElement
        instanceof HTMLElement
        ? document.activeElement
        : null;


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      'hidden';


    function handleKeyDown(
      event: KeyboardEvent,
    ): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }


    document.addEventListener(
      'keydown',
      handleKeyDown,
    );


    const frame =
      window.requestAnimationFrame(
        () => {
          closeButtonRef.current?.focus();
        },
      );


    return () => {
      window.cancelAnimationFrame(
        frame,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;

      previousActiveElement?.focus();
    };
  }, [
    isOpen,
    onClose,
  ]);


  /**
   * =========================================
   * Datos derivados
   * =========================================
   */

  const hourlyForecast =
    useMemo(
      () =>
        data
          ? buildHourlyItems(data)
          : [],
      [data],
    );


  const uvIndex =
    useMemo(
      () =>
        data
          ? getUvIndex(data)
          : 0,
      [data],
    );


  const sunMeta =
    useMemo(
      () =>
        data
          ? getSunMeta(data)
          : {
              sunrise: null,
              sunset: null,
              progressPercentage: 0,
            },
      [data],
    );


  /**
   * El modal no existe si está cerrado.
   */
  if (!isOpen) {
    return null;
  }


  if (
    typeof document === 'undefined'
  ) {
    return null;
  }


  /**
   * =========================================
   * Cierre mediante backdrop
   * =========================================
   */

  function handleBackdropMouseDown(
    event: MouseEvent<HTMLDivElement>,
  ): void {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  }


  /**
   * =========================================
   * Modal
   * =========================================
   */

  const modal = (
    <div
      className="weatherModal__backdrop"
      onMouseDown={
        handleBackdropMouseDown
      }
    >
      <section
        className="weatherModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="weatherModal-title"
      >

        {/*
         * =====================================
         * Header
         * =====================================
         */}

        <header className="weatherModal__header">

          <div className="weatherModal__headerIdentity">

            {data ? (
              <>
                <strong>
                  {
                    data.location
                      .locationName
                  }
                </strong>

                <span>
                  {
                    data.location
                      .locationDescription
                  }
                </span>

                <small>
                  Actualizado{' '}
                  {formatUpdatedAt(
                    data.fetchedAt,
                    data.location.timezone,
                  )}
                </small>
              </>
            ) : (
              <>
                <strong>
                  AgroVision Weather
                </strong>

                <span>
                  Información meteorológica
                </span>
              </>
            )}
          </div>


          <h2
            id="weatherModal-title"
            className="weatherModal__title"
          >
            Centro meteorológico
          </h2>


          <button
            ref={closeButtonRef}
            type="button"
            className="weatherModal__close"
            onClick={onClose}
            aria-label="Cerrar centro meteorológico"
          >
            ×
          </button>
        </header>


        {/*
         * =====================================
         * Loading
         * =====================================
         */}

        {status === 'LOADING' && (
          <div
            className="weatherModal__state"
            aria-live="polite"
          >
            <div
              className="weatherModal__loader"
              aria-hidden="true"
            />

            <strong>
              Consultando clima real
            </strong>

            <span>
              Obteniendo información
              meteorológica actualizada.
            </span>
          </div>
        )}


        {/*
         * =====================================
         * Error
         * =====================================
         */}

        {status === 'ERROR' && (
          <div
            className="weatherModal__state weatherModal__state--error"
            role="alert"
          >
            <strong>
              No fue posible obtener
              el clima
            </strong>

            <span>
              {error?.message ??
                'Ocurrió un problema al consultar el servicio meteorológico.'}
            </span>


            {onRetry && (
              <button
                type="button"
                className="weatherModal__retry avActionButton"
                onClick={onRetry}
              >
                Intentar nuevamente
              </button>
            )}
          </div>
        )}


        {/*
         * =====================================
         * Weather Dashboard
         * =====================================
         */}

        {data &&
          status === 'SUCCESS' && (

          <div className="weatherModal__dashboard">

            {/*
             * =================================
             * Columna izquierda
             * =================================
             */}

            <div className="weatherModal__primaryColumn">

              {/*
               * ===============================
               * Current Weather
               * ===============================
               */}

              <section className="weatherModal__currentCard">

                <div className="weatherModal__currentBadge">
                  <span />

                  Datos en tiempo real
                </div>


                <div className="weatherModal__currentMain">

                  <div className="weatherModal__temperatureBlock">

                    <strong>
                      {formatNumber(
                        data.current
                          .temperatureCelsius,
                      )}
                      °C
                    </strong>

                    <span>
                      {
                        data.current
                          .condition.label
                      }
                    </span>
                  </div>


                  {/*
                   * ===========================
                   * ICONO PRINCIPAL
                   * ===========================
                   *
                   * El SVG correspondiente es
                   * elegido automáticamente por
                   * weatherIcons.ts.
                   *
                   * Las animaciones pertenecen
                   * al propio archivo SVG.
                   */}

                  <div
                    className="weatherModal__weatherArtwork"
                    aria-hidden="true"
                  >
                    <img
                      src={getWeatherIcon(
                        data.current
                          .condition.key,
                        data.current.isDay,
                      )}
                      alt=""
                    />
                  </div>
                </div>


                <div className="weatherModal__currentStats">

                  <div>
                    <span>
                      Sensación
                    </span>

                    <strong>
                      {formatNumber(
                        data.current
                          .apparentTemperatureCelsius,
                      )}
                      °C
                    </strong>
                  </div>


                  <div>
                    <span>
                      Humedad
                    </span>

                    <strong>
                      {
                        data.current
                          .relativeHumidityPercentage
                      }
                      %
                    </strong>
                  </div>


                  <div>
                    <span>
                      Viento
                    </span>

                    <strong>
                      {formatNumber(
                        data.current
                          .windSpeedKmh,
                      )}{' '}
                      km/h{' '}

                      {getWindDirection(
                        data.current
                          .windDirectionDegrees,
                      )}
                    </strong>
                  </div>
                </div>
              </section>


              {/*
               * ===============================
               * Hourly Forecast
               * ===============================
               */}

              <section className="weatherModal__hourlySection">

                <div className="weatherModal__sectionHeaderInline">
                  <strong>
                    Pronóstico por horas
                  </strong>
                </div>


                <div className="weatherModal__hourlyScroller">

                  {hourlyForecast.map(
                    (item) => (

                    <article
                      key={item.key}
                      className="weatherModal__hourCard"
                    >

                      <span className="weatherModal__hourLabel">
                        {item.label}
                      </span>


                      {/*
                       * Icono SVG animado
                       * correspondiente a la hora.
                       */}

                      <span
                        className="weatherModal__hourIcon"
                        aria-hidden="true"
                      >
                        <img
                          src={getWeatherIcon(
                            item.conditionKey,
                            true,
                          )}
                          alt=""
                        />
                      </span>


                      <strong className="weatherModal__hourTemp">
                        {Math.round(
                          item.temperature,
                        )}
                        °
                      </strong>


                      <small className="weatherModal__hourRain">
                        {
                          item.precipitationProbability
                        }
                        %
                      </small>
                    </article>
                  ))}
                </div>
              </section>
            </div>


            {/*
             * =================================
             * Columna derecha
             * =================================
             */}

            <div className="weatherModal__secondaryColumn">

              {/*
               * ===============================
               * Weather Map
               * ===============================
               */}

              <section className="weatherModal__mapWidget">

                <div className="weatherModal__widgetTitle">

                  <strong>
                    Mapa meteorológico
                  </strong>

                  <span>
                    Ubicación actual
                  </span>
                </div>


                <div className="weatherModal__mapCanvas">

                  <div
                    className="weatherModal__mapGrid"
                    aria-hidden="true"
                  />


                  <div className="weatherModal__mapLocation">

                    <span
                      className="weatherModal__mapPin"
                      aria-hidden="true"
                    />


                    <strong>
                      {
                        data.location
                          .locationName
                      }
                    </strong>


                    <small>
                      {formatNumber(
                        data.location
                          .coordinates.latitude,
                      )}
                      ,
                      {' '}
                      {formatNumber(
                        data.location
                          .coordinates.longitude,
                      )}
                    </small>
                  </div>
                </div>
              </section>


              {/*
               * ===============================
               * Recharts Widgets
               * ===============================
               */}

              <div className="weatherModal__widgetsRow">

                <section className="weatherModal__miniWidget">

                  <div className="weatherModal__widgetTitle">
                    <strong>
                      Índice UV
                    </strong>
                  </div>

                  <UvGauge
                    value={uvIndex}
                  />
                </section>


                <section className="weatherModal__miniWidget">

                  <div className="weatherModal__widgetTitle">
                    <strong>
                      Amanecer
                    </strong>
                  </div>


                  <SunGauge
                    progressPercentage={
                      sunMeta.progressPercentage
                    }
                    sunrise={
                      sunMeta.sunrise
                    }
                    sunset={
                      sunMeta.sunset
                    }
                  />
                </section>
              </div>


              {/*
               * ===============================
               * Daily Forecast
               * ===============================
               */}

              <section className="weatherModal__forecast">

                <div className="weatherModal__forecastHeader">

                  <strong>
                    Próximos días
                  </strong>

                  <span>
                    {
                      data.forecast.length
                    }{' '}
                    días
                  </span>
                </div>


                <div className="weatherModal__forecastList">

                  {data.forecast.map(
                    (forecast) => (

                    <article
                      key={forecast.date}
                      className="weatherModal__forecastRow"
                    >

                      <span className="weatherModal__forecastDate">
                        {formatForecastDate(
                          forecast.date,
                        )}
                      </span>


                      {/*
                       * Icono SVG animado
                       * correspondiente al día.
                       */}

                      <span
                        className="weatherModal__forecastIcon"
                        aria-hidden="true"
                      >
                        <img
                          src={getWeatherIcon(
                            forecast
                              .condition.key,
                            true,
                          )}
                          alt=""
                        />
                      </span>


                      <span className="weatherModal__forecastCondition">
                        {
                          forecast
                            .condition.label
                        }
                      </span>


                      <div className="weatherModal__forecastTemperature">

                        <strong>
                          {formatNumber(
                            forecast
                              .temperatureMaxCelsius,
                          )}
                          °
                        </strong>

                        <span>
                          {formatNumber(
                            forecast
                              .temperatureMinCelsius,
                          )}
                          °
                        </span>
                      </div>


                      <div className="weatherModal__forecastRain">

                        <span>
                          {
                            forecast
                              .precipitationProbabilityMaxPercentage
                          }
                          %
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>


            {/*
             * =================================
             * Footer
             * =================================
             */}

            <footer className="weatherModal__footer">

              <div>
                <span className="weatherModal__sourceDot" />

                <span>
                  Datos meteorológicos:
                  {' '}

                  <strong>
                    Open-Meteo
                  </strong>
                </span>
              </div>


              <span>
                {
                  data.location
                    .locationDescription
                }
              </span>
            </footer>
          </div>
        )}
      </section>
    </div>
  );


  /**
   * El modal se renderiza fuera de la jerarquía
   * visual del Sidebar para cubrir toda la app.
   */
  return createPortal(
    modal,
    document.body,
  );
}
