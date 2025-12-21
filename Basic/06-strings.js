//strings

//concatenacion 
let myname ="Marvin"
let greeting = "Hola," + myname + "!"
console.log(greeting)
console.log(typeof greeting)

//longitud
// 
console.log(greeting.length)//greeting es un texto para asignar diferentes metodos, length sirve para medir el tamano del texto.

//Acceso a caracteres.
console.log(greeting[0])//esto significa que imprime la posicion en la que haya una letra
console.log(greeting[1])
console.log(greeting[11])

//metodos comunes
console.log(greeting.toUpperCase())//transforma la cadena de texto en mayuscula
console.log(greeting.toLowerCase())//transforma la cadena de texto en minuscula
console.log(greeting.indexOf("Hola"))
console.log(greeting.indexOf("Marvin"))//se usa para buscar la posicion(indice) de un caracter o una subcadena dentro de una cadena de texto.
console.log(greeting.includes("Marvin"))//esto permite comprobar si existe el texto
console.log(greeting.includes("Hola"))
console.log(greeting.slice(0, 10)) //sirve para retornar un pedazo, (solo quieres ciertos elementos utilizandolo de essa manera)
console.log(greeting.replace("Marvin", "Osvaldo"))//cambiara el texto por otro que hayas ingresado

//Template literals (plantillas literales)

let message =`Hola, este es un
mensaje en varias
lineas`

console.log(message)

console.log(`Hola, ${myname}!`) //esto se llama interpola

let email = "elhh1985@gmail.com"
console.log(`Hola ${myname}! tu email es ${email}.`)


