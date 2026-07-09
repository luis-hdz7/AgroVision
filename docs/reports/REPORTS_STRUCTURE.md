# Reports Structure - AgroVision

## Objetivo

Documentar la estructura, componentes y flujo de los reportes prescriptivos generados por AgroVision. Estos reportes sintetizan evidencia, riesgo, alertas, recomendaciones y acciones en un documento ejecutivo para productores y técnicos.

---

## 1. Tipos de Reportes

### 1.1 Reporte Prescriptivo (PrescriptiveFieldReport)

**Propósito:** Reporte detallado por zona, mostrando diagnóstico, riesgo, alerta, recomendación y acciones sugeridas.

**Destinatario:** Productor agrícola, técnico de campo, equipo de apoyo.

**Frecuencia:** Generado bajo demanda o cada 24h en modo automático.

**Estructura base:**

```typescript
{
  reportId: string;              // ID único: REP-YYYYMMDD-HHMMSS-ZoneId
  reportType: "prescriptive";
  fieldId: string;               // Campo donde ocurre el evento
  zoneId: string;                // Zona específica (ej: zone-03)
  cropType: string;              // Tipo de cultivo (ej: "corn", "soybean")
  generatedAt: Date;             // Timestamp de generación

  // Risk & Health Metrics
  finalRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  healthScore: number;           // 0-100, donde 100 es óptimo
  mainCause: string;             // Causa raíz del problema (ej: "Estrés hídrico + baja defensa")

  // Evidence Layer
  evidence: Evidence[];          // Array de evidencias que sustenta el riesgo

  // Alert Layer
  alerts: Alert[];               // Array de alertas activas generadas

  // Recommendation Layer
  recommendations: Recommendation[]; // Array de recomendaciones
  suggestedAction: string;       // Acción principal sugerida en texto plano
  actionPriority: "IMMEDIATE" | "URGENT" | "MODERATE" | "LOW";

  // Expected Impact
  expectedImpact: string;        // Impacto esperado si se ejecuta la acción (ej: "Recuperación de 15-20% de vigor en 7 días")
  estimatedCost?: number;        // Costo estimado en USD
  estimatedDaysToRecover?: number; // Días estimados hasta recuperación

  // Audit Trail
  createdBy: string;             // Usuario/sistema que generó el reporte
  lastModifiedAt?: Date;
  version: number;               // Versión del reporte (para cambios posteriores)

  // Additional Context
  notes?: string;                // Observaciones técnicas adicionales
  references?: string[];         // Referencias a documentos o standards
}
```

---

## 2. Componentes de Evidencia

### 2.1 Evidencia (Evidence)

Cada evidencia es una capa de información que sustenta el diagnóstico.

```typescript
{
  evidenceId: string;            // ID único: ev-001, ev-002, ev-003, etc.
  type: "visual" | "spectral" | "sensor" | "historical" | "model";
  source: string;                // Fuente: "rover", "satellite", "iot_sensor", "field_notebook", "prediction"

  // Visual Evidence
  description: string;           // Descripción clara: "Clorosis moteada en hojas"
  imageUrl?: string;             // URL a foto de campo
  severity: "low" | "medium" | "high" | "severe";

  // Spectral Evidence (Satellite)
  ndviValue?: number;            // Índice de vegetación normalizado (-1 a 1)
  ndviChange?: number;           // Cambio en NDVI vs referencia (-1 a 1)
  ndviDateRange?: { from: Date; to: Date }; // Rango temporal del análisis

  // Sensor Evidence
  sensorId?: string;             // ID del sensor IoT
  parameter?: string;            // Parámetro medido (ej: "soil_moisture_percent")
  value?: number;                // Valor medido
  unit?: string;                 // Unidad (ej: "%", "mm", "°C")
  threshold?: number;            // Umbral de referencia
  status?: "normal" | "warning" | "critical"; // Vs umbral

  // Temporal Info
  capturedAt: Date;              // Cuándo se capturó la evidencia
  validUntil?: Date;             // Cuándo expira la validez de la evidencia

  // Quality Indicators
  confidence: number;            // 0-100, confianza en la evidencia
  reliabilityScore?: number;     // 0-100, qué tan confiable es la fuente
}
```

---

## 3. Componentes de Alerta

### 3.1 Alerta (Alert)

Comunicación de riesgo detectado que requiere acción.

```typescript
{
  alertId: string;               // ID único: AL-01, AL-02, etc.
  alertType: "pest" | "disease" | "water_stress" | "nutrient_deficiency" | "weather" | "anomaly";
  severity: "low" | "medium" | "high" | "critical";

  // Content
  title: string;                 // Título corto (ej: "Estrés hídrico severo detectado")
  message: string;               // Mensaje para productor (lenguaje simple)
  technicalDescription?: string; // Descripción técnica (si es relevante)

  // Context
  zoneId: string;
  affectedArea?: number;         // Hectáreas o porcentaje afectado

  // Trigger Info
  triggeredBy: string[];         // Array de evidenceIds que disparan la alerta
  triggerCondition: string;      // Lógica: "ev-001 AND ev-003" o similar

  // Temporal
  generatedAt: Date;
  expiresAt?: Date;              // Cuándo la alerta deja de ser válida
  status: "active" | "acknowledged" | "resolved" | "expired";

  // Response Guidance
  recommendedAction?: string;    // Acción inmediata sugerida
  estimatedUrgencyWindow?: string; // Ej: "next 48 hours"
}
```

---

## 4. Componentes de Recomendación

### 4.1 Recomendación (Recommendation)

Acción específica derivada de las alertas y evidencias.

```typescript
{
  recommendationId: string;      // ID único: REC-01, REC-02, etc.

  // Trigger & Source
  generatedFrom: string[];       // Array de alertIds que generan la recomendación
  basedOnEvidence: string[];     // Array de evidenceIds que sustentan

  // Content
  title: string;                 // Título (ej: "Aplicar riego de emergencia")
  description: string;           // Descripción detallada para productor
  technicalRationale?: string;   // Por qué esto funciona (optional, técnico)

  // Prescription
  actionType: "irrigation" | "fertilization" | "pest_control" | "disease_control" | "monitoring" | "harvesting" | "other";
  detailedAction: string;        // Pasos específicos (ej: "Aplicar 30mm de agua en próximas 12-24h")

  // Dosage / Quantity
  product?: string;              // Producto específico si aplica
  dosage?: string;               // Dosis (ej: "2L/ha")
  applicationMethod?: string;    // Cómo aplicar (ej: "riego localizado")

  // Timing
  expectedTiming: string;        // Urgencia (ej: "next 24 hours", "within 7 days")

  // Expected Outcomes
  expectedOutcome: string;       // Qué se espera lograr (ej: "Recuperar vigor vegetal y reducir estrés")
  expectedBenefit: number;       // % de mejora esperada (0-100)
  estimatedROI?: number;         // Retorno esperado (optional)

  // Risk Mitigation
  potentialRisks?: string[];     // Riesgos si NO se ejecuta

  // Metadata
  generatedAt: Date;
  priority: "immediate" | "urgent" | "moderate" | "low";
  status: "pending" | "acknowledged" | "in_progress" | "completed" | "skipped";

  // Audit
  createdBy: string;
  executedAt?: Date;
  executedBy?: string;
}
```

---

## 5. Estructura del Reporte Integrado

```typescript
interface PrescriptiveFieldReport {
  // === HEADER ===
  reportId: string;
  reportType: "prescriptive";
  fieldId: string;
  zoneId: string;
  cropType: string;
  generatedAt: Date;

  // === RISK ASSESSMENT ===
  finalRiskLevel: "low" | "medium" | "high" | "critical";
  healthScore: number; // 0-100
  mainCause: string;

  // === EVIDENCE LAYER (Why we know there's a problem) ===
  evidence: Evidence[]; // Array: ev-001, ev-002, ev-003, ...

  // === ALERT LAYER (What's the immediate threat) ===
  alerts: Alert[]; // Array: AL-01, AL-02, ...

  // === RECOMMENDATION LAYER (What should we do) ===
  recommendations: Recommendation[]; // Array: REC-01, REC-02, ...
  suggestedAction: string; // Primary action in plain text
  actionPriority: "immediate" | "urgent" | "moderate" | "low";

  // === EXPECTED IMPACT ===
  expectedImpact: string; // Summary of what will happen
  estimatedCost?: number;
  estimatedDaysToRecover?: number;

  // === AUDIT & METADATA ===
  createdBy: string;
  version: number;
  lastModifiedAt?: Date;
  notes?: string;
}
```

---

## 6. Flujo de Generación de Reporte

```
Evidencia capturada
        ↓
  ┌─────────────────────────────────┐
  │ Evaluación de Riesgo            │
  │ (¿Hay problema?)                │
  └─────────────────────────────────┘
        ↓ [Sí, hay riesgo]
  ┌─────────────────────────────────┐
  │ Generar Alerta(s)               │
  │ (¿Cuál es el peligro inmediato?)│
  └─────────────────────────────────┘
        ↓
  ┌─────────────────────────────────┐
  │ Generar Recomendación(es)       │
  │ (¿Qué hacer al respecto?)       │
  └─────────────────────────────────┘
        ↓
  ┌─────────────────────────────────┐
  │ Integrar en Reporte Prescriptivo│
  │ (Resumen ejecutivo)             │
  └─────────────────────────────────┘
        ↓
  Reporte listo para distribuir
```

---

## 7. Ejemplo Real: zone-03 (Demo)

```typescript
{
  reportId: "REP-20260705-143022-zone-03",
  reportType: "prescriptive",
  fieldId: "field-002",
  zoneId: "zone-03",
  cropType: "corn",
  generatedAt: "2026-07-05T14:30:22Z",

  // Risk Assessment
  finalRiskLevel: "high",
  healthScore: 42,
  mainCause: "Estrés hídrico severo combinado con baja defensa y posible inicio de plagas estructurales",

  // Evidence
  evidence: [
    {
      evidenceId: "ev-001",
      type: "visual",
      description: "Clorosis moteada en hojas, defoliación parcial visible",
      severity: "high",
      imageUrl: "s3://agrovision/fields/field-002/zone-03/evidence-001.jpg",
      capturedAt: "2026-07-05T09:15:00Z",
      confidence: 95
    },
    {
      evidenceId: "ev-002",
      type: "spectral",
      ndviValue: 0.35,
      ndviChange: -0.28,
      severity: "high",
      capturedAt: "2026-07-05T10:00:00Z",
      confidence: 88
    },
    {
      evidenceId: "ev-003",
      type: "sensor",
      parameter: "soil_moisture_percent",
      value: 18,
      unit: "%",
      threshold: 25,
      status: "critical",
      severity: "high",
      capturedAt: "2026-07-05T08:45:00Z",
      confidence: 100
    }
  ],

  // Alerts
  alerts: [
    {
      alertId: "AL-01",
      alertType: "water_stress",
      severity: "high",
      title: "Estrés hídrico severo detectado en zone-03",
      message: "La humedad del suelo ha caído por debajo de lo óptimo. Riego de emergencia recomendado en próximas 12-24 horas.",
      triggeredBy: ["ev-003"],
      generatedAt: "2026-07-05T11:00:00Z",
      status: "active"
    },
    {
      alertId: "AL-02",
      alertType: "pest",
      severity: "high",
      title: "Posible inicio de plagas estructurales",
      message: "Síntomas visuales sugieren presencia de plagas. Inspección técnica urgente recomendada.",
      triggeredBy: ["ev-001"],
      generatedAt: "2026-07-05T11:05:00Z",
      status: "active"
    }
  ],

  // Recommendations
  recommendations: [
    {
      recommendationId: "REC-01",
      title: "Aplicar riego de emergencia",
      description: "Aplicar 30-35mm de agua mediante riego localizado en próximas 12-24 horas para aliviar estrés hídrico.",
      actionType: "irrigation",
      detailedAction: "Riego por goteo: 30mm en dos turnos de 6 horas, en horario de menor evapotranspiración (amanecer y atardecer).",
      expectedTiming: "next 24 hours",
      expectedOutcome: "Restaurar disponibilidad de agua en zona radicular y reducir estrés de la planta.",
      expectedBenefit: 35,
      priority: "immediate",
      generatedFrom: ["AL-01"],
      basedOnEvidence: ["ev-003"],
      generatedAt: "2026-07-05T11:10:00Z"
    }
  ],

  suggestedAction: "Aplicar 30mm de agua mediante riego localizado en próximas 12-24 horas; realizar inspección técnica el mismo día para evaluar presencia de plagas.",
  actionPriority: "immediate",

  expectedImpact: "Con riego oportuno, se espera recuperación de 15-20% de vigor en 7 días. Si no se actúa, se proyecta pérdida de 25-30% de rendimiento.",
  estimatedCost: 45,
  estimatedDaysToRecover: 7,

  createdBy: "MarvinSystem",
  version: 1
}
```

---

## 8. Endpoints Relacionados

Ver `reportRoutes.ts` para rutas específicas.

- `GET /api/reports/prescriptive/:zoneId` - Obtener reporte prescriptivo de zona
- `GET /api/reports/prescriptive/:zoneId/history` - Historial de reportes
- `POST /api/reports/prescriptive` - Crear nuevo reporte
- `GET /api/reports/:reportId` - Obtener reporte específico

---

## 9. Validación de Reporte

Antes de generar un reporte, validar:

- [ ] Al menos una evidencia presente
- [ ] Riesgo evaluado desde evidencias
- [ ] Si hay riesgo, al menos una alerta generada
- [ ] Si hay alerta, al menos una recomendación generada
- [ ] Timestamps son coherentes (evidencia → alerta → recomendación)
- [ ] No hay referencias rotas entre componentes
- [ ] Mensajes para productor son comprensibles (sin jerga técnica)

---

## 10. Versionado

- **v1.0** (2026-07-05): Estructura base con evidencia, alerta, recomendación e integración en reporte prescriptivo.

---

**Última actualización:** 2026-07-09  
**Estado:** En producción para demo (Día 8-11)
