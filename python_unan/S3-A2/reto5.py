import re

try:
    # Leer datos de la persona
    nombre = str(input("Ingrese nombre: "))
    edad = int(input("Ingrese edad: "))
    telefono = input("Ingrese teléfono (dddd-dddd): ")

    # Validar nombre (entre 3 y 35 caracteres)
    if len(nombre) < 3 or len(nombre) > 35:
        raise ValueError("El nombre debe tener entre 3 y 35 caracteres.")

    # Validar edad (entero entre 18 y 60)
    if edad < 18 or edad > 60:
        raise ValueError("La edad debe estar entre 18 y 60 años.")

    # Validar teléfono (formato dddd-dddd)
    if not re.fullmatch(r"\d{4}-\d{4}", telefono):
        raise ValueError("El teléfono debe tener el formato dddd-dddd.")

    # Si todo está bien, crear el diccionario Persona
    persona = {
        "Nombre": nombre,
        "Edad": edad,
        "Teléfono": telefono
    }

    print("\nPersona registrada correctamente:")
    print(persona)

except ValueError as e:
    print("Error:", e)
    exit()