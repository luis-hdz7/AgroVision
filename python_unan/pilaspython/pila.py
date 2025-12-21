#1. crear nuestra pila vacia
pila_libros = []
print("=== Operaciones con filas ===")

#2. agregar elementos a la pila
def push(pila_libros, element):
    pila_libros.append("El principito")
    pila_libros.append("1984")
    pila_libros.append("Cien years de soledad")
push(pila_libros, "element")

resultado = pila_libros()
#3. Imprimir pila
print(f"\nPila despues de agg los libros: " {resultado})






