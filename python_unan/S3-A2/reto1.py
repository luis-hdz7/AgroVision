# Fragmento A 
for i in range(5): #faltan los dos puntos
    print(i) 

# Fragmento B 
n = 4
def factorial(n):     
    if n == 0:        
         return 1     
    else: 
        return n * factorial(n - 1) 
print(factorial(5)) #no calcular factorial negativo (porque no esta definido en matematicas basicas) es conocido como RecursionError

# Fragmento C 
a = [10, 20, 30] 
print(a[1]) #no existe un 3, en el array solo tenemos 3 valores, quienes van numerados del 0 al 2




