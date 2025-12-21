//funciones, crear codigo que sea capaz de reciclar, de usarlo de forma limpia.
function myFunc(){
    console.log("Hello my function!")
}

myFunc()


//con parametros
function myFuncWithParams(name){
    console.log(`Hola, ${name}!`)
}
myFuncWithParams("Marvin")
myFuncWithParams("Solis")

//funciones anonimas
const myFunc2 = function(name){
    console.log(`Hola, ${name}`)
}

myFunc2(`Marvin Solis`)

//Arrow functions, es una forma mas concisa de escribir funciones.

const myFunc3 = (name) => {
    console.log(`Hola, ${name}`)
}

myFunc3("Marvin SOlis")

function sun(a, b){
    console.log(a + b)
}
sun(10, 15)

function defaultSun(a = 0, b = 0){
    console.log(a + b)
}

defaultSun(5, 10)

//Retorno de valores

function mult(a, b){
    return a *b
}

let result = mult(5, 10)
console.log(result)

//funciones anidadas
function extern(){
    console.log("Funcion interna")
        function intern(){
            console.log("Funcion interna")
        }
        intern()
}

extern()
//intern()Error: Fuera del scope

//Funciones de orden superior, son funciones que reciben otras
//funciones como argunmento.
function applyFunc(func, param){
    func(param)
}

applyFunc(myFunc, "Funcion de orden superior")

//forEach es una funcion que nos permite ejecutar bucles asociados a elementos iterables.

myArray = [1, 2, 3, 4]

mySet = new Set("Marvin", "Solis", "didi", 18, true)

myMap = new Map([
    ["name", "Marvin"], //siempre debe llevar esa coma
    ["email", "elhh1985@gmail.com"],
    ["edad", 18],
])

myArray.forEach((value) => console.log(value))

myArray.forEach(function (value){
    console.log(value)
})


mySet.forEach((value) => console.log(value))

myMap.forEach((value) => console.log(value))

