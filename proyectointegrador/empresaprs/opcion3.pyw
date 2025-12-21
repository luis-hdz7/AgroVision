import sqlite3
import tkinter as tk
from tkinter import messagebox

# ------------------------
# BASE DE DATOS
# ------------------------
conn = sqlite3.connect("prestamos.db")
cursor = conn.cursor()

# Tabla de préstamos
cursor.execute("""
CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT,
    monto REAL,
    interes REAL,
    estado TEXT
)
""")

# Tabla de abonos
cursor.execute("""
CREATE TABLE IF NOT EXISTS abonos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prestamo_id INTEGER,
    monto REAL,
    fecha TEXT,
    FOREIGN KEY(prestamo_id) REFERENCES prestamos(id)
)
""")
conn.commit()

# ------------------------
# FUNCIONES
# ------------------------
def registrar_prestamo():
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

    entry_cliente.delete(0, tk.END)
    entry_monto.delete(0, tk.END)
    entry_interes.delete(0, tk.END)
    mostrar_prestamos()

def mostrar_prestamos():
    listbox.delete(0, tk.END)
    cursor.execute("SELECT id, cliente, monto, interes, estado FROM prestamos")
    for p in cursor.fetchall():
        deuda = calcular_saldo(p[0], p[2])
        listbox.insert(tk.END, f"ID {p[0]} | {p[1]} | Deuda: ${deuda} | {p[4]}")

def calcular_saldo(prestamo_id, monto_original):
    cursor.execute("SELECT SUM(monto) FROM abonos WHERE prestamo_id=?", (prestamo_id,))
    total_abonos = cursor.fetchone()[0]
    if total_abonos is None:
        total_abonos = 0
    saldo = monto_original - total_abonos
    return round(saldo, 2)

def abonar():
    seleccionado = listbox.curselection()
    if not seleccionado:
        messagebox.showwarning("Error", "Selecciona un préstamo de la lista")
        return
    
    texto = listbox.get(seleccionado)
    id_prestamo = texto.split()[1]  # extrae el número después de "ID"

    monto_abono = entry_abono.get()
    if not monto_abono:
        messagebox.showwarning("Error", "Ingresa un monto de abono")
        return

    cursor.execute("INSERT INTO abonos (prestamo_id, monto, fecha) VALUES (?, ?, date('now'))",
                   (id_prestamo, float(monto_abono)))
    conn.commit()

    # Verificar si ya quedó pagado
    cursor.execute("SELECT monto FROM prestamos WHERE id=?", (id_prestamo,))
    monto_original = cursor.fetchone()[0]
    saldo = calcular_saldo(id_prestamo, monto_original)

    if saldo <= 0:
        cursor.execute("UPDATE prestamos SET estado='Pagado' WHERE id=?", (id_prestamo,))
        conn.commit()
        messagebox.showinfo("Éxito", f"Préstamo {id_prestamo} ha sido PAGADO totalmente")
    else:
        messagebox.showinfo("Éxito", f"Se abonaron ${monto_abono}. Saldo restante: ${saldo}")

    entry_abono.delete(0, tk.END)
    mostrar_prestamos()

# ------------------------
# INTERFAZ
# ------------------------
root = tk.Tk()
root.title("Sistema de Préstamos con Abonos")

root.resizable(True, True)
# Registro préstamo
tk.Label(root, text="Cliente:").grid(row=0, column=0)
entry_cliente = tk.Entry(root)
entry_cliente.grid(row=0, column=1)


tk.Label(root, text="Monto:").grid(row=1, column=0)
entry_monto = tk.Entry(root)
entry_monto.grid(row=1, column=1)

tk.Label(root, text="Interés:").grid(row=2, column=0)
entry_interes = tk.Entry(root)
entry_interes.grid(row=2, column=1)

btn_registrar = tk.Button(root, text="Registrar préstamo", command=registrar_prestamo)
btn_registrar.grid(row=3, column=0, columnspan=2, pady=5)

# Lista préstamos
listbox = tk.Listbox(root, width=60)
listbox.grid(row=4, column=0, columnspan=2, pady=10)

# Abonos
tk.Label(root, text="Monto a abonar:").grid(row=5, column=0)
entry_abono = tk.Entry(root)
entry_abono.grid(row=5, column=1)

btn_abonar = tk.Button(root, text="Abonar", command=abonar, bg="lightblue")
btn_abonar.grid(row=6, column=0, columnspan=2, pady=5)

mostrar_prestamos()
root.mainloop()
