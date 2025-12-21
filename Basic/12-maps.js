/*map, (estructura)nos sirve para almacenar en ellas un conjuto de datos
un map o diccionario, es una coleccion de elementos, y que cada elemento ya no es 
unico, aqui cada elemetno esta formado por un par, ejemplo
una esta compuesto de una llave (un Key) y el otro por un valor
a diferencia de las otras vamos a tener cualquier tipo de dato, para relacionar 
los dos datos, y veremos un valor que esta asociado a esa clave */

//declaracion
let myMap = new Map()

console.log(myMap)

//inicializacion
myMap = new Map([
    ["name", "Marvin"], //siempre debe llevar esa coma
    ["email", "elhh1985@gmail.com"],
    ["edad", 18],
])

console.log(myMap);

//metodos y propiedades


//set, vale para actualizar un elemento o para agregarlo
//esto tambien sirve para meter una claveS
myMap.set("alias", "didi"),
myMap.set("name", "Marvin Osvaldo");

//get, para obtener el valor
console.log(myMap.get("name"));
console.log(myMap.get("alias"));

//has, para asegurar si existe.
console.log(myMap.has("edad")),
console.log(myMap.has("surname")),

//delete
myMap.delete("email"),
console.log(myMap),

//keys ,value
console.log(myMap.values())
console.log(myMap.keys())

//clear
//myMap.clear()






