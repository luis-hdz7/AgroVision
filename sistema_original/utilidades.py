# utilidades.py
import json
import os
from datetime import datetime
import uuid

# NO IMPORTAR NINGUNA CLASE DEL MÓDULO 'modelos.py' AQUÍ

# Archivo de persistencia
ARCHIVO_DATOS = "datos.json"

# Configuración Admin
ADMIN_USERS = ["carlos","marvin","jolman"]
ADMIN_PWDS = ["83362847","58101169","86847950"]

# ------------------ Utilidades de Fecha ------------------

def sumar_meses(fecha, meses):
    """Suma 'meses' a una fecha, ajustando correctamente el día final de mes."""
    mes = fecha.month - 1 + meses
    año = fecha.year + mes // 12
    mes = mes % 12 + 1
    dias_por_mes = [31, 29 if año % 4 == 0 and (año % 100 != 0 or año % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    dia = min(fecha.day, dias_por_mes[mes - 1]) 
    return fecha.replace(year=año, month=mes, day=dia)

# ------------------ Lógica de Análisis de Riesgo ------------------

def calcular_cuota_mensual(monto, tasa_anual, plazo_meses):
    """Calcula la cuota mensual de un préstamo de forma aproximada."""
    if plazo_meses <= 0 or monto <= 0:
        return 0.0
    
    tasa_mensual = (tasa_anual / 100) / 12.0
    principal_mensual = monto / plazo_meses
    interes_mensual = monto * tasa_mensual
    
    return round(principal_mensual + interes_mensual, 2)

def analizar_solicitud(cliente, monto, tasa_anual, plazo_meses):
    """
    Analiza la viabilidad de un préstamo (Regla de negocio: Cuota <= 35% del sueldo).
    """
    if cliente.prestamo:
        return False, "El cliente ya tiene un préstamo activo."

    if cliente.sueldo <= 0:
        return False, "El sueldo es cero. Préstamo rechazado por falta de ingresos."

    cuota = calcular_cuota_mensual(monto, tasa_anual, plazo_meses)
    
    limite_endeudamiento = cliente.sueldo * 0.35
    
    if cuota > limite_endeudamiento:
        razon = f"La cuota mensual calculada (${cuota:.2f}) excede el 35% de su sueldo (${limite_endeudamiento:.2f})."
        return False, razon
    
    return True, "Aprobada"

# ------------------ Persistencia de Datos ------------------

def guardar_datos(clientes, solicitudes, messagebox=None):
    """Guarda los datos de clientes y solicitudes a disco."""
    datos = {
        "clientes": [c.to_dict() for c in clientes],
        "solicitudes": [s.to_dict() for s in solicitudes]
    }
    try:
        with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        if messagebox:
            messagebox.showerror("Error de Guardado", f"No se pudieron guardar los datos: {e}")

def cargar_datos():
    """Carga los datos de clientes y solicitudes desde disco."""
    # IMPORTACIÓN LOCAL: Se importa aquí para evitar el ciclo con modelos.py
    from modelos import Cliente, Prestamo, Solicitud 
    
    if not os.path.exists(ARCHIVO_DATOS):
        return [], []
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    except Exception:
        return [], []
        
    clientes = []
    for d in datos.get("clientes", []):
        c = Cliente(d.get("id_cliente", str(uuid.uuid4())), d.get("nombre",""), d.get("correo",""), d.get("contraseña",""), d.get("sueldo",0.0))
        p = d.get("prestamo")
        if p:
            prest = Prestamo(
                p.get("id_prestamo", str(uuid.uuid4())),
                p.get("monto", 0.0),
                p.get("tasa_interes", 0.0),
                p.get("plazo", 12),
                p.get("cedula", ""),
                p.get("direccion", ""),
                p.get("telefono", ""),
                p.get("fecha_desembolso", None)
            )
            prest.saldo_pendiente = p.get("saldo_pendiente", prest.monto)
            prest.historial = p.get("historial", [])
            prest.ganancias = p.get("ganancias", 0.0)
            prest.cuotas_pagadas = p.get("cuotas_pagadas", 0)
            c.prestamo = prest
        clientes.append(c)
        
    solicitudes = []
    for s in datos.get("solicitudes", []):
        solicitudes.append(Solicitud(s.get("id_solicitud"), s.get("id_cliente"), s.get("monto"), s.get("tasa_interes"), s.get("plazo"), s.get("cedula"), s.get("direccion"), s.get("telefono"), s.get("estado","Pendiente"), s.get("fecha")))
        
    return clientes, solicitudes