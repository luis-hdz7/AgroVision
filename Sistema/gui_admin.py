# gui_admin.py
#Contiene el dashboard y las funcionalidades específicas para el rol de administrador.

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import uuid
from datetime import datetime
from modelos import Prestamo
from utilidades import guardar_datos, sumar_meses

class AdminGUI:
    """Clase que maneja todas las funcionalidades de la interfaz de administrador."""

    def __init__(self, app_instance):
        self.app = app_instance
        self.usuario = app_instance.usuario_actual['usuario']
        self._build_admin_dashboard()
    
    def _build_admin_dashboard(self):
        for w in self.app.winfo_children():
            w.destroy()
            
        # --- Top Bar ---
        top = tk.Frame(self.app, bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top, text=f"Administrador: {self.usuario}", bg="#fff", font=("Segoe UI", 12)).pack(side="left", padx=10)
        tk.Button(top, text="Cerrar sesión", command=self.app.logout).pack(side="right", padx=10)

        # --- Paned Window para dividir la vista ---
        pane = tk.PanedWindow(self.app, sashrelief="raised", bg="#f4f6f8")
        pane.pack(fill="both", expand=True)

        # --- Panel Izquierdo: Lista de Clientes ---
        left = tk.Frame(pane, bg="#f4f6f8", padx=10, pady=10)
        pane.add(left, minsize=320)
        
        tk.Label(left, text="Clientes", bg="#f4f6f8", font=("Segoe UI", 11, "bold")).pack(anchor="w")
        cols = ("ID", "Nombre", "Correo")
        self.tree_clientes = ttk.Treeview(left, columns=cols, show='headings', height=20)
        for c in cols:
            self.tree_clientes.heading(c, text=c)
            self.tree_clientes.column(c, width=100)
        self.tree_clientes.pack(fill="both", expand=True)
        self._refrescar_lista_clientes()
        
        btns_left = tk.Frame(left, bg="#f4f6f8")
        btns_left.pack(fill="x", pady=6)
        tk.Button(btns_left, text="Crear préstamo", command=self.crear_prestamo_admin).pack(side="left", padx=4)
        tk.Button(btns_left, text="Eliminar cliente", command=self.eliminar_cliente_seleccionado).pack(side="left", padx=4)
        tk.Button(btns_left, text="Eliminar préstamo", command=self.eliminar_prestamo_seleccionado).pack(side="left", padx=4)

        # --- Panel Derecho: Detalle Préstamo y Plan ---
        right = tk.Frame(pane, bg="#fff", padx=10, pady=10)
        pane.add(right, minsize=620)
        
        tk.Label(right, text="Detalle / Plan de amortización", bg="#fff", font=("Segoe UI", 11, "bold")).pack(anchor="w")
        self.lbl_cliente_sel = tk.Label(right, text="Seleccione un cliente a la izquierda", bg="#fff")
        self.lbl_cliente_sel.pack(anchor="w", pady=(6, 0))
        
        plan_cols = ("No.", "Fecha de pago", "Cuota principal", "Interés", "Total cuota")
        self.tree_plan = ttk.Treeview(right, columns=plan_cols, show='headings', height=15)
        for c in plan_cols:
            self.tree_plan.heading(c, text=c)
            self.tree_plan.column(c, width=110, anchor='center')
        self.tree_plan.pack(fill="both", expand=True, pady=6)

        # --- Acciones Admin ---
        admin_actions = tk.Frame(right, bg="#fff")
        admin_actions.pack(fill="x", pady=6)
        tk.Button(admin_actions, text="Pagar cuota (admin)", command=self.pagar_cuota_admin).pack(side="left", padx=6)
        tk.Button(admin_actions, text="Ver ganancias", command=self.mostrar_ganancias).pack(side="left", padx=6)

        self.tree_clientes.bind("<<TreeviewSelect>>", self.on_cliente_selected)

    # --- Métodos de Interacción y Gestión ---
    
    def _refrescar_lista_clientes(self):
        for i in self.tree_clientes.get_children():
            self.tree_clientes.delete(i)
        for c in self.app.clientes:
            self.tree_clientes.insert("", "end", iid=c.id_cliente, values=(c.id_cliente, c.nombre, c.correo))

    def on_cliente_selected(self, event=None):
        sel = self.tree_clientes.selection()
        if not sel: return
        cid = sel[0]
        cliente = next((c for c in self.app.clientes if c.id_cliente == cid), None)
        if not cliente: return
        
        self.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo}")
        
        for i in self.tree_plan.get_children():
            self.tree_plan.delete(i)
            
        if cliente.prestamo:
            # Usa la función sumar_meses de utilidades
            plan = cliente.prestamo.generar_plan_amortizacion(sumar_meses) 
            for fila in plan:
                self.tree_plan.insert("", "end", values=fila)

    def crear_prestamo_admin(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione primero un cliente")
            return
            
        cid = sel[0]
        cliente = next((c for c in self.app.clientes if c.id_cliente == cid), None)
        if not cliente: return
        
        if cliente.prestamo:
            messagebox.showinfo("Info", "El cliente ya tiene un préstamo activo")
            return
            
        try:
            monto_s = simpledialog.askstring("Crear préstamo", "Monto:", parent=self.app)
            tasa_s = simpledialog.askstring("Crear préstamo", "Tasa anual (%) (p.ej. 10):", parent=self.app)
            plazo_s = simpledialog.askstring("Crear préstamo", "Plazo en meses (p.ej. 12):", parent=self.app)
            
            if not monto_s or not tasa_s or not plazo_s:
                messagebox.showerror("Error", "Campos obligatorios incompletos")
                return
                
            monto = float(monto_s)
            tasa = float(tasa_s)
            plazo = int(plazo_s)
            
            cedula = simpledialog.askstring("Crear préstamo", "Cédula:", parent=self.app) or ""
            fn = simpledialog.askstring("Crear préstamo", "Fecha de nacimiento (YYYY-MM-DD):", parent=self.app) or ""
            direccion = simpledialog.askstring("Crear préstamo", "Dirección:", parent=self.app) or ""
            telefono = int(simpledialog.askstring("Crear préstamo", "Teléfono:", parent=self.app) or "")
            fecha_desembolso = simpledialog.askstring("Crear préstamo", "Fecha de desembolso (YYYY-MM-DD) o vacío=Hoy:", parent=self.app)
            
            if fecha_desembolso:
                try:
                    datetime.strptime(fecha_desembolso, "%Y-%m-%d")
                except:
                    messagebox.showerror("Error", "Fecha inválida. Use YYYY-MM-DD")
                    return
            else:
                fecha_desembolso = datetime.now().strftime("%Y-%m-%d")
                
            prest = Prestamo(str(uuid.uuid4()), monto, tasa, plazo, cedula, fn, direccion, telefono, fecha_desembolso)
            cliente.prestamo = prest
            guardar_datos(self.app.clientes)
            messagebox.showinfo("OK", "Préstamo creado para el cliente")
            self._refrescar_lista_clientes()
            self.on_cliente_selected()
            
        except Exception as e:
            messagebox.showerror("Error", f"Datos inválidos o conversión fallida: {e}")

    def eliminar_cliente_seleccionado(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione un cliente")
            return
        
        cid = sel[0]
        cliente = next((c for c in self.app.clientes if c.id_cliente == cid), None)
        if not cliente: return
        
        if messagebox.askyesno("Confirmar", f"Eliminar cliente {cliente.nombre}? Esto borrará su préstamo si lo tiene."):
            self.app.clientes.remove(cliente)
            guardar_datos(self.app.clientes)
            self._refrescar_lista_clientes()
            
            for i in self.tree_plan.get_children():
                self.tree_plan.delete(i)
            self.lbl_cliente_sel.config(text="Seleccione un cliente a la izquierda")
            messagebox.showinfo("OK", "Cliente eliminado")

    def eliminar_prestamo_seleccionado(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione un cliente")
            return
            
        cid = sel[0]
        cliente = next((c for c in self.app.clientes if c.id_cliente == cid), None)
        
        if cliente and cliente.prestamo:
            if messagebox.askyesno("Confirmar", f"Eliminar préstamo de {cliente.nombre}?"):
                cliente.prestamo = None
                guardar_datos(self.app.clientes)
                self.on_cliente_selected()
                messagebox.showinfo("OK", "Préstamo eliminado")
        else:
            messagebox.showinfo("Info", "Cliente no tiene préstamo")

    def pagar_cuota_admin(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione un cliente")
            return
            
        cliente = next((c for c in self.app.clientes if c.id_cliente == sel[0]), None)
        
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info", "Cliente no tiene préstamo")
            return
            
        # Pasa la función de utilidad al método del modelo Prestamo
        cuota = cliente.prestamo.pagar_cuota(sumar_meses)
        guardar_datos(self.app.clientes)
        messagebox.showinfo("OK", f"Se pagó cuota por ${cuota:.2f}. Saldo pendiente: ${cliente.prestamo.saldo_pendiente:.2f}")
        self.on_cliente_selected()

    def mostrar_ganancias(self):
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención", "Seleccione un cliente")
            return
            
        cliente = next((c for c in self.app.clientes if c.id_cliente == sel[0]), None)
        
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info", "Cliente no tiene préstamo")
            return
            
        ganancias = cliente.prestamo.ganancias
        messagebox.showinfo("Ganancias del préstamo", f"Ganancia acumulada del préstamo: ${ganancias:.2f}")