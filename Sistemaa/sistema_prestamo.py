# sistema_prestamos.py 
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog
from datetime import datetime
import uuid
import json
import os
import csv

# Archivo de persistencia
ARCHIVO_DATOS = "datos.json"

# ------------------ Utilidades de Fecha ------------------

def sumar_meses(fecha, meses):
    """Suma 'meses' a una fecha, ajustando correctamente el día final de mes."""
    mes = fecha.month - 1 + meses
    año = fecha.year + mes // 12
    mes = mes % 12 + 1
    # Días por mes (considerando bisiestos)
    dias_por_mes = [31, 29 if año % 4 == 0 and (año % 100 != 0 or año % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
    dia = min(fecha.day, dias_por_mes[mes - 1]) 
    
    return fecha.replace(year=año, month=mes, day=dia)

# ------------------ Lógica de Negocio / Análisis de Riesgo ------------------

def calcular_cuota_mensual(monto, tasa_anual, plazo_meses):
    """Calcula la cuota mensual de un préstamo de forma aproximada (sistema simple)."""
    if plazo_meses <= 0 or monto <= 0:
        return 0.0
    
    # Tasa mensual
    tasa_mensual = (tasa_anual / 100) / 12.0
    
    # Utilizamos el cálculo simple que ya se usa en la clase Prestamo para consistencia
    principal_mensual = monto / plazo_meses
    interes_mensual = monto * tasa_mensual
    
    return round(principal_mensual + interes_mensual, 2)

def analizar_solicitud(cliente, monto, tasa_anual, plazo_meses):
    """
    Analiza la viabilidad de un préstamo basándose en el sueldo del cliente.
    
    Regla de negocio: La cuota mensual no debe exceder el 35% del sueldo.
    """
    if cliente.prestamo:
        return False, "El cliente ya tiene un préstamo activo."

    if cliente.sueldo <= 0:
        return False, "El sueldo es cero. Préstamo rechazado por falta de ingresos."

    cuota = calcular_cuota_mensual(monto, tasa_anual, plazo_meses)
    
    # Porcentaje máximo de endeudamiento permitido (35%)
    limite_endeudamiento = cliente.sueldo * 0.35
    
    if cuota > limite_endeudamiento:
        razon = f"La cuota mensual calculada (${cuota:.2f}) excede el 35% de su sueldo (${limite_endeudamiento:.2f})."
        return False, razon
    
    return True, "Aprobada"


# ------------------ Modelos ------------------

class Cliente:
    def __init__(self, id_cliente, nombre, correo, contrasena, sueldo=0.0):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contrasena
        self.sueldo = sueldo
        self.prestamo = None

    def to_dict(self):
        return {
            "id_cliente": self.id_cliente,
            "nombre": self.nombre,
            "correo": self.correo,
            "contraseña": self.contraseña,
            "sueldo": self.sueldo,
            "prestamo": self.prestamo.to_dict() if self.prestamo else None
        }

class Prestamo:
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, direccion, telefono, fecha_desembolso=None):
        self.id_prestamo = id_prestamo
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.saldo_pendiente = monto
        self.cedula = cedula
        self.direccion = direccion
        self.telefono = telefono
        self.historial = []
        self.fecha_desembolso = fecha_desembolso or datetime.now().strftime("%Y-%m-%d")
        self.ganancias = 0.0
        self.cuotas_pagadas = 0

    def to_dict(self):
        return {
            "id_prestamo": self.id_prestamo,
            "monto": self.monto,
            "tasa_interes": self.tasa_interes,
            "plazo": self.plazo,
            "saldo_pendiente": self.saldo_pendiente,
            "cedula": self.cedula,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "historial": self.historial,
            "fecha_desembolso": self.fecha_desembolso,
            "ganancias": self.ganancias,
            "cuotas_pagadas": self.cuotas_pagadas
        }

    def registrar_transaccion(self, tipo, monto, detalle):
        self.historial.append({
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tipo": tipo,
            "monto": monto,
            "detalle": detalle
        })

    def pagar_cuota(self):
        # Cálculo simple
        if self.plazo <= 0:
            return 0.0
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        cuota = round(principal_mensual + interes_mensual, 2)

        if self.saldo_pendiente <= 0:
            return 0.0

        if cuota > self.saldo_pendiente:
            cuota = self.saldo_pendiente
            interes_mensual = 0 
            
        self.saldo_pendiente -= cuota
        if self.saldo_pendiente < 0:
            self.saldo_pendiente = 0.0
            
        self.ganancias += interes_mensual
        self.cuotas_pagadas += 1
        
        # Detalle de pago como "aprobado"
        self.registrar_transaccion("Pago de cuota", cuota, f"Pago de cuota aprobado. Cuota #{self.cuotas_pagadas}")
        return cuota

    def generar_plan_amortizacion(self):
        """
        Retorna lista de tuplas: (nro, fecha_pago, cuota_principal, interes, total_cuota, saldo_cliente, estado_cuota)
        """
        plan = []
        try:
            fecha = datetime.strptime(self.fecha_desembolso, "%Y-%m-%d")
        except:
            fecha = datetime.now()

        principal_mensual = round(self.monto / self.plazo, 2) if self.plazo > 0 else 0.0
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2) if self.plazo > 0 else 0.0
        saldo_simulado = self.monto

        for i in range(1, (self.plazo if self.plazo>0 else 1) + 1):
            fecha_pago = sumar_meses(fecha, i)
            total = round(principal_mensual + interes_mensual, 2)

            # Ajuste última cuota
            if i == self.plazo:
                principal = round(saldo_simulado, 2)
                total = round(principal + interes_mensual, 2)
            else:
                principal = principal_mensual

            # Estado de la cuota
            if i <= self.cuotas_pagadas:
                estado = "Pagada"
            elif i == self.cuotas_pagadas + 1:
                estado = "Próxima"
            else:
                estado = "Pendiente" # Cuotas futuras
            
            # Formato de valores
            total_cuota_str = f"${total:.2f}"
            saldo_simulado_str = f"${saldo_simulado:.2f}"
            
            # Reducir saldo simulado con el principal aplicado en esa cuota
            saldo_simulado = round(saldo_simulado - principal, 2)
            if saldo_simulado < 0:
                saldo_simulado = 0.0

            plan.append((i, fecha_pago.strftime("%d/%m/%Y"), f"${principal:.2f}", f"${interes_mensual:.2f}", total_cuota_str, saldo_simulado_str, estado))

        return plan

class Solicitud:
    def __init__(self, id_solicitud, id_cliente, monto, tasa_interes, plazo, cedula, direccion, telefono, estado="Pendiente", fecha=None):
        self.id_solicitud = id_solicitud
        self.id_cliente = id_cliente
        self.monto = monto
        self.tasa_interes = tasa_interes
        self.plazo = plazo
        self.cedula = cedula
        self.direccion = direccion
        self.telefono = telefono
        self.estado = estado  # 'Aprobada', 'Rechazada', 'Pendiente'
        self.fecha = fecha or datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def to_dict(self):
        return {
            "id_solicitud": self.id_solicitud,
            "id_cliente": self.id_cliente,
            "monto": self.monto,
            "tasa_interes": self.tasa_interes,
            "plazo": self.plazo,
            "cedula": self.cedula,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "estado": self.estado,
            "fecha": self.fecha
        }

# ------------------ Utilidades y Persistencia ------------------

def guardar_datos(clientes, solicitudes):
    datos = {
        "clientes": [c.to_dict() for c in clientes],
        "solicitudes": [s.to_dict() for s in solicitudes]
    }
    try:
        with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2)
    except Exception as e:
        messagebox.showerror("Error de Guardado", f"No se pudieron guardar los datos: {e}")

def cargar_datos():
    if not os.path.exists(ARCHIVO_DATOS):
        return [], []
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    except Exception:
        return [], []
    clientes = []
    for d in datos.get("clientes", []):
        c = Cliente(d.get("id_cliente", str(uuid.uuid4())), d.get("nombre",""), d.get("correo",""), d.get("contraseña",""), d.get("sueldo",0.0))
        p = d.get("prestamo")
        if p:
            prest = Prestamo(
                p.get("id_prestamo", str(uuid.uuid4())),
                p.get("monto", 0.0),
                p.get("tasa_interes", 0.0),
                p.get("plazo", 12),
                p.get("cedula", ""),
                p.get("direccion", ""),
                p.get("telefono", ""),
                p.get("fecha_desembolso", None)
            )
            prest.saldo_pendiente = p.get("saldo_pendiente", prest.monto)
            prest.historial = p.get("historial", [])
            prest.ganancias = p.get("ganancias", 0.0)
            prest.cuotas_pagadas = p.get("cuotas_pagadas", 0)
            c.prestamo = prest
        clientes.append(c)
    solicitudes = []
    for s in datos.get("solicitudes", []):
        solicitudes.append(Solicitud(s.get("id_solicitud"), s.get("id_cliente"), s.get("monto"), s.get("tasa_interes"), s.get("plazo"), s.get("cedula"), s.get("direccion"), s.get("telefono"), s.get("estado","Pendiente"), s.get("fecha")))
    return clientes, solicitudes

def abrir_historial_window(parent, prestamo, titulo="Historial"):
    """Función para mostrar el historial de transacciones en una nueva ventana."""
    win = tk.Toplevel(parent)
    win.title(titulo)
    win.geometry("600x400")
    frm = tk.Frame(win, padx=10, pady=10)
    frm.pack(fill="both", expand=True)

    cols = ("Fecha", "Tipo", "Monto", "Detalle")
    tree = ttk.Treeview(frm, columns=cols, show="headings", height=15)
    for c in cols:
        tree.heading(c, text=c)
        tree.column(c, width=150)
    tree.pack(fill="both", expand=True)

    for h in prestamo.historial:
        tree.insert("", "end", values=(h["fecha"], h["tipo"], f"${h['monto']:.2f}", h["detalle"]))

# ------------------ Configuración Admin ------------------

# Usuarios Administradores
ADMIN_USERS = ["carlos","marvin","jolman"]
ADMIN_PWDS = ["83362847","58101169","86847950"]

# ------------------ Dialogs personalizados ------------------

class CrearClienteDialog(simpledialog.Dialog):
    """Dialog para crear cliente: todo en una sola ventana (nombre, correo, contraseña, sueldo)"""
    def __init__(self, parent, title=None):
        self.result = None
        super().__init__(parent, title=title)

    def body(self, master):
        ttk.Label(master, text="Nombre completo:").grid(row=0, column=0, sticky="w", pady=2, padx=5)
        self.ent_nombre = ttk.Entry(master)
        self.ent_nombre.grid(row=0, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Correo (ej. algo@gmail.com):").grid(row=1, column=0, sticky="w", pady=2, padx=5)
        self.ent_correo = ttk.Entry(master)
        self.ent_correo.grid(row=1, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Contraseña (mín 8):").grid(row=2, column=0, sticky="w", pady=2, padx=5)
        self.ent_pwd = ttk.Entry(master, show="*")
        self.ent_pwd.grid(row=2, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Sueldo (número):").grid(row=3, column=0, sticky="w", pady=2, padx=5)
        self.ent_sueldo = ttk.Entry(master)
        self.ent_sueldo.grid(row=3, column=1, sticky="ew", pady=2, padx=5)

        return self.ent_nombre

    def validate(self):
        try:
            nombre = self.ent_nombre.get().strip()
            correo = self.ent_correo.get().strip()
            pwd = self.ent_pwd.get().strip()
            sueldo_str = self.ent_sueldo.get().strip()
            sueldo = float(sueldo_str) if sueldo_str else 0.0

            if not nombre or not correo or not pwd:
                messagebox.showerror("Error", "Complete todos los campos.")
                return 0
            if len(pwd) < 8:
                messagebox.showerror("Error", "Contraseña debe tener mínimo 8 caracteres.")
                return 0
            # correo simple validación
            if "@" not in correo or "." not in correo:
                messagebox.showerror("Error", "Correo inválido.")
                return 0
            return 1
        except ValueError:
            messagebox.showerror("Error", "Sueldo debe ser un número válido.")
            return 0

    def apply(self):
        self.result = (
            self.ent_nombre.get().strip(),
            self.ent_correo.get().strip(),
            self.ent_pwd.get().strip(),
            float(self.ent_sueldo.get().strip() or 0.0)
        )

class CrearPrestamoDialog(simpledialog.Dialog):
    """
    Dialog para crear préstamo o para que cliente solicite préstamo.
    Si prefill dict es pasado, campos se llenan.
    """
    def __init__(self, parent, title=None, prefill=None):
        self.result = None
        self.prefill = prefill or {}
        super().__init__(parent, title=title)

    def body(self, master):
        ttk.Label(master, text="Monto ($):").grid(row=0, column=0, sticky="w", pady=2, padx=5)
        self.ent_monto = ttk.Entry(master)
        self.ent_monto.grid(row=0, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Tasa Anual (%):").grid(row=1, column=0, sticky="w", pady=2, padx=5)
        self.ent_tasa = ttk.Entry(master)
        self.ent_tasa.grid(row=1, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Plazo (meses):").grid(row=2, column=0, sticky="w", pady=2, padx=5)
        self.ent_plazo = ttk.Entry(master)
        self.ent_plazo.grid(row=2, column=1, sticky="ew", pady=2, padx=5)

        ttk.Separator(master, orient="horizontal").grid(row=3, column=0, columnspan=2, sticky="ew", pady=8)

        ttk.Label(master, text="Cédula:").grid(row=4, column=0, sticky="w", pady=2, padx=5)
        self.ent_cedula = ttk.Entry(master)
        self.ent_cedula.grid(row=4, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Dirección:").grid(row=5, column=0, sticky="w", pady=2, padx=5)
        self.ent_direccion = ttk.Entry(master)
        self.ent_direccion.grid(row=5, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Teléfono:").grid(row=6, column=0, sticky="w", pady=2, padx=5)
        self.ent_telefono = ttk.Entry(master)
        self.ent_telefono.grid(row=6, column=1, sticky="ew", pady=2, padx=5)

        # prefill
        if self.prefill:
            self.ent_monto.insert(0, str(self.prefill.get("monto", "")))
            self.ent_tasa.insert(0, str(self.prefill.get("tasa_interes", "")))
            self.ent_plazo.insert(0, str(self.prefill.get("plazo", "")))
            self.ent_cedula.insert(0, str(self.prefill.get("cedula", "")))
            self.ent_direccion.insert(0, str(self.prefill.get("direccion", "")))
            self.ent_telefono.insert(0, str(self.prefill.get("telefono", "")))

        return self.ent_monto

    def validate(self):
        try:
            monto = float(self.ent_monto.get().strip())
            tasa = float(self.ent_tasa.get().strip())
            plazo = int(self.ent_plazo.get().strip())
            if monto <= 0 or tasa <= 0 or plazo <= 0:
                messagebox.showerror("Error de Validación", "Monto, tasa y plazo deben ser mayores que cero.")
                return 0
            return 1
        except ValueError:
            messagebox.showerror("Error de Validación", "Campos numéricos inválidos.")
            return 0

    def apply(self):
        self.result = {
            "monto": float(self.ent_monto.get().strip()),
            "tasa_interes": float(self.ent_tasa.get().strip()),
            "plazo": int(self.ent_plazo.get().strip()),
            "cedula": self.ent_cedula.get().strip(),
            "direccion": self.ent_direccion.get().strip(),
            "telefono": self.ent_telefono.get().strip()
        }

# ------------------ UI principal (una sola clase App) ------------------

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sistema de Préstamos - GUI")
        self.geometry("980x640")
        self.configure(bg="#f4f6f8")
        self.clientes, self.solicitudes = cargar_datos()
        self.usuario_actual = None
        self._build_login()

    # ---------- LOGIN ----------
    def _build_login(self):
        for w in self.winfo_children():
            w.destroy()
        frm = tk.Frame(self, bg="#f4f6f8", padx=20, pady=20)
        frm.pack(expand=True)
        tk.Label(frm, text="Iniciar Sesión", font=("Segoe UI",18,"bold"), bg="#f4f6f8").grid(row=0,column=0,columnspan=2,pady=(0,10))
        tk.Label(frm, text="Usuario / Correo:", bg="#f4f6f8").grid(row=1,column=0,sticky="e")
        self.ent_user = tk.Entry(frm,width=30)
        self.ent_user.grid(row=1,column=1,pady=5)
        tk.Label(frm, text="Contraseña:", bg="#f4f6f8").grid(row=2,column=0,sticky="e")
        self.ent_pwd = tk.Entry(frm,width=30,show="*")
        self.ent_pwd.grid(row=2,column=1,pady=5)
        tk.Button(frm,text="Iniciar sesión", command=self.login, width=20,bg="#4a90e2",fg="white").grid(row=3,column=0,columnspan=2,pady=12)
        tk.Button(frm,text="Crear cuenta (cliente)", command=self.crear_cliente_dialog, width=20).grid(row=4,column=0,columnspan=2)

    def logout(self):
        self.usuario_actual = None
        self._build_login()

    def crear_cliente_dialog(self):
        dlg = CrearClienteDialog(self, title="Crear cliente")
        if dlg.result:
            nombre, correo, pwd, sueldo = dlg.result
            if any(c.correo.lower()==correo.lower() for c in self.clientes):
                messagebox.showerror("Error","Correo ya registrado")
                return
            c = Cliente(str(uuid.uuid4()), nombre, correo, pwd, sueldo)
            self.clientes.append(c)
            guardar_datos(self.clientes, self.solicitudes)
            messagebox.showinfo("OK","Cliente creado correctamente")

    def login(self):
        usuario = self.ent_user.get().strip()
        pwd = self.ent_pwd.get().strip()

        # Admin login
        if usuario in ADMIN_USERS:
            try:
                idx = ADMIN_USERS.index(usuario)
                if pwd == ADMIN_PWDS[idx]:
                    self.usuario_actual = {"tipo": "admin", "usuario": usuario}
                    self._build_admin_dashboard()
                    return
                else:
                    messagebox.showerror("Error","Contraseña admin incorrecta")
                    return
            except ValueError:
                pass

        # Cliente login (correo)
        cliente = next((c for c in self.clientes if c.correo.lower()==usuario.lower() and c.contraseña==pwd), None)
        if cliente:
            self.usuario_actual = {"tipo": "cliente", "cliente": cliente}
            self._build_cliente_dashboard(cliente)
            return

        messagebox.showerror("Error","Usuario o contraseña incorrectos")

    # ---------- DASHBOARD ADMIN ----------
    def _build_admin_dashboard(self):
        for w in self.winfo_children():
            w.destroy()

        # Barra superior
        top = tk.Frame(self, bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top, text=f"Administrador: {self.usuario_actual['usuario']}", bg="#fff", font=("Segoe UI",12)).pack(side="left", padx=10)
        tk.Button(top, text="Cerrar sesión", command=self.logout).pack(side="right", padx=10)

        pane = tk.PanedWindow(self, sashrelief="raised", bg="#f4f6f8")
        pane.pack(fill="both", expand=True)

        # Izquierda: clientes
        left = tk.Frame(pane, bg="#f4f6f8", padx=10, pady=10)
        pane.add(left, minsize=320)
        tk.Label(left, text="Clientes", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor="w")
        cols = ("ID","Nombre","Correo")
        self.tree_clientes = ttk.Treeview(left, columns=cols, show="headings", height=20)
        for c in cols:
            self.tree_clientes.heading(c, text=c)
            self.tree_clientes.column(c, width=100)
        self.tree_clientes.pack(fill="both", expand=True)
        self._refrescar_lista_clientes()

        btns_left = tk.Frame(left, bg="#f4f6f8")
        btns_left.pack(fill="x", pady=6)
        tk.Button(btns_left, text="Crear préstamo", command=self.crear_prestamo_admin).pack(side="left", padx=4)
        tk.Button(btns_left, text="Eliminar cliente", command=self.eliminar_cliente_seleccionado).pack(side="left", padx=4)
        tk.Button(btns_left, text="Ver solicitudes", command=self.ver_solicitudes).pack(side="left", padx=4)

        # Derecha: detalle y plan
        right = tk.Frame(pane, bg="#fff", padx=10, pady=10)
        pane.add(right, minsize=620)
        tk.Label(right, text="Detalle / Plan de amortización", bg="#fff", font=("Segoe UI",11,"bold")).pack(anchor="w")
        self.lbl_cliente_sel = tk.Label(right, text="Seleccione un cliente a la izquierda", bg="#fff")
        self.lbl_cliente_sel.pack(anchor="w", pady=(6,0))

        # CORRECCIÓN AQUÍ: Agregamos la columna 'Estado' al Treeview del plan
        plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota","Saldo del cliente", "Estado")
        self.tree_plan = ttk.Treeview(right, columns=plan_cols, show="headings", height=15)
        for c in plan_cols:
            self.tree_plan.heading(c, text=c)
            # Ajustamos el ancho para que quepa todo
            width = 95 if c != "Saldo del cliente" else 110
            self.tree_plan.column(c, width=width, anchor='center')
        self.tree_plan.pack(fill="both", expand=True, pady=6)

        admin_actions = tk.Frame(right, bg="#fff")
        admin_actions.pack(fill="x", pady=6)
        tk.Button(admin_actions, text="Pagar cuota (admin)", command=self.pagar_cuota_admin).pack(side="left", padx=6)
        tk.Button(admin_actions, text="Eliminar préstamo", command=self.eliminar_prestamo_seleccionado, bg="#e74c3c", fg="white").pack(side="left", padx=6)
        tk.Button(admin_actions, text="Ver ganancias", command=self.mostrar_ganancias).pack(side="left", padx=6)
        tk.Button(admin_actions, text="Ver historial", command=self.ver_historial_admin).pack(side="left", padx=6)
        
        self.tree_clientes.bind("<<TreeviewSelect>>", self.on_cliente_selected)

    def _refrescar_lista_clientes(self):
        for i in self.tree_clientes.get_children():
            self.tree_clientes.delete(i)
        for c in self.clientes:
            self.tree_clientes.insert("", "end", iid=c.id_cliente, values=(c.id_cliente, c.nombre, c.correo))

    def on_cliente_selected(self, event=None):
        sel = self.tree_clientes.selection()
        if not sel:
            self.lbl_cliente_sel.config(text="Seleccione un cliente a la izquierda")
            for i in self.tree_plan.get_children():
                self.tree_plan.delete(i)
            return
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente == cid), None)
        if not cliente:
            return
        if cliente.prestamo:
            self.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo} | Saldo: ${cliente.prestamo.saldo_pendiente:.2f}")
        else:
            self.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo} | SIN PRÉSTAMO")

        for i in self.tree_plan.get_children():
            self.tree_plan.delete(i)

        if cliente.prestamo:
            plan = cliente.prestamo.generar_plan_amortizacion()
            for fila in plan:
                # CORRECCIÓN AQUÍ: Insertamos los 7 valores, incluyendo el estado (fila[6])
                # fila es (i, fecha, principal, interes, total, saldo_simulado, estado)
                nro, fecha_pago, principal, interes, total, saldo_simulado, estado = fila
                self.tree_plan.insert("", "end", values=(nro, fecha_pago, principal, interes, total, saldo_simulado, estado))

    def crear_prestamo_admin(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione primero un cliente")
            return
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente == cid), None)
        if not cliente:
            return
        if cliente.prestamo:
            messagebox.showinfo("Info","El cliente ya tiene un préstamo activo")
            return
        dialog = CrearPrestamoDialog(self, title=f"Crear Préstamo para {cliente.nombre}")
        if dialog.result:
            d = dialog.result
            prest = Prestamo(str(uuid.uuid4()), d['monto'], d['tasa_interes'], d['plazo'], d['cedula'], d['direccion'], d['telefono'])
            cliente.prestamo = prest
            # si había alguna solicitud pendiente relacionada, actualizarla como Aprobada
            for s in self.solicitudes:
                if s.id_cliente == cliente.id_cliente and float(s.monto) == float(d['monto']) and s.estado != "Aprobada":
                    s.estado = "Aprobada"
            guardar_datos(self.clientes, self.solicitudes)
            messagebox.showinfo("OK", f"Préstamo de ${d['monto']:.2f} creado para {cliente.nombre}.")
            self._refrescar_lista_clientes()
            self.on_cliente_selected()

    def eliminar_cliente_seleccionado(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente == cid), None)
        if not cliente:
            return
        if messagebox.askyesno("Confirmar", f"Eliminar cliente {cliente.nombre}? Esto borrará su préstamo si lo tiene."):
            self.clientes.remove(cliente)
            # También borrar solicitudes relacionadas
            self.solicitudes = [s for s in self.solicitudes if s.id_cliente != cid]
            guardar_datos(self.clientes, self.solicitudes)
            self._refrescar_lista_clientes()
            for i in self.tree_plan.get_children():
                self.tree_plan.delete(i)
            messagebox.showinfo("OK","Cliente eliminado")

    # FUNCIÓN PARA ELIMINAR PRÉSTAMO
    def eliminar_prestamo_seleccionado(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione un cliente para eliminar su préstamo.")
            return

        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente == cid), None)

        if not cliente:
            return

        if not cliente.prestamo:
            messagebox.showinfo("Info", f"El cliente {cliente.nombre} no tiene un préstamo activo para eliminar.")
            return

        prestamo_id = cliente.prestamo.id_prestamo[:6] + "..."

        if messagebox.askyesno("Confirmar Eliminación de Préstamo",
                               f"¿Está seguro de que desea ELIMINAR el préstamo {prestamo_id} de {cliente.nombre}?\n\nEsta acción es permanente."):
            cliente.prestamo = None
            
            guardar_datos(self.clientes, self.solicitudes)
            messagebox.showinfo("Éxito", f"Préstamo de {cliente.nombre} eliminado correctamente.")
            
            # Refrescar la vista
            self.on_cliente_selected()
    # FIN FUNCIÓN

    def pagar_cuota_admin(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
        cliente = next((c for c in self.clientes if c.id_cliente == sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
        
        if cliente.prestamo.saldo_pendiente <= 0:
             messagebox.showinfo("Info","El préstamo ya ha sido liquidado.")
             return
             
        cuota = cliente.prestamo.pagar_cuota()
        if cuota > 0:
            guardar_datos(self.clientes, self.solicitudes)
            # El detalle 'aprobado' ya se registró dentro de la función pagar_cuota() del modelo Prestamo
            messagebox.showinfo("OK", f"Se pagó cuota por ${cuota:.2f} (APROBADO). Saldo pendiente: ${cliente.prestamo.saldo_pendiente:.2f}")
            self.on_cliente_selected() # Esto refresca la tabla y la columna 'Estado' se actualiza a 'Pagada'
        else:
            # Esta parte se alcanzó solo si el saldo era 0 al inicio, pero ya se filtra arriba
            messagebox.showinfo("Info","Error: No se pudo procesar el pago.")


    def mostrar_ganancias(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
        cliente = next((c for c in self.clientes if c.id_cliente == sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
        ganancias = cliente.prestamo.ganancias
        messagebox.showinfo("Ganancias del préstamo", f"Ganancia acumulada del préstamo: ${ganancias:.2f}")

    def ver_historial_admin(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
        cliente = next((c for c in self.clientes if c.id_cliente == sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
        abrir_historial_window(self, cliente.prestamo, titulo=f"Historial: {cliente.nombre}")

    # ---------- DASHBOARD CLIENTE ----------
    def _build_cliente_dashboard(self, cliente):
        for w in self.winfo_children():
            w.destroy()

        top = tk.Frame(self, bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top, text=f"Cliente: {cliente.nombre}", bg="#fff", font=("Segoe UI",12)).pack(side="left", padx=10)
        tk.Button(top, text="Cerrar sesión", command=self.logout).pack(side="right", padx=10)

        main = tk.Frame(self, bg="#f4f6f8", padx=12, pady=12)
        main.pack(fill="both", expand=True)

        tk.Label(main, text="Mi información", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor='w')
        tk.Label(main, text=f"Nombre: {cliente.nombre}\nCorreo: {cliente.correo}\nSueldo: ${cliente.sueldo:.2f}", bg="#f4f6f8").pack(anchor='w', pady=(0,8))

        tk.Label(main, text="Plan de amortización", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor='w')
        # CORRECCIÓN AQUÍ: El cliente también ve la columna 'Estado'
        plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota","Saldo del cliente", "Estado") 
        tree = ttk.Treeview(main, columns=plan_cols, show="headings", height=12)
        for c in plan_cols:
            tree.heading(c, text=c)
            width = 110 if c != "Saldo del cliente" else 130
            tree.column(c, width=width, anchor='center')
        tree.pack(fill='both', expand=True)

        actions_frame = tk.Frame(main, bg="#f4f6f8")
        actions_frame.pack(fill="x", pady=8)
        tk.Button(actions_frame, text="Solicitar préstamo", command=lambda: self.solicitar_prestamo(cliente)).pack(side="left", padx=6)
        if cliente.prestamo:
            tk.Label(main, text=f"Saldo Pendiente: ${cliente.prestamo.saldo_pendiente:.2f}", bg="#f4f6f8", font=("Segoe UI", 10, "bold")).pack(anchor='w', pady=(8,4))
            for fila in cliente.prestamo.generar_plan_amortizacion():
                # CORRECCIÓN AQUÍ: Insertamos los 7 valores, incluyendo el estado (fila[6])
                nro, fecha_pago, principal, interes, total, saldo_simulado, estado = fila
                tree.insert("", "end", values=(nro, fecha_pago, principal, interes, total, saldo_simulado, estado))
            tk.Button(main, text="Ver historial de mi préstamo", command=lambda: abrir_historial_window(self, cliente.prestamo, titulo="Mi historial")).pack(pady=8)
        else:
            tk.Label(main, text="No posee préstamo activo.", bg="#f4f6f8").pack(pady=10)

    # --- LÓGICA DE SOLICITUD (CLIENTE) CON ANÁLISIS DE RIESGO ---
    def solicitar_prestamo(self, cliente):
        dialog = CrearPrestamoDialog(self, title="Solicitar préstamo")
        if not dialog.result:
            return
        d = dialog.result
        
        monto = d['monto']
        tasa = d['tasa_interes']
        plazo = d['plazo']

        # PASO CRÍTICO: ANALIZAR LA SOLICITUD
        es_viable, razon = analizar_solicitud(cliente, monto, tasa, plazo)
        
        estado_solicitud = "Aprobada" if es_viable else "Rechazada"
        
        # 1. Crear solicitud con el estado real
        solicitud = Solicitud(str(uuid.uuid4()), cliente.id_cliente, monto, tasa, plazo, d['cedula'], d['direccion'], d['telefono'], estado=estado_solicitud)
        self.solicitudes.append(solicitud)
        
        # 2. Procesar el resultado
        if es_viable:
            # Crear el préstamo si es viable y el cliente no tiene uno activo
            if cliente.prestamo:
                messagebox.showinfo("Info", "Usted ya tiene un préstamo activo. La solicitud se registró (Aprobada) pero no se puede crear un segundo préstamo.")
            else:
                prest = Prestamo(str(uuid.uuid4()), monto, tasa, plazo, d['cedula'], d['direccion'], d['telefono'])
                cliente.prestamo = prest
                messagebox.showinfo("Préstamo Aprobado", "¡Felicidades! Su préstamo fue aprobado y desembolsado. Se guardó automáticamente.")
                self._build_cliente_dashboard(cliente) # Actualizar el dashboard
        else:
            messagebox.showwarning("Préstamo Rechazado", f"Su solicitud ha sido rechazada. Razón: {razon}")

        guardar_datos(self.clientes, self.solicitudes)


    # --- LÓGICA DE GESTIÓN DE SOLICITUDES (ADMIN) ---
    def ver_solicitudes(self):
        # Solo admin llega aquí
        win = tk.Toplevel(self)
        win.title("Solicitudes de préstamos")
        win.geometry("900x450")
        frm = tk.Frame(win, padx=10, pady=10)
        frm.pack(fill="both", expand=True)

        cols = ("ID Sol", "Cliente", "Monto", "Tasa", "Plazo", "Estado", "Fecha")
        tree = ttk.Treeview(frm, columns=cols, show="headings", height=15)
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=110, anchor='center')
        tree.pack(fill="both", expand=True, pady=(0,8))
        
        # Configurar tags de color para distinguir estados visualmente
        tree.tag_configure('Aprobada', foreground='green')
        tree.tag_configure('Rechazada', foreground='red')
        tree.tag_configure('Pendiente', foreground='blue')

        # Cargar solicitudes
        for s in self.solicitudes:
            cliente = next((c for c in self.clientes if c.id_cliente == s.id_cliente), None)
            nombre_cliente = cliente.nombre if cliente else "N/A"
            tag = s.estado
            # Usamos el id_solicitud como iid para poder referenciarlo
            tree.insert("", "end", iid=s.id_solicitud, tags=(tag,), values=(s.id_solicitud[:6]+"...", nombre_cliente, f"${s.monto:.2f}", f"{s.tasa_interes}%", s.plazo, s.estado, s.fecha.split(" ")[0]))


        btn_frame = tk.Frame(frm)
        btn_frame.pack(fill="x")

        def ver_detalle():
            sel = tree.selection()
            if not sel: return
            
            # sel[0] ya es el iid (id_solicitud en este caso)
            sid = sel[0] 
            
            s = next((x for x in self.solicitudes if x.id_solicitud==sid), None)
            if not s: return
            cliente = next((c for c in self.clientes if c.id_cliente==s.id_cliente), None)
            info = f"Solicitud: {s.id_solicitud}\nCliente: {cliente.nombre if cliente else s.id_cliente}\nMonto: ${s.monto:.2f}\nTasa: {s.tasa_interes}%\nPlazo: {s.plazo} meses\nCédula: {s.cedula}\nDirección: {s.direccion}\nTeléfono: {s.telefono}\nEstado: {s.estado}\nFecha: {s.fecha}"
            messagebox.showinfo("Detalle Solicitud", info, parent=win)

        def eliminar_solicitud():
            sel = tree.selection()
            if not sel: return
            
            # sel[0] ya es el iid (id_solicitud en este caso)
            sid = sel[0]
            
            s = next((x for x in self.solicitudes if x.id_solicitud==sid), None)
            if not s: return

            if messagebox.askyesno("Confirmar Eliminación", f"¿Desea eliminar la solicitud {s.id_solicitud[:6]}... ({s.estado})?"):
                self.solicitudes.remove(s)
                guardar_datos(self.clientes, self.solicitudes)
                win.destroy()
                self.ver_solicitudes()
                messagebox.showinfo("Éxito", "Solicitud eliminada.")

        ttk.Button(btn_frame, text="Ver Detalle", command=ver_detalle).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="Eliminar Solicitud", command=eliminar_solicitud).pack(side="left", padx=5)


if __name__ == "__main__":
    app = App()
    app.mainloop()