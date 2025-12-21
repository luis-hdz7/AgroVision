// 1. Crea una variable para cada operacion aritmetica
let a = 100
let b = 20
console.log (a + b)
console.log (a - b)
console.log (a * b)
console.log (a / b)
console.log (a % b)
console.log (a ** b)

//2. Crea una variable para cada tipo de operacion de asignacion, que haga uso
// de las variables utilizadas para las operaciones aritmeticas
myVariable = 10
console.log(myVariable)
myVariable += 2
console.log(myVariable)
myVariable -= 2
console.log(myVariable)
myVariable /= 2
console.log(myVariable)
myVariable *= 2
console.log(myVariable)

//3. imprime 5 comparaciones verdades con diferentes operadores de comparacion
let c = 10
let d = 5
console.log(c > d)
console.log(c == '10')
console.log(c >= d)
console.log(!(false))
console.log(c > '9')

//4. imprime 5 comparaciones falsas con diferentes operadores de comparacion
console.log(d > c)
console.log(!(true))
console.log(d === c)
console.log(d >= c)
console.log(d == '10')

//5. Utiliza el operador logico and
console.log(10 > 5 && 20 > 10)

//6. Utiliza el operador logico or
console.log(15 > 20 || 20 < 5)

//7. Combina ambos operadores logicos.
console.log(20 > 5 && 30 < 50 || 20 == 30)

//8. Agrega una negacion
console.log(!(20 > 5 && 30 < 50 || 20 == 30))

//9. Utiliza el operador ternario
const isDogRunning = false
isDogRunning ? console.log("Dog is running") : console.log("Dog isnt running")

//10.Combina operadores aritmeticos, de comparacion y logicos.
console.log((5 + 10) > 10 || 10 < (5+10))



