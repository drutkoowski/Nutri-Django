const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')
const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

const inputIngredientsBtn = document.querySelector('.add-meals__search__bar__icon')
inputIngredientsBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal-add-search')
    const loader = document.querySelector('.loader')
    loader.classList.remove('loader--hidden')
    loader.style.transition = 'unset'
    loader.style.opacity = '0.85'
    const inputValue = document.querySelector('.modal-add-search__content__search-bar').value
    const langPrefix = window.location.href.split('/')[3];
    const url = location.origin + `/${langPrefix}/recipes/get-recipes-by-ingredients`
    const array = inputValue.split(',');
    const containerBox = document.querySelector('.recipe-search__search__results__container')
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            'ingredients': JSON.stringify(array),
            'ingredientsString': JSON.stringify(inputValue),
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response){
            const recipes = JSON.parse(response.recipes)
            recipes.forEach(recipe => {
                const recipeName = recipe.name
                const servings = recipe.servings
                const duration = recipe.duration
                const msgSwitch = langPrefix === 'pl' ? 'na' : 'for'
                const isVerified = recipe.isVerified ? 'checked' : 'unchecked'
                let contentToAppend = `
                <div class="recipe-search__search__results__container__item">
                  <div class="recipe-search__search__results__container__item--heading">
                    <img src="/static/images/svg/${isVerified}.svg" class="filter-green verified-icon" alt="${isVerified.toUpperCase()} Icon">
                    <p class="isVerified__label">${gettext('Nutri Verified')}</p>
                    <p>${recipeName} ${msgSwitch} ${servings} x <img src="/static/images/svg/people.svg" class="clock-icon-recipe-duration filter-green" alt="People Icon"> ${gettext('servings')}</p>
                </div>
                <div class="recipe-search__search__results__container__item--lower">
                     <p><img src="/static/images/svg/clock.svg" class="clock-icon-recipe-duration filter-green" alt="Clock Icon"> <span>${duration} min.</span> <span class="pushed">SKLADNIKI</span></p>
                </div>
                <button data-pk="32" class="btn-light recipe-details-btn">${gettext('See')}</button>
                </div>
                `
                containerBox.insertAdjacentHTML('beforeend', contentToAppend)
            })
        },
        complete: function (res){
             setTimeout(function (){
                loader.classList.add('loader--hidden')
                loader.style.removeProperty('transition')
                loader.style.removeProperty('opacity')
                modal.classList.add('not-visible')
            }, 1500)
        }
    })
})