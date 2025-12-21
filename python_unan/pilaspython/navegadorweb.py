class NavegadorWeb:
    def __init__(self):
        self.historial = []
    def visitar(self, url):
    #"""Agrega una URL al historial de navegación."""
        self.historial.append(url)
        print(f"Visitando: {url}")
    def atras(self):
    #"""Regresa a la página anterior, si es posible."""
        if len(self.historial) > 1:
            self.historial.pop()
            print(f"Regresando a: {self.historial[-1]}")
        else:
            print("No hay páginas anteriores para regresar.")
        def pagina_actual(self):
    #"""Muestra la URL actual."""
            if self.historial:
                print(f"Página actual: {self.historial[-1]}")
            else:
                print("No hay páginas visitadas aún.")