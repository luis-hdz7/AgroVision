#Busqueda lineal recursiva
numeros = [5, 8, 12, 16, 22]

def linear_search_recursiva(numeros, target, index=0):
    #Caso base
    if index >= len(numeros):
        return -1 #Esto significa que no se encontro el elemento.
    if numeros[index] == target:
        return index
    return linear_search_recursiva(numeros, target, index + 1)

print(linear_search_recursiva(numeros, 12)) #Salida: 2
print(linear_search_recursiva(numeros, 7)) #salida: -1

