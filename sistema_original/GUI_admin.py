# GUI_admin.py
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog
import uuid
from modelos import Cliente, Prestamo, Solicitud # Las clases están disponibles aquí
from utilidades import guardar_datos, ADMIN_USERS, ADMIN_PWDS

# ------------------ Diálogos Reutilizables ------------------

class CrearClienteDialog(simpledialog.Dialog):
    # ... (código se mantiene igual)
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
    # ... (código se mantiene igual)
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

# ------------------ DASHBOARD ADMIN ------------------

def build_admin_dashboard(app_instance):
    """Construye y muestra el dashboard para el administrador."""
    
    for w in app_instance.winfo_children():
        w.destroy()

    top = tk.Frame(app_instance, bg="#fff", pady=10)
    top.pack(fill="x")
    tk.Label(top, text=f"Administrador: {app_instance.usuario_actual['usuario']}", bg="#fff", font=("Segoe UI",12)).pack(side="left", padx=10)
    tk.Button(top, text="Cerrar sesión", command=app_instance.logout).pack(side="right", padx=10)

    pane = tk.PanedWindow(app_instance, sashrelief="raised", bg="#f4f6f8")
    pane.pack(fill="both", expand=True)

    left = tk.Frame(pane, bg="#f4f6f8", padx=10, pady=10)
    pane.add(left, minsize=320)
    tk.Label(left, text="Clientes", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor="w")
    cols = ("ID","Nombre","Correo")
    app_instance.tree_clientes = ttk.Treeview(left, columns=cols, show="headings", height=20)
    for c in cols:
        app_instance.tree_clientes.heading(c, text=c)
        app_instance.tree_clientes.column(c, width=100)
    app_instance.tree_clientes.pack(fill="both", expand=True)
    refrescar_lista_clientes(app_instance)

    btns_left = tk.Frame(left, bg="#f4f6f8")
    btns_left.pack(fill="x", pady=6)
    tk.Button(btns_left, text="Crear préstamo", command=lambda: crear_prestamo_admin(app_instance)).pack(side="left", padx=4)
    tk.Button(btns_left, text="Eliminar cliente", command=lambda: eliminar_cliente_seleccionado(app_instance)).pack(side="left", padx=4)
    tk.Button(btns_left, text="Ver solicitudes", command=lambda: ver_solicitudes(app_instance)).pack(side="left", padx=4)

    right = tk.Frame(pane, bg="#fff", padx=10, pady=10)
    pane.add(right, minsize=620)
    tk.Label(right, text="Detalle / Plan de amortización", bg="#fff", font=("Segoe UI",11,"bold")).pack(anchor="w")
    app_instance.lbl_cliente_sel = tk.Label(right, text="Seleccione un cliente a la izquierda", bg="#fff")
    app_instance.lbl_cliente_sel.pack(anchor="w", pady=(6,0))

    plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota","Saldo del cliente", "Estado")
    app_instance.tree_plan = ttk.Treeview(right, columns=plan_cols, show="headings", height=15)
    for c in plan_cols:
        app_instance.tree_plan.heading(c, text=c)
        width = 95 if c != "Saldo del cliente" else 110
        app_instance.tree_plan.column(c, width=width, anchor='center')
    app_instance.tree_plan.pack(fill="both", expand=True, pady=6)

    admin_actions = tk.Frame(right, bg="#fff")
    admin_actions.pack(fill="x", pady=6)
    tk.Button(admin_actions, text="Pagar cuota (admin)", command=lambda: pagar_cuota_admin(app_instance)).pack(side="left", padx=6)
    tk.Button(admin_actions, text="Eliminar préstamo", command=lambda: eliminar_prestamo_seleccionado(app_instance), bg="#e74c3c", fg="white").pack(side="left", padx=6)
    tk.Button(admin_actions, text="Ver ganancias", command=lambda: mostrar_ganancias(app_instance)).pack(side="left", padx=6)
    tk.Button(admin_actions, text="Ver historial", command=lambda: ver_historial_admin(app_instance)).pack(side="left", padx=6)
    
    app_instance.tree_clientes.bind("<<TreeviewSelect>>", lambda event: on_cliente_selected(app_instance))

def refrescar_lista_clientes(app_instance):
    for i in app_instance.tree_clientes.get_children():
        app_instance.tree_clientes.delete(i)
    for c in app_instance.clientes:
        app_instance.tree_clientes.insert("", "end", iid=c.id_cliente, values=(c.id_cliente, c.nombre, c.correo))

def on_cliente_selected(app_instance, event=None):
    sel = app_instance.tree_clientes.selection()
    if not sel:
        app_instance.lbl_cliente_sel.config(text="Seleccione un cliente a la izquierda")
        for i in app_instance.tree_plan.get_children():
            app_instance.tree_plan.delete(i)
        return
    cid = sel[0]
    cliente = next((c for c in app_instance.clientes if c.id_cliente == cid), None)
    if not cliente: return
    
    if cliente.prestamo:
        app_instance.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo} | Saldo: ${cliente.prestamo.saldo_pendiente:.2f}")
    else:
        app_instance.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo} | SIN PRÉSTAMO")

    for i in app_instance.tree_plan.get_children():
        app_instance.tree_plan.delete(i)

    if cliente.prestamo:
        plan = cliente.prestamo.generar_plan_amortizacion()
        for fila in plan:
            nro, fecha_pago, principal, interes, total, saldo_simulado, estado = fila
            app_instance.tree_plan.insert("", "end", values=(nro, fecha_pago, principal, interes, total, saldo_simulado, estado))

# ------------------ ACCIONES ADMIN ------------------

def crear_prestamo_admin(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel:
        messagebox.showwarning("Atención","Seleccione primero un cliente")
        return
    cid = sel[0]
    cliente = next((c for c in app_instance.clientes if c.id_cliente == cid), None)
    if not cliente: return
    if cliente.prestamo:
        messagebox.showinfo("Info","El cliente ya tiene un préstamo activo")
        return
    dialog = CrearPrestamoDialog(app_instance, title=f"Crear Préstamo para {cliente.nombre}")
    if dialog.result:
        d = dialog.result
        # La clase Prestamo está disponible globalmente en este módulo.
        prest = Prestamo(str(uuid.uuid4()), d['monto'], d['tasa_interes'], d['plazo'], d['cedula'], d['direccion'], d['telefono'])
        cliente.prestamo = prest
        for s in app_instance.solicitudes:
            if s.id_cliente == cliente.id_cliente and s.estado != "Aprobada":
                s.estado = "Aprobada"
        guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)
        messagebox.showinfo("OK", f"Préstamo de ${d['monto']:.2f} creado para {cliente.nombre}.")
        refrescar_lista_clientes(app_instance)
        on_cliente_selected(app_instance)

def eliminar_cliente_seleccionado(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel:
        messagebox.showwarning("Atención","Seleccione un cliente")
        return
    cid = sel[0]
    cliente = next((c for c in app_instance.clientes if c.id_cliente == cid), None)
    if not cliente: return
    if messagebox.askyesno("Confirmar", f"Eliminar cliente {cliente.nombre}? Esto borrará su préstamo si lo tiene."):
        app_instance.clientes.remove(cliente)
        app_instance.solicitudes = [s for s in app_instance.solicitudes if s.id_cliente != cid]
        guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)
        refrescar_lista_clientes(app_instance)
        for i in app_instance.tree_plan.get_children(): app_instance.tree_plan.delete(i)
        messagebox.showinfo("OK","Cliente eliminado")

def eliminar_prestamo_seleccionado(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel: messagebox.showwarning("Atención", "Seleccione un cliente.")
    cid = sel[0]
    cliente = next((c for c in app_instance.clientes if c.id_cliente == cid), None)
    if not cliente or not cliente.prestamo: messagebox.showinfo("Info", f"El cliente {cliente.nombre} no tiene un préstamo activo para eliminar.")
    prestamo_id = cliente.prestamo.id_prestamo[:6] + "..."
    if messagebox.askyesno("Confirmar Eliminación de Préstamo", f"¿Desea ELIMINAR el préstamo {prestamo_id} de {cliente.nombre}?"):
        cliente.prestamo = None
        guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)
        messagebox.showinfo("Éxito", f"Préstamo de {cliente.nombre} eliminado correctamente.")
        on_cliente_selected(app_instance)

def pagar_cuota_admin(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel: messagebox.showwarning("Atención","Seleccione un cliente")
    cliente = next((c for c in app_instance.clientes if c.id_cliente == sel[0]), None)
    if not cliente or not cliente.prestamo: messagebox.showinfo("Info","Cliente no tiene préstamo")
    if cliente.prestamo.saldo_pendiente <= 0: messagebox.showinfo("Info","El préstamo ya ha sido liquidado.")
    
    cuota = cliente.prestamo.pagar_cuota()
    if cuota > 0:
        guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)
        messagebox.showinfo("OK", f"Se pagó cuota por ${cuota:.2f} (APROBADO). Saldo pendiente: ${cliente.prestamo.saldo_pendiente:.2f}")
        on_cliente_selected(app_instance)
    else:
        messagebox.showinfo("Info","Error: No se pudo procesar el pago.")


def mostrar_ganancias(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel: messagebox.showwarning("Atención","Seleccione un cliente")
    cliente = next((c for c in app_instance.clientes if c.id_cliente == sel[0]), None)
    if not cliente or not cliente.prestamo: messagebox.showinfo("Info","Cliente no tiene préstamo")
    ganancias = cliente.prestamo.ganancias
    messagebox.showinfo("Ganancias del préstamo", f"Ganancia acumulada del préstamo: ${ganancias:.2f}")

def ver_historial_admin(app_instance):
    sel = app_instance.tree_clientes.selection()
    if not sel: messagebox.showwarning("Atención","Seleccione un cliente")
    cliente = next((c for c in app_instance.clientes if c.id_cliente == sel[0]), None)
    if not cliente or not cliente.prestamo: messagebox.showinfo("Info","Cliente no tiene préstamo")
    abrir_historial_window(app_instance, cliente.prestamo, titulo=f"Historial: {cliente.nombre}")

def ver_solicitudes(app_instance):
    win = tk.Toplevel(app_instance)
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
    
    tree.tag_configure('Aprobada', foreground='green')
    tree.tag_configure('Rechazada', foreground='red')
    tree.tag_configure('Pendiente', foreground='blue')

    for s in app_instance.solicitudes:
        cliente = next((c for c in app_instance.clientes if c.id_cliente == s.id_cliente), None)
        nombre_cliente = cliente.nombre if cliente else "N/A"
        tag = s.estado
        tree.insert("", "end", iid=s.id_solicitud, tags=(tag,), values=(s.id_solicitud[:6]+"...", nombre_cliente, f"${s.monto:.2f}", f"{s.tasa_interes}%", s.plazo, s.estado, s.fecha.split(" ")[0]))


    btn_frame = tk.Frame(frm)
    btn_frame.pack(fill="x")

    def ver_detalle():
        sel = tree.selection()
        if not sel: return
        sid = sel[0] 
        s = next((x for x in app_instance.solicitudes if x.id_solicitud==sid), None)
        if not s: return
        cliente = next((c for c in app_instance.clientes if c.id_cliente==s.id_cliente), None)
        info = f"Solicitud: {s.id_solicitud}\nCliente: {cliente.nombre if cliente else s.id_cliente}\nMonto: ${s.monto:.2f}\nTasa: {s.tasa_interes}%\nPlazo: {s.plazo} meses\nCédula: {s.cedula}\nDirección: {s.direccion}\nTeléfono: {s.telefono}\nEstado: {s.estado}\nFecha: {s.fecha}"
        messagebox.showinfo("Detalle Solicitud", info, parent=win)

    def eliminar_solicitud():
        sel = tree.selection()
        if not sel: return
        sid = sel[0]
        s = next((x for x in app_instance.solicitudes if x.id_solicitud==sid), None)
        if not s: return

        if messagebox.askyesno("Confirmar Eliminación", f"¿Desea eliminar la solicitud {s.id_solicitud[:6]}... ({s.estado})?"):
            app_instance.solicitudes.remove(s)
            guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)
            win.destroy()
            ver_solicitudes(app_instance)
            messagebox.showinfo("Éxito", "Solicitud eliminada.")

    ttk.Button(btn_frame, text="Ver Detalle", command=ver_detalle).pack(side="left", padx=5)
    ttk.Button(btn_frame, text="Eliminar Solicitud", command=eliminar_solicitud).pack(side="left", padx=5)