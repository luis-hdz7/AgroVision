//set
/*es un tipo de objeto incorporado (desde ES6, 2015)
que representa una colección de valores únicos, es decir, no
permite elementos duplicados. Los valores pueden ser de  cualquier tipo (primitivos o referencias a objetos) y se 
mantienen en el orden de inserción*/

//declaracion

let mySet = new Set()

//inicializacion

mySet = new Set("Marvin", "Solis", "didi", 18, true)/*no es la forma
de inicializar un set*/ //Lee cuantas letras hay en la primera palabra


console.log(mySet)

//metodos comunes
//add y delete 
mySet.add("https://moure.dev")
/*Usamos el add para agregar un elemento al set*/


console.log(mySet)

mySet.delete(6)//con esto indicamos que elemento queremos borrar
/*debe de ir siguiendo este comando:
mySet.delete("https://moure.dev")*/

mySet.delete("https://moure.dev")

console.log(mySet)

/*los sets no permiten duplicados, es la diferencia 
que tiene con los arrays.*/


//Convertir un set a un array
let myArray = Array.from(mySet)
console.log(myArray)



