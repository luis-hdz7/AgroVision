def calcular_area_circulo(radio):
       pi = 3.1416
       area = pi * radio ** 2
       return area

areaCalculada = calcular_area_circulo(8)
print(f"El área del circulo es: {areaCalculada}")
print(f"El dato de la viables es: {type(areaCalculada)}")
