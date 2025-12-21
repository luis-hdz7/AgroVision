# modelos.py
import uuid
from datetime import datetime
from utilidades import sumar_meses # Importación directa, ya que utilidades ya no importa modelos.

class Cliente:
    """Representa a un cliente del sistema."""
    def __init__(self, id_cliente, nombre, correo, contrasena, sueldo=0.0):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contrasena
        self.sueldo = sueldo
        self.prestamo = None

    def to_dict(self):
        return {
            "id_cliente": self.id_cliente,
            "nombre": self.nombre,
            "correo": self.correo,
            "contraseña": self.contraseña,
            "sueldo": self.sueldo,
            "prestamo": self.prestamo.to_dict() if self.prestamo else None
        }

class Prestamo:
    """Representa un préstamo activo con su lógica de amortización."""
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, direccion, telefono, fecha_desembolso=None):
        self.id_prestamo = id_prestamo
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.saldo_pendiente = monto
        self.cedula = cedula
        self.direccion = direccion
        self.telefono = telefono
        self.historial = []
        self.fecha_desembolso = fecha_desembolso or datetime.now().strftime("%Y-%m-%d")
        self.ganancias = 0.0
        self.cuotas_pagadas = 0

    def to_dict(self):
        return {
            "id_prestamo": self.id_prestamo,
            "monto": self.monto,
            "tasa_interes": self.tasa_interes,
            "plazo": self.plazo,
            "saldo_pendiente": self.saldo_pendiente,
            "cedula": self.cedula,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "historial": self.historial,
            "fecha_desembolso": self.fecha_desembolso,
            "ganancias": self.ganancias,
            "cuotas_pagadas": self.cuotas_pagadas
        }

    def registrar_transaccion(self, tipo, monto, detalle):
        self.historial.append({
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tipo": tipo,
            "monto": monto,
            "detalle": detalle
        })

    def pagar_cuota(self):
        if self.plazo <= 0: return 0.0
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        cuota = round(principal_mensual + interes_mensual, 2)

        if self.saldo_pendiente <= 0: return 0.0

        if cuota > self.saldo_pendiente:
            cuota = self.saldo_pendiente
            interes_mensual = 0 
            
        self.saldo_pendiente -= cuota
        if self.saldo_pendiente < 0:
            self.saldo_pendiente = 0.0
            
        self.ganancias += interes_mensual
        self.cuotas_pagadas += 1
        
        self.registrar_transaccion("Pago de cuota", cuota, f"Pago de cuota aprobado. Cuota #{self.cuotas_pagadas}")
        return cuota

    def generar_plan_amortizacion(self):
        """Retorna lista de tuplas: (nro, fecha_pago, cuota_principal, interes, total_cuota, saldo_cliente, estado_cuota)"""
        plan = []
        try:
            fecha = datetime.strptime(self.fecha_desembolso, "%Y-%m-%d")
        except:
            fecha = datetime.now()

        principal_mensual = round(self.monto / self.plazo, 2) if self.plazo > 0 else 0.0
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2) if self.plazo > 0 else 0.0
        saldo_simulado = self.monto

        for i in range(1, (self.plazo if self.plazo>0 else 1) + 1):
            fecha_pago = sumar_meses(fecha, i)
            total = round(principal_mensual + interes_mensual, 2)
            
            if i == self.plazo:
                principal = round(saldo_simulado, 2)
                total = round(principal + interes_mensual, 2)
            else:
                principal = principal_mensual

            if i <= self.cuotas_pagadas:
                estado = "Pagada"
            elif i == self.cuotas_pagadas + 1:
                estado = "Próxima"
            else:
                estado = "Pendiente" 
            
            total_cuota_str = f"${total:.2f}"
            saldo_simulado_str = f"${saldo_simulado:.2f}"
            
            saldo_simulado = round(saldo_simulado - principal, 2)
            if saldo_simulado < 0:
                saldo_simulado = 0.0

            plan.append((i, fecha_pago.strftime("%d/%m/%Y"), f"${principal:.2f}", f"${interes_mensual:.2f}", total_cuota_str, saldo_simulado_str, estado))

        return plan


class Solicitud:
    """Representa una solicitud de préstamo del cliente."""
    def __init__(self, id_solicitud, id_cliente, monto, tasa_interes, plazo, cedula, direccion, telefono, estado="Pendiente", fecha=None):
        self.id_solicitud = id_solicitud
        self.id_cliente = id_cliente
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.cedula = cedula
        self.direccion = direccion
        self.telefono = telefono
        self.estado = estado  # 'Aprobada', 'Rechazada', 'Pendiente'
        self.fecha = fecha or datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def to_dict(self):
        return {
            "id_solicitud": self.id_solicitud,
            "id_cliente": self.id_cliente,
            "monto": self.monto,
            "tasa_interes": self.tasa_interes,
            "plazo": self.plazo,
            "cedula": self.cedula,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "estado": self.estado,
            "fecha": self.fecha
        }