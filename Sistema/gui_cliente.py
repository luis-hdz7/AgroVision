# gui_cliente.py
#Contiene el dashboard y las funcionalidades específicas para el rol de cliente.

import tkinter as tk
from tkinter import ttk
from utilidades import sumar_meses

def build_cliente_dashboard(app_instance, cliente):
    """
    Construye la interfaz principal del cliente.
    Recibe la instancia de la clase App principal.
    """
    for w in app_instance.winfo_children():
        w.destroy()
        
    top = tk.Frame(app_instance, bg="#fff", pady=10)
    top.pack(fill="x")
    tk.Label(top, text=f"Cliente: {cliente.nombre}", bg="#fff", font=("Segoe UI", 12)).pack(side="left", padx=10)
    tk.Button(top, text="Cerrar sesión", command=app_instance.logout).pack(side="right", padx=10)
    
    main = tk.Frame(app_instance, bg="#f4f6f8", padx=12, pady=12)
    main.pack(fill="both", expand=True)
    
    # --- Información Personal ---
    tk.Label(main, text="Mi información", bg="#f4f6f8", font=("Segoe UI", 11, "bold")).pack(anchor='w')
    tk.Label(main, text=f"Nombre: {cliente.nombre}\nCorreo: {cliente.correo}", bg="#f4f6f8").pack(anchor='w', pady=(0, 8))
    
    # --- Plan de Amortización ---
    tk.Label(main, text="Plan de amortización", bg="#f4f6f8", font=("Segoe UI", 11, "bold")).pack(anchor='w')
    
    plan_cols = ("No.", "Fecha de pago", "Cuota principal", "Interés", "Total cuota")
    tree = ttk.Treeview(main, columns=plan_cols, show='headings', height=15)
    
    for c in plan_cols:
        tree.heading(c, text=c)
        tree.column(c, width=120, anchor='center')
    tree.pack(fill='both', expand=True)
    
    if cliente.prestamo:
        # Usa la función sumar_meses de utilidades
        for fila in cliente.prestamo.generar_plan_amortizacion(sumar_meses):
            tree.insert("", "end", values=fila)
    else:
        tk.Label(main, text="No posee préstamo activo.", bg="#f4f6f8").pack(pady=10)