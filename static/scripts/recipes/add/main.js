// navbar
const navbar = document.querySelector('.navbar--dashboard')
navbar.classList.toggle('fix-navbar')
// static
const staticPath = document.querySelector('#static-path').value
// csrf
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
// inputs & validation
const durationInput = document.querySelector('#duration')
const recipeNameInput =  document.querySelector('#name')
const difficultyInput = document.querySelector('#difficulty')
const servingsInput = document.querySelector('#servings')
// steps
const stepCreatingInput = document.querySelector('#step-element')
const stepCreatingButton = document.querySelector('#add-step')
// ingredient
const ingredientCreatingQuantityInput = document.querySelector('#quantity-ingredient')
const ingredientCreatingInput = document.querySelector('#ingredient-element')
const ingredientCreatingButton = document.querySelector('#add-ingredient')
// save recipe button
const saveRecipeBtn = document.querySelector('.new-recipe-add')
saveRecipeBtn.addEventListener('click', () => {
    let isValid = true
    const name = recipeNameInput.value
    const difficulty = difficultyInput.value
    const duration = durationInput.value
    const servings = servingsInput.value
    if (name.length < 3) {
        isValid = false
        recipeNameInput.classList.add('color-error')
        recipeNameInput.classList.toggle('shake-animation')
        shakeAnimation(recipeNameInput)
        setTimeout(function () {
            recipeNameInput.classList.remove('color-error')
        }, 1500);
    }
    if (duration.length === 0) {
        isValid = false
        durationInput.classList.add('color-error')
        durationInput.classList.toggle('shake-animation')
        shakeAnimation(durationInput)
        setTimeout(function () {
            durationInput.classList.remove('color-error')
        }, 1500);
    }
    const stepsBox = document.querySelector('.recipe-add__search__container__steps__elements-box__already-added')
    const ingredientsBox = document.querySelector('.recipe-add__search__container__ingredients__elements-box__already-added')
    if (stepsBox.children.length === 0 ){
        isValid = false
        const parentBox = document.querySelector('.recipe-add__search__container__steps')
        parentBox.classList.add('color-error')
        parentBox.classList.toggle('shake-animation')
        shakeAnimation(parentBox)
        setTimeout(function () {
            parentBox.classList.remove('color-error')
        }, 1500);
    }
    if (ingredientsBox.children.length === 0){
        isValid = false
        const parentBox = document.querySelector('.recipe-add__search__container__ingredients')
        parentBox.classList.add('color-error')
        parentBox.classList.toggle('shake-animation')
        shakeAnimation(parentBox)
        setTimeout(function () {
            parentBox.classList.remove('color-error')
        }, 1500);
    }
    if (isValid){
        const stepsArr = []
        const ingObjArr = []
        const steps = document.querySelectorAll('.step-element-added')
        steps.forEach(step => {
            const stepValue = step.value
            stepsArr.push(stepValue)
        })
        const ingredientElements = document.querySelectorAll('.recipe-add__search__container__ingredients__elements-box__already-added__element')
        ingredientElements.forEach(element => {
            const quantity = element.querySelector('.ingredient-quantity-input').value
            const ingredientName = element.querySelector('.ingredient-element-input').value
            const ingObj = {
                'ingredient': ingredientName,
                'quantity': quantity
            }
            ingObjArr.push(ingObj)
        })
        const url = window.location.origin + `/${langPrefix}/recipes/save/new-recipe`
        let functionTimeExecutionCounter
        const loader = document.querySelector('.loader-message')
        loader.classList.remove('not-visible')
        loader.style.transition = 'unset'
        loader.style.opacity = '0.95'
        $.ajax({
            type: 'post',
            url: url,
            data: {
                'csrfmiddlewaretoken': csrfToken,
                'recipeName': name,
                'recipeDifficulty': difficulty,
                'recipeDuration': `${duration} min.`,
                'recipeServings': servings,
                'recipeSteps': JSON.stringify(stepsArr),
                'recipeIngredients': JSON.stringify(ingObjArr)
            },
            beforeSend: function (){
              let start = new Date().getTime();
              functionTimeExecutionCounter = setInterval(function (){
                const loaderMsg = document.querySelector('.loader-message__message')
                const divParent = loaderMsg.parentElement.getBoundingClientRect()
                let end = new Date().getTime();
                let time = (end - start) / 1000;
                if (time >= 1 && time < 4){
                    loaderMsg.innerHTML = gettext('Adding recipe into the database')
                    loaderMsg.style.removeProperty('left')
                    const loaderY = (loaderMsg.getBoundingClientRect().left) - divParent.left + 37.5 - loaderMsg.clientWidth / 2;
                    loaderMsg.style.left = `${loaderY}px`
                }
                else if (time >= 4 && time < 10){
                    loaderMsg.innerHTML = gettext('Translating and formating recipe')
                    loaderMsg.style.removeProperty('left')
                    const loaderY = (loaderMsg.getBoundingClientRect().left) - divParent.left + 37.5 - loaderMsg.clientWidth / 2;
                    loaderMsg.style.left = `${loaderY}px`
                }
                else if (time >= 10 && time < 14){
                    loaderMsg.innerHTML = gettext('It takes longer than usual, be patient')
                    loaderMsg.style.removeProperty('left')
                    const loaderY = (loaderMsg.getBoundingClientRect().left) - divParent.left + 37.5 - loaderMsg.clientWidth / 2;
                    loaderMsg.style.left = `${loaderY}px`

                }
                else if (time >= 14){
                    loaderMsg.innerHTML = gettext('Something went wrong...')
                    loaderMsg.style.removeProperty('left')
                    const loaderY = (loaderMsg.getBoundingClientRect().left) - divParent.left + 37.5 - loaderMsg.clientWidth / 2;
                    loaderMsg.style.left = `${loaderY}px`
                }
              }, 1000)
            },
            success: function (response){
                // const modal = document.querySelector('.modal-signup')
                // modal.classList.remove('not-visible')
                // setTimeout(function (){
                //     location.reload()
                // }, 2500)
                // location.reload()
            },
            complete: function (res){
                 clearInterval(functionTimeExecutionCounter)
                 setTimeout(function (){
                    loader.classList.add('not-visible')
                    loader.style.removeProperty('transition')
                    loader.style.removeProperty('opacity')
                }, 1500)
            }
        })

    }
    else {
        const errorMsg = document.querySelector('.recipe-add-error-msg')
        errorMsg.style.removeProperty('visibility')
        $(errorMsg).fadeIn(900)
        errorMsg.innerHTML = gettext('Fill out all the indicated forms.')
        setTimeout(function (){
            $(errorMsg).fadeOut(900, () => {
                errorMsg.style.removeProperty('display')
            })
            errorMsg.innerHTML = ''
        }, 4000)

        errorMsg.innerHTML = gettext('Fill out all the indicated forms.')
    }
})


durationInput.addEventListener('input', () => {
    durationInput.value = durationInput.value.slice(0,3)
})

recipeNameInput.addEventListener('input', () => {
    recipeNameInput.value = recipeNameInput.value.slice(0,49)
})

ingredientCreatingQuantityInput.addEventListener('input', () => {
    ingredientCreatingQuantityInput.value = ingredientCreatingQuantityInput.value.slice(0,25)
})

ingredientCreatingInput.addEventListener('input', () => {
    ingredientCreatingInput.value = ingredientCreatingInput.value.slice(0,70)
})

stepCreatingInput.addEventListener('input', () => {
    stepCreatingInput.value = stepCreatingInput.value.slice(0,120)
})

const langPrefix = window.location.href.split('/')[3];

// step creating functionality

stepCreatingButton.addEventListener('click', () => {
    const stepValue = stepCreatingInput.value
    if (stepValue.length > 8){
        stepCreatingInput.value = ''
        const addedStepsBox = document.querySelector('.recipe-add__search__container__steps__elements-box__already-added')
        const recipeStep = `
            <div class="recipe-add__search__container__steps__elements-box__already-added__element">
                <input type="text" class="step-element-added recipes-add__text-input__step" id="temporary-id" value="${stepValue}">
                <img src="${staticPath}images/svg/minus.svg" class="filter-red" alt="Remove Icon">
            </div>
        `
        addedStepsBox.insertAdjacentHTML('beforeend', recipeStep)
        const temporaryInput = addedStepsBox.querySelector('#temporary-id')
        temporaryInput.addEventListener('input', () => {
            temporaryInput.value = temporaryInput.value.slice(0,120)
            if (temporaryInput.value.length <= 8) {
                const parent = temporaryInput.parentElement
                parent.remove()
            }
        })
        const removeIcon = addedStepsBox.getElementsByTagName('img')[0]
        removeIcon.addEventListener('click', () => {
            const parent = removeIcon.parentElement
            parent.remove()
        })
        temporaryInput.removeAttribute('id')
    }
    else {
        stepCreatingInput.classList.add('color-error')
        stepCreatingInput.classList.toggle('shake-animation')
        shakeAnimation(stepCreatingInput)
        setTimeout(function () {
            stepCreatingInput.classList.remove('color-error')
        }, 1500);
        const errorMsg = document.querySelector('.recipe-add__search__container__steps__error-msg')
        $(errorMsg).fadeIn(900)
        errorMsg.innerHTML = gettext('Step description is too short.')
        setTimeout(function (){
            $(errorMsg).fadeOut(900, () => {
                errorMsg.style.removeProperty('display')
            })
            errorMsg.innerHTML = ''
        }, 4000)

        errorMsg.innerHTML = gettext('Step description is too short.')
    }
})

// ingredients creating functionality
ingredientCreatingButton.addEventListener('click', () => {
    const ingredientValue = ingredientCreatingInput.value
    const ingredientQuantityValue = ingredientCreatingQuantityInput.value
    if (ingredientValue.length > 2 && ingredientQuantityValue.length > 1) {
        ingredientCreatingInput.value = ''
        ingredientCreatingQuantityInput.value = ''
        const addedIngredientsBox = document.querySelector('.recipe-add__search__container__ingredients__elements-box__already-added')
        const recipeIngredient = `
           <div class="recipe-add__search__container__ingredients__elements-box__already-added__element">
             <input type="text" class="recipes-add__text-input__ingredient-sm ingredient-quantity-input" id='temporary-ig-value' value="${ingredientQuantityValue}">
             <input type="text" class="recipes-add__text-input__ingredient-lg ingredient-element-input" id='temporary-ig-quantity' value="${ingredientValue}">
             <img src="${staticPath}images/svg/minus.svg" class="filter-red" alt="Remove Icon">
           </div>
        `
        addedIngredientsBox.insertAdjacentHTML('afterbegin', recipeIngredient)
        const quantityTemporary = addedIngredientsBox.querySelector('#temporary-ig-quantity')
        const ingredientTemporary = addedIngredientsBox.querySelector('#temporary-ig-quantity')
        const removeIcon = addedIngredientsBox.getElementsByTagName('img')[0]
        quantityTemporary.addEventListener('input', () => {
            quantityTemporary.value = quantityTemporary.value.slice(0,25)
            if (quantityTemporary.value.length === 0) {
                const parent = quantityTemporary.parentElement
                parent.remove()
            }
        })
        ingredientTemporary.addEventListener('input', () => {
            ingredientTemporary.value = ingredientTemporary.value.slice(0,70)
            if (ingredientTemporary.value.length <= 2) {
                ingredientTemporary.value = ingredientTemporary.value.slice(0,70)
            }
        })
        removeIcon.addEventListener('click', () => {
            const parent = removeIcon.parentElement
            parent.remove()
        })
        quantityTemporary.removeAttribute('id')
        ingredientTemporary.removeAttribute('id')
    }
    else {
        if(ingredientQuantityValue.length === 0 && ingredientValue.length > 2){
            ingredientCreatingQuantityInput.classList.add('color-error')
            ingredientCreatingQuantityInput.classList.toggle('shake-animation')
            shakeAnimation(ingredientCreatingQuantityInput)
            setTimeout(function () {
                ingredientCreatingQuantityInput.classList.remove('color-error')
            }, 1500);
            const errorMsg = document.querySelector('.recipe-add__search__container__ingredients__error-msg')
            $(errorMsg).fadeIn(900)
            errorMsg.innerHTML = gettext('Ingredient quantity is empty.')
            setTimeout(function (){
                $(errorMsg).fadeOut(900, () => {
                    errorMsg.style.removeProperty('display')
                })
                errorMsg.innerHTML = ''
            }, 4000)

            errorMsg.innerHTML = gettext('Ingredient quantity is empty.')
        }
        else if (ingredientValue.length <= 2 && ingredientQuantityValue.length > 0){
            ingredientCreatingInput.classList.add('color-error')
            ingredientCreatingInput.classList.toggle('shake-animation')
            shakeAnimation(ingredientCreatingInput)
            setTimeout(function () {
                ingredientCreatingInput.classList.remove('color-error')
            }, 1500);
            const errorMsg = document.querySelector('.recipe-add__search__container__ingredients__error-msg')
            $(errorMsg).fadeIn(900)
            errorMsg.innerHTML = gettext('Ingredient name is too short.')
            setTimeout(function (){
                $(errorMsg).fadeOut(900, () => {
                    errorMsg.style.removeProperty('display')
                })
                errorMsg.innerHTML = ''
            }, 4000)

            errorMsg.innerHTML = gettext('Ingredient name is too short.')
        }
        else {
            ingredientCreatingInput.classList.add('color-error')
            ingredientCreatingInput.classList.toggle('shake-animation')
            ingredientCreatingQuantityInput.classList.add('color-error')
            ingredientCreatingQuantityInput.classList.toggle('shake-animation')
            shakeAnimation(ingredientCreatingInput)
            shakeAnimation(ingredientCreatingQuantityInput)
            setTimeout(function () {
                ingredientCreatingInput.classList.remove('color-error')
                ingredientCreatingQuantityInput.classList.remove('color-error')
            }, 1500);
            const errorMsg = document.querySelector('.recipe-add__search__container__ingredients__error-msg')
            $(errorMsg).fadeIn(900)
            errorMsg.innerHTML = gettext('Ingredient name and quantity are empty.')
            setTimeout(function (){
                $(errorMsg).fadeOut(900, () => {
                    errorMsg.style.removeProperty('display')

                })
                errorMsg.innerHTML = ''
            }, 4000)
            errorMsg.innerHTML = gettext('Ingredient name and quantity are empty.')
        }
    }
})



// animations
const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}