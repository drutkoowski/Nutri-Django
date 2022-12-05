const langPrefix = window.location.href.split('/')[3];
const editBtn = document.querySelector('.edit-measurements')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
let isChanged = false
// body info
const bmiInput = document.querySelector('.measurements__input-element__bmi')
const weightInput = document.querySelector('.measurements__input-element__weight')
const heightInput = document.querySelector('.measurements__input-element__height')
// about you
const firstNameInput = document.querySelector('.measurements__input-element__fname')
const lastNameInput = document.querySelector('.measurements__input-element__lname')
const ageInput = document.querySelector('.measurements__input-element__age')
const weightGoalInput = document.querySelector('.measurements__input-element__weight-goal')
const weightKgInput = document.querySelector('.measurements__input-element__goal-kg')
const activityInput = document.querySelector('.measurements__input-element__activity')
// measurements
const chestInput = document.querySelector('.measurements__input-element__chest')
const bicepsInput = document.querySelector('.measurements__input-element__biceps')
const waistInput = document.querySelector('.measurements__input-element__waist')
const hipsInput = document.querySelector('.measurements__input-element__hips')
const calvesInput = document.querySelector('.measurements__input-element__calves')
const thighsInput = document.querySelector('.measurements__input-element__thighs')
const neckInput = document.querySelector('.measurements__input-element__neck')
const wristInput = document.querySelector('.measurements__input-element__wrists')
const shouldersInput = document.querySelector('.measurements__input-element__shoulders')
const chestChangeElement = document.querySelector('.measurements__input-element__chest__change')
const chestChangeIcon = document.querySelector('.measurements__input-element__chest__icon')
const bicepsChangeElement = document.querySelector('.measurements__input-element__biceps__change')
const bicepsChangeIcon = document.querySelector('.measurements__input-element__biceps__icon')
const waistChangeElement = document.querySelector('.measurements__input-element__waist__change')
const waistChangeIcon = document.querySelector('.measurements__input-element__waist__icon')
const hipsChangeElement = document.querySelector('.measurements__input-element__hips__change')
const hipsChangeIcon = document.querySelector('.measurements__input-element__hips__icon')
const calvesChangeElement = document.querySelector('.measurements__input-element__calves__change')
const calvesChangeIcon = document.querySelector('.measurements__input-element__calves__icon')
const thighsChangeElement = document.querySelector('.measurements__input-element__thighs__change')
const thighsChangeIcon = document.querySelector('.measurements__input-element__thighs__icon')
const neckChangeElement = document.querySelector('.measurements__input-element__neck__change')
const neckChangeIcon = document.querySelector('.measurements__input-element__neck__icon')
const wristsChangeElement = document.querySelector('.measurements__input-element__wrists__change')
const wristsChangeIcon = document.querySelector('.measurements__input-element__wrists__icon')
const shouldersChangeElement = document.querySelector('.measurements__input-element__shoulders__change')
const shouldersChangeIcon = document.querySelector('.measurements__input-element__shoulders__icon')
// inputs
const allInputs = document.querySelectorAll('.measurements__input-element')
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        isChanged = true
    })
})
// utils
const setStatusChangeIcon = (element, change) => {
    let iconPath
    if (change > 0) {
        iconPath = '/static/images/svg/up-arrow-single.svg'
        element.classList.add('filter-green-dark')
    }
    else if (change < 0){
        iconPath = '/static/images/svg/down-arrow.svg'
        element.classList.add('filter-red')
    }
    else {
        iconPath = '/static/images/svg/straight-arrow.svg'
    }
    element.src = iconPath
}
const fillChanges = (element, change, elementIcon) => {
    if (change !== 0){
        element.innerHTML = change
    }
    else {
        element.style.visibility = 'hidden'
    }
    setStatusChangeIcon(elementIcon, change)
}
const buttonEditListener = () => {
    editBtn.addEventListener('click', e => {
        const editArr = []
        const url = window.location.origin + `/${langPrefix}/data/update/user-parameters`
        const inputElementsAll = document.querySelectorAll('.measurements__input-element')
        inputElementsAll.forEach(input => {
            const value = input.value
            const type = input.dataset.type
            const editObject = {
                'type': type,
                'value': value
            }
            editArr.push(editObject)
        })
        console.log(editArr)
        $.ajax({
            type: 'post',
            url: url,
            data: {
                'data': JSON.stringify(editArr),
                'csrfmiddlewaretoken': csrfToken
            },
            success: function (response){
                if (response.status === 200){
                    getBodyInfo()
                    getPersonalInfo()
                    getMeasurementInfo()
                }
            }
        })
    })
}
// ajax
const getBodyInfo = () => {
    const url = window.location.origin + `/${langPrefix}/data/get-user-body-params`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            bmiInput.value = data.bmi
            weightInput.value = data.weight
            heightInput.value = data.height
        },
    })
}
const getPersonalInfo = () => {
    const url = window.location.origin + `/${langPrefix}/data/get-user-personal-info`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)

            firstNameInput.value = data.firstName
            lastNameInput.value = data.lastName
            ageInput.value = data.age
            weightKgInput.value = data.goalKg
            weightGoalInput.value = String(data.weightGoal)
            activityInput.value = String(data.activityLevel)
        },
    })
}
const getMeasurementInfo = () => {
    const url = window.location.origin + `/${langPrefix}/data/get-user-body-measures`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            chestInput.value = data.chest
            bicepsInput.value = data.biceps
            waistInput.value = data.waist
            hipsInput.value = data.hips
            calvesInput.value = data.calves
            thighsInput.value = data.thighs
            neckInput.value = data.neck
            wristInput.value = data.wrists
            shouldersInput.value = data.shoulders
            fillChanges(chestChangeElement, data.chestChange, chestChangeIcon)
            fillChanges(bicepsChangeElement, data.bicepsChange, bicepsChangeIcon)
            fillChanges(waistChangeElement, data.waistChange, waistChangeIcon)
            fillChanges(hipsChangeElement, data.hipsChange, hipsChangeIcon)
            fillChanges(calvesChangeElement, data.calvesChange, calvesChangeIcon)
            fillChanges(thighsChangeElement, data.thighsChange, thighsChangeIcon)
            fillChanges(neckChangeElement, data.neckChange, neckChangeIcon)
            fillChanges(wristsChangeElement, data.wristsChange, wristsChangeIcon)
            fillChanges(shouldersChangeElement, data.shouldersChange, shouldersChangeIcon)
        },
    })
}

// initials
getBodyInfo()
getPersonalInfo()
getMeasurementInfo()
buttonEditListener()

function lettersOnly(input) {
    var regex = /[^a-z ]/gi;
    input.value = input.value.replace(regex, "");
}
