# main_app.py
#Contiene la clase App principal, el login y el punto de entrada del programa.

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from modelos import Cliente
from utilidades import cargar_datos, guardar_datos, ADMIN_USERS, ADMIN_PWDS
from gui_cliente import build_cliente_dashboard
from gui_admin import AdminGUI
import uuid

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sistema de Préstamos - GUI")
        self.geometry("980x640")
        self.configure(bg="#f4f6f8")
        
        # Carga los datos al iniciar la aplicación
        self.clientes = cargar_datos()
        self.usuario_actual = None
        self._build_login()

    # ---------- LOGIN ----------
    def _build_login(self):
        # Destruye todos los widgets anteriores, Crea la interfaz de inicio de sesión.
        for w in self.winfo_children():
            w.destroy()
            
        frm = tk.Frame(self, bg="#f4f6f8", padx=20, pady=20)
        frm.pack(expand=True)
        
        tk.Label(frm, text="Iniciar Sesión", font=("Segoe UI", 18, "bold"), bg="#f4f6f8").grid(row=0, column=0, columnspan=2, pady=(0, 10))
        
        tk.Label(frm, text="Usuario / Correo:", bg="#f4f6f8").grid(row=1, column=0, sticky="e")
        self.ent_user = tk.Entry(frm, width=30)
        self.ent_user.grid(row=1, column=1, pady=5)
        
        tk.Label(frm, text="Contraseña:", bg="#f4f6f8").grid(row=2, column=0, sticky="e")
        self.ent_pwd = tk.Entry(frm, width=30, show="*")
        self.ent_pwd.grid(row=2, column=1, pady=5)
        
        tk.Button(frm, text="Iniciar sesión", command=self.login, width=20, bg="#4a90e2", fg="white").grid(row=3, column=0, columnspan=2, pady=12)
        tk.Button(frm, text="Crear cuenta (cliente)", command=self.crear_cliente_dialog, width=20).grid(row=4, column=0, columnspan=2)

    def crear_cliente_dialog(self):
        #Permite a un nuevo usuario registrarse y crea un nuevo objeto Cliente.
        nombre = simpledialog.askstring("Crear cliente", "Nombre completo:", parent=self)
        if not nombre: return
        
        correo = simpledialog.askstring("Crear cliente", "Correo (debe terminar en @gmail.com):", parent=self)
        if not correo or not correo.endswith("@gmail.com"):
            messagebox.showerror("Error", "Correo inválido. Debe terminar en @gmail.com")
            return
            
        if any(c.correo.lower() == correo.lower() for c in self.clientes):
            messagebox.showerror("Error", "Correo ya registrado")
            return
            
        contraseña = simpledialog.askstring("Crear cliente", "Contraseña (mínimo 8 caracteres):", parent=self, show='*')
        if not contraseña or len(contraseña) < 8:
            messagebox.showerror("Error", "Contraseña inválida. Mínimo 8 caracteres.")
            return
            
        c = Cliente(str(uuid.uuid4()), nombre, correo, contraseña)
        self.clientes.append(c)
        guardar_datos(self.clientes)
        messagebox.showinfo("OK", "Cliente creado correctamente")

    def login(self):
        #Verifica las credenciales (admin o cliente) y dirige la ejecución al dashboard correcto (AdminGUI o build_cliente_dashboard).
        usuario = self.ent_user.get().strip()
        pwd = self.ent_pwd.get().strip()
        
        # 1. Login Admin
        if usuario in ADMIN_USERS:
            idx = ADMIN_USERS.index(usuario)
            if pwd == ADMIN_PWDS[idx]:
                self.usuario_actual = {"tipo": "admin", "usuario": usuario}
                # Usa la clase AdminGUI del módulo gui_admin
                AdminGUI(self) 
                return
            else:
                messagebox.showerror("Error", "Contraseña admin incorrecta")
                return
                
        # 2. Login Cliente
        cliente = next((c for c in self.clientes if c.correo.lower() == usuario.lower() and c.contraseña == pwd), None)
        if cliente:
            self.usuario_actual = {"tipo": "cliente", "cliente": cliente}
            # Usa la función build_cliente_dashboard del módulo gui_cliente
            build_cliente_dashboard(self, cliente) 
            return
            
        messagebox.showerror("Error", "Usuario o contraseña incorrectos")

    # ---------- Logout ----------
    def logout(self):
        #Limpia la sesión y regresa a la pantalla de login.
        self.usuario_actual = None
        self._build_login()
        
# ------------------ Ejecutar app ------------------

if __name__ == "__main__":
    app = App()
    app.mainloop()