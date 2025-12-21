#Python 
try:
    texto = "configuracion.txt" # Cambie a un archivo existente o no existente para probar 

    # Intenta abrir el archivo    
    archivo = open(texto, "r") 
    contenido = archivo.read()   
    print(f"Contenido de '{texto}':\n{contenido}") 

except FileNotFoundError: 
    print(f"¡Advertencia! El archivo '{texto}' no fue encontrado. Verifique la ruta.") 
except Exception as e: # Para capturar otros posibles errores de lectura    
    print(f"Ocurrió un error inesperado al intentar leer el archivo: {texto}: {e}")
finally: 
    # Este bloque siempre se ejecuta    
    if 'archivo' in locals() and not archivo.closed: 
        archivo.close()        
        print(f"Operación con el archivo '{texto}' finalizada y recursos liberados.")     
    else: 
        print(f"Intento de operación con el archivo '{texto}' finalizado.") 
