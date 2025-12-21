

let personas = ["Marvin", "Valen", "Erika", "Bonono"]

let persona = ["Marvin", "Solis", "Colonia San Isidro", "88776655", 18]
let opersona = {nombre: "Marvin", apellido: "Solis", edad: 18, direccion:"Colonia san isidro"}
let estudiantes = [
    {nombre: "Marvin", apellido: "Solis", carnet: "LE-001", direccion: "Colonia"},
    {nombre: "Cesar", apellido: "Solis", carnet: "LE-002", direccion: "Sutiaba"},
    {nombre: "Jolmar", apellido: "Solis", carnet: "LE-003", direccion: "Alemania"},
]

let carnet = "LE-003";
estudiantes.forEach(function(estudiante){
    if(estudiante.carnet == carnet){
        console.log(estudiante);
    }
})

personas.forEach(function(per){
    console.log(per)
});






// console.log(opersona.nombre)
// console.log(persona[1])

// Object.keys(opersona).forEach(function(clave, valor){
//     console.log(clave + ' ' + valor)
// })