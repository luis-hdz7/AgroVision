ideathon-demo-evidence-map.md

Este documento explica qué evidencia se muestra durante la demo del ideathon
y cómo cada tipo de evidencia sustenta la recomendación final entregada al
agricultor para la zona crítica zone-A3 (campo field-001).

El objetivo es que cualquier persona del equipo (técnica o no técnica) entienda
de un vistazo qué está viendo en pantalla y por qué el sistema llegó a esa
recomendación.


1. Evidencia visual

Qué se muestra: una foto de campo capturada por el técnico, donde se observan
hojas de café con manchas amarillo-anaranjadas, características de la roya.

Por qué importa: es la confirmación humana/visual del problema. Es el tipo
de evidencia más fácil de entender para el agricultor, porque puede compararla
directamente con lo que ve en su parcela.

Dato mock asociado: ev-001 en prescriptiveReportMock.ts.


2. Evidencia satelital simulada

Qué se muestra: un mapa NDVI (índice de vegetación) simulado que compara
el estado actual de la zona contra el de hace 12 días, mostrando una caída
de 0.78 a 0.52.

Por qué importa: demuestra que el sistema puede detectar pérdida de vigor
vegetal antes de que sea visible a simple vista en toda la parcela, usando
datos de tipo satelital (en la demo, simulados).

Dato mock asociado: ev-002 en prescriptiveReportMock.ts.


3. Evidencia de sensor

Qué se muestra: lectura de un sensor de humedad de suelo físico ubicado en
la zona, mostrando 18% de humedad durante 6 días consecutivos, por debajo del
rango óptimo (35-45%).

Por qué importa: es el dato cuantitativo y objetivo que confirma la causa
raíz (estrés hídrico) y permite calcular cuándo y cuánto regar.

Dato mock asociado: ev-003 en prescriptiveReportMock.ts.


4. Evidencia climática

Qué se muestra: datos de estación climática local: 0 mm de lluvia en 14
días y temperatura 3°C por encima del promedio histórico para la fecha.

Por qué importa: da contexto externo (no controlable por el agricultor)
que explica por qué la humedad del suelo bajó y por qué el riesgo aumenta si
no se interviene pronto.

Dato mock asociado: ev-004 en prescriptiveReportMock.ts.


5. Evidencia histórica

Qué se muestra: un registro del cuaderno digital de campo que indica que
esta misma zona tuvo un brote de roya similar hace 14 meses, bajo condiciones
climáticas comparables.

Por qué importa: refuerza la confianza del sistema en el diagnóstico
(no es la primera vez que pasa) y justifica actuar con mayor urgencia.

Dato mock asociado: ev-005 en prescriptiveReportMock.ts.


6. Acción recomendada

Con base en las cinco evidencias anteriores, el sistema genera dos
recomendaciones priorizadas para la zona zone-A3:


Riego suplementario de emergencia — sustentado por evidencia
satelital, de sensor y climática (causa: estrés hídrico).
Tratamiento fungicida focalizado contra roya — sustentado por
evidencia visual e histórica (causa: brote de roya activo).


Cada recomendación queda vinculada explícitamente a los IDs de evidencia que
la sustentan (relatedEvidenceIds), de modo que en la demo se puede hacer
clic en una recomendación y mostrar exactamente qué evidencia la respalda.

Dato mock asociado: rec-201 y rec-202 en prescriptiveReportMock.ts.


Flujo resumido para la demo

ZoneInsight (Jorge) ──┐
Alertas (Jorge) ───────┼──▶ buildPrescriptiveReport() ──▶ PrescriptiveFieldReport ──▶ Dashboard (Brandon)
Recomendaciones (Jorge)┤
Cuaderno de campo ─────┘

La demo navega: Evidencia → Causa raíz → Riesgo → Recomendación → Acción,
mostrando que cada paso está respaldado por datos concretos y no por una
afirmación genérica.