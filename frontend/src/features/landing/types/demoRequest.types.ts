/**
 * Contratos del formulario público de demostración.
 * Representan la entrada aceptada y la confirmación mínima persistida.
 */
export interface DemoRequestInput {
  readonly name: string;
  readonly email: string;
  readonly organization?: string;
  readonly message: string;
  readonly consent: "true";
}

export interface DemoRequestConfirmation {
  readonly id: number;
}

// Integración: no representa un correo enviado ni una cita agendada.
