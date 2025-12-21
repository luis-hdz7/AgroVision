def calcular_interes(monto, tasa_mensual, meses):
    interes = monto *(tasa_mensual/100) * meses
    total = monto + interes
    return interes, total

def main():
    print("====Banco Ficohsa====")
    nombre = input("Ingrese su nombre: ")
    monto = float(input("Ingrese la cantidad de monto: $"))
    tasa = float(input("Ingrese el porcentaje de interes mensual: %"))
    meses = int(input("Ingrese la plaza de pago (en meses): "))

    interes, total = calcular_interes(monto, tasa, meses)
    cuota_mensual = total / meses

    print("\n--- Resumen del Préstamo ---")
    print(f"Cliente: {nombre}")
    print(f"Monto del préstamo: ${monto:.2f}")
    print(f"Interés generado: ${interes:.2f}")
    print(f"Total a pagar: ${total:.2f}")
    print(f"Cuota mensual aproximada: ${cuota_mensual:.2f}")
main()














