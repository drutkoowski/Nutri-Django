const alertMsg = document.querySelector('.login__card__alert')
const loginButton = document.querySelector('#login-button')
const infoBox = document.querySelector('.input-validity-info')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

// fix bg - video stretch and nav adjustments
const navBarEl = document.querySelector('.navbar')
navBarEl.style.marginTop = '0'
navBarEl.style.paddingTop = '3rem'
///
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function isEmpty(str) {
    return !str.trim().length;
}

const emailAddressInput = document.querySelector('#email')
emailAddressInput.addEventListener('input', e => {
    if(!alertMsg.classList.contains('not-visible')) {
        alertMsg.classList.add('not-visible')
    }
    const val = emailAddressInput.value
    if (!validateEmail(val) && !isEmpty(val)){
        emailAddressInput.classList.add('input-invalid')
        infoBox.style.opacity = '1'
        infoBox.querySelector('.info-input1').innerHTML = gettext('Email input is not valid email.')
    }
    else {
        emailAddressInput.classList.remove('input-invalid')
        if(passwordInput.value.length < 3 && !isEmpty(passwordInput.value)){
            infoBox.style.opacity = '0'
        }
        infoBox.querySelector('.info-input1').innerHTML = ''
    }
})

const passwordInput = document.querySelector('#password')
passwordInput.addEventListener('input', () => {
    if(!alertMsg.classList.contains('not-visible')) {
        alertMsg.classList.add('not-visible')
    }
    const val = passwordInput.value
    if (val.length < 3 && !isEmpty(val)){
        passwordInput.classList.add('input-invalid')
        infoBox.style.opacity = '1'
        infoBox.querySelector('.info-input2').innerHTML = gettext('Password too short.')
    }
    else {
        passwordInput.classList.remove('input-invalid')
        if(validateEmail(emailAddressInput.value) && !isEmpty(emailAddressInput.value)){
            infoBox.style.opacity = '0'
        }
        infoBox.querySelector('.info-input2').innerHTML = ''
    }
})


const logIn = (password, emailAddress) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/login-user`
    const nextUrl = window.location.origin + `/${langPrefix}/dashboard`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'csrfmiddlewaretoken': csrfToken,
            'password': password,
            'emailAddress': emailAddress,
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                window.location = nextUrl;
            }
            else if (status === 404) {
                alertMsg.innerHTML = gettext('We could not match any user with these credentials.')
                alertMsg.classList?.remove('not-visible')
            }

            },
        error: function (error) {
            alertMsg.innerHTML = gettext('Error occurred.. try again.')
            alertMsg.classList?.remove('not-visible')
        },
    })
}

loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    alertMsg.classList.add('not-visible')
    infoBox.style.opacity = '0'
    const emailAddress = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    if (validateEmail(emailAddress) && !isEmpty(password) && password.length > 3) {
        // ajax call to login
        logIn(password, emailAddress)
    }
    else {
        emailAddressInput.classList.add('color-error')
        emailAddressInput.classList.toggle('shake-animation')
        shakeAnimation(emailAddressInput)
        setTimeout(function () {
            emailAddressInput.classList.remove('color-error')
        }, 1500);
        passwordInput.classList.add('color-error')
        passwordInput.classList.toggle('shake-animation')
        shakeAnimation(passwordInput)
        setTimeout(function () {
            passwordInput.classList.remove('color-error')
        }, 1500);
        alertMsg.innerHTML = gettext('Email or password field is not valid.')
        alertMsg.classList.remove('not-visible')
    }

})


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}