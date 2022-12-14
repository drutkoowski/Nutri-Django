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
emailAddressInput.addEventListener('input', () => {
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
        infoBox.querySelector('.info-input1').innerHTML = ''
    }
})

const recoverPassword = (emailAddress) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/forgot-password`
    const loader = document.querySelector('.loader')
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'csrfmiddlewaretoken': csrfToken,
            'emailAddress': emailAddress,
        },
        beforeSend: function (response){
            loader.classList.remove('loader--hidden')
            loader.style.opacity = '0.75'
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                loader.classList.add('loader--hidden')
                const modal = document.querySelector('.modal-signup')
                modal.classList.remove('not-visible')
                setTimeout(function (){
                    location.href = window.location.origin + `/${langPrefix}/login`
                }, 3500)
                const modalClose = document.querySelector('.modal-signup__close-button')
                modalClose.addEventListener('click', () => {
                    modal.classList.add('not-visible')
                })
            }
            else if (status === 404) {
                alertMsg.innerHTML = gettext('We could not match any user with these credentials.')
                alertMsg.classList?.remove('not-visible')
                setTimeout(function () {
                    alertMsg.classList.remove('not-visible')
                }, 1500);
                loader.classList.add('loader--hidden')
            }
            else if (status === 405) {
                alertMsg.innerHTML = gettext('Your account is not verified. Click at email we sent you.')
                alertMsg.classList?.remove('not-visible')
                setTimeout(function () {
                    alertMsg.classList.remove('not-visible')
                }, 1500);
                loader.classList.add('loader--hidden')
            }
            },
        error: function (error) {
            alertMsg.innerHTML = gettext('Error occurred.. try again.')
            alertMsg.classList?.remove('not-visible')
            setTimeout(function () {
                alertMsg.classList.remove('not-visible')
                loader.style.removeProperty('opacity')
            }, 1500);
            loader.classList.add('loader--hidden')
        },
    })
}

loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    alertMsg.classList.add('not-visible')
    infoBox.style.opacity = '0'
    const emailAddress = document.querySelector('#email').value
    if (validateEmail(emailAddress)) {
        // ajax call to recover
        recoverPassword(emailAddress)
    }
    else {
        emailAddressInput.classList.add('color-error')
        emailAddressInput.classList.toggle('shake-animation')
        shakeAnimation(emailAddressInput)
        setTimeout(function () {
            emailAddressInput.classList.remove('color-error')
        }, 1500);
        alertMsg.innerHTML = gettext('Email field is not valid email.')
        alertMsg.classList.remove('not-visible')
    }

})


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}