frases = []

print("Ingrese frases. Escribe 'fin' para terminar.")
while True:
    frase = input()
    if frase == "fin":
        break
    frases.append(frase)

palabra_clave = input("Ingresa palabra clave: ").lower()
palabras_encontradas = [frase for frase in frases if palabra_clave in frase.lower()]


print(f"\n=== Palabras claves encontradas ===")
for frase in palabras_encontradas:
    print(frase)

cantidad_palabras_clave = sum(frase.lower().count(palabra_clave) for frase in frases)
print(f"\nLa palabra clave '{palabra_clave}' aparece {cantidad_palabras_clave} veces.")


















