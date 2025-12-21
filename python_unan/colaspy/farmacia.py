class ColaFarmacia:
    def __init__(self):
        """Inicializa una cola vacía usando una lista."""
        self.items = []

    def agregar_paciente(self, nombre):
        """
        Añade un paciente al final de la cola.
        :param nombre: str, nombre del paciente
        """
        self.items.append(nombre)
        print(f"Paciente '{nombre}' agregado a la cola.")

    def atender_paciente(self):
        """
        Atiende (elimina y devuelve) al primer paciente de la cola.
        :return: Nombre del paciente atendido o mensaje si está vacía.
        """
        if self.esta_vacia():
            print("No hay pacientes en la cola para atender.")
            return None
        paciente = self.items.pop(0)  # Ojo: pop(0) es O(n)
        print(f"Paciente '{paciente}' ha sido atendido.")
        return paciente

    def proximo_paciente(self):
        """
        Devuelve el nombre del próximo paciente sin atenderlo.
        :return: Nombre del paciente o mensaje si está vacía.
        """
        if self.esta_vacia():
            print("No hay pacientes en la cola.")
            return None
        return self.items[0]

    def esta_vacia(self):
        """
        Verifica si la cola está vacía.
        :return: True si está vacía, False en caso contrario.
        """
        return len(self.items) == 0

    def tamanio(self):
        """
        Devuelve el número de pacientes en la cola.
        :return: int, tamaño de la cola.
        """
        return len(self.items)

    def mostrar_cola(self):
        """
        Muestra todos los pacientes en la cola, en orden de llegada.
        """
        if self.esta_vacia():
            print("La cola está vacía.")
        else:
            print("Pacientes en la cola:", ", ".join(self.items))

    def __str__(self):
        """
        Representación en cadena de la cola.
        """
        return f"ColaFarmacia({self.items})"
            
# Crear una instancia
cola = ColaFarmacia()

cola.agregar_paciente("Ana")
cola.agregar_paciente("Luis")
cola.agregar_paciente("María")

cola.mostrar_cola()
print("Próximo paciente:", cola.proximo_paciente())

cola.atender_paciente()
cola.mostrar_cola()

print("Tamaño actual de la cola:", cola.tamanio())
print(cola)

cola_invertida = cola.reverse()
print("Esta es la cola invertida: ", cola_invertida)