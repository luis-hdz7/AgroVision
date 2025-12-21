def saludar_usuario(nombre):
    print(f"Bienvenido {nombre}! Este programa es acerca de presupuesto para realizar viajes.")
saludar_usuario("Marvin")

def solicitar_informacion(destino):
    destino = str(input("Ingresa el lugar al que gustes viajar: "))
    personas = int(input("Ingrese cantidad de personas: "))
    print(f"Estamos preparando un presupuesto para tu viaje a {destino}!")
solicitar_informacion("destino")

def calcular_costo_viaje():
    # Solicitar datos al usuario
    distancia = float(input("Ingresa la distancia total del viaje en km: "))
    consumo = float(input("Ingresa cuántos km recorre tu vehículo por litro: "))
    precio_litro = float(input("Ingresa el precio del litro de combustible: "))
    costo_alojamiento = float(input("Ingresa el costo total del alojamiento: "))
    costo_peajes = float(input("Ingresa el costo total de peajes: "))
    otros_gastos = float(input("Ingresa otros gastos estimados: "))
    numero_viajeros = int(input("Ingresa el número de personas que viajan: "))

    # Calcular costo de combustible
    litros_necesarios = distancia / consumo
    costo_combustible = litros_necesarios * precio_litro

    # Calcular total general
    total_viaje = costo_combustible + costo_alojamiento + costo_peajes + otros_gastos

    # Calcular costo por persona
    costo_por_persona = total_viaje / numero_viajeros

    # Mostrar resultados
    print("\n--- Resumen de costos del viaje ---")
    print(f"Costo de combustible: C${costo_combustible:.2f}")
    print(f"Costo de alojamiento: C${costo_alojamiento:.2f}")
    print(f"Costo de peajes: C${costo_peajes:.2f}")
    print(f"Otros gastos: C${otros_gastos:.2f}")
    print(f"TOTAL GENERAL: C${total_viaje:.2f}")
    print(f"Costo por persona: C${costo_por_persona:.2f}")

    # Retornar el total y el costo por persona
    return total_viaje, costo_por_persona

# Llamar a la función
total, por_persona = calcular_costo_viaje()

