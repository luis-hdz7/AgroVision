diccionario = {
    "nombre" : "Marvin",
    "apellido" : "Solis",
    "subs" : 100000
}

#Keys nos devuelve un objeto dict_item
claves = diccionario.keys() 


#Obteniendo un elemento con get() (si no encuentra nada el programa continua)
valor_de = diccionario.get("apellido")
print(claves)

#eliminando todo del diccionario
#diccionario.clear()
#print(diccionario)

#eliminando un elemento del diccionario
diccionario.pop("subs", "nombre")
print(diccionario)

#obteniendo un elemento itereable dict_intem
diccionario_itereable = diccionario.items()
print(diccionario_itereable)



























