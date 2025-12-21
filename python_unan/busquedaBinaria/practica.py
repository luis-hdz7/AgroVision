def busqueda_binaria_recursiva(lista, objetivo, izquierda, derecha):
    if izquierda > derecha:
        return -1

    medio = (izquierda + derecha) // 2
    if lista[medio] == objetivo:
        return medio
    elif lista[medio] < objetivo:
        return busqueda_binaria_recursiva(lista, objetivo, medio + 1, derecha)
    else:
        return busqueda_binaria_recursiva(lista, objetivo, izquierda, medio - 1)
# Prueba
numeros = [2, 5, 8, 10, 15, 18, 20, 24, 30, 40, 44, 50, 62,80]
print(f"El numero 20 se encuentra en la posicion: {busqueda_binaria_recursiva(numeros, 20, 0, len(numeros)-1)}")