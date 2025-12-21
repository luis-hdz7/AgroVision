# lista_contactos.py

from nodo import Contacto

class AgendaEnlazada:
    """
    Clase principal que gestiona la lista enlazada simple de contactos.
    """
    def __init__(self):
        self.cabeza = None # Inicializa la cabeza a None (lista vacía)

    # -----------------------------------------------------------
    # Funcionalidad 1: Agregar Contacto (Insertar al final)
    # -----------------------------------------------------------
    def agregar_contacto(self, nombre, telefono, email):
        """Inserta un nuevo contacto al final de la lista."""
        nuevo_contacto = Contacto(nombre, telefono, email)
        
        if not self.cabeza:
            # Caso: Lista vacía. El nuevo nodo es la cabeza.
            self.cabeza = nuevo_contacto
            print(f"\nContacto '{nombre}' agregado exitosamente (primero en la lista).")
            return

        # Recorrer hasta el último nodo
        actual = self.cabeza
        while actual.siguiente:
            actual = actual.siguiente
        
        # El último nodo apunta al nuevo contacto
        actual.siguiente = nuevo_contacto
        print(f"\nContacto '{nombre}' agregado exitosamente.")

    # -----------------------------------------------------------
    # Funcionalidad 2: Mostrar Contactos
    # -----------------------------------------------------------
    def mostrar_contactos(self):
        """Muestra todos los contactos almacenados en la lista."""
        if not self.cabeza:
            print("\nLa agenda está vacía.")
            return

        print("\n--- AGENDA DE CONTACTOS ---")
        actual = self.cabeza
        contador = 1
        while actual:
            print(f"\n{contador}. {actual.nombre.upper()}")
            print(f"   Teléfono: {actual.telefono}")
            print(f"   Email:    {actual.email}")
            actual = actual.siguiente
            contador += 1
        print("----------------------------")

    # -----------------------------------------------------------
    # Funcionalidad 3: Buscar Contacto por Nombre
    # -----------------------------------------------------------
    def buscar_contacto(self, nombre_buscado):
        """Busca y retorna un contacto por su nombre (ignorando mayúsculas/minúsculas)."""
        if not self.cabeza:
            return None, None # Retorna el nodo y el nodo anterior (None, None)

        actual = self.cabeza
        anterior = None
        
        while actual:
            # Búsqueda que ignora mayúsculas/minúsculas
            if actual.nombre.lower() == nombre_buscado.lower():
                return actual, anterior # Devuelve el nodo encontrado y su anterior
            
            anterior = actual
            actual = actual.siguiente
        
        return None, None # Contacto no encontrado

    # -----------------------------------------------------------
    # Funcionalidad 4: Eliminar Contacto por Nombre
    # -----------------------------------------------------------
    def eliminar_contacto(self, nombre_eliminar):
        """Elimina un contacto de la lista por nombre."""
        # Usamos la función de búsqueda para obtener el nodo y su anterior
        contacto_a_eliminar, anterior = self.buscar_contacto(nombre_eliminar)

        if not contacto_a_eliminar:
            # Caso: Contacto no encontrado
            print(f"\nError: Contacto '{nombre_eliminar}' no encontrado en la agenda.")
            return

        # Caso 1: El contacto a eliminar es la CABEZA
        if contacto_a_eliminar == self.cabeza:
            self.cabeza = contacto_a_eliminar.siguiente
        
        # Caso 2: El contacto está en medio o al final
        else:
            # El nodo anterior apunta al nodo siguiente del eliminado, saltándolo.
            anterior.siguiente = contacto_a_eliminar.siguiente
        
        #Implementación de manejo de memoria:
        # En Python, el garbage collector (recolector de basura) liberará la memoria
        # automáticamente cuando no haya más referencias al objeto (contacto_a_eliminar).
        # Aunque no es necesario el 'del contacto_a_eliminar', se puede hacer por claridad.
        del contacto_a_eliminar
        print(f"\nContacto '{nombre_eliminar}' eliminado correctamente.")