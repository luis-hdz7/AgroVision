#esto es para texto
import tkinter as tk

raiz = tk.Tk()
raiz.title("CreditSure")
raiz.geometry("1000x800")
miFrame = tk.Frame(raiz)
miFrame.pack(fill="both", expand=True)

miImagen=tk.PhotoImage(file="creditsure.png")
tk.Label(miFrame, image=miImagen).place(x=100, y=200)

raiz.mainloop() #Esto es para llamar

