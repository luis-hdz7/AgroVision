class Nodo:
    def __init__(self, pais, capital):
        self.pais = pais
        self.capital = capital
        self.siguiente = None


#Aquí cada nodo guarda:
#pais → nombre del país
#capital → su capital
#sig → referencia al siguiente nodo (None si es el último)