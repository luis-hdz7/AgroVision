estudiantes = []
print("Ingrese 5 nombres de estudiantes:")
for i in range(5):
    nombre = input(f"Nombre {i+1}: ")
    estudiantes.append(nombre)

print("\nLista completada.")
print(estudiantes)

buscar_estu = input("\nIngresa el nombre del estudiante a buscar: ")
if buscar_estu in estudiantes:
    posicion = estudiantes.index(buscar_estu)
    print(f"El nombre '{buscar_estu}' se encuentra en la posicion {posicion}.")
else:
    print(f"El nombre '{buscar_estu}' no se encuetra en la lista de estudiantes.")

estu_eliminar = input("Ingresa el nombre a eliminar: ")
if estu_eliminar in estudiantes:
    estudiantes.remove(estu_eliminar)
    print(f"El nombre '{estu_eliminar}' ha sido eliminado.")
    print(estudiantes)
else:
    print("El nombre del estudiante no ha sido eliminado.")

newStudent = input("Agrega un nuevo nombre: ")
estudiantes.insert(0, newStudent)
print("EL nombre nuevo ha sido agregado.")

print("\nLista final de estudiantes: ", estudiantes)










