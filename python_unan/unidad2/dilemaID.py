# --- Ámbito Global ---# 1. Esta es una variable GLOBAL porque está fuera de cualquier función.
personaje = "Caballero"
print(f"Fuera de la función, al principio, el personaje es: {personaje}")
# --- Definición de la Función ---
def cambiar_de_personalidad():    
# """    Define una variable local con el mismo nombre que la global para demostrar el sombreado.    """    # 2. Esta es una variable LOCAL. Aunque se llama igual, es completamente    # independiente de la variable global. La "sombrea" o la "oculta".   
 personaje = "Dragón"   
 print(f"DENTRO de la función, el personaje se transforma en: {personaje}")
# --- Programa Principal ---print("--- Se llama a la función ---")
# 3. Llamamos a la función. Usará su propia variable local 'personaje’.
cambiar_de_personalidad()
print("--- La función ha terminado ---")
# 4. Imprimimos la variable global de nuevo.# ¿Cuál será su valor? ¿"Caballero" o "Dragón"?
# La función no alteró la variable global, solo usó su propia versión local.
print(f"Fuera de la función, al final, el personaje sigue siendo: {personaje}") 
