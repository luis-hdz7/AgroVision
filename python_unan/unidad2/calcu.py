#original.py
import calculadora

def mostrar_menu():
    print("Calculadora basica")
    print("1. Sumar")
    print("2. Restar")
    print("3. Multiplicar")
    print("4. Dividir")
    print("5. Salir")

while True:
    mostrar_menu()
    opcion = input("Seleccione una opcion 1-5")
    if (opcion == '5'):
        print("Adios")
    break

    if opcion in['1','2','3','4']:
        try:
            num1 = float(input(" "))
            num2 = float(input(" "))
        except ValueError:
            print("Opcion no valida. Intente de nuevo")























