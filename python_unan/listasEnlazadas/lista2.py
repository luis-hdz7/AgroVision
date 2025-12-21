class Nodo:
    def __init__(self, valor):
        self.num = valor
        self.sig = None


# Definir la lista
class ListaEnlazada:
    def __init__(self):
        self.cabecera = None

    def ListaVacia(self):
        return self.cabecera is None

    def AgregarNodoInicio(self, valor):
        # Crear el nuevo nodo
        temp = Nodo(valor)
        # Enlazar el nuevo nodo con la cabecera actual
        temp.sig = self.cabecera
        # Actualizar la cabecera
        self.cabecera = temp

    def VerLista(self):
        actual = self.cabecera
        cadena = ""
        while actual is not None:
            cadena += "[" + str(actual.num) + "] --> "
            actual = actual.sig
        print(cadena + "NULL")

    def BorrarElementos(self):
        actual = self.cabecera

if __name__ == '__main__':
    ls = ListaEnlazada()  # Crear la lista

    # Agregar nodos a la lista
    ls.AgregarNodoInicio(10)
    ls.AgregarNodoInicio(20)
    ls.AgregarNodoInicio(30)
    ls.AgregarNodoInicio(40)
    ls.VerLista()  # Mostrar los nodos de la lista

    # Agregar más nodos
    ls.AgregarNodoInicio(60)
    ls.AgregarNodoInicio(90)
    ls.VerLista()  # Mostrar los nodos actualizados

    # Borrar todos los nodos
    ls.BorrarElementos()
    ls.VerLista()  # Verificar si la lista está vacía