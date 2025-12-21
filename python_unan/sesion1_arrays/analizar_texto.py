# Primer paso. Comenzamos pidiendole al usuario que ingrese una frase.
frase = input("Ingrese una frase: ")

#Segundo paso. Ya con la frase lista, separaramos las palabras para contarlas con una funcion.
def contar_palabras(frase):
    letras = frase.split() #el split nos sirve para separar la frase.
    return len(letras)

print("El numero de palabras en la frase es: ", contar_palabras(frase))

#Tercer paso. En esta parte identificamos la palabra mas larga del texto, y tambien si hay caracteres en el texto.
def palabra_larga(frase):
   identificar = frase.split()
   mas_larga = max(identificar, key=len) #key=len significa usar la longitud del elemento como criterio.
   print("La palabra mas larga es:", mas_larga)
   print("Tiene", len(mas_larga), "caracteres.")
   #Cuarto paso. Permitimos al usuario ingresar una palabra, para asi ver cuantas veces se repite en el texto.
   palabra_buscar = input("Ingresa una palabra a buscar: ")
   cantidad = identificar.count(palabra_buscar) #El count hace que nos devuelva el numero dado anteriormente.
   print(f"La palabra '{palabra_buscar}' aparece {cantidad} veces en el texto")
palabra_larga(frase) 
#Por ultimo mandamos a llamar la funcion, dandonos una respuesta clara.















