import tkinter as tk

creditsure = tk.Tk()
creditsure.geometry("400x300")
creditsure.title("CreditSure")
creditsure.iconbitmap("logopy.ico")

creditsure.resizable(True, True)

sing_in = tk.Label(creditsure, text="Bienvenido a CreditSure", fg="black", font=("Arial", 16))
sing_in.pack()

miFrame = tk.Frame()
miFrame.pack(fill = "both", expand ="True")





creditsure.mainloop()

