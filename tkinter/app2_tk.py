import tkinter as tk
#video 3, label

raiz = tk.Tk()

miFrame = tk.Frame(raiz, width = 500, height= 400)
miFrame.pack()

miLabel=tk.Label(miFrame, text="Hola mundo")
miLabel.pack()


raiz.mainloop()