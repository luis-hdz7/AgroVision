def bubble_sort(lista):
    n = len(lista)
    for i in range(n):
        for j in range(0, n-i-1):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
#Lista de ejemplo
numeros = [5, 3, 8, 6, 2, 7, 4, 1]
print("Lista original: ", numeros)
bubble_sort(numeros)

print("Lista Ordenada: ", numeros)