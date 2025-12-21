nombres = ["Ana", "Luis", "Pedro", "María", "Lucía", "Juan"]
# Solicitar al usuario que ingrese un nombre

nombre_buscar = input("Ingresa un nombre: ")
# COMPLETAR: Verificar si el nombre está en la lista usando el operador "in"
if nombre_buscar in nombres:
 print(f"El nombre {nombre_buscar} SÍ está en la lista")
else:
 print(f"El nombre {nombre_buscar} NO está en la lista")