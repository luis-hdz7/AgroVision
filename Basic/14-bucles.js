//loops o bucles

//for

for (let i = 6; i < 5; i ++){
    console.log(`hola ${i}`)
}

const numbers = [1, 2, 3, 4, 5]

for (let i = 0; i < numbers.lenght; i ++){
    console.log(`elemento: ${numbers[i]}`)
}

//while
let i = 0

while(i < 5) {
    console.log(`Hola ${i}`)
    i++
}

//bucle infinito
//while(true){

// }

//do while
i = 6
do {
    console.log(`Hola ${i}`)
    i++
}while(i < 5)

//for of nos vale para recorrer valores que sea algo iterable, basicamente esstructura de datos.

myArray = [1, 2, 3, 4]

mySet = new Set("Marvin", "Solis", "didi", 18, true)

myMap = new Map([
    ["name", "Marvin"], //siempre debe llevar esa coma
    ["email", "elhh1985@gmail.com"],
    ["edad", 18],
])

myString = "Hola, Javascript"

for (let valor of myArray){
    console.log(valor)
}

for (let valor of mySet){
    console.log(valor)

}

for (let valor of myMap){
    console.log(valor)
}

for (let valor of myString){
    console.log(valor)
}

//buenas practicas

//break y continue

for (let i = 0; i < 10; i ++){
    if (i == 5){
        continue
    } else if(i == 7){
        break
    }
    console.log(`hola ${i}`)
}
