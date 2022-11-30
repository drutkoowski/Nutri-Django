const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')
const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
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
                         <img src="/static/images/svg/${isVerified}.svg" class="filter-green verified-icon" alt="${isVerified.toUpperCase()} Icon">
                         <p class="isVerified__label">${labelMsg}</p>
                         <p>${recipeName} ${msgSwitch} ${servings} ${gettext('servings')} <img src="/static/images/svg/people.svg" class="clock-icon-recipe-duration filter-green" alt="People Icon"></p>
                     </div>
                     <div class="recipe-search__search__results__container__item--lower">
                          <p><img src="/static/images/svg/clock.svg" class="clock-icon-recipe-duration filter-green" alt="Clock Icon"> <span>${duration}</span> ${isDifficultLevel}</p>
                     </div>
                     <button data-pk="32" class="btn-light recipe-details-btn">${gettext('See')}</button>
                     </div>
                     `
                     containerBox.insertAdjacentHTML('beforeend', contentToAppend)
                 })
            }
            else {
                console.log(response)
                const recipeInfoMsg = document.querySelector('.recipe-info-message')
                recipeInfoMsg.classList.remove('not-visible')
                const alreadySuggestedItems = document.querySelectorAll('.recipe-search__search__results__container__item')
                alreadySuggestedItems.forEach(item => {
                     item.remove()
                })
            }
            },
            complete: function (res){
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
