calificaciones = []

# ---------------------------------------------
# INGRESO DE CALIFICACIONES
# ---------------------------------------------
print("=== Lista de Calificaciones ===")
while True:
    try:
        calificacion = int(input(f"Ingresa la Calificacion {len(calificaciones) + 1}: "))
        if calificacion < 0:
            print("La calificación no puede ser negativa. Intenta nuevamente.")
        calificaciones.append(calificacion)
        break
    except ValueError:
        print("Debes ingresar un número válido.")

print("\nEstas son las calificaciones ingresadas:", calificaciones)

# ---------------------------------------------
# FUNCIÓN DE BÚSQUEDA LINEAL
# ---------------------------------------------
def busqueda_lineal_iterativa(calificaciones, calificacion_buscar):
    for i in range(len(calificaciones)):
        if calificaciones[i] == calificacion_buscar:
            return i  # posición encontrada
    return -1  # no encontrada

# ---------------------------------------------
# OBTENER CALIFICACIÓN A BUSCAR (VALIDADA)
# ---------------------------------------------
while True:
    try:
        calificacion_buscar = int(input("\nIngresa la calificación a buscar: "))
        if calificacion_buscar < 0:
            print("La calificación no puede ser negativa. Intenta de nuevo.")
            continue
        break
    except ValueError:
        print("Debes ingresar un número válido.")

# ---------------------------------------------
# FUNCIÓN MAIN Y RESULTADO
# ---------------------------------------------
def main():
    posicion = busqueda_lineal_iterativa(calificaciones, calificacion_buscar)

    if posicion != -1:
        print(f"La calificación {calificacion_buscar} se encuentra en la posición {posicion}.")
    else:
        print(f"La calificación {calificacion_buscar} NO se encuentra en la lista.")

main()
