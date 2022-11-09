const cardContent = document.querySelector('.signup__card__content')
const buttons = document.querySelectorAll("div.signup__card__content button");
const buttonBack = document.querySelector('.signup__card__buttons__button--back')
const buttonNext = document.querySelector('.signup__card__buttons__button--next')
const alertMsg = document.querySelector('.signup__card__alert')
const progressBar = document.querySelector('.progress-bar--active')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
const modal = document.querySelector(".modal-signup");

let iteration = 0
let choices = []
let currentChoice = null

const capitalize = (word) => {
    return word.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
}


const sendData = () => {
    // 0 - GOAL WEIGHT
    // 1 - ACTIVITY LEVEL
    // 2 - body parameter (cm)
    // 3 - body parameter (kg)
    //  4 - first name
    // 5 - last name
    // 6 - gender
    // 7 - years old
    // 8 - email address
    // 9 - username
    // 10 - password
    $.ajax({
        type: "POST",
        url: '',
        data: {
            'csrfmiddlewaretoken': csrfToken,
            'goal-weight': choices[0],
            'activity-level': choices[1],
            'body-cm': choices[2],
            'body-kg': choices[3],
            'first-name': capitalize(choices[4]),
            'last-name': capitalize(choices[5]),
            'gender': choices[6],
            'years-old': choices[7],
            'email': choices[8],
            'username': choices[9],
            'password': choices[10],
        },
        success: function (response){
            progressBar.classList.remove(`progress--${iteration}`)
            iteration += 1
            progressBar.classList.add(`progress--${iteration}`)
            modal.classList.remove('not-visible')
            const langPrefix = window.location.href.split('/')[3];
            setInterval(function () {
                window.location = window.location.origin + `/${langPrefix}/login`;
            }, 4000);
            },
        error: function (error) {
            alertMsg.innerHTML = `Something went wrong, try again.`
            alertMsg.classList?.remove('not-visible')
        },
    })
}

function isEmpty(str) {
    return !str.trim().length;
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function clearQuestions(parent, children) {

    children.forEach((child) => {
        parent.removeChild(child)
    })
}

function clearAlerts() {
    alertMsg.innerHTML = ''
    alertMsg.classList.add('not-visible')
}

function getChildren(parent) {
    let arr = Array.from(parent.children);
    arr = arr.filter(function (el) {
        return !el.classList.contains('not-visible')
    })
    return arr
}


function appendContent(parent, iteration) {
    const arr = getChildren(parent)
    clearQuestions(parent,arr)
    let contentToAppend
    if (iteration === 0) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = gettext('"What\'s your weight goal?"')
        contentToAppend = `
          <button id='gain-weight' class="signup__card__button">${gettext('Gain Weight')}</button>
          <button id='maintain-weight' class="signup__card__button">${gettext('Maintain Weight')}</button>
          <button id='lose-weight' class="signup__card__button">${gettext('Lose Weight')}</button>`
    }
    if (iteration === 1) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML =  gettext('What\'s your activity level?')
        contentToAppend = `
         <button id='not-active' class="signup__card__button">${gettext('Not-active')}</button>
          <button id='lightly-active' class="signup__card__button">${gettext('Lightly-active')}</button>
          <button id='active' class="signup__card__button">${gettext('Active')}</button>
          <button id='very-active' class="signup__card__button">${gettext('Very-active')}</button>`
    }

     if (iteration === 2) {
         let currentHeading = document.querySelector('.signup__card__heading')
         currentHeading.innerHTML = gettext("What's your body parameters?")
         contentToAppend = `
         <div class="signup__card__input__container top-margin-md"><input id='tall' class="signup__card__input"/><span class="signup__card__input__span">cm</span></div>
         <div class="signup__card__input__container"><input id='weight' class="signup__card__input"/><span class="signup__card__input__span">kg</span></div>
          `
    }

     if (iteration === 3) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = gettext("What's your personal info?")
        currentHeading.classList.add('signup__card__heading--3')
        contentToAppend = `
             <input id='first-name' class="signup__card__input" placeholder="${gettext('First Name')}"/>
            
             <input id='last-name' class="signup__card__input" placeholder="${gettext('Last Name')}"/>
            <div class="gender-box">
                <div class="gender-box__male gender-box__card gender-box__item-active" data-gender="Male"><h2>${gettext('Male')}</h2></div>
                <div class="gender-box__female gender-box__card" data-gender="Female"><h2>${gettext('Female')}</h2></div>
            </div>
        <div class="year-box">
            <h3>${gettext('How old are you?')}</h3>     
            <div class="slider">
                <input type="range" name="yearsOld" min="10" max="100" value="20" oninput="rangeValue.innerText = this.value">
                 <p id="rangeValue"><b>20</b></p>
            </div>
        </div>    

          `
    }

     if (iteration === 4) {
        let currentHeading = document.querySelector('.signup__card__heading')
        currentHeading.innerHTML = gettext('What\'s your email address and password?')
        currentHeading.classList.toggle('signup__card__heading--3')
        currentHeading.classList.add('signup__card__heading--4')
        contentToAppend = `
            <input id='email' type="email" class="signup__card__input" placeholder="${gettext('Email Address')}" required/>
            <input id='username' type="text" class="signup__card__input" placeholder="${gettext('Username')}" required/>
             <input id='password' type="password" class="signup__card__input" placeholder="${gettext('Password')}" required/>
           
             
          `
    }
    parent.insertAdjacentHTML("afterbegin", contentToAppend)
     if (iteration < 2) {
         addListeners(parent)
    }
    if (iteration === 3 ){
        const male = document.querySelector('.gender-box__male')
        const female = document.querySelector('.gender-box__female')
        male.addEventListener('click', e => {
            if (!male.classList.contains('gender-box__item-active')){
                female.getElementsByTagName('h2')[0].classList.remove('gender-animation-label')
                male.classList.add('gender-box__item-active')
                female.classList.remove('gender-box__item-active')
                male.getElementsByTagName('h2')[0].classList.add('gender-animation-label')
            }
        })
        female.addEventListener('click', e => {
            if (!female.classList.contains('gender-box__item-active')){
                male.getElementsByTagName('h2')[0].classList.remove('gender-animation-label')
                female.classList.add('gender-box__item-active')
                male.classList.remove('gender-box__item-active')
                female.getElementsByTagName('h2')[0].classList.add('gender-animation-label')

            }
        })
    }

}

function resetButtons(buttons) {
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

function addListeners(parent) {
    const arr = Array.from(parent.children)

    arr.forEach(el => {
         el.addEventListener("click", e => {
            resetButtons(arr)
            currentChoice = e.target.id
            e.target.style.backgroundColor = "rgba(8, 245, 53, 0.5)"
            e.target.style.color = "white";
         });
    })
}

addListeners(cardContent)


buttonNext.addEventListener('click', e => {
    const parent = document.querySelector('.signup__card__content')
        if(iteration < 2){
            if (currentChoice !== null) {
            alertMsg.classList?.add('not-visible')
            choices.push(currentChoice)
            currentChoice = null
            progressBar.classList.remove(`progress--${iteration}`)
            iteration += 1
            progressBar.classList.add(`progress--${iteration}`)
            // animation
          if(buttonBack.disabled === true) buttonBack.disabled = false
                    appendContent(parent, iteration)
                    clearAlerts()

            }
            else {
                alertMsg.innerHTML = gettext('You have to choose one option.')
                alertMsg.classList.remove('not-visible')
                currentChoice = null
            }
        }
        else if (iteration === 2) {
            const tall = document.querySelector('#tall').value
            const weight = document.querySelector('#weight').value
            if (tall !== null && weight !== null && !isEmpty(tall) && !isEmpty(weight)){
                 if(tall < 230 && tall > 60 && weight > 30 && weight < 200){
                     choices.push(tall)
                     choices.push(weight)
                     progressBar.classList.remove(`progress--${iteration}`)
                     iteration += 1
                     progressBar.classList.add(`progress--${iteration}`)
                     if(buttonBack.disabled === true) buttonBack.disabled = false
                     appendContent(parent, iteration)
                     clearAlerts()
                 }
                 else {
                     alertMsg.innerHTML = gettext('You have filled inputs incorrectly.')
                     alertMsg.classList?.remove('not-visible')
                 }

            }
            else {
                alertMsg.innerHTML = gettext('You have to fill the inputs.')
                alertMsg.classList?.remove('not-visible')

            }
        }
         else if (iteration === 3) {
            const firstName = document.querySelector('#first-name').value
            const lastName = document.querySelector('#last-name').value
            const yearsOld = document.getElementsByName("yearsOld")[0].value
            const gender = document.querySelector(".gender-box__item-active").dataset.gender
            if (firstName !== null && lastName !== null && (gender === 'Male' || gender ==='Female') && !isEmpty(firstName) && !isEmpty(lastName) && (yearsOld > 5 && yearsOld < 91)) {
                if(firstName.length < 3 || lastName.length < 3)
                {
                    alertMsg.innerHTML = gettext('You have filled incorrect name or last name field.')
                    alertMsg.classList?.remove('not-visible')
                }
                else {
                    choices.push(firstName)
                    choices.push(lastName)
                    choices.push(gender)
                    choices.push(yearsOld)
                    progressBar.classList.remove(`progress--${iteration}`)
                    iteration += 1
                    progressBar.classList.add(`progress--${iteration}`)
                    if(buttonBack.disabled === true) buttonBack.disabled = false
                    appendContent(parent, iteration)
                    clearAlerts()

                }

            }
            else {
                alertMsg.innerHTML = gettext('You have filled inputs incorrectly.')
                alertMsg.classList?.remove('not-visible')
            }
        }

         else if (iteration === 4) {
             clearAlerts()
            const emailAddress = document.querySelector('#email').value
            const password = document.querySelector('#password').value
            const username = document.querySelector('#username').value
            if (emailAddress !== null && password !== null && username !== null && !isEmpty(emailAddress) && !isEmpty(username) && !isEmpty(password) && validateEmail(emailAddress)){
                 if(password.length < 4){
                     alertMsg.innerHTML = gettext('Your password is too short!')
                     alertMsg.classList?.remove('not-visible')
                 }
                 if(password.length > 35){
                     alertMsg.innerHTML = gettext('Your password is too long!')
                     alertMsg.classList?.remove('not-visible')
                 }
                 if (password.length >= 4 && password.length <= 35) {
                     choices.push(emailAddress)
                     choices.push(username)
                     choices.push(password)
                     // ajax call to check if desired username/email address is not taken
                     const langPrefix = window.location.href.split('/')[3];
                     const getUrl = window.location.origin + `/${langPrefix}/data/check-if-taken`
                     $.ajax({
                        type: "GET",
                        url: getUrl,
                        data: {
                            'emailAddress': emailAddress,
                            'username': username,
                        },
                        success: function (response){
                            const status = response.status
                            if (status === 200) {

                                alertMsg.innerHTML = gettext('User with these credentials already exists.')
                                choices = choices.slice(0, 8)
                                alertMsg.classList?.remove('not-visible')
                            }
                            else if (status === 404) {
                                 sendData()
                            }
                        },
                        error: function (error) {
                            alertMsg.innerHTML = gettext('Something went wrong, try again.')
                            alertMsg.classList?.remove('not-visible')
                        },
                    })
                 }
                 else if (password.length < 4) {
                    alertMsg.innerHTML = gettext('Your password is too short!')
                     alertMsg.classList?.remove('not-visible')
                 }
                 else if (password.length > 35) {
                    alertMsg.innerHTML = gettext('Your password is too long!')
                     alertMsg.classList?.remove('not-visible')
                 }
            }

            else {
                alertMsg.innerHTML = gettext('You have filled inputs incorrectly.')
                alertMsg.classList?.remove('not-visible')
            }
        }
})

buttonBack.addEventListener('click', (e) => {
    let parent = document.querySelector('.signup__card__content')
    const children = Array.from(parent.children)
    progressBar.classList.remove(`progress--${iteration}`)
    clearQuestions(parent, children)
    clearAlerts()
    if(iteration === 1) {
        choices = []
        currentChoice = null
    }
    if(iteration === 2) {
        let choicesHandler = []
        choicesHandler.push(choices[0])
        choices = choicesHandler
        currentChoice = null
    }

    if(iteration === 3) {
        let choicesHandler = []
        choicesHandler.push(choices[0], choices[1])
        choices = choicesHandler
    }

    if(iteration === 4) {
        let choicesHandler = []
        choicesHandler.push(choices[0], choices[1], choices[2], choices[3])
        choices = choicesHandler
    }

    if(iteration === 5) {
        choices = choices.slice(0, 9)
    }
    iteration = iteration - 1
    progressBar.classList.add(`progress--${iteration}`)
    parent = document.querySelector('.signup__card__content')
    appendContent(parent, iteration)
    if (iteration < 1) {
        buttonBack.disabled = true
    }
})

if (iteration < 1) {
    buttonBack.disabled = true
}