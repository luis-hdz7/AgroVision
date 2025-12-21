otros_cursos_min = 2.5
otros_cursos_max = 7
otros_cursos_prom = 4
dalto_curso = 1.5

#diferencia de duracion
diferencia_con_min = dalto_curso / otros_cursos_min * 100
diferencia_con_max = 100 - dalto_curso * 1000 // otros_cursos_max / 10
diferencia_con_promedio = 100 - dalto_curso / otros_cursos_prom * 100

print(f"El curso de Dalto duna un {diferencia_con_min}% menos que el mas rapido")
print(f"El curso de dalto dura un {diferencia_con_max}% menos que el mas lento")
print(f"El curso de dalto dura un {diferencia_con_promedio}% menos que el promedio")
















