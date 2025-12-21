//1.crea un array que almacene cinco animales.
myArray = ["perro", "gato", "aguila", "loro", "chancho"]
console.log(myArray)

// 2.Agrega dos mas. Uno al principio y otro al final 
myArray.unshift("Bono")
myArray.push("jamon")
console.log(myArray)//debo imprimirlo despues de agregarlo.

// 3. Elimina el que se encuentra en tercera posicion.
myArray.splice(2, 1)//para eliminar, indicamos el indice y lo borramos
console.log(myArray)
// 4. Crea un set que almacene cinco libros.
let mySet = new Set(["libro de ruben dario", "libro2", "libro3", "libro4", "libro5"])

console.log(mySet)
// 5. Agrega dos mas. Uno de ellos repetido.
mySet.add("bono")
mySet.add("tati")
mySet.add("tati")
console.log(mySet)
// 6. Elimina uno concreto a tu eleccion.
mySet.delete("bono")
console.log(mySet)

// 7. Crea un mapa que asocie el numero del mes a su nombre.
let myMap = new Map([
    [1, "enero"],
    [2, "febrero"],
    [3, "marzo"],
    [4, "abril"],
    [5, "mayo"],
    [6, "junio"],
    [7, "julio"],
    [8, "agosto"],
    [9, "septiembre"],
    [10, "octubre"],
    [11, "noviembre"],
    [12, "diciembre"],
])

console.log(myMap)

// 8. Comprueba si el mes numero 5 existe en el map e imprime su valor
console.log(myMap.has(5))

// 9. agrega al mapa una clave con un array como que almacene los meses de verano



// 10. crea un array, transformalo a un set y almacenalo en un map.

















