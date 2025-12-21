import sqlite3
import tkinter as tk
from tkinter import messagebox

# Crear DB
conn = sqlite3.connect("prestamos.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT,
    monto REAL,
    interes REAL,
    estado TEXT
)
""")
conn.commit()

# Función para guardar
def registrar():
    cliente = entry_cliente.get()
    monto = entry_monto.get()
    interes = entry_interes.get()

    if not cliente or not monto or not interes:
        messagebox.showwarning("Error", "Completa todos los campos")
        return

    cursor.execute("INSERT INTO prestamos (cliente, monto, interes, estado) VALUES (?, ?, ?, ?)",
                   (cliente, float(monto), float(interes), "Pendiente"))
    conn.commit()
    messagebox.showinfo("Éxito", "Préstamo registrado")

# GUI
root = tk.Tk()
root.title("Sistema de Préstamos")

tk.Label(root, text="Cliente:").grid(row=0, column=0)
entry_cliente = tk.Entry(root)
entry_cliente.grid(row=0, column=1)

tk.Label(root, text="Monto:").grid(row=1, column=0)
entry_monto = tk.Entry(root)
entry_monto.grid(row=1, column=1)

tk.Label(root, text="Interés:").grid(row=2, column=0)
entry_interes = tk.Entry(root)
entry_interes.grid(row=2, column=1)

btn_registrar = tk.Button(root, text="Registrar", command=registrar)
btn_registrar.grid(row=3, column=0, columnspan=2)

root.mainloop()
