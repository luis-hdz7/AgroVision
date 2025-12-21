# --- Programa para gestionar lista de correos ---

# Lista de correos de ejemplo (puedes cambiarla o pedir al usuario que los ingrese)
correos = [
    "maria@gmail.com",
    "juan@yahoo.com",
    "pedro@hotmail.com",
    "ana@gmail.com",
    "luis@outlook.com",
    "carla@gmail.com",
    "sofia@yahoo.com"
]

print("=== LISTA DE CORREOS ===")
for c in correos:
    print("-", c)

# 1️⃣ Contar dominios
dominios = {}

for correo in correos:
    # separamos el nombre y el dominio (después del @)
    parte = correo.split("@")[1]
    # contamos cuántas veces aparece cada dominio
    dominios[parte] = dominios.get(parte, 0) + 1

print("\n=== CANTIDAD DE CORREOS POR DOMINIO ===")
for dom, cantidad in dominios.items():
    print(f"{dom}: {cantidad}")

# 2️⃣ Filtrar por palabra clave
palabra = input("\nIngresa una palabra clave para buscar en los correos: ").lower()

print(f"\n=== CORREOS QUE CONTIENEN '{palabra}' ===")
encontrados = [c for c in correos if palabra in c.lower()]

if encontrados:
    for c in encontrados:
        print("-", c)
else:
    print("No se encontraron correos con esa palabra.")

# 3️⃣ Lista ordenada
print("\n=== LISTA DE CORREOS ORDENADA ===")
for c in sorted(correos):
    print("-", c)

# 4️⃣ (Parte de presentación)
print("\nPrograma finalizado. ✅")
print("El equipo debe explicar cómo resolvió cada parte y mostrar el funcionamiento.")
