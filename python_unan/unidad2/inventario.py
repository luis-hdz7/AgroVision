print("Bienvenidos a nuestro MiMarket")

inventario= {
    "Manzana" : 50,
    "Cereal" : 10,
    "Leche" : 15,
    "Vasos" : 5
    }

def mostrar_inventario():
    print(f"Disponible: {inventario}")
mostrar_inventario()

def actualizar_stock(producto, cantidad):
    producto = str(input("Ingresa el producto: "))
    cantidad = int(input("ingresa la cantidad: "))

    if (producto, cantidad == inventario):
        for producto in inventarios:
            
actualizar_stock(producto, cantidad)








