lista = list(["hola", "marvin", 18])

cadena = "hola"
resultado = len(lista)
print(resultado)

#agregando un elemento a la lista
agregando_con_append = lista.append("JAJAJA")
print(agregando_con_append)

#agregando un elemento a la lista en un indice especifico
lista.insert(2, "tome senora tome")
print(lista)

#agregando varios elementos a la lista
lista.extend([False, 2030])
print(lista)

#eliminando un elemento de la lista por su inddice

lista.pop(-1)#podemos usar el -1 para eliminar el ultimo
print(lista)

print(len(lista))

#removiendo un elemento de la lista por su valor
lista.remove("tome senora tome")
print(lista)

#sort es para ordenar la lista(solo numeros, aexcepcion de los true)
#lista.sort()
#print(lista)
#invirtiendo los elementos de la lista
lista.reverse()
print(lista)

#eliminando todos los elementos de la lista
lista.clear()
print(lista)




