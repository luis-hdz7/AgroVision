lista = [
    "auto",
    "casa",
    "computadora",
    "celular",
    "moto",
]

indice = input(f"Ingrese el índice del producto (0 a {len(lista)-1}): ")

if not indice.isdigit():
    print("Error: Debe ingresar un número entero.")
else:
    indice = int(indice)
    if 0 <= indice < len(lista):
        print("Producto seleccionado:", lista[indice])
    else:
        print("Error: El índice está fuera")



