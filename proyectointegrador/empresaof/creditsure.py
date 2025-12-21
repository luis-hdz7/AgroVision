import time
import os
from clientes import crear_cliente, buscar_cliente, mostrar_historial
from prestamos import registrar_prestamo
from pagos import abonar
from almacenamiento import cargar_historial, guardar_historial

historial = cargar_historial()

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

while True:
    print("=== Bienvenido a CreditSure ===")
    print("1. Iniciar Sesion Administrador") 
    print("2. Iniciar sesion Usuario")
    print("3. Salir")
    try:
        opcion = int(input("Seleccione una opción del menu: "))
        time.sleep(3)
        limpiar_pantalla()
    except ValueError:
        print("Opción inválida.")
        time.sleep(2)
        limpiar_pantalla()
        continue

    if opcion == 1:
        # === Inicio de sesión del administrador ===
        ADMIN_USUARIO = "admin"
        ADMIN_CLAVE = "1234"
        print("=== Inicio de Sesion Administrador ===")
        usuario = input("Usuario: ")
        clave = input("Contraseña: ")
        time.sleep(1)
        limpiar_pantalla()
        if usuario != ADMIN_USUARIO or clave != ADMIN_CLAVE:
            print("Credenciales incorrectas.")
            time.sleep(2)
            limpiar_pantalla()
            continue  # vuelve al menú principal
        
        # Si pasa el login, muestra el menú de administrador
        print("Acceso concedido. Bienvenido, administrador.\n")
        time.sleep(2)
        limpiar_pantalla()
        print("Sistema de Gestion de Prestamos - CreditSurte")
        print("1. Crear Usuario")
        print("2. Realizar Préstamo")
        print("3. Ver Monto Total")
        print("4. Pago en Línea")
        print("5. Historial")
        print("6. Salir")

        try:
            opcion1 = int(input("Seleccione una opción del menu: "))
            time.sleep(1)
            limpiar_pantalla()
        except ValueError:
            print("Opción inválida.")
            time.sleep(1)
            limpiar_pantalla()
            continue

        limpiar_pantalla()
        if opcion1 == 1:
            print("Ingrese los datos del nuevo cliente: ")
            nombre = input("Nombre del usuario: ")
            cedula = input("Ingrese su cedula: ")
            telefono = input("Teléfono: ")
            direccion = input("Dirección: ")

            crear_cliente(historial, nombre, telefono, direccion)
            guardar_historial(historial)
            print("Cliente creado.")
            time.sleep(2)
            limpiar_pantalla()
            pass

        elif opcion1 == 2:
            nombre = input("Nombre del cliente: ")
            cliente = buscar_cliente(historial, nombre)
            if not cliente:
                print("Cliente no encontrado.")
                time.sleep(2)
                continue
            monto = float(input("Monto: $"))
            dias = int(input("Días: "))
            prestamo = registrar_prestamo(cliente, monto, dias)
            guardar_historial(historial)
            print(f"Préstamo registrado. Total a pagar: ${prestamo['monto_final']:.2f}")
            time.sleep(2)
            pass

        elif opcion1 == 3:
            nombre = input("Nombre del cliente: ")
            cliente = buscar_cliente(historial, nombre)
            if cliente:
                total = sum(p["monto_final"] for p in cliente["prestamos"])
                print(f"Monto total adeudado: ${total:.2f}")
            else:
                print("Cliente no encontrado.")
            time.sleep(2)
            pass

        elif opcion1 == 4:
            nombre = input("Nombre del cliente: ")
            cliente = buscar_cliente(historial, nombre)
            if not cliente:
                print("Cliente no encontrado.")
                time.sleep(2)
                limpiar_pantalla()
                continue
            monto = float(input("Monto a abonar: $"))
            nuevo_saldo = abonar(cliente, monto)
            if nuevo_saldo is not None:
                guardar_historial(historial)
                print(f"Pago realizado. Nuevo saldo: ${nuevo_saldo:.2f}")
            else:
                print("Error al procesar el pago.")
            time.sleep(2)
            limpiar_pantalla()

    
        elif opcion1 == 5:
            print(mostrar_historial(historial))
            input("Presione Enter para continuar...")
    
        elif opcion1 == 6:
            guardar_historial(historial)
            print("Cerrando sistema...")
            break

        else:
            print("Opción inválida.")
            time.sleep(1)
            limpiar_pantalla()
    

    elif opcion == 2:
        print("Funcionalidad de usuario en desarrollo")

    elif opcion == 3:
        print("Cerrando sistema...")
        time.sleep(2)
        limpiar_pantalla()
        break

    else:
        print("Opción inválida.")
        time.sleep(1)
        limpiar_pantalla()



