# main.py
import tkinter as tk
from tkinter import messagebox
import uuid

# Importar las clases y funciones de los módulos
from modelos import Cliente
from utilidades import cargar_datos, guardar_datos, ADMIN_USERS, ADMIN_PWDS
from GUI_admin import build_admin_dashboard, CrearClienteDialog
from GUI_cliente import build_cliente_dashboard # <-- Esta importación ya funciona

class App(tk.Tk):
    """Clase principal de la aplicación GUI."""
    def __init__(self):
        super().__init__()
        self.title("Sistema de Préstamos - GUI")
        self.geometry("980x640")
        self.configure(bg="#f4f6f8")
        self.clientes, self.solicitudes = cargar_datos()
        self.usuario_actual = None
        self._build_login()

    # ---------- LOGIN/REGISTRO/LOGOUT ----------
    def _build_login(self):
        """Construye la pantalla de inicio de sesión."""
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
        """Cierra la sesión y regresa a la pantalla de login."""
        self.usuario_actual = None
        self._build_login()

    def crear_cliente_dialog(self):
        """Abre el diálogo para que un nuevo cliente se registre."""
        dlg = CrearClienteDialog(self, title="Crear cliente")
        if dlg.result:
            nombre, correo, pwd, sueldo = dlg.result
            if any(c.correo.lower()==correo.lower() for c in self.clientes):
                messagebox.showerror("Error","Correo ya registrado")
                return
            c = Cliente(str(uuid.uuid4()), nombre, correo, pwd, sueldo)
            self.clientes.append(c)
            guardar_datos(self.clientes, self.solicitudes, messagebox)
            messagebox.showinfo("OK","Cliente creado correctamente")

    def login(self):
        """Procesa el intento de inicio de sesión."""
        usuario = self.ent_user.get().strip()
        pwd = self.ent_pwd.get().strip()

        # Admin login
        if usuario in ADMIN_USERS:
            try:
                idx = ADMIN_USERS.index(usuario)
                if pwd == ADMIN_PWDS[idx]:
                    self.usuario_actual = {"tipo": "admin", "usuario": usuario}
                    build_admin_dashboard(self) 
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
            build_cliente_dashboard(self, cliente) 
            return

        messagebox.showerror("Error","Usuario o contraseña incorrectos")


if __name__ == "__main__":
    app = App()
    app.mainloop()