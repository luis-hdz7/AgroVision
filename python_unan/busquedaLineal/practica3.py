lista = [1, 2, 3, 2, 4, 2]

def return_position(lista, target):
    for i in range(len(lista)):
        if lista[i] == target:
            print(f"El numero {target} se encuentra en la posicion {i}")
    return -1
return_position(lista, target=2)









