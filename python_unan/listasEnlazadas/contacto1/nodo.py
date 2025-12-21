# nodo.py

class Contacto:
    """
    Representa un nodo en la lista enlazada.
    Contiene la información del contacto y un puntero al siguiente nodo.
    """
    def __init__(self, nombre, telefono, email):
        self.nombre = nombre
        self.telefono = telefono
        self.email = email
        self.siguiente = None  # Puntero al siguiente Contacto