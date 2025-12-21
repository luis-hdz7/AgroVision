#nueva versión. Simulación de cajero automático con la clase cola y deque
from collections import deque
import time
import os as os

def limpiar_pantalla():
# ... (código de la función de limpieza)
    os.system('cls' if os.name == 'nt' else 'clear')

class Cola:
    """Implementación de una cola usando deque."""
    def __init__(self):
        self.elementos = deque()

    def encolar(self, elemento):
        """Agrega un elemento al final de la cola."""
        self.elementos.append(elemento)

    def desencolar(self):
        """Elimina y devuelve el primer elemento de la cola."""
        if not self.esta_vacia():
            return self.elementos.popleft()
        return None

    def esta_vacia(self):
        """Verifica si la cola está vacía."""
        return len(self.elementos) == 0

    def tamanio(self):
        """Devuelve el número de elementos en la cola."""
        return len(self.elementos)

    def mostrar(self):
        """Muestra los elementos de la cola."""
        if self.esta_vacia():
            print("La cola está vacía.")
        else:
            print("Clientes en la cola:", list(self.elementos))


def simulacion_cajero():
    """Simulación interactiva del cajero automático."""
    cola = Cola()
    print("=== Simulación de Cajero Automático ===")
    print("¡Bienvenido al sistema de cola del banco!")

    while True:
        print("\n" + "-" * 40)
        print("Menú del Cajero:")
        print("1. Agregar cliente a la cola")
        print("2. Atender al siguiente cliente")
        print("3. Ver estado de la cola")
        print("4. Buscar cliente")
        print("5. Salir")

        opcion = input("Elige una opción (1-5): ").strip()
        time.sleep(2)
        limpiar_pantalla()

        if opcion == "1":
            nombre = input("Ingresa el nombre del cliente: ").strip()
            cola.encolar(nombre)
            print(f"Cliente '{nombre}' agregado a la cola.")
            time.sleep(2)
            limpiar_pantalla()

        elif opcion == "2":
            cliente = cola.desencolar()
            if cliente:
                print(f"Atendiendo al cliente: {cliente}")
            else:
                print("No hay clientes en la cola.")
                time.sleep(3)
                limpiar_pantalla()

        elif opcion == "3":
            cola.mostrar()
            print(f"Total de clientes en espera: {cola.tamanio()}")
            #print(f"Cola invertida: ", {cola_invertida})            
            time.sleep(3)
            limpiar_pantalla()

        elif opcion == "4":
            buscar_user = input("Ingresa el usuario a buscar: ")
            for cliente in nombre:
                if buscar_user == nombre:
                    print(f"El usuario", buscar_user, "si esta en la lista.")
                    limpiar_pantalla()
                else:
                    print("El usuario no se encuentra en la lista de espera.")
                    limpiar_pantalla()

        elif opcion == "5":
            print("Saliendo del sistema. ¡Hasta pronto!")
            time.sleep(2)
            limpiar_pantalla()
            break

        else:
            print("Opción no válida. Intenta de nuevo.")


# Ejecutar la simulación
if __name__ == "__main__":
    simulacion_cajero()

















