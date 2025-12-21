def calcular_interes(monto, dias, tasa=0.15):
    return monto * (1 + tasa * dias)

def registrar_prestamo(cliente, monto, dias):
    monto_final = calcular_interes(monto, dias)
    prestamo = {
        "monto_inicial": monto,
        "tiempo_dias": dias,
        "monto_final": monto_final
    }
    cliente["prestamos"].append(prestamo)
    return prestamo
