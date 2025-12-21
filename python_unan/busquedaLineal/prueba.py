import os 
import time

def limpiar_pantalla():
    """Limpia la consola."""
    os.system('cls' if os.name == 'nt' else 'clear')


calificaciones = []
limpiar_pantalla()
print("=== Ingreso de Calificaciones ===")
print("Ingresa '0' para terminar el ingreso.")

while True:
    try:
        entrada = input(f"Ingresa la Calificación {len(calificaciones) + 1}: ")
        calificacion = int(entrada)
        
        if calificacion == 0:
            break
        if calificacion < 0 or calificacion > 100: 
            print("Calificación inválida. Debe estar entre 1 y 100.")
            continue
            
        calificaciones.append(calificacion)
    except ValueError:
        print("Debes ingresar un número entero válido.")

# --- 2. Búsqueda de Calificación ---

if not calificaciones:
    print("\nNo se ingresaron calificaciones para buscar.")
else:
    print("\nCalificaciones ingresadas:", calificaciones)
    
    # Captura segura de la calificación a buscar
    while True:
        try:
            calificacion_buscar = int(input("\nIngresa la calificación a buscar: "))
            if calificacion_buscar < 0:
                print("La calificación no puede ser negativa. Intenta de nuevo.")
                continue
            break
        except ValueError:
            print("Debes ingresar un número válido.")

    # --- 3. Implementación del Método Iterativo (Búsqueda Lineal) ---
    
    def busqueda_lineal_iteractiva(lista, valor):
        for i in range(len(lista)):
            if lista[i] == valor:
                return i  # Retorna inmediatamente la posición al encontrarlo
        return -1 # Retorna -1 si el bucle termina sin encontrar el valor

    # --- 4. Ejecución y Resultado ---

    def main_busqueda(calificaciones, calificacion_buscar):
        posicion = busqueda_lineal_iteractiva(calificaciones, calificacion_buscar)
        
        print("\n=== Resultados de la Búsqueda Lineal ===")
        if posicion != -1:
            print(f"La calificación {calificacion_buscar} se encuentra en la posición {posicion}")
            print(f"Esta en la posicion {posicion} de la lista.")
        else:
            print(f"La calificación {calificacion_buscar} no se encuentra en la lista.")

    main_busqueda(calificaciones, calificacion_buscar)

