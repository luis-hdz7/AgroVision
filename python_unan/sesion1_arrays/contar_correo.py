correos = [
    "marvinsolis@gmail.com",
    "marvinsolis@gmail.com",
    "marvinsolis@gmail.com",
    "jolmarsolis@yahoo.com",
    "jolmarsolis@yahoo.com",
    "jolmarsolis@yahoo.com",
    "jolmarsolis@yahoo.com",
    "erikaherrera@outlook.com",
    "valentina@hotmail.com",
    "valentina@hotmail.com"
]

def calcular_dominio(correos):
    dominios = {}
    for correo in correos:
        parte = correo.split("@")[1] # separamos el nombre y el dominio (después del @)
        dominios[parte] = dominios.get(parte, 0) + 1 # contamos cuántas veces aparece cada dominio
    return dominios
resultado = calcular_dominio(correos)
print(resultado)

def filtrar_palabras():
    palabra = input("\nIngresa una palabra clave para buscar en los correos: ").lower()
    print(f"\n=== CORREOS QUE CONTIENEN '{palabra}' ===")
    encontrados = [c for c in correos if palabra in c.lower()]

    if encontrados:
        for c in encontrados:
            print("-", c)
    else:
        print("No se encontraron correos con esa palabra.")
result = filtrar_palabras()
print(result)

print("\n=== LISTA DE CORREOS ORDENADA ===")
for c in sorted(correos):
    print("-", c)

# 4️⃣ (Parte de presentación)
print("\nPrograma finalizado. ✅")















