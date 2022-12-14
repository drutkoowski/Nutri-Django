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
            success: function (response){
                console.log(response)
            }
        })
        console.log(name, difficulty,duration,servings, stepsArr,ingObjArr)
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
                <img src="/static/images/svg/minus.svg" class="filter-red" alt="Remove Icon">
            </div>
        `
        addedStepsBox.insertAdjacentHTML('beforeend', recipeStep)
        const temporaryInput = addedStepsBox.querySelector('#temporary-id')
        temporaryInput.addEventListener('input', () => {
            temporaryInput.value = temporaryInput.value.slice(0,120)
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
             <img src="/static/images/svg/minus.svg" class="filter-red" alt="Remove Icon">
           </div>
        `
        addedIngredientsBox.insertAdjacentHTML('afterbegin', recipeIngredient)
        const quantityTemporary = addedIngredientsBox.querySelector('#temporary-ig-quantity')
        const ingredientTemporary = addedIngredientsBox.querySelector('#temporary-ig-quantity')
        quantityTemporary.addEventListener('input', () => {
            quantityTemporary.value = quantityTemporary.value.slice(0,25)
        })
        ingredientTemporary.addEventListener('input', () => {
            ingredientTemporary.value = ingredientTemporary.value.slice(0,70)
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