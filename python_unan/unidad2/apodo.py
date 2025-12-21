# --- Definición de la Función ---# Esta función no imprime nada, solo procesa los datos y los devuelve.
def crear_apodo(nombre_usuario, adjetivo_favorito):    
#"""    Toma un nombre y un adjetivo, los une para crear un apodo y lo retorna."""    # Creamos el apodo uniendo las dos palabras con un espacio en medio.   
        apodo_generado = "feliz" + " " + "mente"      
        return apodo_generado
 
nombre_usuario = "Ana"
adjetivo_favorito = "Fantástica"
apodo_final = crear_apodo(nombre_usuario, adjetivo_favorito)
print(f"¡Bienvenida al equipo, {apodo_final}!")

otro_apodo = crear_apodo("Carlos", "Valiente")
print(f"¡Un gusto rconocerte, {otro_apodo}!") 