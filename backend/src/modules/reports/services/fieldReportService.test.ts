import { buildFieldReport } from './fieldReportService';

const sampleReport = buildFieldReport({
  fieldId: 'field-001',
  fieldName: 'Parcela A',
  cropName: 'Maíz',
  incidentDescription: 'Se detectó stress hídrico y manchas foliares en el sector norte.',
  location: 'Sector norte - 0.75 ha',
  severity: 'HIGH',
  alerts: [
    {
      title: 'Alta radiación y falta de riego',
      description: 'La parcela no tiene riego activo desde hace 24 horas y muestra signos de deshidratación.',
      severity: 'HIGH',
    },
    {
      title: 'Manchas foliares en hojas jóvenes',
      description: 'Se observan lesiones color marrón en el 30% del área inspeccionada.',
      severity: 'MEDIUM',
    },
  ],
  evidence: [
    {
      type: 'image',
      source: 'inspección manual',
      description: 'Foto de hojas con manchas foliares.',
      url: 'https://example.com/evidence/field-001-image-1.jpg',
    },
    {
      type: 'sensor',
      source: 'estación de humedad',
      description: 'Lectura de humedad del suelo por debajo del umbral crítico.',
    },
  ],
  recommendations: [
    {
      summary: 'Aumentar riego de manera controlada',
      details: 'Revisar el sistema de riego localizado y aplicar riego adicional en el sector afectado.',
      dueDate: '2026-06-20T12:00:00.000Z',
    },
    {
      summary: 'Aplicar tratamiento foliar preventivo',
      details: 'Usar fungicida compatible con maíz para evitar avance de la mancha foliar.',
    },
  ],
  actionsTaken: [
    {
      summary: 'Inspección de campo completada',
      details: 'Se recorrió el sector norte y se tomaron fotos de las plantas afectadas.',
      performedBy: 'Inspector 7',
    },
  ],
});

console.log('=== Field Report Test ===');
console.log(JSON.stringify(sampleReport, null, 2));
