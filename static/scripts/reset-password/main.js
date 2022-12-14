const alertMsg = document.querySelector('.login__card__alert')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
const infoBox = document.querySelector('.input-validity-info')
// fix bg - video stretch and nav adjustments
const navBarEl = document.querySelector('.navbar')
navBarEl.style.marginTop = '0'
navBarEl.style.paddingTop = '3rem'
///
const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}
const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#password-confirm')
const changeBtn = document.querySelector('#change-password')
changeBtn.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/reset-user-password`
    const loader = document.querySelector('.loader')
    if (password.value.length > 3 && passwordConfirm.value.length > 3){
        if (password.value === passwordConfirm.value){
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    'password': password.value,
                    'csrfmiddlewaretoken': csrfToken
                },
                beforeSend: function (response){
                    loader.classList.remove('loader--hidden')
                    loader.style.opacity = '0.75'
                },
                success: function (response){
                    setTimeout(function (){
                        if (response.status === 200){
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
                        else if (response.status === 405){
                            loader.classList.add('loader--hidden')
                            alertMsg.classList.remove('not-visible')
                            infoBox.querySelector('.info-input2').innerHTML = gettext('Your password recovery link is not valid or not existing. Try again.')
                            setTimeout(function () {
                                alertMsg.classList.remove('not-visible')
                            }, 1500);
                        }
                    }, 1200)

                }
            })
        }
        else {
            password.classList.add('input-invalid')
            passwordConfirm.classList.add('input-invalid')
            infoBox.style.opacity = '1'
            shakeAnimation(password)
            shakeAnimation(passwordConfirm)
            setTimeout(function () {
                password.classList.remove('input-invalid')
                passwordConfirm.classList.remove('input-invalid')
                alertMsg.classList.remove('not-visible')
            }, 1500);
            infoBox.querySelector('.info-input2').innerHTML = gettext('Password mismatches.')
        }
    }
    else {
        password.classList.add('input-invalid')
        passwordConfirm.classList.add('input-invalid')
        infoBox.style.opacity = '1'
        shakeAnimation(password)
        shakeAnimation(passwordConfirm)
        setTimeout(function () {
            password.classList.remove('input-invalid')
            passwordConfirm.classList.remove('input-invalid')
            alertMsg.classList.remove('not-visible')
         }, 1500);
        infoBox.querySelector('.info-input2').innerHTML = gettext('Password too short.')
    }
})