import os
import time
import json
import uuid
import datetime

# ------------------- ARCHIVOS -------------------
ARCHIVO_DATOS = "datos.json"
ARCHIVO_HISTORIAL = "historial_clientes.json"

# ------------------- FUNCIONES -------------------
def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

def validar_fecha(fecha_str):
    try:
        datetime.datetime.strptime(fecha_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def confirmar_accion(mensaje):
    resp = input(f"{mensaje} (s/n): ").strip().lower()
    return resp == "s"

def correo_duplicado(clientes, correo):
    return any(c.correo.lower() == correo.lower() for c in clientes)

def cambiar_contraseña(cliente):
    nueva = input("Ingrese nueva contraseña (mínimo 8 caracteres): ").strip()
    if len(nueva) < 8:
        print("La contraseña es demasiado corta.")
    else:
        cliente.contraseña = nueva
        print("Contraseña actualizada correctamente.")
        time.sleep(2)
        limpiar_pantalla()

def calcular_interes(monto, tiempo_dias, tasa=0.15):
    return monto * (1 + tasa * tiempo_dias)

# ------------------- CLASES -------------------
class Prestamo:
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, fecha_nacimiento, direccion, telefono):
        self.id_prestamo = id_prestamo
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.saldo_pendiente = monto
        self.cedula = cedula
        self.fecha_nacimiento = fecha_nacimiento
        self.direccion = direccion
        self.telefono = telefono
        self.historial = []

    def calcular_cuota(self):
        if self.plazo <= 0:
            return 0.0
        tasa_mensual = self.tasa_interes / 100.0 / 12.0
        if tasa_mensual == 0:
            return self.monto / self.plazo
        num = tasa_mensual * (1 + tasa_mensual) ** self.plazo
        den = (1 + tasa_mensual) ** self.plazo - 1
        return self.monto * (num / den)

    def abonar(self, monto):
        if monto <= 0:
            print("El monto del abono debe ser positivo.")
            return
        if monto >= self.saldo_pendiente:
            excedente = monto - self.saldo_pendiente
            abonado = self.saldo_pendiente
            self.saldo_pendiente = 0.0
            self.registrar_transaccion("Abono total", abonado, "Abono que salda el préstamo")
            print(f"Abono realizado. Préstamo saldado. Excedente: ${excedente:.2f}")
            time.sleep(2)
            limpiar_pantalla()
            return
        self.saldo_pendiente -= monto
        self.registrar_transaccion("Abono parcial", monto, "Abono al préstamo")
        print(f"Abono realizado. Saldo restante: ${self.saldo_pendiente:.2f}")
        time.sleep(2)
        limpiar_pantalla()

    def pagar_cuota(self):
        if self.saldo_pendiente <= 0:
            print("El préstamo ya está pagado.")
            time.sleep(2)
            limpiar_pantalla()
            return
        cuota = self.calcular_cuota()
        if cuota > self.saldo_pendiente:
            cuota = self.saldo_pendiente
        self.saldo_pendiente -= cuota
        self.registrar_transaccion("Pago de cuota", cuota, "Pago mensual del préstamo")
        print(f"Cuota de ${cuota:.2f} pagada. Saldo restante: ${self.saldo_pendiente:.2f}")
        time.sleep(2)
        limpiar_pantalla()

    def registrar_transaccion(self, tipo, monto, detalle):
        self.historial.append({
            "fecha": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tipo": tipo,
            "monto": monto,
            "detalle": detalle
        })

    def mostrar_saldo(self):
        print(f"Saldo pendiente actual: ${self.saldo_pendiente:.2f}")

    def mostrar_historial(self):
        if not self.historial:
            print("No hay historial de transacciones.")
        else:
            print("\n=== HISTORIAL DE TRANSACCIONES ===")
            for t in self.historial:
                print(f"{t['fecha']} - {t['tipo']}: ${t['monto']:.2f} ({t['detalle']})")
            time.sleep(4)
            limpiar_pantalla()

class Cliente:
    def __init__(self, id_cliente, nombre, correo, contraseña):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        self.prestamo = None

    def agregar_prestamo(self, prestamo):
        if self.prestamo is not None:
            print("Este cliente ya tiene un préstamo activo.")
            time.sleep(2)
            limpiar_pantalla()
        else:
            self.prestamo = prestamo
            print("Préstamo agregado correctamente al cliente.")
            time.sleep(2)
            limpiar_pantalla()

    def mostrar_info(self):
        print("\n=== INFORMACIÓN DEL CLIENTE ===")
        print(f"ID: {self.id_cliente}")
        print(f"Nombre: {self.nombre}")
        print(f"Correo: {self.correo}")
        if self.prestamo:
            print(f"Préstamo activo: ${self.prestamo.monto:.2f}")
            self.prestamo.mostrar_saldo()
        else:
            print("No tiene préstamos registrados.")
        time.sleep(3)
        limpiar_pantalla()

# ------------------- GESTIÓN DE DATOS -------------------
def guardar_datos(clientes):
    datos = []
    for c in clientes:
        datos.append({
            "id_cliente": c.id_cliente,
            "nombre": c.nombre,
            "correo": c.correo,
            "contraseña": c.contraseña,
            "prestamo": {
                "id_prestamo": c.prestamo.id_prestamo,
                "monto": c.prestamo.monto,
                "tasa_interes": c.prestamo.tasa_interes,
                "plazo": c.prestamo.plazo,
                "saldo_pendiente": c.prestamo.saldo_pendiente,
                "cedula": c.prestamo.cedula,
                "fecha_nacimiento": c.prestamo.fecha_nacimiento,
                "direccion": c.prestamo.direccion,
                "telefono": c.prestamo.telefono,
                "historial": c.prestamo.historial
            } if c.prestamo else None
        })
    with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

def cargar_datos():
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
            clientes = []
            for d in datos:
                c = Cliente(
                    d.get("id_cliente", str(uuid.uuid4())),
                    d.get("nombre", "Desconocido"),
                    d.get("correo", ""),
                    d.get("contraseña", "12345678")
                )
                if d.get("prestamo"):
                    p_data = d["prestamo"]
                    p = Prestamo(
                        p_data.get("id_prestamo", str(uuid.uuid4())),
                        p_data.get("monto", 0),
                        p_data.get("tasa_interes", 0),
                        p_data.get("plazo", 1),
                        p_data.get("cedula", ""),
                        p_data.get("fecha_nacimiento", ""),
                        p_data.get("direccion", ""),
                        p_data.get("telefono", "")
                    )
                    p.saldo_pendiente = p_data.get("saldo_pendiente", p.monto)
                    p.historial = p_data.get("historial", [])
                    c.prestamo = p
                clientes.append(c)
            return clientes
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# ------------------- HISTORIAL GLOBAL -------------------
def cargar_historial_global():
    if os.path.exists(ARCHIVO_HISTORIAL):
        try:
            with open(ARCHIVO_HISTORIAL, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def guardar_historial_global(historial):
    with open(ARCHIVO_HISTORIAL, 'w', encoding='utf-8') as f:
        json.dump(historial, f, indent=4, ensure_ascii=False)

# ------------------- ADMIN -------------------
ADMIN_USERS = ["adminjolman", "admincarlos", "adminmarvin"]
ADMIN_PWDS  = ["86847950", "83362847", "58101169"]

def crear_cliente(clientes, historial_global):
    limpiar_pantalla()
    print("=== CREAR CLIENTE ===")
    nombre = input("Nombre completo: ").strip()
    correo = input("Correo (debe terminar en @gmail.com): ").strip()
    if not correo.endswith("@gmail.com"):
        print("Correo inválido. Debe terminar en @gmail.com")
        time.sleep(2)
        limpiar_pantalla()
        return None
    if correo_duplicado(clientes, correo):
        print("Este correo ya está registrado.")
        time.sleep(2)
        limpiar_pantalla()
        return None
    contraseña = input("Contraseña (mínimo 8 caracteres): ").strip()
    if len(contraseña) < 8:
        print("La contraseña debe tener al menos 8 caracteres.")
        time.sleep(2)
        limpiar_pantalla()
        return None
    id_cliente = str(uuid.uuid4())
    cliente = Cliente(id_cliente, nombre, correo, contraseña)
    clientes.append(cliente)
    historial_global.append({
        "id_cliente": id_cliente,
        "nombre": nombre,
        "correo": correo,
        "prestamos": []
    })
    guardar_datos(clientes)
    guardar_historial_global(historial_global)
    print("Cliente creado correctamente.")
    time.sleep(2)
    limpiar_pantalla()
    return cliente

# ------------------- MENÚ ADMIN -------------------
def menu_admin(clientes, historial_global):
    while True:
        limpiar_pantalla()
        print("\n==== MENÚ ADMINISTRADOR ====")
        print("1. Crear nuevo cliente")
        print("2. Crear préstamo para cliente")
        print("3. Ver lista completa de clientes")
        print("4. Eliminar cliente")
        print("5. Eliminar préstamo de un cliente")
        print("6. Ver historial global")
        print("7. Guardar y volver al menú principal")
        opcion = input("Seleccione opción: ").strip()

        if opcion == "1":
            crear_cliente(clientes, historial_global)
        elif opcion == "3":
            limpiar_pantalla()
            print("=== LISTA DE CLIENTES ===")
            for c in clientes:
                print(f"ID: {c.id_cliente} | Nombre: {c.nombre} | Correo: {c.correo} | Préstamo activo: {'Sí' if c.prestamo else 'No'}")
            time.sleep(4)
            limpiar_pantalla()
        elif opcion == "6":
            limpiar_pantalla()
            print("\n=== HISTORIAL GLOBAL ===")
            for c in historial_global:
                print(c)
            time.sleep(4)
            limpiar_pantalla()
        elif opcion == "7":
            guardar_datos(clientes)
            guardar_historial_global(historial_global)
            break
        else:
            print("Opción aún no implementada en esta demo.")  
            time.sleep(2)
            limpiar_pantalla()

# ------------------- MENÚ PRINCIPAL -------------------
def menu_principal():
    clientes = cargar_datos()
    historial_global = cargar_historial_global()
    while True:
        limpiar_pantalla()
        print("\n=== SISTEMA DE GESTIÓN DE PRÉSTAMOS ===")
        print("1. Iniciar sesión como Administrador")
        print("2. Crear cuenta")
        print("3. Iniciar sesión como Cliente")
        print("4. Salir")
        opcion = input("Seleccione opción: ").strip()

        if opcion == "1":
            usuario = input("Usuario: ").strip()
            contraseña = input("Contraseña: ").strip()
            if usuario in ADMIN_USERS:
                indice = ADMIN_USERS.index(usuario)
                if contraseña == ADMIN_PWDS[indice]:
                    menu_admin(clientes, historial_global)
                else:
                    print("Contraseña incorrecta.")
                    time.sleep(2)
            else:
                print("Usuario no encontrado.")
                time.sleep(2)
        elif opcion == "2":
            crear_cliente(clientes, historial_global)
        elif opcion == "4":
            guardar_datos(clientes)
            guardar_historial_global(historial_global)
            print("Cerrando sistema... Hasta pronto.")
            time.sleep(2)
            limpiar_pantalla()
            break
        else:
            print("Opción inválida.")
            time.sleep(2)

menu_principal()
