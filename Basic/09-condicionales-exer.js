//1.Imprime por consola tu nombre si una variable toma su valor.
let name = "marn"

if(name === "marvin"){
    console.log("Marvin")
} else if(!(name === "marvin")){
    console.log("Usuario no permitido")
}

//2.Imprime por consola un mensaje si el usuario y contrasena concide con uno establecido.
let usuario = "cano"
let contrasena = 1234

if(usuario === "canito" && contrasena === 1234){
    console.log("Bienvenido")
} else if(!(usuario === "canito" && contrasena === 1234)){
    console.log("Bloqueado")
}


//3.Verifica si un numero es positivo, negativo o cero e imprime un mensaje.
let number = 1
/*prompt("Ingresa un número:")
¿Qué hace?
Muestra una ventana al usuario para que escriba algo.

Devuelve:
Siempre un texto (string). Ej: "5", "-8".*/

/*parseFloat(...)
¿Qué hace?
Convierte un texto a un número decimal (float).

Ejemplo:
parseFloat("5") → 5
parseFloat("-8.3") → -8.3

¿Por qué lo usamos?
Porque prompt() devuelve texto, y necesitamos un número
para poder compararlo con > o <.*/

if(number > 0){
    console.log("El numero es positivo")
} else if(number < 0){
    console.log("El numero es negativo")
} else{
    console.log("El numero es cero")
}

//4.Verifica si una persona puede votar o no(mayor o igual a 18) e indica cuantos años le faltan.
let age = 17

if (age == 18 || age > 18){
    console.log("Puede votar")
} else if(age < 18){
    console.log("No puede votar")
}


//5. Usa el operador ternario para asignar el valor "adulto" o "menor" a una variable dependiendo de la edad
const message = age == 18 || age > 18 ? "Es mayor de edad" : "No es mayor de edad"
console.log(message)

//6. muestra en que estacion del año nos encontramos dependiendo del valor de una variable "mes"
let mes = 2

if(mes >= 3 && mes <=5){
    console.log("Es primavera")
} else if(mes >= 6 && mes <= 8){
    console.log("Es verano")
} else if(mes >= 9 && mes <=11){
    console.log("Es otono")
} else if (mes === 12 || mes === 1 || mes === 2){
    console.log("Es invierno")
}



//7. Muestra el numero de dias que tiene un mes dependiendo la variable del ejercicio anterior

if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
    console.log("Este mes tiene 30 dias")
} else if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
    console.log("Este mes tiene 31 dias")
} else if(mes == 2){
    console.log("Este mes es febrero, tiene 28 dias")
}


//switch
//8.Usa un switch para imprimir un mensaje de saludo diferente dependiendo del idioma.
let mensage = 4
let mensaje

switch(mensage){
    case 0:
        mensaje = "Hi"
        break
    case 1:
        mensaje = "Oi"
        break
    case 2:
        mensaje ="hola"
        break
    case 3:
        mensaje = "aloha"
        break
    case 4:
        mensaje = "ola"
        break
    default:
        mensaje = "Ingresa saludo"
}
console.log(mensaje)

//9. usa un switch para hacer de nuevo el ejercicio 6
let month = 3-5
let thismonthis

switch(month){
    case 3-5: 
        thismonthis = "Es primavera"
        break
    case 6-8:
        thismonthis = "Es verano"
        break
    case 9-11:
        thismonthis = "Es fall"
        break
    case 12-1:
        thismonthis = "Es invierno"
        break
}
console.log(thismonthis)
//10. Usa un switch para hacer de nuevo el ejercicio 7
let months = 1
let thesemonthsare 

switch (months){
    case (4) || (6) || (9) || (11):
        thesemonthsare = "Este mes tiene 30 dias"
        break
    case (1) || (3) || (5) || (7) || (8) || (10) || (12):
        thesemonthsare = "Este mes tiene 31 dias"
        break
    case 2:
        thesemonthsare = "Este mes es febrero, tiene 28 dias"
        break
}
console.log(thesemonthsare)


























