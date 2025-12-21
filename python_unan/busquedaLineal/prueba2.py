#metodo iterativo
import os 
import time

calificaciones = []
def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

#Ingresar calificaciones
print("=== Lista de Calificaciones ===")
print("Ingresa 0 para terminar las solicitudes.")
while True:
    calificacion = int(input(f"Ingresa la Calificacion {len(calificaciones) + 1}: "))
    if calificacion == 0:
        break
    calificaciones.append(calificacion)

#Calificaciones ingresadas
print("Estas son las calificaciones ingresadas: ", calificaciones)
while True:
    try:
        calificacion_buscar = int(input("Ingresa la calificación a buscar: "))
        break
        if calificacion_buscar < 0:
            print(" La calificación no puede ser negativa. Intenta de nuevo.")
            
    except ValueError:
        print("Debes ingresar un numero valido")



#calificacion a buscar
def busqueda_lineal_iteractiva(calificaciones, calificacion_buscar):
    for i in range(len(calificaciones)):
        if calificaciones[i] == calificacion_buscar:
            print(f"La calificacion {calificacion_buscar} se encuentra en la posicion {i}")
        elif calificacion_buscar not in calificaciones:
            print(f"La calificacion {calificacion_buscar} no se encuentra en la lista")
    return calificacion_buscar

#llamado a la calificacion
def main():
    print("La calificacion buscada: ", busqueda_lineal_iteractiva(calificaciones, calificacion_buscar))
main()








