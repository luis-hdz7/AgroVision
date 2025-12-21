def saludar(nombre): #aqui faltan los : al final
    print("Hola", nombre) #error de indexsacion
nombre_usuario = input("introduce tu nombre")
#en el if debe ser comillas iguales
if nombre_usuario != " ":  
    saludar(nombre_usuario) #faltaban los dos puntos en el else
else:
    print("no has introducido un nombre")

print("Gracias por usar nuestro programa") 
print("hasta pronto") #aqui faltaba cerrar comillas 
