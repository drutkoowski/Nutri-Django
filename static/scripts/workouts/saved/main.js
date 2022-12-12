// cards
const searchContainer = document.querySelector('.saved-workouts__search')
const adjustableCard = document.querySelector('.saved-workouts__added')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')
// buttons
const saveNewWorkoutButton = document.querySelector('.saved-workouts__search__save-new__button')
const editButtons = document.querySelectorAll('.edit-saved-workouts')
const deleteButtons = document.querySelectorAll('.delete-saved-workouts')
const modalCloseEdit = document.querySelector('.modal-edit-search__close-button')
const modalCloseAdd = document.querySelector('.modal-add-search__close-button')

// others
const headingAdjustableCard = document.querySelector('.saved-workouts__added--saved__heading--item')

// csrf
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

let isCardVisible = false

const clearCardContent = () => {
    const parentContent = document.querySelector('.saved-workouts__added--saved__content')
    const childrenContent = Array.from(parentContent?.children)
    childrenContent.forEach(child => {
        parentContent.removeChild(child)
    })
    const inputEl = document.querySelector('.workout_name_input')
    const saveEl = document.querySelector('.saved-workouts__added--saved__content__save')
    if(inputEl && saveEl) {
        inputEl.remove()
        saveEl.remove()
    }
    const inputBox= document.querySelector('.saved-new-workouts-buttons-container')
    if (inputBox){
        inputBox.remove()
    }
    if (saveNewWorkoutButton.disabled) {
        saveNewWorkoutButton.disabled = false
    }
}
let onlyVerifiedEdit = true
let onlyVerifiedAdd = true

const verifiedIconEdit = document.querySelector('#verified-edit')
verifiedIconEdit.addEventListener('click', () => {
    if (verifiedIconEdit.id === 'verified-edit') {
        verifiedIconEdit.id = 'unverified-edit'
        verifiedIconEdit.src = '/static/images/svg/unchecked.svg'
        onlyVerifiedEdit = false
    }
    else {
        verifiedIconEdit.id = 'verified-edit'
        verifiedIconEdit.src = '/static/images/svg/checked.svg'
        onlyVerifiedEdit = true
    }
})

const verifiedIconAdd = document.querySelector('#verified-add')
verifiedIconAdd.addEventListener('click', () => {
    if (verifiedIconAdd.id === 'verified-add') {
        verifiedIconAdd.id = 'unverified-add'
        verifiedIconAdd.src = '/static/images/svg/unchecked.svg'
        onlyVerifiedAdd = false
    }
    else {
        verifiedIconAdd.id = 'verified-add'
        verifiedIconAdd.src = '/static/images/svg/checked.svg'
        onlyVerifiedAdd = true
    }
})



let watch_media_query = '(max-width:  84.375em)';
let watch_small_media_query = '(max-width: 56.25em)';
let watch_small_phone_media_query = '(max-width: 37.5em';
let matches_small = window.matchMedia(watch_small_media_query).matches
let matches_small_phone = window.matchMedia(watch_small_phone_media_query).matches
let matched = window.matchMedia(watch_media_query).matches;

const workoutsVideo = document.getElementById('save-workouts-video')
if (workoutsVideo) {
    workoutsVideo.playbackRate = 0.5;
}

window.onresize = () => window.location.reload()

if (matched && !isCardVisible && !matches_small && !matches_small_phone) {
    searchContainer.style.width = '65%'
    searchContainer.style.margin = '0 auto'
}
else if (matches_small && !isCardVisible && !matches_small_phone) {
    searchContainer.style.width = '85%'
    searchContainer.style.margin = '0 auto'
}
else if(matches_small_phone && !isCardVisible) {
    searchContainer.style.width = '95%'
    searchContainer.style.margin = '0 auto'
}
 else {
    searchContainer.style.width = '50%'
    searchContainer.style.justifySelf = 'center'
}

// search
const ajaxCall = (query, searchResponseBox) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/live-search-exercises`
    $.ajax({
        type: "GET",
        url: url,
        data: {
            'query': query,
            'isVerified': onlyVerifiedAdd
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
               searchResponseBox.classList.remove('not-visible')
               let exercises = [...response.exercises]
               exercises.forEach(exercise => {
                   let exerciseName
                   let exerciseCategoryName
                   if (langPrefix === 'pl'){
                       exerciseName = exercise.pl_name
                       exerciseCategoryName = exercise.category_name_pl
                   }
                   else {
                       exerciseName = exercise.en_name
                       exerciseCategoryName = exercise.category_name_en
                   }
                   let contentToAppend = `
                    <div class="saved-workouts__added--saved__content__search-response__item" data-pk="${exercise.id}">
                        <p><b>${exerciseName}</b></p>
                        <div data-exercisePK='${exercise.id}' class="new-workout-add-item add-icon filter-green"></div>
                         <small class="search-category-small--saved">${gettext('Category')} <span class="search-category-small--saved__text">${exerciseCategoryName}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-workout-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const infoBox = document.querySelector('.info-search-saved')
                        if(!infoBox.classList.contains('not-visible')) {
                            infoBox.classList.add('not-visible')
                        }
                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)
                        const exercisePK = button.dataset.exercisepk
                        const workoutContent = document.querySelector('.saved-workouts__added--saved__content__workout')
                        const workoutNameSaveContainer = document.querySelector('.saved-new-workouts-buttons-container')
                        workoutContent.classList.remove('not-visible')
                        workoutNameSaveContainer.classList.remove('not-visible')
                        getExerciseById(exercisePK)
                    })
                })
            }
            else if (status === 404) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
                searchResponseBox.classList.add('not-visible')
            }

            },
        error: function (error) {
            const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
        },
    })
}
const ajaxCallEditWorkout = (query) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/live-search-exercises`
    const searchResponseBox = document.querySelector('.saved-workouts__added--saved__content__search-response')
    $.ajax({
        type: "GET",
        url: url,
        data: {
            'query': query,
            'isVerified': onlyVerifiedEdit
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
               searchResponseBox.classList.remove('not-visible')
               let exercises = [...response.exercises]
               exercises.forEach(exercise => {
                   let exerciseName
                   let exerciseCategoryName
                   if (langPrefix === 'pl'){
                       exerciseName = exercise.pl_name
                       exerciseCategoryName = exercise.category_name_pl
                   }
                   else {
                       exerciseName = exercise.en_name
                       exerciseCategoryName = exercise.category_name_en
                   }
                   let contentToAppend = `
                    <div class="saved-workouts__added--saved__content__search-response__item">
                        <p><b>${exerciseName}</b></p>
                        <div data-exercisePK='${exercise.id}' class="new-workout-add-item add-icon filter-green"></div>
                         <small class="search-category-small--saved">${gettext('Category')}<span class="search-category-small--saved__text">${exerciseCategoryName}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-workout-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', () => {

                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)

                        const exercisePk = button.dataset.exercisepk
                        const alreadyItemsAll = document.querySelector('.edit-workout-added-items').children

                        let alreadyAdded = false
                        Array.from(alreadyItemsAll).forEach(item => {
                            const itemPk = item.dataset.exercisepk
                            if (itemPk === exercisePk) {
                                alreadyAdded = true
                            }
                        })
                        if (!alreadyAdded) {
                        const url = window.location.origin + `/${langPrefix}/workouts/data/get-exercise`
                        $.ajax({
                            type: 'get',
                            url: url,
                            data: {
                                "exerciseId": exercisePk
                            },
                            success: function (response){
                                const exercise = JSON.parse(response.exercise)
                                const randomId = "Id" + exercisePk * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                                let exerciseName
                                let unitName
                                if (langPrefix === 'pl'){
                                   exerciseName = exercise.pl_name
                                   unitName = 'minut'
                                }
                                else {
                                   exerciseName = exercise.en_name
                                   unitName = 'minutes'
                                }
                                const workoutItemAppend = `
                                    <div class="today-workouts-saved-edit-inputBox" data-exercisePK='${exercisePk}'>
                                      <p><b>${exerciseName}</b></p>
                                     <input name="${exercisePk}" min="0" max="1000" class='updated-workout-element-input' type="number" placeholder="${unitName}">
                                     <label for="${exercisePk}">x ${unitName}</label>
                                     <div id="${randomId}" class="edit-remove-item remove-icon filter-red"></div>
                                    </div>
                                  `
                                    const itemsContainer = document.querySelector('.edit-workout-added-items')
                                    itemsContainer.insertAdjacentHTML('beforeend', workoutItemAppend)
                                    const btnRemove = itemsContainer.querySelector(`#${randomId}`)
                                    btnRemove.addEventListener('click', e => {
                                        const parent = e.target.parentNode
                                        const itemsCount = document.querySelector('.edit-workout-added-items').children.length
                                        if (itemsCount >= 2) {
                                            $(parent).fadeOut(300)
                                            parent.remove()
                                        }
                                    })
                                    btnRemove.removeAttribute('id')
                                    }
                                })
                        }

                    })
                })
            }
            else if (status === 404) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
                searchResponseBox.classList.add('not-visible')
            }

            },
        error: function (error) {
            const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
        },
    })
}
const getExerciseById = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/get-exercise`
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            'exerciseId': id
        },
        success: function (response){
            const exercise = JSON.parse(response.exercise)
            const exercisePk = exercise.id
            const alreadyItemsAll = document.querySelector('.saved-workouts__added--saved__content__workout__items').children
            let alreadyAdded = false
            Array.from(alreadyItemsAll).forEach(item => {
                const itemPk = item.dataset.exercisepk
                if (parseInt(itemPk) === exercisePk) {
                    alreadyAdded = true
                }
            })
            if (!alreadyAdded) {
                let exerciseName = exercise['en_name']
                let exerciseUnitName = exercise['time_unit_en']
                if(langPrefix === 'pl') {
                    exerciseName = exercise["pl_name"]
                    exerciseUnitName = exercise["time_unit_pl"]
                }
                const workoutItemAppend = `
                <div data-exercisePK='${exercise.id}' class="saved-workouts__added--saved__content__workout__item">
                <p><b>${exerciseName}</b></p>
                <div class="saved-workouts__added--saved__content__workout__item--remove remove-icon filter-red"></div>
                <div class="today-workouts-saved-inputBox">
                    <input min="1" max="1000" class="new-today-workout-input-quantity" name="${exerciseName}" type="number" placeholder="${exerciseUnitName}">
                    <label for="${exerciseName}">x ${exerciseUnitName}</label>
                </div>
                </div>
                `
                const workoutContentItems = document.querySelector('.saved-workouts__added--saved__content__workout__items')
                workoutContentItems.insertAdjacentHTML('beforeend', workoutItemAppend)
                const workoutItems = document.querySelectorAll('.saved-workouts__added--saved__content__workout__item--remove')
                const workoutContent = document.querySelector('.saved-workouts__added--saved__content__workout')
                workoutItems.forEach(workoutEl => {
                    workoutEl.addEventListener('click', e => {
                        const parent = workoutContentItems
                        const removeEl = e.target.parentNode
                        removeEl.remove()
                        const parentChildrenCount = parent.children.length
                        const workoutNameSaveContainer = document.querySelector('.saved-new-workouts-buttons-container')
                        if (parentChildrenCount === 0) {
                            const infoBox = document.querySelector('.info-search-saved')
                            if(infoBox.classList.contains('not-visible')) {
                                infoBox.classList.remove('not-visible')
                            }
                            workoutContent.classList.add('not-visible')
                            workoutNameSaveContainer.classList.add('not-visible')
                        }
                        else {
                            workoutNameSaveContainer.classList.remove('not-visible')
                        }
                    })
                })
            }
        }
    })
}
// create
const createNewWorkoutTemplate = (exercisesArr,workoutName) => {
     const langPrefix = window.location.href.split('/')[3];
     const url = window.location.origin + `/${langPrefix}/workouts/data/save/workout-template`
     $.ajax({
         type: "POST",
         url: url,
         data: {
             'workoutName': workoutName,
             'csrfmiddlewaretoken': csrfToken,
         },
         success: function (response){
             const workoutId = response.workoutId
             $.ajax({
                 type: 'POST',
                 url: window.location.origin + `/${langPrefix}/workouts/data/save/workout-template/element`,
                 data: {
                     'workoutId': workoutId,
                     'exerciseObjArr': JSON.stringify(exercisesArr),
                     'csrfmiddlewaretoken': csrfToken,
                 },
                 success: function (response) {
                     const status = response.status
                     if (status === 201) {
                         const modal = document.querySelector('.modal-queued')
                         modal.classList.toggle('not-visible')
                         modal.style.zIndex = '22000'
                         const closeModalBtn = document.querySelector('.modal-queued__close-button')
                         closeModalBtn.addEventListener('click', () => {
                             window.location = window.location.href;
                         })
                         setInterval(function () {
                             window.location = window.location.href;
                         }, 2500);
                        }
                    }
                })
         },
         error: function (error){
             console.log(error)
         }
     })
}
const saveNewWorkout = () => {
    const langPrefix = window.location.href.split('/')[3];
    const workoutName = document.querySelector('.workout_name_input').value
    const workoutElements = document.querySelectorAll('.saved-workouts__added--saved__content__workout__item')
    $.ajax({
        type: 'POST',
        url: window.location.origin + `/${langPrefix}/workouts/data/save/workout-template`,
        data: {
            'workoutName': workoutName,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response) {
            const workoutId = response.workoutId
            let exercisesArr = []
            workoutElements.forEach(item => {
                const exercisePk = item.dataset.exercisepk
                const inputEl = item.querySelector('.new-today-workout-input-quantity')
                const exerciseObj = {
                    'exercisePk': exercisePk,
                    'quantity': inputEl.value,
                    'workoutId': workoutId
                }
                exercisesArr.push(exerciseObj)
            })
            $.ajax({
                type: 'POST',
                url: window.location.origin + `/${langPrefix}/workouts/data/save/workout-template/element`,
                data: {
                    'workoutId': workoutId,
                    'exerciseObjArr': JSON.stringify(exercisesArr),
                    'csrfmiddlewaretoken': csrfToken,
                },
                success: function (response) {
                const status = response.status
                if (status === 201) {
                    const modal = document.querySelector('.modal-queued')
                    modal.classList.toggle('not-visible')
                    modal.style.zIndex = '22000'
                    const closeModalBtn = document.querySelector('.modal-queued__close-button')
                    closeModalBtn.addEventListener('click', e => {
                        window.location = window.location.href;
                    })
                setInterval(function () {
                    window.location = window.location.href;
                }, 2500);
                }
                }
            })
        },

    })

}
// delete
const deleteAndCreateWorkoutTemplate = (workoutTemplateId, exercisesArrPk, workoutName) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/delete/saved-workout/template`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'workoutTemplateId': workoutTemplateId,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response) {
            createNewWorkoutTemplate(exercisesArrPk, workoutName)
        },
    })
}
const deleteWorkoutTemplate = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/delete/workout-template/element`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'workoutTemplateId': id,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                const modal = document.querySelector('.modal-queued')
                modal.style.zIndex = '22000'
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                const modalHeading = modal.querySelector('.modal-queued--heading')
                modalHeading.innerHTML = gettext(`Removing selected activity template from database..`)
                closeModalBtn.addEventListener('click', e => {
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                    }, 1000);
             }
        },
    })
}

// edit
const getTemplateElement = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/get/saved-workout/template`
    $.ajax({
        type: "GET",
        url: url,
        data: {
            "templateId": id,
        },
        success: function (response) {
           const workoutObj = JSON.parse(response.workoutTemplateObj)
           const workoutName = workoutObj.workout_name
           const kcal = workoutObj.kcal_burnt_sum
           const ids_array = workoutObj.workout_elements_ids
           getWorkoutTemplateElement(workoutObj, workoutName, kcal, ids_array)
        },
    })
}
const getWorkoutTemplateElement = (workoutObj, workoutName, kcal, ids_array) => {
    const contentContainer = document.querySelector('.saved-workouts__added--saved__content')
    let contentToAppend = `
        <div class="saved-workouts__added--saved__content__item saved-template-edit__heading" id="${workoutObj.workoutId}">
            <p><b>${workoutName}</b> - ${kcal} kcal</p>
        </div
         <div> 
            <div class="add-new-element-box">
                <div class="add-icon filter-green"></div>
                <a class="saved-template-edit__add-new__trigger-search">${gettext('Add new element for your activity')}</a>
            </div>
        </div>
        <div class="edit-workout-added-items"></div>
    `
    let saveButtonAppend = `
       <div class="saved-new-workouts-buttons-container">
              <input type="text" placeholder="${workoutName}" value="${workoutName}" class="workout_name_input">
              <button class="saved-workouts__added--saved__content__save save-updated-template-workout btn">${gettext('Save')}</button>
         </div>
        `
    contentContainer.insertAdjacentHTML('beforeend', contentToAppend)
    contentContainer.insertAdjacentHTML('afterend', saveButtonAppend)
    const addNewElementBtn = document.querySelector('.add-new-element-box')
    addNewElementBtn.addEventListener('click', () => {
        const modalAddSearch = document.querySelector('.modal-edit-search')
        modalAddSearch.style.zIndex = '22000'
        modalAddSearch.classList.toggle('not-visible')
    })
    const workoutSaveButton = document.querySelector('.save-updated-template-workout')
    workoutSaveButton.addEventListener('click', () => {
        const workoutItems = document.querySelector('.today-workouts-saved-edit-inputBox').children
        const inputNameEl = document.querySelector('.workout_name_input')
        const inputsQuantity = document.querySelectorAll('.updated-workout-element-input')
        let isValid = true
        inputsQuantity.forEach(inputEl => {
            if(!inputEl.value || inputEl.value.length === 0 || inputEl.value === '') {
                isValid = false
                inputEl.classList.add('color-error')
                inputEl.classList.toggle('shake-animation')
                shakeAnimation(inputEl)
                setTimeout(function () {
                    inputEl.classList.remove('color-error')
                }, 1500);
            }
        })
        if (workoutItems.length > 0 && inputNameEl.value && inputNameEl.value.length > 3 && isValid) {
            updateWorkout(workoutObj)
        }
        else if(!workoutItems.length > 0 || !inputNameEl.value || !inputNameEl.value.length > 3) {
            inputNameEl.classList.add('color-error')
            inputNameEl.parentElement.classList.toggle('shake-animation')
            shakeAnimation(inputNameEl.parentElement)
            setTimeout(function () {
                inputNameEl.classList.remove('color-error')
            }, 1500);

        }
    })
    const searchInput = document.querySelector('.new-saved-workout-search')
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/get/saved-workout/template/element`
    searchInput.addEventListener('input', e => {
        const searchValue = e.target.value
        const searchResponseBox = document.querySelector('.saved-workouts__added--saved__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCallEditWorkout(searchValue)
    })
    ids_array.forEach(id => {
         $.ajax({
             type: 'GET',
             url: url,
             data: {
                'workoutElementId': id,
             },
            success: function (response){
                const obj = JSON.parse(response['workoutTemplateElement'])
                const objDataSet = JSON.parse(response['workoutElement'])
                const randomId = "Id" + obj.workoutTemplateElementId * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                let elementName
                let unitName
                if (langPrefix === 'pl') {
                    elementName = obj.templateElementName_pl
                    unitName = 'minut'
                }
                else {
                    elementName = obj.templateElementName_en
                    unitName = 'minutes'
                }
                let appendItemElement = `
                <div class="today-workouts-saved-edit-inputBox" data-exercisePk="${objDataSet.id}">
                    <p><b>${elementName}</b> ${Math.trunc(obj.kcal_burnt)} kcal</p>
                    <input name="${obj.workoutTemplateElementId}" min="0" max="1000" value="${obj.min_spent}" class='updated-workout-element-input' type="number" placeholder="${obj.min_spent}">
                    <label for="${obj.workoutTemplateElementId}">x ${unitName}</label>
                    <div id='${randomId}' class="edit-remove-item remove-icon filter-red"></div>
                </div>
                `
                const itemsContainer = document.querySelector('.edit-workout-added-items')
                itemsContainer.insertAdjacentHTML('beforeend', appendItemElement)
                const btnRemove = itemsContainer.querySelector(`#${randomId}`)
                btnRemove.addEventListener('click', e => {
                    const parent = e.target.parentNode
                    const itemsCount = document.querySelector('.edit-workout-added-items').children.length
                    if (itemsCount >= 2) {
                        $(parent).fadeOut(300)
                        parent.remove()
                    }

                })
                btnRemove.removeAttribute('id')
            },
          })
    })
}
const updateWorkout = (workoutObj) => {
    const workoutName = document.querySelector('.workout_name_input').value
    const workoutElements = document.querySelectorAll('.today-workouts-saved-edit-inputBox')
    let exercisesArrPk = []
    workoutElements.forEach(item => {
        const workoutObjPk = item.dataset.exercisepk;
        const inputEl = item.querySelector('.updated-workout-element-input')
        const exerciseObj = {
            'exercisePk': workoutObjPk,
            'quantity': inputEl.value,
        }
        exercisesArrPk.push(exerciseObj)
    })
    deleteAndCreateWorkoutTemplate(workoutObj.workoutId, exercisesArrPk, workoutName)

}


// buttons listeners
$(searchContainer).addClass('animate-left').on("animationend", function(){
    $(this).removeClass('animate-left');
});

// modal close listeners
modalCloseEdit.addEventListener('click', () => {
    animateDeletingElementByClass('.modal-edit-search', 1200)
})

modalCloseAdd.addEventListener('click', () => {
    animateDeletingElementByClass('.modal-add-search', 1200)
})


// save
saveNewWorkoutButton.addEventListener('click', () => {
     if (!isCardVisible) {
        document.querySelector('.saved-workouts-layout-container').classList.remove('not-expanded')
        document.querySelector('.saved-workouts-layout-container').classList.add('expanded')
        searchContainer.style.gridColumn = '1/2'
        searchContainer.style.removeProperty('width')
        searchContainer.style.removeProperty('justify-self')
         $(searchContainer).addClass('animate-left').on("animationend", function(){
            $(this).removeClass('animate-left');
         });
        adjustableCard.classList.toggle('not-visible')
        isCardVisible = true
    }
     $(adjustableCard).addClass('animate').on("animationend", function(){
            $(this).removeClass('animate');
     });
     clearCardContent()
     saveNewWorkoutButton.disabled = true
     headingAdjustableCard.innerHTML = gettext("Create New Activity Template")
     const modalAddWorkout = document.querySelector('.modal-add-search')
     modalAddWorkout.classList.remove('not-visible')
     modalAddWorkout.style.zIndex = '22000'
     const cardContentParent = document.querySelector('.saved-workouts__added--saved__content')
     let contentToAppend = `
     
          <div class="info-search-saved ">${gettext('Search to fill your template with activity')}.</div>
          <div class="saved-workouts__added--saved__content__workout not-visible">
               <h2 class="your-workout-heading">${gettext('Your Activity')}</h2>
               <div class="saved-workouts__added--saved__content__workout__items"></div>
          </div>
     `
    let saveButtonAppend = `
     <div class="saved-new-workouts-buttons-container not-visible">
        <input type="text" placeholder="${gettext('Activity Name')}" class="workout_name_input input-scale">
        <button class="saved-workouts__added--saved__content__save btn">${gettext('Save')}</button>
    </div>
    
    `
    let addButtonMarkup = `
     <div> 
          <div class="add-new-element-box add-workout-template">
               <div class="add-icon filter-green"></div>
               <a class="saved-template-edit__add-new__trigger-search add-workout-template__trigger-search">${gettext('Add new element for your activity')}</a>
           </div>
     </div>
    `
    cardContentParent.insertAdjacentHTML('afterbegin', addButtonMarkup)
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)
    cardContentParent.insertAdjacentHTML('afterend', saveButtonAppend)
    const addNewElBtn = document.querySelector('.add-workout-template__trigger-search')
    addNewElBtn.addEventListener('click', () => {
        modalAddWorkout.style.zIndex = '22000'
        modalAddWorkout.classList.remove('not-visible')
    })
    const inputNameElement = document.querySelector('.workout_name_input')
    inputNameElement.addEventListener('input', e => {
        if(e.target.value.length < 3) {
            inputNameElement.classList.add('color-error')
        }
        else {
            inputNameElement.classList.remove('color-error')
        }
    })
    const searchInput = document.querySelector('.modal-add-search__content__search-bar')
    searchInput.addEventListener('input', e => {
        const searchValue = e.target.value
        const searchResponseBox = document.querySelector('.modal-add-search__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCall(searchValue, searchResponseBox)
    })
    const workoutSaveButton = document.querySelector('.saved-workouts__added--saved__content__save')
    workoutSaveButton.addEventListener('click', e => {
        const workoutItems = document.querySelector('.saved-workouts__added--saved__content__workout__items').children
        const inputNameEl = document.querySelector('.workout_name_input')
        const inputsQuantity = document.querySelectorAll('.new-today-workout-input-quantity')
        let isValid = true
        inputsQuantity.forEach(inputEl => {
            if(!inputEl.value || inputEl.value.length === 0 || inputEl.value === '') {
                isValid = false
                inputEl.classList.add('color-error')
                inputEl.classList.toggle('shake-animation')
                shakeAnimation(inputEl)
                setTimeout(function () {
                    inputEl.classList.remove('color-error')
                }, 1500);
            }
        })
        if (workoutItems.length > 0 && inputNameEl.value && inputNameEl.value.length > 3 && isValid) {
            saveNewWorkout()
        }
        else {
            inputNameEl.classList.add('color-error')
            inputNameEl.parentElement.classList.toggle('shake-animation')
            shakeAnimation(inputNameEl.parentElement)
            setTimeout(function () {
                inputNameElement.classList.remove('color-error')
            }, 1500);

        }
    })
})

// manage
editButtons.forEach(button => button.addEventListener('click', e => {
    if (!isCardVisible) {
        document.querySelector('.saved-workouts-layout-container').classList.remove('not-expanded')
        document.querySelector('.saved-workouts-layout-container').classList.add('expanded')
        searchContainer.style.gridColumn = '1/2'
        searchContainer.style.removeProperty('width')
        searchContainer.style.removeProperty('justify-self')
        $(searchContainer).addClass('animate-left').on("animationend", function(){
            $(this).removeClass('animate-left');
         });
        adjustableCard.classList.remove('not-visible')
        isCardVisible = true
    }
    $(adjustableCard).addClass('animate').on("animationend", function(){
            $(this).removeClass('animate');
    });
    clearCardContent()
    headingAdjustableCard.innerHTML = gettext(`Edit Activity`)
    const objectToEditId = button.dataset.activity;
    getTemplateElement(objectToEditId)
}))


// delete
deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
        const workoutTemplateId = e.target.dataset.activity
        deleteWorkoutTemplate(workoutTemplateId)
    })
})

// animations
const animateDeletingElementByClass = (elementClass, duration) => {
    const element = document.querySelector(elementClass)
     if (!element.classList.contains('not-visible')) {
         $(elementClass).animate({
                top: '-15rem',
                opacity: '0',

            }, 300)
             setTimeout(function () {
                 element.classList.add('not-visible')
                 element.style.removeProperty('display')
                 element.style.removeProperty('opacity')
                element.style.removeProperty('top')
             }, duration)
     }
     else {
            element.style.removeProperty('opacity')
            element.style.removeProperty('top')
            element.classList.remove('not-visible')
            element.style.removeProperty('display')
        }
}


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}


