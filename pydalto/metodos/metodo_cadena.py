cadena1 = "hola,marvin"
cadena2 = "bienvenido"

#convierte a minuscula
minus = cadena1.lower()
print(minus)

#convierte a mayusc
mayus = cadena1.upper()
print(mayus)

#convierte primera letra a mayus
primera_letra_mayus = cadena1.capitalize()
print(primera_letra_mayus)

#BUscamos una cadena en otra
busqueda_find = cadena1.find("hola")
print(busqueda_find)

#buscamos una cadena en otra cadena, sino encuentra coincidencia, lanza una excepcion
busqueda_index = cadena1.index("hola")
print(busqueda_index)

#Si es numerico, devuelve true, si no devuelve falso
es_numerico = cadena1.isnumeric()
print(es_numerico)

es_alfanumerico = cadena1.isalpha()
print(es_alfanumerico)

#count, contamos coincidencias de una cadena dentro de otra cadea, devuelve la cantidad de coincidencias
contar_coincidencias = cadena1.count("lama")
print(contar_coincidencias)

#contamos cuantos caracteres tiene una cadena
contar_caracteres = len(cadena1)
print(contar_caracteres)

#verificamos si una cadean empieza con otra cadena dada, si es asi devuelve true
empieza_con = cadena1.startswith("h")
print(empieza_con)

termina_con = cadena1.endswith("n")
print(termina_con)

#remplaza un pedazo de la cadena dada por otra dada
cadena_nueva = cadena1.replace("hola marvin" , "hola tatiana")
print(cadena_nueva)
cadena_nueva_2 = cadena1.replace("," , " ")
print(cadena_nueva_2)

#separar cadena con la cadena que le pasemos
cadena_separada = cadena1.split(",")
print(type(cadena_separada))




