// if, else if, else


//if(si)
//if
let age = 19
if (age ==18){
    console.log("La edad es 18")
}   else if(age < 18){
    console.log("Es menor de edad")
} else{
        console.log("La edad no es 18 ni es menor de edad")
} 

//Operador ternario
//Es una forma rapida de acabar escribiendo un if y un else
//es una forma mas compacta de escribir un condicional simple.

const message= age == 18 ? "La edad es 18" : "La edad no es 18"
console.log(message)

//switch
//Es una alternativa a anidar if/else
//Es util cuando tenemos muchas condiciones que verificar con una misma variable
let day = 4
let dayName
//case es una palabra reservada
switch (day){
    case 0: //aqui va la condicion
        dayName = "Lunes"
        break//lo utilizamos para finalizar un case
    case 1: 
        dayName = "Martes"
        break
    case 2: 
        dayName = "Miercoles"
        break
    case 3: 
        dayName = "Jueves"
        break
    case 4: 
        dayName = "Viernes"
        break
    case 5: 
        dayName = "Sabado"
        break
    case 6: 
        dayName = "Domingo"
        break
    default:
        dayName = "Numerdo de dia incorrecto"
}
console.log(dayName)









