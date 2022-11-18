// fix bg - video stretch and nav adjustments
const navBarEl = document.querySelector('.navbar--dashboard')
navBarEl.style.marginTop = '0'
navBarEl.style.paddingTop = '3rem'
///

const updateSummary = () => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/get/saved-workout/daily-summary`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response) {
            const items = document.querySelectorAll('.modal__today-workouts-list__content__elements__item')
            if (items.length > 0){
                const dailySummary = document.querySelector('.modal__today-workouts-list__daily-summary')
                const kcal = dailySummary.querySelector('.kcal')
                const duration = dailySummary.querySelector('.duration')
                if (dailySummary) {
                    kcal.innerHTML = response.kcalBurntSum
                    duration.innerHTML =  response.durationSum + ' min'
                }
            }
        },
    })
}


function hideModal(modalClass) {
    $("." + modalClass).fadeOut(900, e => {
         const modal = document.querySelector(`.${modalClass}`)
         modal.classList.add('not-visible')
         modal.style.removeProperty('display')
    });
}

let openModal = function (modalClass) {
        const el = document.querySelector(modalClass);
        if (modalClass === '.modal__today-workouts-list'){
            updateSummary()
        }
        el.classList.remove('not-visible')
        el.classList.add('modal-active')
        // let Mwidth = div.offsetWidth;
        // let Mheight = div.offsetHeight;
        // let Wwidth = window.innerWidth;
        // let Wheight = window.innerHeight;
        // div.style.position = "absolute";
        // div.style.top = ((Wheight - Mheight ) / 2 +window.pageYOffset ) + "px";
        // div.style.left = ((Wwidth - Mwidth) / 2 +window.pageXOffset ) + "px";
        // $(modalClass).on('scroll touchmove mousewheel', function(e){
        //   e.preventDefault();
        //   e.stopPropagation();
        //   return false;
        // })

};


const mealsVideo = document.getElementById('add-meals-video')
const navbar = document.querySelector('.navbar--dashboard')

const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

const checkYourWorkoutsBtn = document.querySelector('.check-today-workouts')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.5;
}

// animations
const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}


// save
const saveWorkout = (exercises, workoutId) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/save/added-workout`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'exercisesArray': exercises,
            'workoutId': workoutId,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response) {
                const status = response.status
                if (status === 201) {
                    openModal('.modal-queued')
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
}
const ajaxCallSave = (workoutItems) => {
    let exercisesArr = []
    const langPrefix = window.location.href.split('/')[3];
    $.ajax({
        type: 'GET',
        url: `/${langPrefix}/workouts/data/save/workout`,
        success: function (response) {
            const workoutId = response.workoutId
            workoutItems.forEach(item => {
                const parent = item.children[2]
                const inputValue = parent.children[0].value
                let obj
                const objectTemplate = item.dataset?.objecttemplate
                const object = item.dataset?.object
                if (objectTemplate){
                    const workoutObj = JSON.parse(decodeURIComponent(item.dataset.objecttemplate));
                     obj = {
                        'type': 'templateElement',
                        'id': workoutObj,
                        'quantity': inputValue,
                    }
                }
               else if (object){
                   const workoutObj = JSON.parse(decodeURIComponent(item.dataset.object));
                   obj = {
                        'type': 'exerciseElement',
                        'id': workoutObj.id,
                        'quantity': inputValue,
                    }
                }
                exercisesArr.push(obj)
               })
                saveWorkout(JSON.stringify(exercisesArr), workoutId)
        },
    })
}
// search
const ajaxCallSearch = (query) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/live-search-exercises`
    const searchResponseBox = document.querySelector('.add-workouts__search__results__container')

    $.ajax({
        type: "GET",
        url: url,
        data: {
            'query': query,
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
               searchResponseBox.innerHTML = ``
               let exercises = [...response.exercises]
               exercises.forEach(exercise => {
                   let contentToAppend
                   const langPrefix = window.location.href.split('/')[3];
                   let categoryName
                   let exerciseName

                   if (langPrefix === 'pl'){
                       categoryName = exercise.category_name_pl
                       exerciseName = exercise.pl_name
                   }
                   else {
                       categoryName = exercise.category_name_en
                       exerciseName = exercise.en_name
                   }

                    contentToAppend = `
                    <div class="add-workouts__search__results__container__item">
                        <p><b>${exerciseName}</b></p>
                        <div data-object='${encodeURIComponent(JSON.stringify(exercise))}' id='${exercise.id}' class="new-workout-item-add add-icon filter-green"></div>
                        <small class="search-category-small">${gettext('Category')}: <span class="search-category-small__text">${categoryName}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                // after clicking + on search
                const addButtons = document.querySelectorAll('.new-workout-item-add')
                addButtons.forEach(button => {
                    button.addEventListener('click', e =>{

                        const workoutContent = document.querySelector('.add-workouts__added--added__content')
                        const getWorkoutObject = JSON.parse(decodeURIComponent(e.target.dataset.object));
                        const langPrefix = window.location.href.split('/')[3];
                        const allCompositionItems = document.querySelectorAll('.add-workouts__added--added__content__item')
                        let isAlreadyAdded = false
                        allCompositionItems.forEach(item => {
                            const itemPk = item.dataset.pk
                            if (parseInt(itemPk) === getWorkoutObject.id){
                                isAlreadyAdded = true
                            }
                        })
                        if (!isAlreadyAdded) {
                            let workoutName
                            let unitName
                            if (langPrefix === 'pl') {
                                workoutName = getWorkoutObject.pl_name
                                unitName = getWorkoutObject.time_unit_pl
                            }
                            else {
                                workoutName = getWorkoutObject.en_name
                                unitName = getWorkoutObject.time_unit_en
                            }
                            const infoResults = document.querySelector('.saved-results-info')
                            infoResults.classList.add('not-visible')
                            const workoutItemAppend = `
                                   <div data-object="${e.target.dataset.object}" class="add-workouts__added--added__content__item" data-pk="${getWorkoutObject.id}">
                                       <p><b>${workoutName}</b></p>
                                      <div class="today-workouts-added-remove-btn temporary-workout-today remove-icon filter-red"></div>
                                      <div class="today-workouts-added-inputBox">
                                        <input min="1" max="1000" class="new-today-workout-input-quantity" name="${workoutName}" type="number" placeholder="${unitName}">
                                        <label for="${workoutName}">x ${unitName}</label>
                                      </div>
                            </div>
                          `
                            workoutContent.insertAdjacentHTML('beforeend', workoutItemAppend)
                            const removeAddedBtn = document.querySelectorAll('.temporary-workout-today')
                            removeAddedBtn.forEach(button => {
                                button.addEventListener('click', e => {
                                    const parentEl = button.parentNode
                                    if(workoutContent.children.length === 2) {
                                        const infoResults = document.querySelector('.saved-results-info')
                                        infoResults.classList.remove('not-visible')
                                    }
                                    parentEl.remove()
                                })
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
                searchResponseBox.innerHTML = `<h3 class="search-results-info">${gettext('No search results.')}</h3>`
            }

            },
        error: function (error) {
            searchResponseBox.innerHTML = `<h3 class="search-results-info">${gettext('No search results.')}</h3>`
            const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
        },
    })
}
const ajaxCallSearchTemplate = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = `/${langPrefix}/workouts/data/get/saved-workout/template`
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
           const infoResults = document.querySelector('.saved-results-info')
           infoResults.classList.add('not-visible')
           const langPrefix = window.location.href.split('/')[3];
           const allCompositionItems = document.querySelectorAll('.add-workouts__added--added__content__item')
           let isAlreadyAdded = false
           allCompositionItems.forEach(item => {
               const itemPk = item.dataset.pk
               if (parseInt(itemPk) === parseInt(workoutObj.workoutId)){
                   isAlreadyAdded = true
               }
           })
           if(!isAlreadyAdded) {
               let placeholder
               if (langPrefix === 'pl') {
                   placeholder = 'razy'
               }
               else {
                   placeholder = 'times'
               }
               const workoutItemAppend = `
                <div data-objectTemplate="${encodeURIComponent(JSON.stringify(workoutObj.workout_elements_ids))}" class="add-workouts__added--added__content__item" data-pk="${workoutObj.workoutId}">
                    <p><b>${workoutName}</b> (${Math.trunc(kcal)} kcal)</p>
                    <div class="today-workouts-added-remove-btn temporary-workout-today remove-icon filter-red"></div>
                    <div class="today-workouts-added-inputBox">
                        <input min="1" max="1000" class="new-today-workout-input-quantity" name="${workoutName}-${workoutObj.workoutId}" type="number" placeholder="${placeholder}">
                        <label for="${workoutName}-${workoutObj.workoutId}">x ${placeholder}</label>
                    </div>
                </div>
                `
                const workoutContent = document.querySelector('.add-workouts__added--added__content')
                workoutContent.insertAdjacentHTML('beforeend', workoutItemAppend)
                const removeAddedBtn = document.querySelectorAll('.temporary-workout-today')
                    removeAddedBtn.forEach(button => {
                        button.addEventListener('click', () => {
                            const parentEl = button.parentNode
                            if(workoutContent.children.length === 2) {
                                const infoResults = document.querySelector('.saved-results-info')
                                infoResults.classList.remove('not-visible')
                            }
                            parentEl.remove()
                        })
                 })
           }
        },
    })
}


// delete
const ajaxCallDeleteWorkout = (workoutId) => {
       const langPrefix = window.location.href.split('/')[3];
       const url = location.origin + `/${langPrefix}/workouts/data/delete/added-workout`
       $.ajax({
        type: "POST",
        url: url,
        data: {
            'workout_id': workoutId,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response){
            openModal('.modal__today-workouts-list')
        }
    })
}
const ajaxCallDeleteWorkoutElement = (elementId) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = location.origin + `/${langPrefix}/workouts/data/delete/added-workout/element`
     $.ajax({
        type: "POST",
        url: url,
        data: {
            'workout_element_id': elementId,
            'csrfmiddlewaretoken': csrfToken,
        },
    })
}


// listeners
const alreadySavedButtons = document.querySelectorAll('.workout-saved')
alreadySavedButtons?.forEach(button => {

    button.addEventListener('click', () => {
        const workoutId = button.dataset.workoutobjid
        openModal('.modal-accept-delete')
        const acceptBtn = document.querySelector('.accept-delete-today-workout')
        const denyBtn = document.querySelector('.deny-delete-today-workout')
        const modalCloseBtn = document.querySelector('.modal-accept-delete-close')
        denyBtn.addEventListener('click', () => {
             hideModal('modal-accept-delete')
        })
        modalCloseBtn.addEventListener('click', () => {
             hideModal('modal-accept-delete')
        })
        acceptBtn.addEventListener('click', () => {
            ajaxCallDelete(workoutId)
            updateSummary()
            const alreadyAddedBox = document.querySelector('.add-workouts__already__added')
            const temporaryMealContent = document.querySelector('.add-workouts__added--added__content')
            const heading = document.querySelector('.workouts-on-date')
            const summary = document.querySelector('.modal__today-workouts-list__daily-summary')
            const item = button.parentElement
            item.remove()
            hideModal('modal-accept-delete')
            modal.style.zIndex = '1'
            openModal('.modal-queued__today-meals-list')
            if (alreadyAddedBox.children.length === 0) {
                button.remove()
                heading.remove()
                summary.remove()
                const items = temporaryMealContent.querySelectorAll('.add-meals__added--added__content__item')
                items.forEach(item => {
                    item.remove()
                })
                alreadyAddedBox.remove()
                const infoResults = document.querySelector('.saved-results-info')
                infoResults.classList.remove('not-visible')
                 let contentToAppend = `
                 <p class="no-saved-templates-info" style="color: rgba(255,255,255, 0.75);">${gettext('No activities added for today...')}</p>
                `
                const modalContentBox = document.querySelector('.modal__today-workouts-list__content')
                modalContentBox.insertAdjacentHTML('beforeend', contentToAppend)
            }
        })
    })
})


const searchInput = document.querySelector('.search-workout-add')
searchInput.addEventListener('input', e => {
    const searchQuery = e.target.value
    const searchResponseBox = document.querySelector('.add-workouts__search__results__container')
    if (searchQuery !== '' ) {
        ajaxCallSearch(searchQuery)

    }
    else {
        searchResponseBox.innerHTML = `<h3 class="search-results-info" style="text-align: center">${gettext('Try to search exercise or exercises that have you eaten today.')}
        <br>${gettext('Results will appear here.')}</h3>`
    }
})


const saveWorkoutBtn = document.querySelector('.save-add-today-workouts')
saveWorkoutBtn.addEventListener('click', () => {
    const workoutsItems = Array.from(document.querySelectorAll('.add-workouts__added--added__content__item'))
    const quantityInputs = document.querySelectorAll('.new-today-workout-input-quantity')
    let inputsValid = true
    quantityInputs.forEach(inputEl => {
        if(!inputEl.value || inputEl.value.length === 0 || inputEl.value === '') {
            inputEl.classList.add('color-error')
            inputEl.classList.toggle('shake-animation')
            shakeAnimation(inputEl)
            setTimeout(function () {
                inputEl.classList.remove('color-error')
            }, 1500);
            inputsValid = false
        }
    })
    if(workoutsItems.length > 0 && inputsValid) {
        ajaxCallSave(workoutsItems)
    }
})


const savedTemplateItems = document.querySelectorAll('.add-workouts__added--saved__content__item')
savedTemplateItems.forEach(item => {
    const addSavedButton = item.children[1]
    addSavedButton.addEventListener('click', e => {
        let workoutTemplateObjId = item.dataset.objectid
        ajaxCallSearchTemplate(workoutTemplateObjId)
    })
})

checkYourWorkoutsBtn.addEventListener('click', () => {
    openModal('.modal__today-workouts-list')
})

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
const openModalAcceptDeny = (handler, id, button) => {
        openModal('.modal-accept-delete')
        const modalAccept = document.querySelector('.modal-accept-delete')
        modalAccept.style.zIndex = '45000'
        const acceptBtn = document.querySelector('.accept-delete-today-workouts')
        const denyBtn = document.querySelector('.deny-delete-today-workouts')
        const closeBtn = document.querySelector('.modal-accept-delete-close')
        closeBtn.addEventListener('click', () => {
             hideModal('modal-accept-delete')
             modalAccept.style.zIndex = '1'
             openModal('.modal__today-workouts-list')
        })
        acceptBtn.addEventListener('click', () => {
            handler(id)
            updateSummary()
            const alreadyAddedBox = document.querySelector('.modal__today-workouts-list__content__elements')
            const temporaryMealContent = document.querySelector('.add-workouts__added--added__content')
            const heading = document.querySelector('.workouts-on-date')
            const summary = document.querySelector('.modal__today-workouts-list__daily-summary')
            const item = button.parentElement
            item.remove()
            hideModal('modal-accept-delete')
            const modal = document.querySelector('.modal-accept-delete')
            modal.style.zIndex = '1'
            openModal('.modal__today-workouts-list')
               if (alreadyAddedBox.children.length === 0) {
                button.remove()
                heading.remove()
                alreadyAddedBox.remove()
                summary.remove()
                const items = temporaryMealContent.querySelectorAll('.add-workouts__added--added__content__item')
                items.forEach(item => {
                    item.remove()
                })
                const infoResults = document.querySelector('.saved-results-info')
                infoResults.classList.remove('not-visible')
                let contentToAppend = `
                 <p class="no-saved-templates-info" style="color: rgba(255,255,255, 0.75);">${gettext('No activities added for today...')}</p>
                `
                const modalContentBox = document.querySelector('.modal__today-workouts-list__content')
                modalContentBox.insertAdjacentHTML('beforeend', contentToAppend)
            }
        })
        denyBtn.addEventListener('click', () => {
             hideModal('modal-accept-delete')
             modalAccept.style.zIndex = '1'
             openModal('.modal__today-workouts-list')
        })
}

const modalCloseTodayWorkouts = document.querySelector('.modal__today-workouts-list__close-button')
modalCloseTodayWorkouts.addEventListener('click', () => {
    animateDeletingElementByClass('.modal__today-workouts-list', 1200)
})

const removeWorkoutBtns = document.querySelectorAll('.remove-workout')
removeWorkoutBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const workoutId = e.target.dataset.workoutobjid
        openModalAcceptDeny(ajaxCallDeleteWorkout, workoutId, e.target)
    })
})

const removeWorkoutElementBtns = document.querySelectorAll('.remove-workout-element')
removeWorkoutElementBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const workoutElementId = e.target.dataset.workoutelobjid
        openModalAcceptDeny(ajaxCallDeleteWorkoutElement, workoutElementId, e.target)
    })
})