import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog
from datetime import datetime
import uuid
import json
import os
import csv

# Nombre del archivo donde se guardarán los datos de forma persistente
ARCHIVO_DATOS = "datos.json"

# ------------------ Modelos ------------------

class Cliente:
    def __init__(self, id_cliente, nombre, correo, contraseña):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        self.prestamo = None

    def to_dict(self):
        return {
            "id_cliente": self.id_cliente,
            "nombre": self.nombre,
            "correo": self.correo,
            "contraseña": self.contraseña,
            "prestamo": self.prestamo.to_dict() if self.prestamo else None
        }

class Prestamo:
    def __init__(self, id_prestamo, monto, tasa_interes, plazo, cedula, fecha_nacimiento, direccion, telefono, fecha_desembolso=None):
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
        # Asegura el formato de fecha para cálculos
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
            "fecha_nacimiento": self.fecha_nacimiento,
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
        # Cálculo simple (interés fijo sobre el monto inicial) para simplificar la lógica
        principal_mensual = round(self.monto / self.plazo, 2)
        # La tasa de interés es anual (Tasa/100) y se divide entre 12 meses
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        cuota = round(principal_mensual + interes_mensual, 2)

        if self.saldo_pendiente <= 0:
            return 0.0 # No se puede pagar si ya está liquidado

        if cuota > self.saldo_pendiente:
            # Si es el pago final, ajusta la cuota al saldo restante
            cuota = self.saldo_pendiente
            principal_mensual = cuota - interes_mensual

        self.saldo_pendiente -= cuota
        self.ganancias += interes_mensual
        self.cuotas_pagadas += 1
        self.registrar_transaccion("Pago de cuota", cuota, f"Cuota #{self.cuotas_pagadas} del préstamo")
        return cuota

    def generar_plan_amortizacion(self):
        plan = []
        try:
            fecha = datetime.strptime(self.fecha_desembolso, "%Y-%m-%d")
        except:
            fecha = datetime.now()
            
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        
        # Simula el saldo inicial para el plan
        saldo_simulado = self.monto
        
        for i in range(1, self.plazo + 1):
            fecha_pago = sumar_meses(fecha, i)
            total = round(principal_mensual + interes_mensual, 2)
            
            # Ajuste de la última cuota si es necesario
            if i == self.plazo:
                principal_mensual = saldo_simulado
                total = round(principal_mensual + interes_mensual, 2)
            
            # Estado para mostrar en la interfaz
            if i <= self.cuotas_pagadas:
                 estado = "Pagada"
            elif i == self.cuotas_pagadas + 1:
                estado = f"${total:.2f} (Próxima)"
            else:
                estado = f"${total:.2f}"

            plan.append((i, fecha_pago.strftime("%d/%m/%Y"), f"${principal_mensual:.2f}", f"${interes_mensual:.2f}", estado))
            
            # Simula la reducción del saldo
            saldo_simulado -= principal_mensual
            if saldo_simulado < 0:
                saldo_simulado = 0

        return plan

# ------------------ Utilidades y Persistencia ------------------

def sumar_meses(fecha, meses):
    """Suma 'meses' a una fecha, ajustando correctamente el día final de mes."""
    mes = fecha.month - 1 + meses
    año = fecha.year + mes // 12
    mes = mes % 12 + 1
    # Lista de días por mes (incluyendo 29 para febrero en bisiestos)
    dias_por_mes = [31, 29 if año % 4 == 0 and (año % 100 != 0 or año % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    dia = min(fecha.day, dias_por_mes[mes - 1])
    return fecha.replace(year=año, month=mes, day=dia)

def guardar_datos(clientes):
    """Guarda la lista de clientes (y sus préstamos) en un archivo JSON."""
    datos = [c.to_dict() for c in clientes]
    try:
        with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2)
    except Exception as e:
         messagebox.showerror("Error de Guardado", f"No se pudieron guardar los datos: {e}")

def cargar_datos():
    """Carga los clientes y sus préstamos desde el archivo JSON."""
    if not os.path.exists(ARCHIVO_DATOS):
        return []
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    except:
        return []
    
    clientes = []
    for d in datos:
        # Recrea el objeto Cliente
        c = Cliente(d.get("id_cliente", str(uuid.uuid4())), d.get("nombre",""), d.get("correo",""), d.get("contraseña",""))
        p = d.get("prestamo")
        if p:
            # Recrea el objeto Prestamo con todos sus atributos guardados
            prest = Prestamo(
                p.get("id_prestamo", str(uuid.uuid4())),
                p.get("monto",0),
                p.get("tasa_interes",0),
                p.get("plazo",12),
                p.get("cedula",""),
                p.get("fecha_nacimiento",""),
                p.get("direccion",""),
                p.get("telefono",""),
                p.get("fecha_desembolso", None)
            )
            # Actualiza los atributos dinámicos
            prest.saldo_pendiente = p.get("saldo_pendiente", prest.monto)
            prest.historial = p.get("historial", [])
            prest.ganancias = p.get("ganancias",0.0)
            prest.cuotas_pagadas = p.get("cuotas_pagadas",0)
            c.prestamo = prest
        clientes.append(c)
    return clientes

# ------------------ Configuración Admin ------------------

ADMIN_USERS = ["carlos","marvin","jolman"]
ADMIN_PWDS = ["83362847","58101169","86847950"]

# ------------------ Funciones de Historial / Export ------------------

def abrir_historial_window(parent, prestamo: Prestamo, titulo="Historial de transacciones"):
    """Crea una ventana Toplevel para mostrar el historial de transacciones."""
    win = tk.Toplevel(parent)
    win.title(titulo)
    win.geometry("700x400")
    frm = tk.Frame(win, padx=10, pady=10)
    frm.pack(fill="both", expand=True)

    cols = ("Fecha", "Tipo", "Monto", "Detalle")
    tree = ttk.Treeview(frm, columns=cols, show="headings", height=15)
    for c in cols:
        tree.heading(c, text=c)
        tree.column(c, width=150, anchor='center')
    tree.pack(fill="both", expand=True, pady=(0,8))

    # cargar historial
    if prestamo and prestamo.historial:
        for item in prestamo.historial:
            tree.insert("", "end", values=(item.get("fecha",""), item.get("tipo",""), f"${item.get('monto',0):.2f}", item.get("detalle","")))
    else:
        tree.insert("", "end", values=("No hay transacciones", "", "", ""))

    btn_frame = tk.Frame(frm)
    btn_frame.pack(fill="x")
    
    def export_csv():
        if not prestamo or not prestamo.historial:
            messagebox.showinfo("Info", "No hay transacciones para exportar.")
            return
        initial = f"historial_{prestamo.id_prestamo}.csv"
        path = filedialog.asksaveasfilename(parent=win, defaultextension=".csv", initialfile=initial, filetypes=[("CSV files",".csv"),("All files",".*")])
        if not path: return
        try:
            with open(path, "w", newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(["fecha","tipo","monto","detalle"])
                for it in prestamo.historial:
                    writer.writerow([it.get("fecha",""), it.get("tipo",""), f"{it.get('monto',0):.2f}", it.get("detalle","")])
            messagebox.showinfo("OK", f"Historial exportado a:\n{path}")
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo exportar: {e}")

    tk.Button(btn_frame, text="Exportar CSV", command=export_csv).pack(side="left", padx=6)
    tk.Button(btn_frame, text="Cerrar", command=win.destroy).pack(side="right", padx=6)

# ------------------ NUEVA VENTANA DE DIÁLOGO ÚNICA ------------------

class CrearPrestamoDialog(simpledialog.Dialog):
    """
    Ventana de diálogo única para ingresar todos los datos del préstamo.
    """
    def __init__(self, parent, title=None):
        self.result = None
        super().__init__(parent, title=title)

    def body(self, master):
        self.parent = master
        
        ttk.Label(master, text="Monto ($):").grid(row=0, column=0, sticky="w", pady=2, padx=5)
        self.ent_monto = ttk.Entry(master)
        self.ent_monto.grid(row=0, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Tasa Anual (%):").grid(row=1, column=0, sticky="w", pady=2, padx=5)
        self.ent_tasa = ttk.Entry(master)
        self.ent_tasa.grid(row=1, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Plazo (meses):").grid(row=2, column=0, sticky="w", pady=2, padx=5)
        self.ent_plazo = ttk.Entry(master)
        self.ent_plazo.grid(row=2, column=1, sticky="ew", pady=2, padx=5)

        ttk.Separator(master, orient="horizontal").grid(row=3, column=0, columnspan=2, sticky="ew", pady=10)

        ttk.Label(master, text="Cédula:").grid(row=4, column=0, sticky="w", pady=2, padx=5)
        self.ent_cedula = ttk.Entry(master)
        self.ent_cedula.grid(row=4, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Fec. Nacimiento (YYYY-MM-DD):").grid(row=5, column=0, sticky="w", pady=2, padx=5)
        self.ent_fn = ttk.Entry(master)
        self.ent_fn.grid(row=5, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Dirección:").grid(row=6, column=0, sticky="w", pady=2, padx=5)
        self.ent_direccion = ttk.Entry(master)
        self.ent_direccion.grid(row=6, column=1, sticky="ew", pady=2, padx=5)

        ttk.Label(master, text="Teléfono:").grid(row=7, column=0, sticky="w", pady=2, padx=5)
        self.ent_telefono = ttk.Entry(master)
        self.ent_telefono.grid(row=7, column=1, sticky="ew", pady=2, padx=5)
        
        ttk.Label(master, text="Fec. Desembolso (YYYY-MM-DD) (Opcional):").grid(row=8, column=0, sticky="w", pady=2, padx=5)
        self.ent_desembolso = ttk.Entry(master)
        self.ent_desembolso.grid(row=8, column=1, sticky="ew", pady=2, padx=5)

        return self.ent_monto # Foco inicial

    def validate(self):
        """Valida que los campos numéricos sean correctos."""
        try:
            monto = float(self.ent_monto.get().strip())
            tasa = float(self.ent_tasa.get().strip())
            plazo = int(self.ent_plazo.get().strip())
            
            # Validación de rangos mínimos
            if monto <= 0 or tasa <= 0 or plazo <= 0:
                messagebox.showerror("Error de Validación", "Monto, Tasa y Plazo deben ser mayores que cero.")
                return 0
                
            # Validación de formato de fecha (si se ingresó)
            f_desembolso_str = self.ent_desembolso.get().strip()
            if f_desembolso_str:
                datetime.strptime(f_desembolso_str, "%Y-%m-%d")

            return 1 # La validación fue exitosa
            
        except ValueError:
            messagebox.showerror("Error de Validación", "Monto, Tasa y Plazo deben ser números válidos.\nFecha de desembolso debe ser YYYY-MM-DD (si se ingresa).")
            return 0
        except Exception as e:
            messagebox.showerror("Error", f"Error inesperado: {e}")
            return 0

    def apply(self):
        """Guarda los resultados validados."""
        self.result = (
            float(self.ent_monto.get().strip()),
            float(self.ent_tasa.get().strip()),
            int(self.ent_plazo.get().strip()),
            self.ent_cedula.get().strip(),
            self.ent_fn.get().strip(),
            self.ent_direccion.get().strip(),
            self.ent_telefono.get().strip(),
            self.ent_desembolso.get().strip() or datetime.now().strftime("%Y-%m-%d")
        )

# ------------------ Interfaz Tkinter ------------------

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sistema de Préstamos - GUI")
        self.geometry("980x640")
        self.configure(bg="#f4f6f8")
        self.clientes = cargar_datos()
        self.usuario_actual = None
        self._build_login()

    # ---------- LOGIN ----------
    def _build_login(self):
        """Crea la interfaz de inicio de sesión."""
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

    def crear_cliente_dialog(self):
        """Muestra diálogo para registrar un nuevo cliente."""
        nombre = simpledialog.askstring("Crear cliente","Nombre completo:",parent=self)
        if not nombre: return
        correo = simpledialog.askstring("Crear cliente","Correo (debe terminar en @gmail.com):",parent=self)
        if not correo or not correo.endswith("@gmail.com"):
            messagebox.showerror("Error","Correo inválido. Debe terminar en @gmail.com")
            return
        if any(c.correo.lower()==correo.lower() for c in self.clientes):
            messagebox.showerror("Error","Correo ya registrado")
            return
        contraseña = simpledialog.askstring("Crear cliente","Contraseña (mínimo 8 caracteres):",parent=self, show='*')
        if not contraseña or len(contraseña)<8:
            messagebox.showerror("Error","Contraseña inválida (mínimo 8 caracteres)")
            return
        c = Cliente(str(uuid.uuid4()), nombre, correo, contraseña)
        self.clientes.append(c)
        guardar_datos(self.clientes)
        messagebox.showinfo("OK","Cliente creado correctamente")

    def login(self):
        """Valida las credenciales e inicia la sesión (Admin o Cliente)."""
        usuario = self.ent_user.get().strip()
        pwd = self.ent_pwd.get().strip()
        
        # Lógica de login para administrador
        if usuario in ADMIN_USERS:
            try:
                idx = ADMIN_USERS.index(usuario)
                if pwd==ADMIN_PWDS[idx]:
                    self.usuario_actual={"tipo":"admin","usuario":usuario}
                    self._build_admin_dashboard()
                    return
                else:
                    messagebox.showerror("Error","Contraseña admin incorrecta")
                    return
            except ValueError:
                pass 
                
        # Lógica de login para cliente
        cliente = next((c for c in self.clientes if c.correo.lower()==usuario.lower() and c.contraseña==pwd),None)
        if cliente:
            self.usuario_actual={"tipo":"cliente","cliente":cliente}
            self._build_cliente_dashboard(cliente)
            return
            
        messagebox.showerror("Error","Usuario o contraseña incorrectos")

    # ---------- DASHBOARD ADMIN ----------
    def _build_admin_dashboard(self):
        """Construye la interfaz principal del administrador."""
        for w in self.winfo_children():
            w.destroy()
        
        # Barra superior con nombre y botón de logout
        top = tk.Frame(self,bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top,text=f"Administrador: {self.usuario_actual['usuario']}",bg="#fff",font=("Segoe UI",12)).pack(side="left",padx=10)
        tk.Button(top,text="Cerrar sesión",command=self.logout).pack(side="right",padx=10)

        # PanedWindow para dividir la vista
        pane = tk.PanedWindow(self, sashrelief="raised", bg="#f4f6f8")
        pane.pack(fill="both", expand=True)

        # Marco Izquierdo: Lista de clientes
        left = tk.Frame(pane, bg="#f4f6f8", padx=10, pady=10)
        pane.add(left, minsize=320)
        tk.Label(left,text="Clientes", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor="w")
        cols = ("ID","Nombre","Correo")
        self.tree_clientes = ttk.Treeview(left, columns=cols, show='headings', height=20)
        for c in cols:
            self.tree_clientes.heading(c,text=c)
            self.tree_clientes.column(c,width=100)
        self.tree_clientes.pack(fill="both", expand=True)
        self._refrescar_lista_clientes()
        
        # Botones de acciones de clientes
        btns_left = tk.Frame(left,bg="#f4f6f8")
        btns_left.pack(fill="x", pady=6)
        tk.Button(btns_left,text="Crear préstamo", command=self.crear_prestamo_admin).pack(side="left", padx=4)
        tk.Button(btns_left,text="Eliminar cliente", command=self.eliminar_cliente_seleccionado).pack(side="left", padx=4)
        tk.Button(btns_left,text="Eliminar préstamo", command=self.eliminar_prestamo_seleccionado).pack(side="left", padx=4)

        # Marco Derecho: Detalle de préstamo y plan
        right = tk.Frame(pane, bg="#fff", padx=10, pady=10)
        pane.add(right, minsize=620)
        tk.Label(right,text="Detalle / Plan de amortización", bg="#fff", font=("Segoe UI",11,"bold")).pack(anchor="w")
        self.lbl_cliente_sel = tk.Label(right, text="Seleccione un cliente a la izquierda", bg="#fff")
        self.lbl_cliente_sel.pack(anchor="w", pady=(6,0))
        
        # Treeview para el Plan de Amortización
        plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota")
        self.tree_plan = ttk.Treeview(right, columns=plan_cols, show='headings', height=15)
        for c in plan_cols:
            self.tree_plan.heading(c,text=c)
            self.tree_plan.column(c,width=110, anchor='center')
        self.tree_plan.pack(fill="both", expand=True, pady=6)

        # Botones de acciones de préstamos
        admin_actions = tk.Frame(right, bg="#fff")
        admin_actions.pack(fill="x", pady=6)
        tk.Button(admin_actions,text="Pagar cuota (admin)",command=self.pagar_cuota_admin).pack(side="left", padx=6)
        tk.Button(admin_actions,text="Ver ganancias",command=self.mostrar_ganancias).pack(side="left", padx=6)
        tk.Button(admin_actions,text="Ver historial",command=self.ver_historial_admin).pack(side="left", padx=6)

        # Evento de selección de cliente
        self.tree_clientes.bind("<<TreeviewSelect>>", self.on_cliente_selected)

    def _refrescar_lista_clientes(self):
        """Actualiza la lista de clientes en el Treeview del admin."""
        for i in self.tree_clientes.get_children():
            self.tree_clientes.delete(i)
        for c in self.clientes:
            self.tree_clientes.insert("", "end", iid=c.id_cliente, values=(c.id_cliente, c.nombre, c.correo))

    def on_cliente_selected(self, event=None):
        """Maneja el evento de seleccionar un cliente para mostrar su detalle."""
        sel = self.tree_clientes.selection()
        if not sel: 
            self.lbl_cliente_sel.config(text="Seleccione un cliente a la izquierda")
            for i in self.tree_plan.get_children(): self.tree_plan.delete(i)
            return
            
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente==cid), None)
        if not cliente: return
        
        self.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo} | Saldo: ${cliente.prestamo.saldo_pendiente:.2f}" if cliente.prestamo else f"Cliente: {cliente.nombre} - {cliente.correo} | SIN PRÉSTAMO")
        
        for i in self.tree_plan.get_children():
            self.tree_plan.delete(i)
            
        if cliente.prestamo:
            plan = cliente.prestamo.generar_plan_amortizacion()
            for fila in plan:
                self.tree_plan.insert("", "end", values=fila)

    def crear_prestamo_admin(self):
        """Abre la nueva ventana de diálogo única para crear el préstamo."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione primero un cliente")
            return
            
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente==cid), None)
        if not cliente: return
        if cliente.prestamo:
            messagebox.showinfo("Info","El cliente ya tiene un préstamo activo")
            return
            
        # 1. Abre el nuevo diálogo (el único widget)
        dialog = CrearPrestamoDialog(self, title=f"Crear Préstamo para {cliente.nombre}")
        
        # 2. Si el diálogo fue aceptado (OK) y tenemos resultados
        if dialog.result:
            monto, tasa, plazo, cedula, fn, direccion, telefono, fecha_desembolso = dialog.result

            try:
                # 3. Creación y asignación del objeto Prestamo
                prest = Prestamo(str(uuid.uuid4()), monto, tasa, plazo, cedula, fn, direccion, telefono, fecha_desembolso)
                cliente.prestamo = prest
                
                # 4. Guardar datos y actualizar UI
                guardar_datos(self.clientes)
                messagebox.showinfo("OK", f"Préstamo de ${monto:.2f} creado para {cliente.nombre}.")
                self._refrescar_lista_clientes()
                self.on_cliente_selected()
                
            except Exception as e:
                messagebox.showerror("Error", f"Error al finalizar la creación: {e}")

    def eliminar_cliente_seleccionado(self):
        """Elimina el cliente seleccionado de la lista."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
            
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente==cid), None)
        if not cliente: return
        
        if messagebox.askyesno("Confirmar",f"Eliminar cliente {cliente.nombre}? Esto borrará su préstamo si lo tiene."):
            self.clientes.remove(cliente)
            guardar_datos(self.clientes)
            self._refrescar_lista_clientes()
            for i in self.tree_plan.get_children():
                self.tree_plan.delete(i)
            messagebox.showinfo("OK","Cliente eliminado")

    def eliminar_prestamo_seleccionado(self):
        """Elimina el préstamo asociado al cliente seleccionado."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
            
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente==cid), None)
        
        if cliente and cliente.prestamo:
            if messagebox.askyesno("Confirmar",f"Eliminar préstamo de {cliente.nombre}?"):
                cliente.prestamo = None
                guardar_datos(self.clientes)
                self.on_cliente_selected()
                messagebox.showinfo("OK","Préstamo eliminado")
        else:
            messagebox.showinfo("Info","Cliente no tiene préstamo")

    def pagar_cuota_admin(self):
        """Ejecuta el pago de una cuota para el cliente seleccionado."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
            
        cliente = next((c for c in self.clientes if c.id_cliente==sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
            
        cuota = cliente.prestamo.pagar_cuota()
        if cuota > 0:
            guardar_datos(self.clientes)
            messagebox.showinfo("OK",f"Se pagó cuota por ${cuota:.2f}. Saldo pendiente: ${cliente.prestamo.saldo_pendiente:.2f}")
            self.on_cliente_selected() # Refresca la vista
        else:
            messagebox.showinfo("Info","El préstamo ya ha sido liquidado.")

    def mostrar_ganancias(self):
        """Muestra las ganancias acumuladas del préstamo del cliente seleccionado."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
            
        cliente = next((c for c in self.clientes if c.id_cliente==sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
            
        ganancias = cliente.prestamo.ganancias
        messagebox.showinfo("Ganancias del préstamo",f"Ganancia acumulada del préstamo: ${ganancias:.2f}")

    def ver_historial_admin(self):
        """Abre la ventana de historial de transacciones para el cliente seleccionado."""
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
            
        cliente = next((c for c in self.clientes if c.id_cliente==sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
            
        abrir_historial_window(self, cliente.prestamo, titulo=f"Historial: {cliente.nombre}")

    # ---------- DASHBOARD CLIENTE ----------
    def _build_cliente_dashboard(self, cliente):
        """Construye la interfaz principal del cliente."""
        for w in self.winfo_children():
            w.destroy()
            
        top = tk.Frame(self,bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top,text=f"Cliente: {cliente.nombre}",bg="#fff",font=("Segoe UI",12)).pack(side="left",padx=10)
        tk.Button(top,text="Cerrar sesión",command=self.logout).pack(side="right",padx=10)
        
        main = tk.Frame(self,bg="#f4f6f8", padx=12, pady=12)
        main.pack(fill="both", expand=True)
        
        tk.Label(main,text="Mi información",bg="#f4f6f8",font=("Segoe UI",11,"bold")).pack(anchor='w')
        tk.Label(main,text=f"Nombre: {cliente.nombre}\nCorreo: {cliente.correo}",bg="#f4f6f8").pack(anchor='w', pady=(0,8))
        
        tk.Label(main,text="Plan de amortización",bg="#f4f6f8",font=("Segoe UI",11,"bold")).pack(anchor='w')
        plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota")
        tree = ttk.Treeview(main, columns=plan_cols, show='headings', height=15)
        for c in plan_cols:
            tree.heading(c,text=c)
            tree.column(c,width=120,anchor='center')
        tree.pack(fill='both',expand=True)
        
        if cliente.prestamo:
            # Muestra el saldo pendiente del cliente
            tk.Label(main, text=f"Saldo Pendiente: ${cliente.prestamo.saldo_pendiente:.2f}", bg="#f4f6f8", font=("Segoe UI", 10, "bold")).pack(anchor='w', pady=(8,4))
            
            for fila in cliente.prestamo.generar_plan_amortizacion():
                tree.insert("", "end", values=fila)
            tk.Button(main, text="Ver historial de mi préstamo", command=lambda: abrir_historial_window(self, cliente.prestamo, titulo="Mi historial")).pack(pady=8)
        else:
            tk.Label(main,text="No posee préstamo activo.", bg="#f4f6f8").pack(pady=10)

    def logout(self):
        """Cierra la sesión actual y regresa a la pantalla de login."""
        self.usuario_actual = None
        self._build_login()

# ------------------ Ejecutar app ------------------

if __name__ == '__main__':
    # El punto de entrada de la aplicación
    app = App()
    app.mainloop()