import datetime
import uuid

historial = []

#for i in range(3):
    #historial.append({"nombres":nombres,"correo":correo})
    
#print("\n-----historial-------")
#for i,personas in enumerate(historial,start=1):
 #print(f"{i}. nombre:{personas['nombres']},correo:{personas['correo']}")

# Cliente
class Cliente:
    def _init_(self, id_cliente, nombre, correo):
        pass  # Inicializa atributos del cliente (id, nombre, correo, lista de préstamos)

    def agregar_prestamo(self, prestamo):
        pass  # Asocia un préstamo al cliente

    def mostrar_info(self):
        pass  # Muestra toda la información del cliente y sus préstamos


# Prestamo
class Prestamo:
    def _init_(self, id_prestamo, monto, tasa_interes, plazo):
        pass  # Inicializa atributos del préstamo (id, monto, tasa, plazo, saldo pendiente, historial)

    def calcular_cuota(self):
        pass  # Calcula el monto de la cuota mensual (capital + interés)

    def abonar(self, monto):
        pass  # Reduce el saldo pendiente según el monto abonado

    def pagar_cuota(self):
        pass  # Registra el pago de una cuota completa

    def pagar_en_linea(self, empresa, monto):
        pass  # Realiza un pago en línea (ej. servicio, tarjeta, empresa)

    def registrar_transaccion(self, tipo, monto, detalle=""):
        pass  # Guarda la operación realizada en el historial (abono, cuota, pago en línea)

    def mostrar_saldo(self):
        pass  # Muestra el saldo pendiente actual del préstamo

    def mostrar_historial(self):
        pass  # Muestra todas las transacciones (abonos, cuotas, pagos en línea)


# --- Funciones auxiliares ---
def crear_cliente(nombre, correo):
    pass  # Crea un objeto Cliente con los datos proporcionados

def crear_prestamo(monto, tasa_interes, plazo):
    pass  # Crea un objeto Prestamo con los datos ingresados

def generar_reporte(cliente):
    pass  # Genera un reporte con la información del cliente y sus préstamos

historial = []

def crear_historia(nombre, correo):
f
or i in range(3):
    nombre = str(input("Ingresa tu nombre: "))
    correo = input("Ingresa tu correo: ")
    historial.append({"nombres":nombre,"correo":correo})
        print(f"Cliente ingresado: {nombre}, {correo}")
crear_historial()
# --- Menú interactivo ---
def menu():
    while True:
        print("\n=== Sistema de Préstamos ===")
        print("1. Crear cliente")
        print("2. Registrar préstamo a cliente")
        print("3. Abonar a préstamo")
        print("4. Pagar cuota")
        print("5. Pago en línea")
        print("6. Ver reporte de cliente")
        print("7. Historial")
        print("0. Salir")

        opcion = input("Seleccione una opción: ")

        if opcion == "1":
            # Entrada de datos para cliente
            
            #nombre = str(input("Ingrese el nombre del cliente: ")).strip()
            #correo = input("Ingrese el correo del cliente: ")
                
            pass  
        
        elif opcion == "2":
            # Entrada de datos para préstamo
            monto = float(input("Ingrese el monto del préstamo: "))
            #tasa = float(input("Ingrese la tasa de interés (%): "))
            plazo = int(input("Ingrese el plazo en meses: "))
            print(f"Préstamo registrado: Monto ${monto}, Tasa {tasa}%, Plazo {plazo} meses")
            pass  
        elif opcion == "3":
            pass  
        elif opcion == "4":
            pass 
        elif opcion == "5":
            # Entrada de datos para pago en línea
            empresa = input("Ingrese el nombre de la empresa o servicio: ")
            monto = float(input("Ingrese el monto a pagar: "))
            print(f" Pago en línea realizado a {empresa} por ${monto:.2f}")
            pass  
        elif opcion == "6":
            pass
        elif opcion == 7:
            print(f"Historial de clientes: ", {crear_historial})
            pass
        elif opcion == "0":
            print(" Saliendo del sistema...")
            break
        else:
            print("Opción inválida. Intente de nuevo.")


# --- Ejecución ---
menu()