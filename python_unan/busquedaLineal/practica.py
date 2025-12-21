numeros = [10, 20, 30, 40, 50]
def busqueda_lineal_iteractiva(numeros, target):
    for i in range(len(numeros)):
        if numeros[i] == target:
            return i
    return -1

def main():
    print(busqueda_lineal_iteractiva(numeros, 30))
    print(busqueda_lineal_iteractiva(numeros, 70))
main()
