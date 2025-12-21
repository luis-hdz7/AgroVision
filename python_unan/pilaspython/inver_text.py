class ManipuladorTexto:
    # El constructor (__init__) para inicializar los atributos necesarios
    def __init__(self, texto_a_procesar=""):
        # Se almacena el texto como un atributo de la instancia
        self.texto = texto_a_procesar

    # El método de instancia ahora incluye 'self'
    def invertir_texto(self):
        # 1. Se inicializa la 'pila' (que es una lista en Python)
        pila = []
        
        # 2. Se llena la pila con los caracteres
        #    'self.texto' ahora accede al texto de la instancia.
        for caracter in self.texto:
            pila.append(caracter)

        texto_invertido = ""
        # 3. Se vacía la pila para obtener el texto invertido
        while pila: # Es más Pythónico que 'while len(pila) > 0'
            texto_invertido += pila.pop()

        print("Texto invertido:", texto_invertido)

# --- Uso ---

# Se crea la instancia, pasando el texto en el constructor.
manipulador = ManipuladorTexto("Si lo lees me debes un casco") 

# Ahora se llama al método correctamente.
manipulador.invertir_texto() 
# Salida esperada: Texto invertido: odnuM aloH

















