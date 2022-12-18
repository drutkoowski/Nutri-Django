const langPrefix = window.location.href.split('/')[3];
const editBtn = document.querySelector('.edit-profile-info')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
let isChanged = false
let allowedGoal
let goalWeightConst
const staticPath = document.querySelector('#static-path').value

// sidebar
const fullNameSidebar = document.querySelector('.dashboard__sidebar__name')
const usernameSidebar = document.querySelector('.dashboard__sidebar__username')
const genderSidebar = document.querySelector('.dashboard__sidebar__gender')
const yearsSidebar = document.querySelector('.dashboard__sidebar__years')
const heightSidebar = document.querySelector('.dashboard__sidebar__height')
const weightSidebar = document.querySelector('.dashboard__sidebar__weight')
const goalSidebar = document.querySelector('.dashboard__sidebar__goal')
const activitySidebar = document.querySelector('.dashboard__sidebar__activity-level')
// body info
const bmiInput = document.querySelector('.measurements__input-element__bmi')
const weightInput = document.querySelector('.measurements__input-element__weight')
const heightInput = document.querySelector('.measurements__input-element__height')
const weightChangeElement = document.querySelector('.measurements__input-element__weight__change')
const weightChangeDateElement = document.querySelector('.measurements__input-element__weight__change-date')
const weightChangeIcon = document.querySelector('.measurements__input-element__weight__icon')
// about you
const firstNameInput = document.querySelector('.measurements__input-element__fname')
const lastNameInput = document.querySelector('.measurements__input-element__lname')
const ageInput = document.querySelector('.measurements__input-element__age')
const weightGoalInput = document.querySelector('.measurements__input-element__weight-goal')
const weightKgInput = document.querySelector('.measurements__input-element__goal-kg')
const activityInput = document.querySelector('.measurements__input-element__activity')
// profile-info
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
const chestChangeDateElement = document.querySelector('.measurements__input-element__chest__change-date')
const chestChangeIcon = document.querySelector('.measurements__input-element__chest__icon')
const bicepsChangeElement = document.querySelector('.measurements__input-element__biceps__change')
const bicepsChangeDateElement = document.querySelector('.measurements__input-element__biceps__change-date')
const bicepsChangeIcon = document.querySelector('.measurements__input-element__biceps__icon')
const waistChangeElement = document.querySelector('.measurements__input-element__waist__change')
const waistChangeDateElement = document.querySelector('.measurements__input-element__waist__change-date')
const waistChangeIcon = document.querySelector('.measurements__input-element__waist__icon')
const hipsChangeElement = document.querySelector('.measurements__input-element__hips__change')
const hipsChangeDateElement = document.querySelector('.measurements__input-element__hips__change-date')
const hipsChangeIcon = document.querySelector('.measurements__input-element__hips__icon')
const calvesChangeElement = document.querySelector('.measurements__input-element__calves__change')
const calvesChangeDateElement = document.querySelector('.measurements__input-element__calves__change-date')
const calvesChangeIcon = document.querySelector('.measurements__input-element__calves__icon')
const thighsChangeElement = document.querySelector('.measurements__input-element__thighs__change')
const thighsChangeDateElement = document.querySelector('.measurements__input-element__thighs__change-date')
const thighsChangeIcon = document.querySelector('.measurements__input-element__thighs__icon')
const neckChangeElement = document.querySelector('.measurements__input-element__neck__change')
const neckChangeDateElement = document.querySelector('.measurements__input-element__neck__change-date')
const neckChangeIcon = document.querySelector('.measurements__input-element__neck__icon')
const wristsChangeElement = document.querySelector('.measurements__input-element__wrists__change')
const wristsChangeDateElement = document.querySelector('.measurements__input-element__wrists__change-date')
const wristsChangeIcon = document.querySelector('.measurements__input-element__wrists__icon')
const shouldersChangeElement = document.querySelector('.measurements__input-element__shoulders__change')
const shouldersChangeDateElement = document.querySelector('.measurements__input-element__shoulders__change-date')
const shouldersChangeIcon = document.querySelector('.measurements__input-element__shoulders__icon')
// inputs
const allInputs = document.querySelectorAll('.measurements__input-element')
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        isChanged = true
        checkSelectedGoal()
    })
})
// utils
const setStatusChangeIcon = (element, change) => {
    let iconPath
    if (change > 0) {
        iconPath = `${staticPath}images/svg/up-arrow-single.svg`
        element.classList.add('filter-green-dark')
        element.classList.remove('filter-red')
    }
    else if (change < 0){
        iconPath = `${staticPath}images/svg/down-arrow.svg`
        element.classList.add('filter-red')
        element.classList.remove('filter-green-dark')
    }
    else {
        iconPath = `${staticPath}images/svg/straight-arrow.svg`
        element.classList.remove('filter-green-dark')
        element.classList.remove('filter-red')
    }
    element.src = iconPath
}
const fillChanges = (element, change, elementIcon,dateElement, dateChange, unit) => {
    if (change !== 0){
        element.innerHTML = `${change} ${unit}`
        element.style.removeProperty('visibility')
        if (dateChange){
            dateElement.innerHTML =`(${dateChange})`
        }
    }
    else {
        element.style.visibility = 'hidden'
    }
    setStatusChangeIcon(elementIcon, change)
}
const buttonEditListener = () => {
    editBtn.addEventListener('click', () => {
        if (isChanged) {
            const editArr = []
            const url = window.location.origin + `/${langPrefix}/data/update/user-parameters`
            const inputElementsAll = document.querySelectorAll('.measurements__input-element')
            const loader = document.querySelector('.loader-message')
            inputElementsAll.forEach(input => {
                const value = input.value
                const type = input.dataset.type
                const editObject = {
                    'type': type,
                    'value': value
                }
                editArr.push(editObject)
            })
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    'data': JSON.stringify(editArr),
                    'csrfmiddlewaretoken': csrfToken
                },
                beforeSend: function () {
                    loader.classList.remove('not-visible')
                    loader.style.transition = 'unset'
                    loader.style.opacity = '0.95'
                    const loaderMsg = document.querySelector('.loader-message__message')
                    const divParent = loaderMsg.parentElement.getBoundingClientRect()
                    loaderMsg.innerHTML = gettext('Updating Profile')
                    loaderMsg.style.removeProperty('left')
                    const loaderY = (loaderMsg.getBoundingClientRect().left) - divParent.left + 37.5 - loaderMsg.clientWidth / 2;
                    loaderMsg.style.left = `${loaderY}px`
                },
                success: function (response){
                    if (response.status === 200){
                        getBodyInfo()
                        getPersonalInfo()
                        getMeasurementInfo()
                    }
                },
                 complete: function (res){
                     setTimeout(function (){
                        const loaderMsg = document.querySelector('.loader-message__message')
                        loaderMsg.innerHTML = ''
                        loader.classList.add('not-visible')
                        loader.style.removeProperty('transition')
                        loader.style.removeProperty('opacity')
                    }, 1500)
                }
            })
        }

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
            goalWeightConst = String(data.weightGoal)
            // sidebar
            fullNameSidebar.innerHTML = `${data.firstName} ${data.lastName}`
            usernameSidebar.innerHTML = data.username
            if (langPrefix === 'pl'){
                if (data.gender === 'Male'){
                    genderSidebar.innerHTML = 'Mężczyzna'
                }
                else {
                    genderSidebar.innerHTML = 'Kobieta'
                }
            }
            else {
                genderSidebar.innerHTML = data.gender
            }
            yearsSidebar.innerHTML = `${data.age} ${gettext('years old')}`
            heightSidebar.innerHTML = `${data.height} cm`
            weightSidebar.innerHTML = `${data.weight} kg`
            goalSidebar.innerHTML = `${gettext('Goal')}: ${data.weightGoal} (${data.goalKg} kg)`
            activitySidebar.innerHTML = `${gettext('Activity')}: ${data.activityLevel}`
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
            fillChanges(weightChangeElement, data.weightChange, weightChangeIcon, weightChangeDateElement, data.weightDateChange, 'kg')
            fillChanges(chestChangeElement, data.chestChange, chestChangeIcon, chestChangeDateElement, data.chestDateChange, 'cm')
            fillChanges(bicepsChangeElement, data.bicepsChange, bicepsChangeIcon, bicepsChangeDateElement, data.bicepsDateChange, 'cm')
            fillChanges(waistChangeElement, data.waistChange, waistChangeIcon, waistChangeDateElement, data.waistDateChange, 'cm')
            fillChanges(hipsChangeElement, data.hipsChange, hipsChangeIcon, hipsChangeDateElement, data.hipsDateChange, 'cm')
            fillChanges(calvesChangeElement, data.calvesChange, calvesChangeIcon, calvesChangeDateElement, data.calvesDateChange, 'cm')
            fillChanges(thighsChangeElement, data.thighsChange, thighsChangeIcon, thighsChangeDateElement, data.thighsDateChange, 'cm')
            fillChanges(neckChangeElement, data.neckChange, neckChangeIcon, neckChangeDateElement, data.neckDateChange, 'cm')
            fillChanges(wristsChangeElement, data.wristsChange, wristsChangeIcon, wristsChangeDateElement, data.wristsDateChange, 'cm')
            fillChanges(shouldersChangeElement, data.shouldersChange, shouldersChangeIcon, shouldersChangeDateElement, data.shouldersDateChange, 'cm')
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

const checkSelectedGoal = () => {
    const weight = Number(weightInput.value)
    const weightGoalKG = Number(weightKgInput.value)
    if (weight > weightGoalKG) {
        allowedGoal = gettext('Lose Weight')
    }
    else if (weight < weightGoalKG){
        allowedGoal = gettext('Gain Weight')
    }
    else if (weight === weightGoalKG){
        allowedGoal = gettext('Maintain Weight')
    }
    else {
        allowedGoal = goalWeightConst
    }

    weightGoalInput.value = String(allowedGoal)
}

function maxLengthCheck(object, min, max) {
    fixInputMax(object, max)
    fixInputMin(object, min)
    fixInputMax(object, max)
    fixInputMin(object, min)
}

const fixInputMax = function (input, max) {
   input.addEventListener('focusout', () => {
       let inputLength = input.value.length
       if (inputLength > 3) {
           input.value = input.value.slice(0, 3)
       }
       if (input.value > max) {
           input.value = max
       }
   })
}
const fixInputMin = function (input, min) {
    input.addEventListener('focusout', () => {
        if (input.value < min && input !== document.activeElement) {
            input.value = min
        }
    })
}