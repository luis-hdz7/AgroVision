class EditorNotas:
    def __init__(self):
        self.contenido = ""
        self.historial = []

    def escribir(self, texto):
        self.historial.append(self.contenido)
        self.contenido += texto
        print(f"Texto agregado: '{texto}'")

    def deshacer(self):
        if self.historial:
            self.contenido = self.historial.pop()
            print("Acción deshecha. Estado anterior restaurado.")
        else:
            print("No hay acciones para deshacer.")

    def mostrar(self):
        if self.contenido:
            print(f"Contenido actual: '{self.contenido}'")
        else:
            print("El editor está vacío.")


# --- Uso del editor ---
editor = EditorNotas()
editor.escribir("Hola")
editor.escribir(" mundo")
editor.mostrar()
editor.deshacer()
editor.mostrar()
