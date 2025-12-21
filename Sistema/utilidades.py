# utilidades.py
#Contiene funciones auxiliares (sumar_meses, guardar_datos, cargar_datos) y la configuración de administradores.

import json
import os
from datetime import datetime
from modelos import Cliente, Prestamo # Importa los modelos para cargar los datos
import uuid

ARCHIVO_DATOS = "datos.json"

# --- Configuración Admin ---
ADMIN_USERS = ["carlos","marvin","jolman"]
ADMIN_PWDS  = ["83362847","58101169","86847950"]

# --- Funciones de Utilidad ---

def sumar_meses(fecha, meses):
    """Calcula la fecha sumando un número de meses."""
    mes = fecha.month - 1 + meses
    año = fecha.year + mes // 12
    mes = mes % 12 + 1
    # Manejo de días del mes (incluye bisiestos)
    dias_por_mes = [31, 29 if año%4==0 and (año%100!=0 or año%400==0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    dia = min(fecha.day, dias_por_mes[mes-1])
    return fecha.replace(year=año, month=mes, day=dia)

# --- Persistencia de Datos ---

def guardar_datos(clientes):
    """Guarda la lista de clientes en formato JSON."""
    datos = [c.to_dict() for c in clientes]
    with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

def cargar_datos():
    """Carga la lista de clientes desde el archivo JSON."""
    if not os.path.exists(ARCHIVO_DATOS):
        return []
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    except:
        return []
        
    clientes = []
    for d in datos:
        c = Cliente(d.get("id_cliente", str(uuid.uuid4())), d.get("nombre",""), d.get("correo",""), d.get("contraseña",""))
        p = d.get("prestamo")
        if p:
            prest = Prestamo(
                p.get("id_prestamo", str(uuid.uuid4())),
                p.get("monto",0),
                p.get("tasa_interes",0),
                p.get("plazo",12),
                p.get("cedula",""),
                p.get("fecha_nacimiento",""),
                p.get("direccion",""),
                p.get("telefono",""),
                p.get("fecha_desembolso", None)
            )
            # Actualiza atributos dinámicos
            prest.saldo_pendiente = p.get("saldo_pendiente", prest.monto)
            prest.historial = p.get("historial", [])
            prest.ganancias = p.get("ganancias",0.0)
            prest.cuotas_pagadas = p.get("cuotas_pagadas",0)
            c.prestamo = prest
        clientes.append(c)
    return clientes