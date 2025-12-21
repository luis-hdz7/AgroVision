#Como crear un modulo propio
#Paso 1. Crear el archivo del modulo 
#Ej. Crear un archivo llamado Operaciones.py

pi = 3.1416
def sumar(a, b):
    return a + b
def resta(a, b):
    return a - b 
def multiplicar(a, b):
    return a * b 
def dividir (a, b):
    if (b == 0):
        return "Error, division por cero"
    return a/b

if _main_ == "_main_":
    print("Ejecutando las pruebas de la Calculadora.")
    assert sumar(5, 3) == 8
    assert restar(5, 3) == 2
    assert multiplicar(7,3) == 21
    assert dividir(10, 5) == 2
    print("Las pruebas son correctas")

















