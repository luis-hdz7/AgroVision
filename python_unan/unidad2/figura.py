import math

def calcular_area_perimetro():
    print("Elige una figura geométrica:")
    print("1. Cuadrado")
    print("2. Rectángulo")
    print("3. Triángulo")
    print("4. Círculo")
    
    opcion = input("Ingresa el número de tu elección: ")

    if opcion == "1":
        lado = float(input("Ingresa la longitud del lado del cuadrado: "))
        area = lado ** 2
        perimetro = 4 * lado
        figura = "Cuadrado"

    elif opcion == "2":
        base = float(input("Ingresa la base del rectángulo: "))
        altura = float(input("Ingresa la altura del rectángulo: "))
        area = base * altura
        perimetro = 2 * (base + altura)
        figura = "Rectángulo"

    elif opcion == "3":
        lado1 = float(input("Ingresa el primer lado del triángulo: "))
        lado2 = float(input("Ingresa el segundo lado del triángulo: "))
        lado3 = float(input("Ingresa el tercer lado del triángulo: "))
        s = (lado1 + lado2 + lado3) / 2
        area = math.sqrt(s * (s - lado1) * (s - lado2) * (s - lado3))
        perimetro = lado1 + lado2 + lado3
        figura = "Triángulo"

    elif opcion == "4":
        radio = float(input("Ingresa el radio del círculo: "))
        area = math.pi * radio ** 2
        perimetro = 2 * math.pi * radio
        figura = "Círculo"

    else:
        print("Opción no válida.")
        return

    print(f"\n{figura}:")
    print(f"Área = {area:.2f}")
    print(f"Perímetro = {perimetro:.2f}")

calcular_area_perimetro()