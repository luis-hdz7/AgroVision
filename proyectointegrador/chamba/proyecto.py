import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from datetime import datetime
import uuid
import json
import os

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
        self.monto = float(monto)
        self.tasa_interes = float(tasa_interes)
        self.plazo = int(plazo)
        self.saldo_pendiente = float(monto)
        self.cedula = cedula
        self.fecha_nacimiento = fecha_nacimiento
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
        # cálculo mensual simple: parte principal fija + interés mensual calculado sobre monto original
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        cuota = round(principal_mensual + interes_mensual, 2)

        # si la cuota supera el saldo restante (última cuota), ajustamos
        if cuota >= self.saldo_pendiente:
            cuota = round(self.saldo_pendiente, 2)
            # recalculamos principal en base a la cuota final (interés puede quedarse igual)
            principal_pagado = max(0.0, round(cuota - interes_mensual, 2))
        else:
            principal_pagado = principal_mensual

        # restar del saldo, guardar ganancias e historial
        self.saldo_pendiente = round(max(0.0, self.saldo_pendiente - cuota), 2)
        self.ganancias = round(self.ganancias + interes_mensual, 2)
        self.cuotas_pagadas += 1
        self.registrar_transaccion("Pago de cuota", cuota, f"Pago mensual - principal {principal_pagado:.2f}, interés {interes_mensual:.2f}")
        return cuota

    def generar_plan_amortizacion(self):
        plan = []
        try:
            fecha = datetime.strptime(self.fecha_desembolso, "%Y-%m-%d")
        except:
            fecha = datetime.now()
        principal_mensual = round(self.monto / self.plazo, 2)
        interes_mensual = round(self.monto * (self.tasa_interes / 100) / 12.0, 2)
        for i in range(1, self.plazo + 1):
            fecha_pago = sumar_meses(fecha, i)
            total = round(principal_mensual + interes_mensual, 2)
            if i <= self.cuotas_pagadas:
                estado = "Pagada"
            else:
                # si es la última cuota y el saldo actual es menor, mostrar saldo pendiente aproximado
                estado = f"${total:.2f}"
            plan.append((i, fecha_pago.strftime("%d/%m/%Y"), f"{principal_mensual:.2f}", f"{interes_mensual:.2f}", estado))
        return plan

# ------------------ Utilidades ------------------

def sumar_meses(fecha, meses):
    mes = fecha.month - 1 + meses
    año = fecha.year + mes // 12
    mes = mes % 12 + 1
    dias_por_mes = [31, 29 if año%4==0 and (año%100!=0 or año%400==0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    dia = min(fecha.day, dias_por_mes[mes-1])
    return fecha.replace(year=año, month=mes, day=dia)

# ------------------ Persistencia ------------------

def guardar_datos(clientes):
    datos = [c.to_dict() for c in clientes]
    with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

def cargar_datos():
    if not os.path.exists(ARCHIVO_DATOS):
        return []
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    except:
        return []
    clientes = []
    for d in datos:
        c = Cliente(d.get("id_cliente", str(uuid.uuid4())), d.get("nombre",""), d.get("correo",""), d.get("contraseña",""))
        p = d.get("prestamo")
        if p:
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
            prest.saldo_pendiente = p.get("saldo_pendiente", prest.monto)
            prest.historial = p.get("historial", [])
            prest.ganancias = p.get("ganancias",0.0)
            prest.cuotas_pagadas = p.get("cuotas_pagadas",0)
            c.prestamo = prest
        clientes.append(c)
    return clientes

# ------------------ Configuración Admin ------------------

ADMIN_USERS = ["carlos","marvin","jolman"]
ADMIN_PWDS  = ["83362847","58101169","86847950"]

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
            messagebox.showerror("Error","Contraseña inválida")
            return
        c = Cliente(str(uuid.uuid4()), nombre, correo, contraseña)
        self.clientes.append(c)
        guardar_datos(self.clientes)
        messagebox.showinfo("OK","Cliente creado correctamente")

    def login(self):
        usuario = self.ent_user.get().strip()
        pwd = self.ent_pwd.get().strip()
        # login admin por nombre de usuario (no correo)
        if usuario in ADMIN_USERS:
            idx = ADMIN_USERS.index(usuario)
            if pwd==ADMIN_PWDS[idx]:
                self.usuario_actual={"tipo":"admin","usuario":usuario}
                self._build_admin_dashboard()
                return
            else:
                messagebox.showerror("Error","Contraseña admin incorrecta")
                return
        # login cliente por correo
        cliente = next((c for c in self.clientes if c.correo.lower()==usuario.lower() and c.contraseña==pwd),None)
        if cliente:
            self.usuario_actual={"tipo":"cliente","cliente":cliente}
            self._build_cliente_dashboard(cliente)
            return
        messagebox.showerror("Error","Usuario o contraseña incorrectos")

    # ---------- DASHBOARD ADMIN ----------
    def _build_admin_dashboard(self):
        for w in self.winfo_children():
            w.destroy()
        top = tk.Frame(self,bg="#fff", pady=10)
        top.pack(fill="x")
        tk.Label(top,text=f"Administrador: {self.usuario_actual['usuario']}",bg="#fff",font=("Segoe UI",12)).pack(side="left",padx=10)
        tk.Button(top,text="Cerrar sesión",command=self.logout).pack(side="right",padx=10)

        pane = tk.PanedWindow(self, sashrelief="raised", bg="#f4f6f8")
        pane.pack(fill="both", expand=True)

        # izquierda: lista clientes
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
        btns_left = tk.Frame(left,bg="#f4f6f8")
        btns_left.pack(fill="x", pady=6)
        tk.Button(btns_left,text="Crear préstamo", command=self.crear_prestamo_admin).pack(side="left", padx=4)
        tk.Button(btns_left,text="Eliminar cliente", command=self.eliminar_cliente_seleccionado).pack(side="left", padx=4)
        tk.Button(btns_left,text="Eliminar préstamo", command=self.eliminar_prestamo_seleccionado).pack(side="left", padx=4)

        # derecha: detalle préstamo y plan
        right = tk.Frame(pane, bg="#fff", padx=10, pady=10)
        pane.add(right, minsize=620)
        tk.Label(right,text="Detalle / Plan de amortización", bg="#fff", font=("Segoe UI",11,"bold")).pack(anchor="w")
        self.lbl_cliente_sel = tk.Label(right, text="Seleccione un cliente a la izquierda", bg="#fff")
        self.lbl_cliente_sel.pack(anchor="w", pady=(6,0))
        plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota")
        self.tree_plan = ttk.Treeview(right, columns=plan_cols, show='headings', height=15)
        for c in plan_cols:
            self.tree_plan.heading(c,text=c)
            self.tree_plan.column(c,width=110, anchor='center')
        self.tree_plan.pack(fill="both", expand=True, pady=6)

        # acciones admin
        admin_actions = tk.Frame(right, bg="#fff")
        admin_actions.pack(fill="x", pady=6)
        tk.Button(admin_actions,text="Pagar cuota (admin)",command=self.pagar_cuota_admin).pack(side="left", padx=6)
        tk.Button(admin_actions,text="Ver ganancias",command=self.mostrar_ganancias).pack(side="left", padx=6)

        self.tree_clientes.bind("<<TreeviewSelect>>", self.on_cliente_selected)

    def _refrescar_lista_clientes(self):
        for i in self.tree_clientes.get_children():
            self.tree_clientes.delete(i)
        for c in self.clientes:
            self.tree_clientes.insert("", "end", iid=c.id_cliente, values=(c.id_cliente, c.nombre, c.correo))

    def on_cliente_selected(self, event=None):
        sel = self.tree_clientes.selection()
        if not sel: return
        cid = sel[0]
        cliente = next((c for c in self.clientes if c.id_cliente==cid), None)
        if not cliente: return
        self.lbl_cliente_sel.config(text=f"Cliente: {cliente.nombre} - {cliente.correo}")
        for i in self.tree_plan.get_children():
            self.tree_plan.delete(i)
        if cliente.prestamo:
            plan = cliente.prestamo.generar_plan_amortizacion()
            for fila in plan:
                self.tree_plan.insert("", "end", values=fila)

    def crear_prestamo_admin(self):
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
        try:
            monto_s = simpledialog.askstring("Crear préstamo","Monto:",parent=self)
            tasa_s = simpledialog.askstring("Crear préstamo","Tasa anual (%) (p.ej. 10):",parent=self)
            plazo_s = simpledialog.askstring("Crear préstamo","Plazo en meses (p.ej. 12):",parent=self)
            if not monto_s or not tasa_s or not plazo_s:
                messagebox.showerror("Error","Campos obligatorios incompletos")
                return
            monto = float(monto_s)
            tasa = float(tasa_s)
            plazo = int(plazo_s)
            cedula = simpledialog.askstring("Crear préstamo","Cédula:",parent=self) or ""
            fn = simpledialog.askstring("Crear préstamo","Fecha de nacimiento (YYYY-MM-DD):",parent=self) or ""
            direccion = simpledialog.askstring("Crear préstamo","Dirección:",parent=self) or ""
            telefono = simpledialog.askstring("Crear préstamo","Teléfono:",parent=self) or ""
            fecha_desembolso = simpledialog.askstring("Crear préstamo","Fecha de desembolso (YYYY-MM-DD) o vacío=Hoy:",parent=self)
            if fecha_desembolso:
                try:
                    datetime.strptime(fecha_desembolso,"%Y-%m-%d")
                except:
                    messagebox.showerror("Error","Fecha inválida. Use YYYY-MM-DD")
                    return
            else:
                fecha_desembolso = datetime.now().strftime("%Y-%m-%d")
            prest = Prestamo(str(uuid.uuid4()), monto, tasa, plazo, cedula, fn, direccion, telefono, fecha_desembolso)
            cliente.prestamo = prest
            guardar_datos(self.clientes)
            messagebox.showinfo("OK","Préstamo creado para el cliente")
            self._refrescar_lista_clientes()
            self.on_cliente_selected()
        except Exception as e:
            messagebox.showerror("Error","Datos inválidos o conversión fallida")

    def eliminar_cliente_seleccionado(self):
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
        sel = self.tree_clientes.selection()
        if not sel:
            messagebox.showwarning("Atención","Seleccione un cliente")
            return
        cliente = next((c for c in self.clientes if c.id_cliente==sel[0]), None)
        if not cliente or not cliente.prestamo:
            messagebox.showinfo("Info","Cliente no tiene préstamo")
            return
        cuota = cliente.prestamo.pagar_cuota()
        guardar_datos(self.clientes)
        messagebox.showinfo("OK",f"Se pagó cuota por ${cuota:.2f}. Saldo pendiente: ${cliente.prestamo.saldo_pendiente:.2f}")
        self.on_cliente_selected()

    def mostrar_ganancias(self):
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

    # ---------- DASHBOARD CLIENTE ----------
    def _build_cliente_dashboard(self, cliente):
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
            for fila in cliente.prestamo.generar_plan_amortizacion():
                tree.insert("", "end", values=fila)
        else:
            tk.Label(main,text="No posee préstamo activo.", bg="#f4f6f8").pack()

    def logout(self):
        self.usuario_actual = None
        self._build_login()

# ------------------ Ejecutar app ------------------

def main():
    app = App()
    app.mainloop()
main()