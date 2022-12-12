const navbar = document.querySelector('.navbar--dashboard')
navbar.classList.toggle('fix-navbar')

// csrf
const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value

// inputs
const inputName = document.querySelector('#name')
const inputCategory = document.querySelector('#category')
const inputMET = document.querySelector('#met')

// button
const btnAdd = document.querySelector('.btn-light')
const allInputs = Array.from(document.querySelectorAll('.activity-enter__input'))
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.id !== 'name'){
            input.value = input.value.slice(0,2);
        }
        else {
            input.value = input.value.slice(0,100);
        }
        input.dataset.value = input.value
    })
})
inputCategory.addEventListener('change', () => {
    inputCategory.dataset.value = inputCategory.value
})

btnAdd.addEventListener('click', () => {
    let activityName, met, category
    let isValid = true
    const allInputs = Array.from(document.querySelectorAll('.activity-enter__input'))
    allInputs.forEach(input => {
        const inputVal = input.dataset.value
        if (inputVal) {
            const type = input.id
            if (type === 'name') {
                activityName = inputVal
            }
            else if (type === 'category') {
                category = inputVal
            }
            else if (type === 'met'){
                met = inputVal
            }
        }
        else {
            isValid = false
            input.classList.add('color-error')
            input.classList.toggle('shake-animation')
            setTimeout(function () {
                input.classList.remove('color-error')
                input.classList.remove('shake-animation')
            }, 1500);
        }
    })
    if (isValid) {
        const langPrefix = window.location.href.split('/')[3];
        const url = location.origin + `/${langPrefix}/workouts/data/save/new-activity-element`
        $.ajax({
            type: 'post',
            url: url,
            beforeSend: function (){
                const modal = document.querySelector('.modal-signup')
                modal.classList.remove('not-visible')
                const modalHeading = document.querySelector('#modal-header-msg')
                modalHeading.innerHTML = gettext('Adding your custom element...')
            },
            data: {
                'csrfmiddlewaretoken': csrfToken,
                'name': activityName,
                'categoryPk': category,
                'met': met,
                'langCode': langPrefix
            },
            success: function (response) {
                setTimeout({},1200)
                const modalHeading = document.querySelector('#modal-header-msg')
                if (response.status === 200){
                    setTimeout(function () {
                        modalHeading.innerHTML = gettext('Your element added successfully.')
                    }, 3200)
                }
                else {
                    setTimeout(function () {
                        modalHeading.innerHTML = gettext('Your is already in database.')
                    }, 3200)
                }

                location.reload()
            }
        })
    }
})
