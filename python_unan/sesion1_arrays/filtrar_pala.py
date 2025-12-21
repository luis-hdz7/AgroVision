frases = []

#Paso 1. Pedir varis frases al usuario.
print("Ingresa tus frases. Escribe 'fin' para terminar.")
while True:
    frase = input()
    if frase == ("fin" or "Fin" or "FIN"):
        break
    frases.append(frase)

#Paso 2. Pedir la palabra clave.
palabra_clave = input("Ingresa la palabra clave: ").lower()

#Encontrar palabra clave.
frases_encontradas = [frase for frase in frases if palabra_clave in frase.lower()]
print("\n=== Frases que contienen la palabra clave ====")
for frase in frases_encontradas:
    print(frase)

#Paso 3. Mostrar frases que contienen la palabra clave
contador_total = sum(frase.lower().count(palabra_clave) for frase in frases)

print(f"\nLa palabra '{palabra_clave}' aparece {contador_total} veces en total.")





