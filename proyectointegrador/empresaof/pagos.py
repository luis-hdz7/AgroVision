def abonar(cliente, monto_abono):
    if not cliente or not cliente["prestamos"]:
        return None
    cliente["prestamos"][-1]["monto_final"] -= monto_abono
    return cliente["prestamos"][-1]["monto_final"]
