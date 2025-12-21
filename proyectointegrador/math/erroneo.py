import math
# Coeficientes de la ecuación cuadrática
a = float(input("Introduce el valor de a: "))
b = float(input("Introduce el valor de b: "))
c = float(input("Introduce el valor de c: "))
# Calcula el discriminante
discriminante = b**2 - 4*a*c
if discriminante > 0:
 # Dos soluciones reales
 raiz1 = (-b + math.sqrt(discriminante)) / (2 * a)
 raiz2 = (-b - math.sqrt(discriminante)) / (2 * a)
 print(f"Las raíces son reales y diferentes: {raiz1} y {raiz2}")
elif discriminante == 0:
 # Una solución real
 raiz = -b / (2 * a)
 print(f"Las raíces son reales e iguales: {raiz}")
 else:
 # Soluciones complejas
 parte_real = -b / (2 * a)
 parte_imaginaria = math.sqrt(-discriminante) / (2 * a)
 print(f"Las raíces son complejas: {parte_real} + {parte_imaginaria}i y
{parte_real} - {parte_imaginaria}i")