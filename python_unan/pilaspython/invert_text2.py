#crear clase manipulador de texto
class manipulador_texto:
    def _init_(self, texto):
        self.texto = texto
    def invertir(self):
        self.texto = self.texto[::-1]
    def imprimir(self):
        print(self.texto)
#ingresar cadena de texto
texto = input("Ingrese un texto: ")
print(texto)
#crear objeto manipulador de texto
texto_manipulador = manipulador_texto(texto)
#invertir texto
texto_manipulador.invertir()
#imprimir texto
texto_manipulador.imprimir() 

#definir si es palindromo
def es_palindromo(texto):
    return texto == texto[::-1]

#verificar si es palindromo
palindromo = es_palindromo(texto)
print(palindromo)   
if not palindromo:
    print("No es palindromo")