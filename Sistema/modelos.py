# modelos.py
#Contiene las clases Cliente y Prestamo.

from datetime import datetime
import uuid

class Cliente:
    """Modelo para almacenar la información básica del cliente."""
    def __init__(self, id_cliente, nombre, correo, contraseña):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        self.prestamo = None

    def to_dict(self):
        return {
            "id_cliente": self.id_cliente,
            "nombre": self.nombre,
            "correo": self.correo,
            "contraseña": self.contraseña,
            "prestamo": self.prestamo.to_dict() if self.prestamo else None
        }

class Prestamo:
    """Modelo para almacenar los detalles y estado del préstamo."""
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, fecha_nacimiento, direccion, telefono, fecha_desembolso=None):
        self.id_prestamo = id_prestamo
        self.monto = float(monto)
        self.tasa_interes = float(tasa_interes)
        self.plazo = int(plazo)
        self.saldo_pendiente = float(monto)
        self.cedula = cedula
        self.fecha_nacimiento = fecha_nacimiento
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
            "fecha_nacimiento": self.fecha_nacimiento,
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

    def pagar_cuota(self, sumar_meses_func): # Recibe la función de utilidad
        # Cálculo simple: parte principal fija + interés mensual sobre monto original
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        cuota = round(principal_mensual + interes_mensual, 2)

        if cuota >= self.saldo_pendiente:
            cuota = round(self.saldo_pendiente, 2)
            principal_pagado = max(0.0, round(cuota - interes_mensual, 2))
        else:
            principal_pagado = principal_mensual

        self.saldo_pendiente = round(max(0.0, self.saldo_pendiente - cuota), 2)
        self.ganancias = round(self.ganancias + interes_mensual, 2)
        self.cuotas_pagadas += 1
        self.registrar_transaccion("Pago de cuota", cuota, f"Pago mensual - principal {principal_pagado:.2f}, interés {interes_mensual:.2f}")
        return cuota

    def generar_plan_amortizacion(self, sumar_meses_func): # Recibe la función de utilidad
        from utilidades import sumar_meses
        plan = []
        try:
            fecha = datetime.strptime(self.fecha_desembolso, "%Y-%m-%d")
        except:
            fecha = datetime.now()
            
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        
        for i in range(1, self.plazo + 1):
            fecha_pago = sumar_meses_func(fecha, i)
            total = round(principal_mensual + interes_mensual, 2)
            
            # Ajuste para la última cuota si el saldo es menor a la cuota total
            if i == self.plazo:
                saldo_proyectado = self.monto - (principal_mensual * (self.plazo - 1))
                total = round(min(saldo_proyectado + interes_mensual, total), 2)


            if i <= self.cuotas_pagadas:
                estado = "Pagada"
                # Para la vista de plan, si la cuota fue pagada, ajustamos el total al valor fijo
                total_cuota_mostrar = round(principal_mensual + interes_mensual, 2)
            else:
                total_cuota_mostrar = total
                estado = f"${total_cuota_mostrar:.2f}"
            
            plan.append((i, fecha_pago.strftime("%d/%m/%Y"), f"{principal_mensual:.2f}", f"{interes_mensual:.2f}", estado))
        return plan