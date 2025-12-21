print("Bienvenido a IMC!")

def leer_datos():
    peso = float(input("Ingresa tu peso en kg: "))
    altura = float(input("Ingresa tu altura en metros: "))
    return peso, altura

#calculo
def calcular_imc(peso, altura):
    return peso / altura ** 2

#interpretacion
def interpretar_imc(imc):
    if imc < 18.5:
        return "bajo peso"
    elif imc < 25.0:
        return "normal"
    elif imc < 30.0:
        return "sobrepeso"
    else: 
        return "Obesidad"

#resultados
def mostrar_resultado(imc, categoria):
    print(f"Tu imc es {imc:.2f} kilos y se clasifica como {categoria}") 
    #imc:.2f significa el formato numerico en float con 2 decimales.

def main():
    peso, altura = leer_datos()
    imc = calcular_imc(peso, altura)
    categoria = interpretar_imc(imc)
    mostrar_resultado(imc, categoria)

main()
















