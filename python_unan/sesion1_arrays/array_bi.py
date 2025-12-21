notas = [
    [80, 90, 70, 100],  # estudiante 1
    [60, 75, 85, 95],   # estudiante 2
    [90, 88, 92, 85]    # estudiante 3
]

print("\nMatriz de notas:")
for fila in notas:
    print(fila)

num_est = len(notas)
num_asig = len(notas[0])

# Promedio de cada estudiante (filas)
print("\nPromedios por estudiante:")
promedios_est = []
for i in range(num_est):
    suma = 0
    for nota in notas[i]:
        suma += nota
    prom = suma / num_asig
    promedios_est.append(prom)
    print(f"Estudiante {i+1}: {round(prom,2)}")

# Promedio de cada asignatura (columnas)
print("\nPromedios por asignatura:")
for j in range(num_asig):
    suma_col = 0
    for i in range(num_est):
        suma_col += notas[i][j]
    prom_col = suma_col / num_est
    print(f"Asignatura {j+1}: {round(prom_col,2)}")

# Estudiante con mayor promedio
idx_mejor = 0
mejor_prom = promedios_est[0]
for i in range(1, len(promedios_est)):
    if promedios_est[i] > mejor_prom:
        mejor_prom = promedios_est[i]
        idx_mejor = i

print(f"\nEstudiante con mayor promedio: Estudiante {idx_mejor+1} ({round(mejor_prom,2)})")

idx_menor = 0
menor_prom = promedios_est[1]
for i in range(1, len(promedios_est)):
    if promedios_est[i] < mejor_prom:
        menor_prom = promedios_est[i]
        idx_menor = i

print(f"\nEstudiante con menor promedio: , Estudiante {idx_menor+1} ({round(menor_prom,1)})")