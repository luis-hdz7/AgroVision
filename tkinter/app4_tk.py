#entry
import tkinter as tk

raiz = tk.Tk()

miFrame = tk.Frame(raiz, width=800, height=400)
miFrame.pack()

#cuadroNombre = tk.Entry(miFrame)
#el grid trabaja en filas cuadroNombre.grid(row=0, column=1)
cuadroNombre = tk.Entry(miFrame)
cuadroNombre.grid(row=0, column = 1)
cuadroApellido = tk.Entry(miFrame)
cuadroApellido.grid(row=1, column = 1)
cuadroDireccion = tk.Entry(miFrame)
cuadroDireccion.grid(row=2, column = 1)

nombreLabel=tk.Label(miFrame, text="Nombre: ")
nombreLabel.grid(row=0, column=0)
apellidoLabel=tk.Label(miFrame, text="Apellido: ")
apellidoLabel.grid(row=1, column=0)
direccionLabel=tk.Label(miFrame, text="Direccion: ")
direccionLabel.grid(row=2, column=0)

raiz.mainloop()









