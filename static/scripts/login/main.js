const cardContent = document.querySelector('.login__card__content')
const alertMsg = document.querySelector('.login__card__alert')
const loginButton = document.querySelector('#login-button')

const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

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



loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    alertMsg.classList.add('not-visible')
    const emailAddress = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    if (validateEmail(emailAddress) && !isEmpty(password)) {
        if (password.length < 3) {
            alertMsg.innerHTML = `Password is too short!`
            alertMsg.classList?.remove('not-visible')
        }
        else {
            // ajax call to check if user exist
            const url = window.location.origin + '/data/login-user'
            const nextUrl = window.location.origin + '/dashboard'
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
                        alertMsg.innerHTML = `We could not match any user with these credentials.`
                        alertMsg.classList?.remove('not-visible')
                    }

                },
                error: function (error) {
                    alertMsg.innerHTML = `Error occurred.. try again.`
                    alertMsg.classList?.remove('not-visible')
                },
            })
        }
    }
    else {
        alertMsg.innerHTML = `Email or password field is not valid.`
        alertMsg.classList.remove('not-visible')
    }

})