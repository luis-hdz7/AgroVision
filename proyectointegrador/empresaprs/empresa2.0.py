import datetime
import uuid

# Lista global de clientes
clientes = []

# Cliente
class Cliente:
    def _init_(self, id_cliente, nombre, correo):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.prestamos = []  # Lista de préstamos

    def agregar_prestamo(self, prestamo):
        self.prestamos.append(prestamo)

    def mostrar_info(self):
        print(f"\nID: {self.id_cliente} | Nombre: {self.nombre} | Correo: {self.correo}")
        if self.prestamos:
            print("  Préstamos asociados:")
            for p in self.prestamos:
                print(f"   - {p.monto} USD a {p.tasa_interes}% en {p.plazo} meses")
        else:
            print("  No tiene préstamos registrados.")


# Prestamo
class Prestamo:
    def _init_(self, id_prestamo, monto, tasa_interes, plazo):
        self.id_prestamo = id_prestamo
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.saldo = monto
        self.historial = []

    def calcular_cuota(self):
        return self.monto / self.plazo + (self.monto * (self.tasa_interes/100)) / self.plazo


# --- Funciones auxiliares ---
def crear_cliente(nombre, correo):
    id_cliente = str(uuid.uuid4())[:8]  # ID corto
    cliente = Cliente(id_cliente, nombre, correo)
    clientes.append(cliente)
    return cliente

def generar_reporte():
    if not clientes:
        print("\nNo hay clientes registrados.")
    else:
        print("\n=== Reporte de Clientes ===")
        for cliente in clientes:
            cliente.mostrar_info()


# --- Menú interactivo ---
def menu():
    while True:
        print("\n=== Sistema de Préstamos ===")
        print("1. Crear cliente")
        print("2. Ver clientes registrados")
        print("0. Salir")

        opcion = input("Seleccione una opción: ")

        if opcion == "1":
            nombre = input("Ingrese el nombre del cliente: ").strip()
            correo = input("Ingrese el correo del cliente: ")
            cliente = crear_cliente(nombre, correo)
            print(f"Cliente registrado: {cliente.nombre}, {cliente.correo}")

        elif opcion == "2":
            generar_reporte()

        elif opcion == "0":
            print(" Saliendo del sistema...")
            break
        else:
            print("Opción inválida. Intente de nuevo.")


# --- Ejecución ---

menu()