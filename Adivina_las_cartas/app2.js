const totalCards = 12;
let cards = []
let selectordCards = []
let valuesUsed = []
let currentMove = 0
let selectedCards = []

let cardTemplate = `<div class="card"><div class="back"></div><div class="face"></div></div>`

function activate(e){
    if (currentMove < 2){
        e.target.classList.add('activate');

        if (!selectedCards[0] || selectedCards[0] !== e.target){
            selectedCards.push(e.target);

            console.log(currentMove)

            if(++currentMove == 2){
                if (selectedCards[0].querySelectorAll('.face')[0].innerHTML ==selectedCards[1].querySelectorAll('.face')[0].innerHTML){
                    console.log("aqui 1")
                    selectedCards = [];
                    currentMove = 0;
                }
                else{
                    console.log("aqui 2")
                    setTimeout(()=>{
                        selectedCards[0].classList.remove('activate');
                        selectedCards[1].classList.remove('activate');
                        selectedCards = [];
                        currentMove = 0;
                    }, 600)
                }
            }
        }
    }
}

function randomValue(){
    let rnd = Math.floor(Math.random() * totalCards * 0.5);
    // console.log(rnd)
    let values = valuesUsed.filter(value => value === rnd);
    // console.log(values)
    // console.log(valuesUsed)
    if(values.length < 2){
        // console.log(rnd + " esta " + values.length + " en los valores usados, por eso lo voy a meter")
        valuesUsed.push(rnd);
    }
    else{
        // console.log(rnd + " esta " + values.length + " en los valores usados, por eso no lo voy a meter")
        randomValue();
    }
}

for (let i=0; i < totalCards; i++){
    let div = document.createElement('div');
    div.innerHTML = cardTemplate
    cards.push(div);
    document.querySelector('#game').append(cards[i]);
    randomValue();

    cards[i].querySelectorAll('.face')[0].innerHTML = valuesUsed[i];
    cards[i].querySelectorAll('.card')[0].addEventListener('click', activate);
}




