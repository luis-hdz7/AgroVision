import tkinter as tk
from tkinter import messagebox, simpledialog
import uuid
import json
import datetime

# ------------------- ARCHIVOS -------------------
ARCHIVO_DATOS = "datos_gui_minimal.json"

# ------------------- CLASES -------------------
class Prestamo:
    def __init__(self, monto, plazo=12, tasa_interes=10.0):
        self.id_prestamo = str(uuid.uuid4())
        self.monto = monto
        self.plazo = plazo
        self.tasa_interes = tasa_interes
        self.saldo_pendiente = monto
        self.historial = []

    def abonar(self, monto):
        if monto <= 0:
            return False, "El monto debe ser positivo."
        if monto >= self.saldo_pendiente:
            excedente = monto - self.saldo_pendiente
            abonado = self.saldo_pendiente
            self.saldo_pendiente = 0
            self.registrar_transaccion("Abono total", abonado, "Préstamo saldado")
            return True, f"Préstamo saldado. Excedente: ${excedente:.2f}"
        else:
            self.saldo_pendiente -= monto
            self.registrar_transaccion("Abono parcial", monto, "Abono parcial al préstamo")
            return True, f"Abono realizado. Saldo restante: ${self.saldo_pendiente:.2f}"

    def pagar_cuota(self):
        if self.saldo_pendiente <= 0:
            return False, "El préstamo ya está pagado."
        tasa_mensual = self.tasa_interes / 100 / 12
        cuota = self.monto * (tasa_mensual * (1 + tasa_mensual) ** self.plazo) / ((1 + tasa_mensual) ** self.plazo - 1) if tasa_mensual != 0 else self.monto / self.plazo
        if cuota > self.saldo_pendiente:
            cuota = self.saldo_pendiente
        self.saldo_pendiente -= cuota
        self.registrar_transaccion("Pago de cuota", cuota, "Pago mensual")
        return True, f"Cuota de ${cuota:.2f} pagada. Saldo restante: ${self.saldo_pendiente:.2f}"

    def registrar_transaccion(self, tipo, monto, detalle):
        self.historial.append({
            "fecha": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tipo": tipo,
            "monto": monto,
            "detalle": detalle
        })

class Cliente:
    def __init__(self, nombre, correo, contraseña):
        self.id_cliente = str(uuid.uuid4())
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        self.prestamo = None

# ------------------- GESTIÓN DE DATOS -------------------
def cargar_datos():
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
            clientes = []
            for d in datos:
                c = Cliente(d["nombre"], d["correo"], d["contraseña"])
                c.id_cliente = d["id_cliente"]
                if d.get("prestamo"):
                    p_data = d["prestamo"]
                    p = Prestamo(p_data["monto"])
                    p.saldo_pendiente = p_data["saldo_pendiente"]
                    p.historial = p_data.get("historial", [])
                    c.prestamo = p
                clientes.append(c)
            return clientes
    except:
        return []

def guardar_datos(clientes):
    datos = []
    for c in clientes:
        datos.append({
            "id_cliente": c.id_cliente,
            "nombre": c.nombre,
            "correo": c.correo,
            "contraseña": c.contraseña,
            "prestamo": {
                "monto": c.prestamo.monto,
                "saldo_pendiente": c.prestamo.saldo_pendiente,
                "historial": c.prestamo.historial
            } if c.prestamo else None
        })
    with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=2)

clientes = cargar_datos()

# ------------------- ADMIN -------------------
ADMIN_USERS = ["adminjolman", "admincarlos", "adminmarvin"]
ADMIN_PWDS  = ["86847950", "83362847", "58101169"]

# ------------------- FUNCIONES -------------------
def crear_cliente_gui():
    nombre = simpledialog.askstring("Nuevo Cliente", "Ingrese nombre completo:")
    correo = simpledialog.askstring("Nuevo Cliente", "Ingrese correo:")
    contraseña = simpledialog.askstring("Nuevo Cliente", "Ingrese contraseña:")
    if nombre and correo and contraseña:
        if any(c.correo.lower() == correo.lower() for c in clientes):
            messagebox.showerror("Error", "Correo ya registrado.")
            return
        c = Cliente(nombre, correo, contraseña)
        clientes.append(c)
        guardar_datos(clientes)
        messagebox.showinfo("Éxito", f"Cliente {nombre} creado.")

# ------------------- LOGIN ADMIN -------------------
def login_admin():
    usuario = simpledialog.askstring("Login Admin", "Usuario:")
    pwd = simpledialog.askstring("Login Admin", "Contraseña:")
    if usuario in ADMIN_USERS:
        idx = ADMIN_USERS.index(usuario)
        if pwd == ADMIN_PWDS[idx]:
            admin_interface()
        else:
            messagebox.showerror("Error", "Contraseña incorrecta.")
    else:
        messagebox.showerror("Error", "Usuario no encontrado.")

# ------------------- INTERFAZ ADMIN -------------------
def admin_interface():
    ventana_admin = tk.Toplevel(root)
    ventana_admin.title("Panel Administrador")
    ventana_admin.geometry("400x400")

    tk.Label(ventana_admin, text="Panel Administrador", font=("Arial", 16)).pack(pady=10)
    tk.Button(ventana_admin, text="Crear Cliente", width=30, command=crear_cliente_gui).pack(pady=5)
    tk.Button(ventana_admin, text="Crear Préstamo", width=30, command=crear_prestamo_gui).pack(pady=5)
    tk.Button(ventana_admin, text="Ver Clientes", width=30, command=ver_clientes_gui).pack(pady=5)
    tk.Button(ventana_admin, text="Pagar Cuota", width=30, command=pagar_cuota_gui).pack(pady=5)
    tk.Button(ventana_admin, text="Abonar al Préstamo", width=30, command=abonar_gui).pack(pady=5)
    tk.Button(ventana_admin, text="Ver Historial", width=30, command=ver_historial_gui).pack(pady=5)

# ------------------- LOGIN CLIENTE -------------------
def login_cliente():
    correo = simpledialog.askstring("Login Cliente", "Correo:")
    pwd = simpledialog.askstring("Login Cliente", "Contraseña:")
    cliente = next((c for c in clientes if c.correo.lower() == correo.lower() and c.contraseña == pwd), None)
    if cliente:
        cliente_interface(cliente)
    else:
        messagebox.showerror("Error", "Correo o contraseña incorrectos.")

# ------------------- INTERFAZ CLIENTE -------------------
def cliente_interface(cliente):
    ventana_cliente = tk.Toplevel(root)
    ventana_cliente.title(f"Panel Cliente - {cliente.nombre}")
    ventana_cliente.geometry("400x400")

    tk.Label(ventana_cliente, text=f"Cliente: {cliente.nombre}", font=("Arial", 16)).pack(pady=10)
    tk.Button(ventana_cliente, text="Ver Información Personal", width=30,
              command=lambda: messagebox.showinfo("Información", f"Nombre: {cliente.nombre}\nCorreo: {cliente.correo}\nPréstamo: {'Sí' if cliente.prestamo else 'No'}")).pack(pady=5)
    tk.Button(ventana_cliente, text="Pagar Cuota", width=30,
              command=lambda: pagar_cuota_cliente(cliente)).pack(pady=5)
    tk.Button(ventana_cliente, text="Abonar al Préstamo", width=30,
              command=lambda: abonar_cliente(cliente)).pack(pady=5)
    tk.Button(ventana_cliente, text="Ver Historial", width=30,
              command=lambda: ver_historial_cliente(cliente)).pack(pady=5)

def pagar_cuota_cliente(cliente):
    if cliente.prestamo:
        exito, mensaje = cliente.prestamo.pagar_cuota()
        guardar_datos(clientes)
        messagebox.showinfo("Resultado", mensaje)
    else:
        messagebox.showerror("Error", "No tiene préstamo activo.")

def abonar_cliente(cliente):
    if cliente.prestamo:
        monto = simpledialog.askfloat("Abonar", "Ingrese monto a abonar:")
        if monto:
            exito, mensaje = cliente.prestamo.abonar(monto)
            guardar_datos(clientes)
            messagebox.showinfo("Resultado", mensaje)
    else:
        messagebox.showerror("Error", "No tiene préstamo activo.")

def ver_historial_cliente(cliente):
    if cliente.prestamo:
        texto = ""
        for t in cliente.prestamo.historial:
            texto += f"{t['fecha']} - {t['tipo']}: ${t['monto']} ({t['detalle']})\n"
        messagebox.showinfo("Historial de Transacciones", texto if texto else "Sin historial")
    else:
        messagebox.showerror("Error", "No tiene préstamo activo.")

# ------------------- FUNCIONES AUXILIARES -------------------
def crear_prestamo_gui():
    if not clientes:
        messagebox.showwarning("Advertencia", "No hay clientes registrados.")
        return
    nombres = [c.nombre for c in clientes]
    nombre_cliente = simpledialog.askstring("Préstamo", f"Ingrese nombre del cliente:\n{nombres}")
    cliente = next((c for c in clientes if c.nombre.lower() == nombre_cliente.lower()), None)
    if not cliente:
        messagebox.showerror("Error", "Cliente no encontrado.")
        return
    if cliente.prestamo:
        messagebox.showwarning("Advertencia", "Cliente ya tiene un préstamo.")
        return
    monto = simpledialog.askfloat("Préstamo", "Ingrese monto del préstamo:")
    if monto:
        p = Prestamo(monto)
        cliente.prestamo = p
        guardar_datos(clientes)
        messagebox.showinfo("Éxito", f"Préstamo de ${monto:.2f} creado para {cliente.nombre}.")

def ver_clientes_gui():
    texto = ""
    for c in clientes:
        texto += f"{c.nombre} | {c.correo} | Préstamo: {'Sí' if c.prestamo else 'No'}\n"
    messagebox.showinfo("Lista de Clientes", texto if texto else "No hay clientes.")

def pagar_cuota_gui():
    nombre_cliente = simpledialog.askstring("Pago de cuota", "Ingrese nombre del cliente:")
    cliente = next((c for c in clientes if c.nombre.lower() == nombre_cliente.lower()), None)
    if cliente and cliente.prestamo:
        exito, mensaje = cliente.prestamo.pagar_cuota()
        guardar_datos(clientes)
        messagebox.showinfo("Resultado", mensaje)
    else:
        messagebox.showerror("Error", "Cliente o préstamo no encontrado.")

def abonar_gui():
    nombre_cliente = simpledialog.askstring("Abonar", "Ingrese nombre del cliente:")
    cliente = next((c for c in clientes if c.nombre.lower() == nombre_cliente.lower()), None)
    if cliente and cliente.prestamo:
        monto = simpledialog.askfloat("Abonar", "Ingrese monto a abonar:")
        if monto:
            exito, mensaje = cliente.prestamo.abonar(monto)
            guardar_datos(clientes)
            messagebox.showinfo("Resultado", mensaje)
    else:
        messagebox.showerror("Error", "Cliente o préstamo no encontrado.")

def ver_historial_gui():
    nombre_cliente = simpledialog.askstring("Historial", "Ingrese nombre del cliente:")
    cliente = next((c for c in clientes if c.nombre.lower() == nombre_cliente.lower()), None)
    if cliente and cliente.prestamo:
        texto = ""
        for t in cliente.prestamo.historial:
            texto += f"{t['fecha']} - {t['tipo']}: ${t['monto']} ({t['detalle']})\n"
        messagebox.showinfo("Historial de Transacciones", texto if texto else "Sin historial")
    else:
        messagebox.showerror("Error", "Cliente o préstamo no encontrado.")

# ------------------- INTERFAZ PRINCIPAL -------------------
root = tk.Tk()
root.title("Sistema de Gestión de Préstamos")
root.geometry("400x300")

tk.Label(root, text="Bienvenido a CreditSure", font=("Arial", 16)).pack(pady=20)
tk.Button(root, text="Login Admin", width=30, command=login_admin).pack(pady=5)
tk.Button(root, text="Crear Cliente", width=30, command=crear_cliente_gui).pack(pady=5)
tk.Button(root, text="Login Cliente", width=30, command=login_cliente).pack(pady=5)
tk.Button(root, text="Salir", width=30, command=root.destroy).pack(pady=20)

root.mainloop()
