import datetime
import uuid
import json
import os

# Archivo donde se guardarán los datos de clientes y préstamos
ARCHIVO_DATOS = "datos.json"

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

def pausar():
    input("\nPresione Enter para continuar...")

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
        else:
            self.prestamo = prestamo
            print("Préstamo agregado correctamente al cliente.")

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

class Prestamo:
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, fecha_nacimiento, direccion, telefono):
        self.id_prestamo = id_prestamo
        self.monto = float(monto)
        self.tasa_interes = float(tasa_interes)
        self.plazo = int(plazo)
        self.saldo_pendiente = float(monto)
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
        try:
            monto = float(monto)
        except (ValueError, TypeError):
            print("Monto inválido.")
            return
        if monto <= 0:
            print("El monto del abono debe ser positivo.")
            return
        if monto >= self.saldo_pendiente:
            excedente = monto - self.saldo_pendiente
            abonado = self.saldo_pendiente
            self.saldo_pendiente = 0.0
            self.registrar_transaccion("Abono total", abonado, "Abono que salda el préstamo")
            print(f"Abono realizado. Préstamo saldado. Excedente: ${excedente:.2f}")
            return
        self.saldo_pendiente -= monto
        self.registrar_transaccion("Abono parcial", monto, "Abono al préstamo")
        print(f"Abono realizado. Saldo restante: ${self.saldo_pendiente:.2f}")

    def pagar_cuota(self):
        if self.saldo_pendiente <= 0:
            print("El préstamo ya está pagado.")
            return
        cuota = self.calcular_cuota()
        if cuota <= 0:
            print("No se pudo calcular la cuota (plazo o tasa inválidos).")
            return
        if cuota > self.saldo_pendiente:
            cuota = self.saldo_pendiente
        self.saldo_pendiente -= cuota
        self.registrar_transaccion("Pago de cuota", cuota, "Pago mensual del préstamo")
        print(f"Cuota de ${cuota:.2f} pagada. Saldo restante: ${self.saldo_pendiente:.2f}")

    def registrar_transaccion(self, tipo, monto, detalle):
        self.historial.append({
            "fecha": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tipo": tipo,
            "monto": float(monto),
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

# -------------------- VALIDACIONES --------------------
def correo_duplicado(clientes, correo):
    return any(c.correo.lower() == correo.lower() for c in clientes)

def validar_fecha(fecha_str):
    try:
        datetime.datetime.strptime(fecha_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def confirmar_accion(mensaje):
    resp = input(f"{mensaje} (s/n): ").strip().lower()
    return resp == "s"

def cambiar_contraseña(cliente):
    nueva = input("Ingrese nueva contraseña (mínimo 8 caracteres): ").strip()
    if len(nueva) < 8:
        print("La contraseña es demasiado corta.")
    else:
        cliente.contraseña = nueva
        print("Contraseña actualizada correctamente.")

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
    try:
        with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error guardando datos: {e}")

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
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("El archivo de datos está corrupto o vacío. Se creará uno nuevo al guardar.")
        return []
    except Exception as e:
        print(f"Error cargando datos: {e}")
        return []

ADMIN_USERS = ["adminjolman", "admincarlos", "adminmarvin"]
ADMIN_PWDS  = ["86847950", "83362847", "58101169"]

def crear_cliente(clientes):
    nombre = input("Nombre completo: ").strip()
    correo = input("Correo (debe terminar en @gmail.com): ").strip()
    if not correo.endswith("@gmail.com"):
        print("Correo inválido. Debe terminar en @gmail.com")
        return None
    if correo_duplicado(clientes, correo):
        print("Este correo ya está registrado.")
        return None
    contraseña = input("Contraseña (mínimo 8 caracteres): ").strip()
    if len(contraseña) < 8:
        print("La contraseña debe tener al menos 8 caracteres.")
        return None
    id_cliente = str(uuid.uuid4())
    cliente = Cliente(id_cliente, nombre, correo, contraseña)
    clientes.append(cliente)
    guardar_datos(clientes)
    print("Cliente creado correctamente.")
    return cliente

def menu_admin(clientes):
    while True:
        limpiar_pantalla()
        print("\n==== MENÚ ADMINISTRADOR ====")
        print("1. Crear nuevo cliente")
        print("2. Crear préstamo para cliente")
        print("3. Ver lista completa de clientes")
        print("4. Eliminar cliente")
        print("5. Eliminar préstamo de un cliente")
        print("6. Ver préstamos activos")
        print("7. Guardar y volver al menú principal")
        opcion = input("Seleccione opción: ").strip()

        if opcion == "1":
            crear_cliente(clientes)
            pausar()

        elif opcion == "2":
            correo = input("Correo del cliente: ").strip()
            cliente = next((c for c in clientes if c.correo.lower() == correo.lower()), None)
            if not cliente:
                print("Cliente no encontrado.")
                pausar()
                continue
            if cliente.prestamo:
                print("Este cliente ya tiene un préstamo activo.")
                pausar()
                continue
            try:
                monto = float(input("Monto del préstamo: "))
                if monto <= 0:
                    print("Monto inválido.")
                    pausar()
                    continue
                cedula = input("Cédula: ").strip()
                fecha = input("Fecha de nacimiento (YYYY-MM-DD): ").strip()
                if not validar_fecha(fecha):
                    print("Fecha inválida.")
                    pausar()
                    continue
                direccion = input("Dirección: ").strip()
                telefono = input("Teléfono: ").strip()
                tasa = 10.0
                plazo = 12
                id_prestamo = str(uuid.uuid4())
                prestamo = Prestamo(id_prestamo, monto, tasa, plazo, cedula, fecha, direccion, telefono)
                cuota = prestamo.calcular_cuota()
                cliente.agregar_prestamo(prestamo)
                guardar_datos(clientes)
                print(f"Cuota mensual estimada: ${cuota:.2f}")
            except ValueError:
                print("Monto inválido.")
            pausar()

        elif opcion == "3":
            if not clientes:
                print("No hay clientes registrados.")
            else:
                for c in clientes:
                    c.mostrar_info()
            pausar()

        elif opcion == "4":
            correo = input("Correo del cliente a eliminar: ").strip()
            cliente = next((c for c in clientes if c.correo.lower() == correo.lower()), None)
            if not cliente:
                print("Cliente no encontrado.")
                pausar()
                continue
            if confirmar_accion(f"Eliminar cliente {cliente.nombre}?"):
                clientes.remove(cliente)
                guardar_datos(clientes)
                print("Cliente eliminado correctamente.")
            else:
                print("Operación cancelada.")
            pausar()

        elif opcion == "5":
            correo = input("Correo del cliente: ").strip()
            cliente = next((c for c in clientes if c.correo.lower() == correo.lower()), None)
            if not cliente:
                print("Cliente no encontrado.")
                pausar()
                continue
            if cliente.prestamo:
                if confirmar_accion(f"Eliminar préstamo de {cliente.nombre}?"):
                    cliente.prestamo = None
                    guardar_datos(clientes)
                    print("Préstamo eliminado correctamente.")
                else:
                    print("Operación cancelada.")
            else:
                print("Cliente o préstamo no encontrado.")
            pausar()

        elif opcion == "6":
            encontrados = False
            for c in clientes:
                if c.prestamo:
                    print(f"{c.nombre} ({c.correo}) - Saldo: ${c.prestamo.saldo_pendiente:.2f} - Plazo: {c.prestamo.plazo} meses")
                    encontrados = True
            if not encontrados:
                print("No hay préstamos activos.")
            pausar()

        elif opcion == "7":
            guardar_datos(clientes)
            break
        else:
            print("Opción inválida.")
            pausar()

def menu_cliente(clientes, cliente):
    while True:
        limpiar_pantalla()
        print(f"\n=== MENÚ CLIENTE ({cliente.nombre}) ===")
        print("1. Crear préstamo (para este cliente)")
        print("2. Ver información personal")
        print("3. Pagar cuota mensual")
        print("4. Abonar al préstamo")
        print("5. Ver historial de transacciones")
        print("6. Cambiar contraseña")
        print("7. Salir")
        opcion = input("Seleccione opción: ").strip()

        if opcion == "1":
            if cliente.prestamo:
                print("Ya tiene un préstamo activo.")
                pausar()
                continue
            try:
                monto = float(input("Monto del préstamo: $"))
                if monto <= 0:
                    print("Monto inválido.")
                    pausar()
                    continue
                cedula = input("Cédula: ").strip()
                fecha = input("Fecha de nacimiento (YYYY-MM-DD): ").strip()
                if not validar_fecha(fecha):
                    print("Fecha inválida.")
                    pausar()
                    continue
                direccion = input("Dirección: ").strip()
                telefono = input("Teléfono: ").strip()
                tasa = 10.0
                plazo = 12
                id_prestamo = str(uuid.uuid4())
                prestamo = Prestamo(id_prestamo, monto, tasa, plazo, cedula, fecha, direccion, telefono)
                cuota = prestamo.calcular_cuota()
                cliente.agregar_prestamo(prestamo)
                guardar_datos(clientes)
                print(f"Cuota mensual estimada: ${cuota:.2f}")
            except ValueError:
                print("Monto inválido.")
            pausar()

        elif opcion == "2":
            cliente.mostrar_info()
            pausar()

        elif opcion == "3":
            if cliente.prestamo:
                cliente.prestamo.pagar_cuota()
                guardar_datos(clientes)
            else:
                print("No tiene préstamo activo.")
            pausar()

        elif opcion == "4":
            if cliente.prestamo:
                try:
                    monto = float(input("Ingrese el monto a abonar: $"))
                    cliente.prestamo.abonar(monto)
                    guardar_datos(clientes)
                except ValueError:
                    print("Monto inválido.")
            else:
                print("No tiene préstamo activo.")
            pausar()

        elif opcion == "5":
            if cliente.prestamo:
                cliente.prestamo.mostrar_historial()
            else:
                print("No hay historial disponible.")
            pausar()

        elif opcion == "6":
            cambiar_contraseña(cliente)
            guardar_datos(clientes)
            pausar()

        elif opcion == "7":
            break
        else:
            print("Opción inválida.")
            pausar()

def menu_principal():
    clientes = cargar_datos()
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
                    menu_admin(clientes)
                else:
                    print("Contraseña incorrecta.")
                    pausar()
            else:
                print("Usuario no encontrado.")
                pausar()

        elif opcion == "2":
            crear_cliente(clientes)
            pausar()

        elif opcion == "3":
            correo = input("Correo: ").strip()
            contraseña = input("Contraseña: ").strip()
            cliente = next((c for c in clientes if c.correo.lower() == correo.lower() and c.contraseña == contraseña), None)
            if cliente:
                menu_cliente(clientes, cliente)
            else:
                print("Correo o contraseña incorrectos.")
                pausar()

        elif opcion == "4":
            guardar_datos(clientes)
            print("Saliendo del sistema. Hasta pronto.")
            break
        else:
            print("Opción inválida.")
            pausar()


menu_principal()
