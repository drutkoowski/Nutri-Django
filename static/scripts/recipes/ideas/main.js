const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')
const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}
// utils
const capitalize = (word) => {
    return word.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
}
const fillModalRecipe = (response) => {
    const recipe = JSON.parse(response['recipe'])
    const headingModal = document.querySelector('.modal-queued__recipe__heading')
    headingModal.innerHTML = recipe.name
    const difficultyBox = document.querySelector('.modal-queued__recipe__difficulty')
    difficultyBox.innerHTML = recipe.difficulty === '' || recipe.difficulty === null ? gettext('Unknown') : recipe.difficulty
    const durationBox = document.querySelector('.modal-queued__recipe__duration')
    durationBox.innerHTML = `${recipe.duration}`
    const personCount = document.querySelector('.modal-queued__recipe__person-count')
    personCount.innerHTML = `${gettext('for')} ${recipe.person_count} ${gettext('persons')}`
    const authorBox = document.querySelector('.modal-queued__recipe__author')
    authorBox.innerHTML = recipe.author
    const closeModalBtn = document.querySelector('.closeRecipeInfoBtn')
    closeModalBtn.addEventListener('click', () => {
        $("." + "modal-queued__recipe").fadeOut(900, () => {
            const modal = document.querySelector(`.modal-queued__recipe`)
            modal.classList.add('not-visible')
            modal.style.removeProperty('display')
            modal.style.zIndex = '0'
        });
    })
    const ingredientsBox = document.querySelector('.modal-queued__recipe__container__main-content__ingredients__elements')
    const stepsBox = document.querySelector('.modal-queued__recipe__container__main-content__steps__elements')
    const ingredientsBoxItems = document.querySelectorAll('.recipe-ingredient-element')
    const stepsBoxItems = document.querySelectorAll('.recipe-step-element')

    ingredientsBoxItems.forEach(item => {
        item.remove()
    })

    stepsBoxItems.forEach(item => {
        item.remove()
    })
    const ingredients = recipe.ingredients
    const steps = recipe.steps
    let stepsIterator = 0
    ingredients.forEach(ingredient => {
        const isQuantity = ingredient.quantity ? '-' : ''
        const ingredientHTML = `
            <p class="recipe-ingredient-element">${capitalize(ingredient.ingredient)} ${isQuantity} ${ingredient.quantity}</p>
        `
        ingredientsBox.insertAdjacentHTML('beforeend', ingredientHTML)
    })
    steps.forEach(step => {
        const stepHTML = `
            <p class="recipe-step-element"><b>${stepsIterator+1}.</b> ${step}</p>
        `
        stepsBox.insertAdjacentHTML('beforeend', stepHTML)
        stepsIterator = stepsIterator + 1
    })
}
// Initials
let alreadySeenDbRecipes = []
let alreadySeenApiRecipes = []

const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}
const loader = document.querySelector('.loader')
loader.classList.add('loader--hidden')

const inputIngredientsBtn = document.querySelector('.add-meals__search__bar__icon')
inputIngredientsBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal-add-search')
    const containerBox = document.querySelector('.recipe-search__search__results__container')
    const inputValue = document.querySelector('.modal-add-search__content__search-bar').value
    if (inputValue !== '') {
        const array = inputValue.split(',');
        const loader = document.querySelector('.loader-message')
        const focusValItem = document.querySelector('.active-icon-focus')
        const focusValue = focusValItem.parentElement.classList[0] === 'maximize' ? 1 : 2
        loader.classList.remove('not-visible')
        loader.style.transition = 'unset'
        loader.style.opacity = '0.95'
        const langPrefix = window.location.href.split('/')[3];
        const url = location.origin + `/${langPrefix}/recipes/get-recipes-by-ingredients`
        let functionTimeExecutionCounter
        $.ajax({
        type: 'POST',
        url: url,
        data: {
             'ingredients': JSON.stringify(array),
             'ingredientsString': JSON.stringify(inputValue),
             'focusOn': focusValue,
             'blockedSuggestionsArray': JSON.stringify(alreadySeenApiRecipes),
             'blockedDbSuggestionsArray': JSON.stringify(alreadySeenDbRecipes),
             'csrfmiddlewaretoken': csrfToken
        },
        beforeSend: function (){
          const loaderMsg = document.querySelector('.loader-message__message')
          let start = new Date().getTime();
          functionTimeExecutionCounter = setInterval(function (){
            let end = new Date().getTime();
            let time = (end - start) / 1000;
            if (time >= 1 && time < 4){
                loaderMsg.innerHTML = gettext('Searching for recipes in our database')
                if (langPrefix === 'pl'){
                    loaderMsg.style.left = '-6.5rem'
                }
            }
            else if (time >= 4 && time < 10){
                loaderMsg.innerHTML = gettext('Searching for recipes into the web')
                if (langPrefix === 'pl') {
                    loaderMsg.style.left = '-6.5rem'
                }
                else {
                    loaderMsg.style.left = '-4.5rem'
                }
            }
            else if (time >= 10 && time < 14){
                loaderMsg.innerHTML = gettext('Translating and formatting recipes')
                 if (langPrefix === 'pl') {
                    loaderMsg.style.left = '-7.5rem'
                }

            }
            else if (time >= 14 && time < 40){
                loaderMsg.innerHTML = gettext('It takes longer than usual, be patient')
                 if (langPrefix === 'pl') {
                    loaderMsg.style.left = '-7.5rem'
                }
                else {
                    loaderMsg.style.left = '-4rem'
                }
            }
            else if (time >= 40){
                loaderMsg.innerHTML = gettext('Something went wrong...')
            }
          }, 1000)
        },
        success: function (response){
            if (response.status === 200){
                 const recipes = JSON.parse(response.recipes)
                 const recipeInfoMsg = document.querySelector('.recipe-info-message')
                 const alreadySuggestedItems = document.querySelectorAll('.recipe-search__search__results__container__item')
                 alreadySuggestedItems.forEach(item => {
                     item.remove()
                 })
                 recipeInfoMsg.classList.add('not-visible')
                 recipes.forEach(recipe => {
                     console.log(recipe)
                     const recipeName = recipe.name
                     const servings = recipe.person_count
                     const duration = recipe.duration
                     const msgSwitch = langPrefix === 'pl' ? 'na' : 'for'
                     const isVerified = recipe.isVerified ? 'checked' : 'unchecked'
                     const dbId = recipe.dbId
                     let isDifficultLevel = recipe.difficulty ? `<span class="pushed">${gettext("Difficulty:")} ${recipe.difficulty}</span>` : `<span class="pushed">${gettext("Difficulty:")} ${gettext('Unknown')}</span>`
                     let isFromApi = recipe.from === 'api'
                     if (isFromApi) {
                         alreadySeenApiRecipes.push(recipe.recipeId)
                     }
                     else {
                         alreadySeenDbRecipes.push((recipe.recipeId))
                     }
                     let labelMsg
                     if (isVerified === 'checked'){
                         labelMsg = gettext('Nutri Verified')
                     }
                     else {
                         labelMsg = gettext('Not verified')
                     }
                     let contentToAppend = `
                     <div class="recipe-search__search__results__container__item">
                       <div class="recipe-search__search__results__container__item--heading">
                         <img src="/static/images/svg/${isVerified}.svg" class="filter-green verified-icon" alt="${capitalize(isVerified)} Icon">
                         <p class="isVerified__label">${labelMsg}</p>
                         <p>${recipeName} ${msgSwitch} ${servings} ${gettext('servings')} <img src="/static/images/svg/people.svg" class="clock-icon-recipe-duration filter-green" alt="People Icon"></p>
                     </div>
                     <div class="recipe-search__search__results__container__item--lower">
                          <p><img src="/static/images/svg/clock.svg" class="clock-icon-recipe-duration filter-green" alt="Clock Icon"> <span>${duration}</span> ${isDifficultLevel}</p>
                     </div>
                     <button data-pk="${dbId}" class="btn-light recipe-details-btn">${gettext('See')}</button>
                     </div>
                     `
                     containerBox.insertAdjacentHTML('beforeend', contentToAppend)
                 })
                 const recipesDetailButtons = document.querySelectorAll('.recipe-details-btn')
                 recipesDetailButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const dataPk = btn.dataset.pk
                        const url = location.origin + `/${langPrefix}/recipes/get-recipe-info-by-id`
                        $.ajax({
                            type: 'get',
                            url: url,
                            data: {
                                'recipeId': dataPk,
                            },
                            success: function (response){
                                if (response.status === 200){
                                    const modalRecipeInfo = document.querySelector('.modal-queued__recipe')
                                    modalRecipeInfo.style.zIndex = '34500'
                                    modalRecipeInfo.classList.remove('not-visible')
                                    fillModalRecipe(response)
                                }
                                else {
                                    const modalError = document.querySelector('.modal-accept-delete')
                                    const modalErrorClose = document.querySelector('.modal-accept-delete-close')
                                    modalError.classList.remove('not-visible')
                                    modalErrorClose.addEventListener('click', () => {
                                        modalError.classList.add('not-visible')
                                    })
                                }
                            }
                        })
                    })
                })
            }
            else {
                const recipeInfoMsg = document.querySelector('.recipe-info-message')
                recipeInfoMsg.classList.remove('not-visible')
                const alreadySuggestedItems = document.querySelectorAll('.recipe-search__search__results__container__item')
                alreadySuggestedItems.forEach(item => {
                     item.remove()
                })
            }
            },
            complete: function (res){
                 clearInterval(functionTimeExecutionCounter)
                 setTimeout(function (){
                    loader.classList.add('not-visible')
                    loader.style.removeProperty('transition')
                    loader.style.removeProperty('opacity')
                    modal.classList.add('not-visible')
                }, 1500)
            }
        })
    }
    else {
            const input = document.querySelector('.modal-add-search__content__search-bar')
            input.classList.add('color-error')
            input.classList.toggle('shake-animation')
            shakeAnimation(input)
            setTimeout(function () {
                input.classList.remove('color-error')
            }, 1500);
    }

})


const maximize = document.querySelector('.maximize')
const minimizing = document.querySelector('.minimizing')

maximize.addEventListener('click', () => {
    const icon = document.querySelector('.maximize-icon')
    const secondIcon = document.querySelector('.minimizing-icon')
    if (!icon.classList.contains('active-icon-focus')){
        secondIcon.classList.remove('active-icon-focus')
        const getPathChecked = secondIcon.src
        secondIcon.src = icon.src
        icon.classList.add('active-icon-focus')
        icon.src = getPathChecked
    }
})

minimizing.addEventListener('click', () => {
    const icon = document.querySelector('.minimizing-icon')
    const secondIcon = document.querySelector('.maximize-icon')
    if (!icon.classList.contains('active-icon-focus')){
        secondIcon.classList.remove('active-icon-focus')
        const getPathChecked = secondIcon.src
        secondIcon.src = icon.src
        icon.classList.add('active-icon-focus')
        icon.src = getPathChecked
    }
})

const closeModalSearchBtn = document.querySelector('.modal-queued__recipe__close-button')
closeModalSearchBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal-add-search')
    modal.classList.add('not-visible')
})


const tryAgainBtn = document.querySelector('.recipe-search__search__save-new__button')
tryAgainBtn.addEventListener('click', () => {
    const modalSearch = document.querySelector('.modal-recipe-ideas')
    modalSearch.classList.remove('not-visible')
})
