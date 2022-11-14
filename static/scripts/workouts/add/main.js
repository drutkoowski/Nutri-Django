// fix bg - video stretch and nav adjustments
const navBarEl = document.querySelector('.navbar--dashboard')
navBarEl.style.marginTop = '0'
navBarEl.style.paddingTop = '3rem'
///

function hideModal(modalClass) {
    $("." + modalClass).fadeOut(900, e => {
         const modal = document.querySelector(`.${modalClass}`)
         modal.classList.add('not-visible')
         modal.style.removeProperty('display')
    });
}

let openModal = function (modalClass) {
        let div = document.querySelector(modalClass);
        div.classList.remove('not-visible')
        div.classList.add('modal-active')
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
const saveWorkout = (exercises) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/save/added-workout`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'exercisesArray': exercises,
            'csrfmiddlewaretoken': csrfToken,
        },
    })
}
const ajaxCallSave = (workoutItems) => {
    let exercisesArr = []
    workoutItems.forEach(item => {
        if (item.dataset.objecttemplate) {
            const workoutObj = JSON.parse(decodeURIComponent(item.dataset.objecttemplate));
            const parent = item.children[2]
            const inputValue = parent.children[0].value
            workoutObj.forEach(el => {
                getWorkoutTemplateElement(el, inputValue)
            })
        }
        else if (item.dataset.object) {
            const workoutObj = JSON.parse(decodeURIComponent(item.dataset.object));
            const parent = item.children[2]
            const inputValue = parent.children[0].value
            let obj = {
                'exerciseId': workoutObj.id,
                'quantity': inputValue,
            }
            exercisesArr.push(obj)
        }
    })
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/save/added-workout`
    const exercises = JSON.stringify(exercisesArr)
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'exercisesArray': exercises,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response){
            const status = response.status
            if (status === 201) {
                openModal('.modal-queued')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                closeModalBtn.addEventListener('click', e => {
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                }, 2500);

            }
            else if (status === 404) {
                // const searchElements = Array.from(searchResponseBox.children)
                // searchElements.forEach(el => {
                //     el.remove()
                // })
            }

            },
        error: function (error) {
            // const searchElements = Array.from(searchResponseBox.children)
            //     searchElements.forEach(el => {
            //         el.remove()
            //     })
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
                               <div data-object="${e.target.dataset.object}" class="add-workouts__added--added__content__item">
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
                                if(workoutContent.children.length === 1) {
                                    const infoResults = document.querySelector('.saved-results-info')
                                    infoResults.classList.remove('not-visible')
                                }
                                parentEl.remove()
                            })
                        })
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

const getWorkoutTemplateElement = (id, inputValue) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/workouts/data/get/saved-workout/template/element`
    $.ajax({
        'type': 'get',
         url: url,
         data: {
            'mealElementId': id,
         },
        success: function (response){
            const exercises_arr = []
            const obj = JSON.parse(response['workoutTemplateElement'])
            const exercise_id = obj.exerciseId
            const quantity = obj.quantity * inputValue
            let workout_obj = {
                'exerciseId': exercise_id,
                'quantity': quantity,
            }
            exercises_arr.push(workout_obj)
            saveWorkout(JSON.stringify(exercises_arr))
        },
        error: function (error){

        }
    })
}
const ajaxCallSearchTemplate = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = `/${langPrefix}/workouts/data/get/saved-workout/template`
    $.ajax({
        "type": "GET",
        url: url,
        data: {
            "templateId": id,
        },
        success: function (response) {
           const workoutObj = JSON.parse(response.workoutTemplateObj)
           const workoutName = workoutObj.workout_name
           const kcal = workoutObj.kcal
           const infoResults = document.querySelector('.saved-results-info')
           infoResults.classList.add('not-visible')
           const langPrefix = window.location.href.split('/')[3];
           let placeholder
           if (langPrefix === 'pl') {
               placeholder = 'Sztuk'
           }
           else {
               placeholder = 'Pieces'
           }
           const workoutItemAppend = `
                <div data-objectTemplate="${encodeURIComponent(JSON.stringify(workoutObj.workout_elements_ids))}" class="add-workouts__added--added__content__item">
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
                button.addEventListener('click', e => {
                    const parentEl = button.parentNode
                    if(workoutContent.children.length === 1) {
                        const infoResults = document.querySelector('.saved-results-info')
                        infoResults.classList.remove('not-visible')
                    }
                    parentEl.remove()
                })
         })
        },
        error: function (error) {

        }
    })
}


// delete
const ajaxCallDelete = (workoutId) => {
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
            const status = response.status
            if (status === 200) {
               location.reload()
            }
            },
    })
}



// listeners
const alreadySavedButtons = document.querySelectorAll('.workout-saved')
alreadySavedButtons?.forEach(button => {

    button.addEventListener('click', e=> {
        const workoutId = button.dataset.workoutobjid
        openModal('.modal-accept-delete')
        const acceptBtn = document.querySelector('.accept-delete-today-workout')
        const denyBtn = document.querySelector('.deny-delete-today-workout')
        const modalCloseBtn = document.querySelector('.modal-accept-delete-close')
         denyBtn.addEventListener('click', e => {
             hideModal('modal-accept-delete')
        })
         modalCloseBtn.addEventListener('click', e => {
             hideModal('modal-accept-delete')

        })
        acceptBtn.addEventListener('click', e => {
            ajaxCallDelete(workoutId)
            const alreadyAddedBox = document.querySelector('.add-workouts__already__added')
            const heading = document.querySelector('.workouts-on-date')
            const item = button.parentElement
            item.remove()
            hideModal('modal-accept-delete')
            if (alreadyAddedBox.children.length === 0) {
                button.remove()
                heading.remove()
                alreadyAddedBox.remove()
                const infoResults = document.querySelector('.saved-results-info')
                infoResults.classList.remove('not-visible')
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
saveWorkoutBtn.addEventListener('click', e => {
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

checkYourWorkoutsBtn.addEventListener('click', e => {
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

const modalCloseTodayWorkouts = document.querySelector('.modal__today-workouts-list__close-button')
modalCloseTodayWorkouts.addEventListener('click', e => {
    animateDeletingElementByClass('.modal__today-workouts-list', 1200)
})

const removeWorkoutBtns = document.querySelectorAll('.remove-workout')
removeWorkoutBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const workoutId = e.target.dataset.workoutobjid
        const modalAccept = document.querySelector('.modal-accept-delete')
        modalAccept.classList.remove('not-visible')
        modalAccept.style.zIndex = '45000'
        const acceptBtn = document.querySelector('.accept-delete-today-workouts')
        const denyBtn = document.querySelector('.deny-delete-today-workouts')
        const closeBtn = document.querySelector('.modal-accept-delete-close')
        closeBtn.addEventListener('click', e => {
             $('.modal-accept-delete').css('z-index', 'initial');
             hideModal('.modal-accept-delete')
        })
        acceptBtn.addEventListener('click', e => {
            ajaxCallDelete(workoutId)
        })
        denyBtn.addEventListener('click', e => {
            $('.modal-accept-delete').css('z-index', 'initial');
            hideModal('.modal-accept-delete')
        })
    })
})

