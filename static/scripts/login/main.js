const cardContent = document.querySelector('.login__card__content')
const buttons = document.querySelectorAll("div.login__card__content button");
const buttonBack = document.querySelector('.login__card__buttons__button--back')
const buttonNext = document.querySelector('.login__card__buttons__button--next')
const alertMsg = document.querySelector('.login__card__alert')
const progressBar = document.querySelector('.progress-bar--active')

let iteration = 0
let choices = []
let currentChoice = null

function clearQuestions(children) {
    children.forEach(child => {
        cardContent.removeChild(child)
    })
}


function resetButtons() {
    // loops through each card
    buttons.forEach(button => {
        // Makes the card and the button go to original look
        currentChoice = null
        // Change this to your own default colour for the card and button
        button.style.backgroundColor = "white";

        // Change button's text colour back to black (default)
        button.style.color = "black";
    });
}

buttons.forEach(button => {
        button.addEventListener("click", e => {
        resetButtons()
        currentChoice = e.target.id
        e.target.style.backgroundColor = "black";
        e.target.style.color = "white";
    });
})

if (iteration < 1) {
    buttonBack.disabled = true
}

buttonNext.addEventListener('click', e => {
    console.log(currentChoice)
    if (currentChoice !== null) {
        alertMsg.classList.add('not-visible')
        choices.push(currentChoice)
        let arr = Array.from(cardContent.children);
        clearQuestions(arr)
        progressBar.classList.remove(`progress--${iteration}`)
        iteration += 1
        progressBar.classList.add(`progress--${iteration}`)
    }
    else {
        alertMsg.classList.remove('not-visible')
        currentChoice = null
    }

})


