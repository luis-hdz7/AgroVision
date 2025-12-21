def crear_cliente(historial, nombre, telefono, direccion):
    nuevo_cliente = {
        "nombre": nombre,
        "telefono": telefono,
        "direccion": direccion,
        "prestamos": []
    }
    historial.append(nuevo_cliente)
    return nuevo_cliente

def buscar_cliente(historial, nombre):
    return next((c for c in historial if c["nombre"].lower() == nombre.lower()), None)

def mostrar_historial(historial):
    if not historial:
        return "No hay clientes registrados."
    salida = ""
    for c in historial:
        salida += f"\n{c['nombre']} ({c['telefono']}) - {c['direccion']}\n"
        if c["prestamos"]:
            for i, p in enumerate(c["prestamos"], 1):
                salida += f"  Préstamo #{i}: ${p['monto_inicial']} → ${p['monto_final']} en {p['tiempo_dias']} días\n"
        else:
            salida += "  Sin préstamos registrados.\n"
    return salida
