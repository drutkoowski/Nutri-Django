const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')
const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value
const staticPath = document.querySelector('#static-path').value

let onlyVerified = true
navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

const verifiedIcon = document.querySelector('.verified-icon')
verifiedIcon.addEventListener('click', () => {
    if (verifiedIcon.id === 'verified') {
        verifiedIcon.id = 'unverified'
        verifiedIcon.src = `${staticPath}images/svg/unchecked.svg`
        onlyVerified = false
    }
    else {
        verifiedIcon.id = 'verified'
        verifiedIcon.src = `${staticPath}images/svg/checked.svg`
        onlyVerified = true
    }
})
const fillModalRecipe = (response) => {
    const recipe = JSON.parse(response['recipe'])
    const headingModal = document.querySelector('.modal-queued__recipe__heading')
    headingModal.innerHTML = recipe.name
    const difficultyBox = document.querySelector('.modal-queued__recipe__difficulty')
    difficultyBox.innerHTML = recipe.difficulty ? recipe.difficulty : gettext("Unknown")
    const durationBox = document.querySelector('.modal-queued__recipe__duration')
    durationBox.innerHTML = `${recipe.duration}`
    const personCount = document.querySelector('.modal-queued__recipe__person-count')
    personCount.innerHTML = `${gettext('for')} ${recipe.person_count} ${gettext('persons')}`
    const authorBox = document.querySelector('.modal-queued__recipe__author')
    authorBox.innerHTML = recipe.author
    openModal('.modal-queued__recipe')
    const closeModalBtn = document.querySelector('.modal-queued__recipe__close-button')
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


const capitalize = (word) => {
    return word.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
}


let openModal = function (modalClass) {
        let div = document.querySelector(modalClass);
        div.classList.remove('not-visible')
        div.style.zIndex = '45000'
};
window.onresize = function(){ location.reload(); }

const removeSearchResults = () => {
    const infoMessage = document.querySelector('.recipe-info-message')
    infoMessage.classList.remove('not-visible')
    const resultsContainer = document.querySelector('.recipe-search__search__results__container')
    const resultItems = resultsContainer.querySelectorAll('.recipe-search__search__results__container__item')
    if (resultItems){
        resultItems.forEach(result => {
            result.remove()
        })
    }
}

const searchRecipes = (query) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = location.origin + `/${langPrefix}/recipes/live-search-recipes`
    $.ajax({
        type: 'get',
        url: url,
        data: {
            'query': query,
            'isVerified': onlyVerified
        },
        success: function (response){
            if (response.status === 200) {
                const recipes = JSON.parse(response.recipes)
                if (recipes) {
                    const infoMessage = document.querySelector('.recipe-info-message')
                    infoMessage.classList.add('not-visible')
                    const resultsContainer = document.querySelector('.recipe-search__search__results__container')
                    const resultItems = resultsContainer.querySelectorAll('.recipe-search__search__results__container__item')
                    if (resultItems){
                        resultItems.forEach(result => {
                            result.remove()
                        })
                    }
                    recipes.forEach(recipe => {
                    const recipeName = recipe.name
                    const recipeDuration = recipe.duration
                    const recipePersonCount = recipe.person_count
                    const recipeDifficulty = recipe.difficulty ? recipe.difficulty : gettext("Unknown")
                    let contentToAppend = `
                        <div class="recipe-search__search__results__container__item">
                            <div class="recipe-search__search__results__container__item--heading">
                                <p>${recipeName} ${gettext('for')}&nbsp;${recipePersonCount}&nbsp;x <img src="${staticPath}images/svg/people.svg" class="clock-icon-recipe-duration filter-green" alt="People Icon"></p>
                            </div>
                            <div class="recipe-search__search__results__container__item--lower">
                                <p><img src="${staticPath}images/svg/clock.svg" class="clock-icon-recipe-duration filter-green" alt="Clock Icon"> <span>${recipeDuration}</span> <span class="pushed">${gettext('Difficulty level: ')} ${recipeDifficulty}</span></p>
                            </div>
                            <button data-pk="${recipe.id}" class="btn-light recipe-details-btn">${gettext('See')}</button>
                        </div>
                    `
                    resultsContainer.insertAdjacentHTML('beforeend', contentToAppend)
                    })
                    const detailsBtns = document.querySelectorAll('.recipe-details-btn')
                    detailsBtns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            const recipePk = btn.dataset.pk
                            const langPrefix = window.location.href.split('/')[3];
                            const url = location.origin + `/${langPrefix}/recipes/get-recipe-info-by-id`
                            $.ajax({
                                type: 'GET',
                                url: url,
                                data: {
                                    'recipeId': recipePk,
                                },
                                success: function (response){
                                    fillModalRecipe(response)
                                }
                            })

                        })
                    })
                }
                else {
                   removeSearchResults()
                }
            }
            else {
                removeSearchResults()
            }
        },
        error: function (error) {
              removeSearchResults()
        }
    })
}

const recipeSearchInput = document.querySelector('.recipe-search-add')
recipeSearchInput.addEventListener('input', (e) => {
    const query = e.target.value
    if (query.trim() !== ''){
        searchRecipes(query)
    }
    else {
        removeSearchResults()
    }
})

const randomRecipeBtn = document.querySelector('.recipe-search__search__save-new__button')
randomRecipeBtn.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    const url = location.origin + `/${langPrefix}/recipes/get-random-recipe`
    $.ajax({
        type: 'get',
        url: url,
        data: {
          'isVerified': onlyVerified
        },
        success: function (response) {
            if (response.status === 200) {
                fillModalRecipe(response)
            }
        }
    })
})


