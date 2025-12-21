//concatena dos cadenas de texto
let myname = "Marvin"
let greeting = "Hola, "+myname + "!"
console.log(greeting)

//2. muestra la longitud de una cadena de texto.
console.log(greeting.length)

//3. muestra el primer y ultimo caracter de un string
console.log(greeting[0])
console.log(greeting[12])

//4.Convierte en mayuscula y en minuscula un string
console.log(greeting.toUpperCase())
console.log(greeting.toLowerCase())

//5.crea una cadena de texto en varias lineas.
let message = `esto
es un
mensaje
en
5 lineas.`
console.log(message)
//6. Interpola el valor de una variable en un string.
console.log (`hola,  ${myname}! Bienvenido.`)

//7. Reemplaza todos los espacios en blanco de un string por guiones
console.log(greeting.replace(" ", "-"))

//8. comprueba si una cadena de texto contiene una palabra concreta
console.log(greeting.includes("hola"))

//9.Comprueba si dos strings son iguales
let string1 = "hola"
let string2 = "hola"

console.log(string1 === string2)

//10. Comprueba si dos strings tienen la misma longitud
console.log(string1.length === string2.length)












