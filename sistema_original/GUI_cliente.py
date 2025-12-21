# GUI_cliente.py
import tkinter as tk
from tkinter import ttk, messagebox
import uuid
from modelos import Cliente 
from utilidades import guardar_datos, analizar_solicitud

# Se evita importar de GUI_admin directamente. Se hará localmente.

# ------------------ DASHBOARD CLIENTE ------------------

def build_cliente_dashboard(app_instance, cliente):
    """Construye y muestra el dashboard para un cliente."""
    
    # Importación Local: Solo se importa aquí dentro cuando es necesario
    from GUI_admin import CrearPrestamoDialog, abrir_historial_window 

    for w in app_instance.winfo_children():
        w.destroy()

    top = tk.Frame(app_instance, bg="#fff", pady=10)
    top.pack(fill="x")
    tk.Label(top, text=f"Cliente: {cliente.nombre}", bg="#fff", font=("Segoe UI",12)).pack(side="left", padx=10)
    tk.Button(top, text="Cerrar sesión", command=app_instance.logout).pack(side="right", padx=10)

    main = tk.Frame(app_instance, bg="#f4f6f8", padx=12, pady=12)
    main.pack(fill="both", expand=True)

    tk.Label(main, text="Mi información", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor='w')
    tk.Label(main, text=f"Nombre: {cliente.nombre}\nCorreo: {cliente.correo}\nSueldo: ${cliente.sueldo:.2f}", bg="#f4f6f8").pack(anchor='w', pady=(0,8))

    tk.Label(main, text="Plan de amortización", bg="#f4f6f8", font=("Segoe UI",11,"bold")).pack(anchor='w')
    plan_cols = ("No.","Fecha de pago","Cuota principal","Interés","Total cuota","Saldo del cliente", "Estado") 
    tree = ttk.Treeview(main, columns=plan_cols, show="headings", height=12)
    for c in plan_cols:
        tree.heading(c, text=c)
        width = 110 if c != "Saldo del cliente" else 130
        tree.column(c, width=width, anchor='center')
    tree.pack(fill='both', expand=True)

    actions_frame = tk.Frame(main, bg="#f4f6f8")
    actions_frame.pack(fill="x", pady=8)
    
    tk.Button(actions_frame, text="Solicitar préstamo", command=lambda: solicitar_prestamo(app_instance, cliente)).pack(side="left", padx=6)
    
    if cliente.prestamo:
        tk.Label(main, text=f"Saldo Pendiente: ${cliente.prestamo.saldo_pendiente:.2f}", bg="#f4f6f8", font=("Segoe UI", 10, "bold")).pack(anchor='w', pady=(8,4))
        for fila in cliente.prestamo.generar_plan_amortizacion():
            nro, fecha_pago, principal, interes, total, saldo_simulado, estado = fila
            tree.insert("", "end", values=(nro, fecha_pago, principal, interes, total, saldo_simulado, estado))
        
        tk.Button(main, text="Ver historial de mi préstamo", command=lambda: abrir_historial_window(app_instance, cliente.prestamo, titulo="Mi historial")).pack(pady=8)
    else:
        tk.Label(main, text="No posee préstamo activo.", bg="#f4f6f8").pack(pady=10)


# ------------------ LÓGICA DE SOLICITUD (CLIENTE) CON ANÁLISIS DE RIESGO ------------------

def solicitar_prestamo(app_instance, cliente):
    """Maneja la lógica de solicitud de préstamo por parte del cliente."""
    # Importación Local: Importa el diálogo necesario
    from GUI_admin import CrearPrestamoDialog 
    
    dialog = CrearPrestamoDialog(app_instance, title="Solicitar préstamo")
    if not dialog.result:
        return
    d = dialog.result
    
    monto = d['monto']
    tasa = d['tasa_interes']
    plazo = d['plazo']

    # Importación Local: Importa las clases de modelos necesarias para el procesamiento
    from modelos import Prestamo, Solicitud

    # 1. ANÁLISIS DE RIESGO
    es_viable, razon = analizar_solicitud(cliente, monto, tasa, plazo)
    
    estado_solicitud = "Aprobada" if es_viable else "Rechazada"
    
    # 2. Crear registro de solicitud
    solicitud = Solicitud(str(uuid.uuid4()), cliente.id_cliente, monto, tasa, plazo, d['cedula'], d['direccion'], d['telefono'], estado=estado_solicitud)
    app_instance.solicitudes.append(solicitud) 
    
    # 3. Procesar el resultado
    if es_viable:
        if cliente.prestamo:
            messagebox.showinfo("Info", "Usted ya tiene un préstamo activo. La solicitud se registró (Aprobada) pero no se puede crear un segundo préstamo.")
        else:
            prest = Prestamo(str(uuid.uuid4()), monto, tasa, plazo, d['cedula'], d['direccion'], d['telefono'])
            cliente.prestamo = prest
            messagebox.showinfo("Préstamo Aprobado", "¡Felicidades! Su préstamo fue aprobado y desembolsado. Se guardó automáticamente.")
            build_cliente_dashboard(app_instance, cliente) 
    else:
        messagebox.showwarning("Préstamo Rechazado", f"Su solicitud ha sido rechazada. Razón: {razon}")

    guardar_datos(app_instance.clientes, app_instance.solicitudes, messagebox)