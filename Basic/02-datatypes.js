//Datos primitivos, datos en donde se fundamenta la interaccion con el lenguaje, representan un solo valor

//string (cadena de texto)
let name ="Marvin Solis"
let alias= "Didi"
let email = "elhh1985@gmail.com"


//numeros (Number)
let age = 18//entero
let height =1.70 // Decimal


//Boleanos (boolean) son estructura de control que tienen que ver si es correctp (Verdadero o falso)
let isStudent = false
let isTeacher = true


//underfined declaramos la variable, pero no le asignamos un valor asociado.
let underfinedValue 
console.log(underfinedValue)

//Null, en esta variable es nula, no hay valor.
let nullvalue = null

//symbol
let mysymbol = Symbol("mysymbol") //son valores unicos, lo podemos usar como identificadores de propiedades de futuros objetos, nos ayuda a evitar colisiones


//BinInt
let myBigInt = BigInt(11000000000000000000000000000000000000000) //lo utilizamos cuando intenamos representar un numero grande, que no puede ser representado con number

//mostramos los tipos de datos
console.log =(typeof name) //nos ayuda a recuperar datos
console.log = (typeof underfinedValue)
console.log = (typeof isStudent)
console.log = (typeof isTeacher)
console.log = (typeof nullvalue)
console.log = (typeof mysymbol)
