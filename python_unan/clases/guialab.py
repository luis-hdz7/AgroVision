edadvalida = False
entrada_edad = input("Por favor ingresa tu edad")

if entrada_edad.isdigit(): #el metodo .isdigit() verifica si la cadena contiene solo digitos
    edad = int(entrada_edad) #si es un digito tratar de convertir a entero

#segundo, verificar si la edad esta en el rango permitido
    if 0 <= edad <=120:
        print("Gracias has ingresado tu {edad} anos. Es una edad valida.")
        edadvalidad = True #La edad es valida, salimos del bucle
    else:
        print("Error, la edad debe estar entre 0 y 120 anos. Intentelo de nuevo")
else:
    print("error, entrada no valida. por favor, introduce un numero entero para tu edad.")
print("Programa de validacion de edad finalizado")


















