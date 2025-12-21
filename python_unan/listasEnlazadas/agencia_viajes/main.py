# main.py
from lista import ListaEnlazada

def menu(opciones):
    print("\n--------------------------------")
    for i, op in enumerate(opciones, 1):
        print(f"{i} - {op}")
    print("--------------------------------")

    while True:
        try:
            opcion = int(input(f"Opción (1 - {len(opciones)}): "))
            if 1 <= opcion <= len(opciones):
                return opcion
            else:
                print("Opción fuera de rango.")
        except ValueError:
            print("Por favor ingrese un número válido.")

def main():
    lista = ListaEnlazada()
    opciones = [
        "Insertar un dato (país/capital).",
        "Buscar por país.",
        "Buscar por capital.",
        "Ver todos los datos.",
        "Borrar un dato.",
        "Salir."
    ]

    while True:
        opcion = menu(opciones)

        if opcion == 1:
            pais = input("Ingrese país: ")
            capital = input("Ingrese capital: ")
            lista.insertar(pais, capital)

        elif opcion == 2:
            pais = input("Ingrese país a buscar: ")
            resultado = lista.buscar_pais(pais)
            print(f"La capital de {pais} es: {resultado}" if resultado else "País no encontrado.")

        elif opcion == 3:
            capital = input("Ingrese capital a buscar: ")
            resultado = lista.buscar_por_capital(capital)
            print(f"{capital} es la capital de: {resultado}" if resultado else "Capital no encontrada.")

        elif opcion == 4:
            lista.mostrar_todos()

        elif opcion == 5:
            pais = input("Ingrese el país a eliminar: ")
            lista.borrar(pais)

        elif opcion == 6:
            print("Saliendo del programa...")
            break
main()
