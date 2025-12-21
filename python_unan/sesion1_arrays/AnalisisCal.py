calificaciones = [85, 92, 78, 95, 88, 70, 90, 81, 99, 75]

def calcular_calificacion():
    calificacion_max = max(calificaciones)
    calificacion_min = min(calificaciones)
    print(f"La calificacion maxima es {calificacion_max} y la calificacion minima es {calificacion_min}.")
calcular_calificacion()

def calcular_promedio():
    promedio = sum(calificaciones) / len(calificaciones)
    print("E: promedio de las calificaciones es: ", promedio)
calcular_promedio() 

aprobados = list([85, 92, 95, 88, 90, 81, 99])
ordenada_asc = sorted(aprobados, reverse=False)
print("\nEsta es la lista de clases aprobadas: ", ordenada_asc)

ordenada_desc = sorted(calificaciones, reverse=True)
print("\nEsta es la lista original de forma descendente: ", ordenada_desc)
#print(newlist)


















