class Nodo: 
    def _init_(self, dato): 
        self.dato = dato 
        self.siguiente = None 

class ListaEnlazada: 
    def _init_(self): 
        self.cabeza = None  # Primer nodo de la lista 
     
    # Insertar al final 
    def insertar_al_final(self, dato): 
        nuevo_nodo = Nodo(dato) 
        if not self.cabeza: 
            self.cabeza = nuevo_nodo 
            return 
        actual = self.cabeza 
        while actual.siguiente: 
            actual = actual.siguiente 
        actual.siguiente = nuevo_nodo 
 
    # Mostrar la lista 
    def mostrar(self): 
        actual = self.cabeza 
        while actual: 
            print(actual.dato, end=" -> ") 
            actual = actual.siguiente 
        print("None") 

    # Buscar un elemento 
    def buscar(self, dato): 
        actual = self.cabeza 
        while actual: 
            if actual.dato == dato: 
                return True 
            actual = actual.siguiente 
        return False 

    # Eliminar un elemento 
    def eliminar(self, dato): 
        actual = self.cabeza 
        anterior = None 
        while actual: 
            if actual.dato == dato: 
                if anterior: 
                    anterior.siguiente = actual.siguiente 
                else: 
                    self.cabeza = actual.siguiente 
                return True 
            anterior = actual 
            actual = actual.siguiente 
        return False

lista = ListaEnlazada()
lista.insertar_al_final(10)
lista.insertar_al_final(20)
lista.insertar_al_final(30)

lista.mostrar()
print(lista.buscar(20))    # Salida: True
print(lista.buscar(40))    # Salida: False

lista.eliminar(20)
lista.mostrar()            # Salida: 10 -> 30 -> None