#PYTHON
try: #movimos el try por lo que estaba mal colocado
    precios_productos = { 
        "Laptop": 550, 
        "Mouse": 10, #aqui le agregamos los precios.
        "Teclado": 20, 
        "Monitor": 100, 
    }   
    productos = input("Ingrese el nombre del producto que desea buscar: ") #estaba incompleto el codigo, le faltaban colocar las variables en algunos puntos. 
    precio = precios_productos[productos]    
    print(f"El precio de '{productos}' es: ${precio}") 

except KeyError:   
    print(f"Error: El producto '{productos}' no se encontró en nuestro inventario.")




















