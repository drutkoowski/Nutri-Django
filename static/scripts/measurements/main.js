const langPrefix = window.location.href.split('/')[3];
const getBodyInfo = () => {
    const url = window.location.origin + `/${langPrefix}/data/get-user-body-params`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            const bmiInput = document.querySelector('.measurements__input-element__bmi')
            const weightInput = document.querySelector('.measurements__input-element__weight')
            const heightInput = document.querySelector('.measurements__input-element__height')
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
            console.log(data)
            const firstNameInput = document.querySelector('.measurements__input-element__fname')
            const lastNameInput = document.querySelector('.measurements__input-element__lname')
            const ageInput = document.querySelector('.measurements__input-element__age')
            const weightGoalInput = document.querySelector('.measurements__input-element__weight-goal')
            const weightKgInput = document.querySelector('.measurements__input-element__goal-kg')
            const activityInput = document.querySelector('.measurements__input-element__activity')
            firstNameInput.value = data.firstName
            lastNameInput.value = data.lastName
            ageInput.value = data.age
            weightKgInput.value = data.goalKg
            weightGoalInput.value = data.weightGoal
            activityInput.value = data.activityLevel
            console.log(weightGoalInput.value,activityInput.value)
        },
    })
}

getBodyInfo()
getPersonalInfo()