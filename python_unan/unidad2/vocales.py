print("Bienvenido al contador de vocales!")

vocales = "aeiou"
textos = str(input("Ingresa las vocales a contar: ")).lower()
contador = 0
def contador_vocales():
    global contador #esto hace que se modifique la variable global
    for letra in textos:
        if letra in vocales:
            contador += 1

contador_vocales() #aqui es la llamda de la funcion que definimos con def contador_vocales()
print("Cantidad de vocales: ", contador)









