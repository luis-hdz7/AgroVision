import json
import os

NOMBRE_ARCHIVO = "historial_clientes.json"

def cargar_historial():
    if os.path.exists(NOMBRE_ARCHIVO):
        try:
            with open(NOMBRE_ARCHIVO, "r") as file:
                return json.load(file)
        except Exception:
            return []
    return []

def guardar_historial(historial):
    try:
        with open(NOMBRE_ARCHIVO, "w") as file:
            json.dump(historial, file, indent=4)
    except Exception as e:
        print(f"Ocurrió un error al guardar el historial: {e}")
