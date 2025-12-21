nombres = ["Ana", "Luis", "Pedro", "Ana", "Carlos"]

def buscar_nombre(nombres, target):
    for nombre in range(len(nombres)):
        if nombres[nombre] == target:
            print(f"El nombre {target} se encuentra en la posicion {nombre}")
    return -1
buscar_nombre(nombres, target="Ana")
