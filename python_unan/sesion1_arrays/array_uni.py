ventas = [100, 200, 150, 300, 80, 120, 400]

print("ventas =", ventas)
print("Venta del dia 2: ", ventas[1])
print("Venta del dia 3: ", ventas[2])
# Total
total = 0
for v in ventas:
    total += v

# Promedio
promedio = total / len(ventas)

# Buscar mayor y menor (manualmente)
mayor_val = ventas[0]
menor_val = ventas[0]
idx_mayor = 0
idx_menor = 0

for i in range(1, len(ventas)):
    if ventas[i] > mayor_val:
        mayor_val = ventas[i]
        idx_mayor = i
    if ventas[i] < menor_val:
        menor_val = ventas[i]
        idx_menor = i

print("Total:", total)
print("Promedio:", round(promedio, 1))
print(f"Mayor venta: {mayor_val} (día {idx_mayor + 1})")
print(f"Menor venta: {menor_val} (día {idx_menor + 1})")