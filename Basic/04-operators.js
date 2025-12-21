/*operadores
son para relacionar datos, operar datos, son para realizar operaciones...
se clasifican en:
*/

//operador aritmetico
let a = 5
let b =10
console.log(a+b)//suma
console.log(a-b) //resta
console.log(a*b)//multiplicacion
console.log(a/b)//division
console.log(a%b)//Modulo, devuelve el residuo de una division
console.log(a**b)//exponente
a++ //incremento
console.log(a)
b-- //decremento
console.log(b)

//operadores de asignacion
let myVariable = 2
console.log(myVariable)
myVariable += 2
console.log(myVariable)
myVariable -= 2
myVariable *= 2
myVariable /= 2
myVariable %= 2
myVariable **= 2

//Operadores de comparacion (son boleanos, algo que es verdadero o falso)
let c = 5
let d = 10
console.log(c > d);
console.log(c < d);
console.log(c >= d);
console.log(c <= d);
console.log(c**d);
console.log(c == 6); //Igualdad por valor
console.log(c == "6");//igualdad por valor
console.log(c == c);
console.log(c === c); //Igualdad por identidad (por tipo y valor)
console.log(c != 6); 
console.log(c !== "6");

//Truthy values (valores verdaderos)
//Todos los numeros positivos y negativos menos el cero.
//Todas las cadenas de texto menos las vacias.
//Todos los boolean verdaderos


//Falsy value (Valores falsos)
//0
//0n (bigInt)
//null
//underfined
//NaN
//EL boleano falso
//Cadenas de texto vacias

//Operadores logicos, sirve para comparar valores, o sea, su valor boleano, en alguna expresion verdadera o falsa, uniendo diferentes comparaciones.

//and (&&)
console.log(5 > 20 && 15 > 20)
console.log(5 < 20 && 15 < 20)
console.log(5 > 20 && 15 < 20)

//or (||)

console.log(5 > 20 || 15 > 20)
console.log(5 < 20 || 15 < 20)
console.log(5 > 20 || 15 < 20)
console.log(5 > 20 && 15 < 20 ||20 <40)

console.log(5 > 20 || 15 < 20)
console.log(!(5 > 20 && 15 < 20))
console.log(!(5 > 20 || 15 < 20))
console.log(!true)
console.log(!false)

//operadores ternarios, permiten escribir una condicion. Es otra forma de escribir condicionales, pero es un operador como tal.
const isRaining = false
isRaining ? console.log("Esta lloviendo") : console.log("No esta lloviendo")




