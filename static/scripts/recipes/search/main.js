const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')
navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

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
                    const recipeDifficulty = recipe.difficulty
                    let contentToAppend = `
                        <div class="recipe-search__search__results__container__item">
                            <div class="recipe-search__search__results__container__item--heading">
                                <p>${recipeName} ${gettext('for')} ${recipePersonCount} x <img src="/static/images/svg/people.svg" class="clock-icon-recipe-duration filter-green" alt="People Icon"></p>
                            </div>
                            <div class="recipe-search__search__results__container__item--lower">
                                <p><img src="/static/images/svg/clock.svg" class="clock-icon-recipe-duration filter-green" alt="Clock Icon"> <span>${recipeDuration}</span> <span class="pushed">${gettext('Difficulty level: ')} ${recipeDifficulty}</span></p>
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
    if (query !== ''){
        const handler = () => {
        searchRecipes(query)
        }
        setTimeout(handler, 50);
    }
    else {
        removeSearchResults()
    }

})


