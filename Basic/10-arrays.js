//arrays
//nos permite almacenar varios valores en una sola variable

//declaracion
let myArray = []
let myArray2 = new Array()

console.log(myArray)
console.log(myArray2)


//Inicializacion
myArray = [3]//aqui redefinimos
myArray2 = new Array(3)

console.log(myArray)
console.log(myArray2)

myArray = [1, 2, 3, 4]
myArray2 = new Array(1, 2, 3, 4)

console.log(myArray)
console.log(myArray2)

myArray = ["Marvin", "Solis", "didi", 4, true]
myArray2 = new Array("Marvin", "Solis", "didi", 4, true)

console.log(myArray)
console.log(myArray2)

myArray2 = new Array(3)
myArray2[2] = "Marvin"
myArray2[0] = "Solis"
myArray2[1] = "didi"

console.log(myArray2)

myArray = []
myArray[1] = "Marvin"
//myArray[2] = "Solis"
myArray[0] = "didi"

console.log(myArray)

//metodos comunes

myArray = []

//push y pop
/*push(), agrega un elemento al final.
pop(), elimina/quita el ultimo elemento del final.
unshift() agrega un elemento al inicio.
shift()quita el primer elemento del inicio*/

myArray.push("Marvin")
myArray.push("Osvaldo")
myArray.push("didi")
myArray.push(18)

console.log(myArray)

console.log(myArray.pop())//Elimina el ultimo y lo devuelve
myArray.pop
console.log(myArray)

//shift y unshift

console.log(myArray.shift())
console.log(myArray)

myArray.unshift("Marvin", "Solis")
console.log(myArray)

//length, es una propiedad, no una funcion
console.log(myArray.length)

//clear
myArray = []
myArray.length = 0 //esto es una alternativa, pero es mejor hacerlo de manera que este vacio
console.log(myArray)

//slice, devuelve una copia superficial de una porcion
myArray.push("Marvin", "Solis", "didi", 18, true)
let myNewArray = myArray.slice(1, 3)

console.log(myArray)
console.log(myNewArray)

//splice
myArray.splice(1, 2, "Nueva entrada")//elimina los elementos que encuentra

console.log(myArray)




