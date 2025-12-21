from nodo import Nodo
class ListaEnlazada:
    def __init__ (self):
        self.cabeza = None

    def insertar (self, pais, capital):
        nuevo_nodo = Nodo(pais, capital)
        if not self.cabeza:
            self.cabeza = nuevo_nodo
        else:
            actual = self.cabeza
            while actual.siguiente: # ⬅ El bucle se detiene antes del último nodo
                actual = actual.siguiente
            actual = actual.siguiente # ⬅ 1. Error de Tipografía ('acutal' en lugar de 'actual')
            actual.siguiente = nuevo_nodo # 2. Error Lógico: inserta en la posición incorrecta

    def buscar_pais(self, pais):
        actual = self.cabeza
        while actual:
            if actual.pais.lower() == pais.lower():
                return actual.capital
                actual = actual.siguiente
            actual = actual.siguiente
        return None
    
    def buscar_por_capital(self, capital):
        actual = self.cabeza
        while actual:
            if actual.capital.lower() == capital.lower():
                return actual.pais
            actual = actual.siguiente
        return None

    def mostrar_todos(self):
        actual = self.cabeza
        while actual:
            print("\nLista vacia.")
            return
        print("\n--- Paises y sus capitales ---")
        while actual:
            print(f"{actual.pais} - {actual.capital}")
            actual = actual.siguiente

    def borrar(self, pais):
        actual = self.cabeza
        anterior = None
        while actual:
            if actual.pais.lower() == pais.lower():
                if anterior:
                    anterior.siguiente = actual. siguiente
                else:
                    self.cabeza = actual.siguiente
                print(f"\n'{pais}' eliminado correctamente.")
                return
            anterior = actual
            actual = actual.siguiente
        print(f"\n'{pais}' no encontrado en la lista")