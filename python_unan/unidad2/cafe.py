# --- Esqueleto del Programa (Top-Down Design) --- 
seleccionar_bebida = [
    "uva",
    "capuccino"
]
def mostrar_menu():
     """Muestra las opciones de bebidas y sus precios."""
     pass # Aún no implementado
def seleccionar_bebida():
        """Solicita al usuario que elija una bebida y devuelve su elección y precio."""
        pass # Aún no implementado

def procesar_pago(precio_bebida):
     """Maneja el ingreso de dinero y verifica si es suficiente."""    
     pass # Aún no implementado
 
def preparar_y_entregar(bebida, cambio):
     """Simula la preparación de la bebida y la entrega del producto y el cambio.""" 
     pass # Aún no implementado

def main():
      """Función principal que orquesta el flujo del programa.""" 
print("Bienvenido a la Máquina de Café Python!")
tu_bebida = input("que bebida te gustaria tomar?")
mostrar_menu()
bebida_elegida = tu_bebida
precio = seleccionar_bebida()

if bebida_elegida:
    pago_exitoso = True
    cambio = procesar_pago(precio)
    if bebida_elegida == tu_bebida:
        print("bebida disponible")
    elif bebida_elegida != tu_bebida:
        print("no disponible")

    if pago_exitoso:
      preparar_y_entregar(bebida_elegida, cambio)
      print("Pago exitoso, Tu bebida esta lista")
      
    else:
      print("Pago cancelado. Devolviendo dinero.") 

else:
    print("Esa bebida no esta disponible")
print("¡Gracias por usar la máquina de café!")
# Punto de entrada del programa if  name	== "main ":
main()