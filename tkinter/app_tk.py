import tkinter as tk

raiz = tk.Tk() #Esto es para crear la ventana

raiz.title("Ventana de prueba")
#Es para el nombre de la ventana

raiz.iconbitmap("logopy.ico")
# se utiliza para establecer el ícono que aparecerá en la barra de 
# título de la ventana y en la barra de tareas del sistema operativo.
#Solo se puede ingresar mediante un archivo .ico

#raiz.geometry("680x350")
#esto es mas que todo para cuando corramos el programa, la ventana ya tenga
#su geometria especifica

raiz.config(bg="green")
#esto es para cambiarle el color al bg (background)

raiz.resizable(True, True) #es para controlar si el usuario puede cambiar el tamano de la ventana principal
#raiz.resizable(True, False) siempre se usan los dos

#video 2 - frame, es lo que esta dentro de la ventana

miFrame = tk.Frame() 
#Crea el contenedor en la memoria.
#Esto crea un nuevo widget frame, Frame(), es una clase de tkinter que funciona como contenedor invisible.

miFrame.pack(fill = "both", expand ="True") #Muestra el contenedor en la ventana para que sea visible y pueda empezar a contener otros elementos de tu interfaz.
# x, es horizontal. Y, es vertical. Both, es para amabsdir la ventana
#miFrame.pack(side = "left", "right", "top")
#miFrame.pack(fill = "x", expand = "True") esto es para expan
#miFrame.pack(anchor = "n") esto es mas que todo para en donde este posicionado, usando puntos cardinales

miFrame.config(bg="red")
miFrame.config(width="650", height="350")

miFrame.config(bd=20) #esto es para dar el tamano del grosor
miFrame.config(relief ="groove") #esto es el relieve
#groove, sunken

miFrame.config(cursor="pirate") #esto es para cambiar el cursor del mouse
#pirate, hand2

#Video 3 label, esto es el text

raiz.mainloop() #es un bucle infinito










