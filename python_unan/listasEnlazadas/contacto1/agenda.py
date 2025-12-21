# agenda.py

from lista_contactos import AgendaEnlazada
import os
import sys

# Función para limpiar la pantalla (mejora la experiencia de usuario)
def limpiar_pantalla():
    """Limpia la consola para un menú más claro."""
    # 'cls' para Windows, 'clear' para Linux/macOS
    os.system('cls' if os.name == 'nt' else 'clear')

# -----------------------------------------------------------
# Función principal con el Menú Interactivo
# -----------------------------------------------------------
def main():
    agenda = AgendaEnlazada()
    
    # Datos de prueba opcionales para facilitar la demostración
    agenda.agregar_contacto("Alice", "5551234", "alice@mail.com")
    agenda.agregar_contacto("Bob", "5559876", "bob@mail.com")

    while True:
        limpiar_pantalla()
        print("=============================================")
        print("       AGENDA DE CONTACTOS ENLAZADA       ")
        print("=============================================")
        print("1. Agregar contacto")
        print("2. Mostrar todos los contactos")
        print("3. Buscar contacto por nombre")
        print("4. Eliminar contacto por nombre")
        print("5. Salir")
        print("---------------------------------------------")

        try:
            opcion = input("Elige una opción (1-5): ")
            
            if opcion == '1':
                print("\n--- AGREGAR NUEVO CONTACTO ---")
                nombre = input("Nombre: ")
                telefono = input("Teléfono: ")
                email = input("Email: ")
                agenda.agregar_contacto(nombre, telefono, email)
            
            elif opcion == '2':
                agenda.mostrar_contactos()
            
            elif opcion == '3':
                nombre_buscado = input("\nIngresa el nombre a buscar: ")
                contacto, _ = agenda.buscar_contacto(nombre_buscado)
                
                if contacto:
                    print(f"\nContacto Encontrado:")
                    print(f"   Nombre: {contacto.nombre}")
                    print(f"   Teléfono: {contacto.telefono}")
                    print(f"   Email: {contacto.email}")
                else:
                    print(f"\nContacto '{nombre_buscado}' no encontrado.")
            
            elif opcion == '4':
                nombre_eliminar = input("\nIngresa el nombre del contacto a eliminar: ")
                agenda.eliminar_contacto(nombre_eliminar)
            
            elif opcion == '5':
                print("\nSaliendo de la agenda. ¡Hasta pronto!")
                # El programa termina, liberando los objetos de la lista.
                sys.exit(0)
            
            else:
                print("\nOpción no válida. Por favor, elige una opción del 1 al 5.")
                
        except Exception as e:
            print(f"\nOcurrió un error inesperado: {e}")
        
        input("\nPresiona ENTER para continuar...")


main()