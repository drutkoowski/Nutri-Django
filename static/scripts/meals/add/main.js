const mealsVideo = document.getElementById('add-meals-video')
const navbar = document.querySelector('.navbar--dashboard')

const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.5;
}

const ajaxCallSearch = (query) => {
    const url = window.location.origin + '/meals/data/live-search-ingredients'
    const searchResponseBox = document.querySelector('.add-meals__search__results__container')

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
               let ingredients = [...response.ingredients]
               ingredients.forEach(ingredient => {
                   let contentToAppend
                   let unit_multiplier = ingredient.unit_multiplier
                   let isGram = ingredient.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredient.serving_grams)} g`
                   let categoryName = ingredient.category_name_pl
                    contentToAppend = `
                    <div class="add-meals__search__results__container__item">
                        <p><b>${ingredient.pl_name}</b> (${Math.trunc(ingredient.kcal)} kcal / ${unit_multiplier} ${ingredient.unit_name_pl} ${isGram})</p>
                        <div data-object='${encodeURIComponent(JSON.stringify(ingredient))}' id='${ingredient.id}' class="new-meal-item-add add-icon filter-green"></div>
                        <small class="search-category-small">Kategoria: <span class="search-category-small__text">${categoryName}</span></small>
                    </div>
                   `



                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                //
                const addButtons = document.querySelectorAll('.new-meal-item-add')
                addButtons.forEach(button => {
                    button.addEventListener('click', e =>{

                        const mealContent = document.querySelector('.add-meals__added--added__content')
                        const infoResults = document.querySelector('.saved-results-info')
                        infoResults.classList.add('not-visible')
                        const getMealObject = JSON.parse(decodeURIComponent(e.target.dataset.object));
                        let unit_multiplier = getMealObject.unit_multiplier
                        let isGram = getMealObject.unit_name_pl === 'g' ? '' : `lub ${Math.round(getMealObject.serving_grams)} g`
                        const mealItemAppend = `
                               <div data-object="${e.target.dataset.object}" class="add-meals__added--added__content__item">
                                   <p><b>${getMealObject.pl_name}</b> (${Math.trunc(getMealObject.kcal)} kcal / ${unit_multiplier} ${getMealObject.unit_name_pl} ${isGram})</p>
                                  <div class="today-meals-added-remove-btn remove-icon filter-red"></div>
                                  <div class="today-meals-added-inputBox">
                                    <input class="new-today-meal-input-quantity" name="${getMealObject.en_name}" type="number" placeholder="${getMealObject.unit_name_pl}">
                                    <label for="${getMealObject.en_name}">x ${getMealObject.unit_name_pl}</label>
                                  </div>
                        </div>
                      `
                        mealContent.insertAdjacentHTML('beforeend', mealItemAppend)
                        const removeAddedBtn = document.querySelectorAll('.today-meals-added-remove-btn')
                        removeAddedBtn.forEach(button => {
                            button.addEventListener('click', e => {
                                const parentEl = button.parentNode
                                if(mealContent.children.length === 1) {
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
                searchResponseBox.innerHTML = `<h3 class="search-results-info">No search results.</h3>`
            }

            },
        error: function (error) {
            searchResponseBox.innerHTML = `<h3 class="search-results-info">No search results.</h3>`
            const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
        },
    })
}

const ajaxCallSave = (mealItems) => {
    let ingredientsArr = []
    mealItems.forEach(item => {
        const mealObj = JSON.parse(decodeURIComponent(item.dataset.object));
        const parent = item.children[2]
        const inputValue = parent.children[0].value
        let obj = {
            'ingredientId': mealObj.id,
            'quantity': inputValue,
        }
        ingredientsArr.push(obj)
    })
    const url = window.location.origin + '/meals/data/save/added-meal'
    const ingredients = JSON.stringify(ingredientsArr)
    console.log(ingredients)
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'ingredientsArray': ingredients,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                console.log('Dodano produkty!')
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

const searchInput = document.querySelector('.search-meal-add')
searchInput.addEventListener('input', e => {
    const searchQuery = e.target.value
    const searchResponseBox = document.querySelector('.add-meals__search__results__container')
    if (searchQuery !== '' ) {
        ajaxCallSearch(searchQuery)

    }
    else {
        searchResponseBox.innerHTML = `<h3 class="search-results-info">No search results.</h3>`
    }
})



const saveMealBtn = document.querySelector('.save-add-today-meals')
saveMealBtn.addEventListener('click', e => {
    const mealsItems = Array.from(document.querySelectorAll('.add-meals__added--added__content__item'))
    const quantityInputs = document.querySelectorAll('.new-today-meal-input-quantity')
    let inputsValid = true
    quantityInputs.forEach(el => {
        if(!el.value || el.value === '') {
            inputsValid = false
        }
    })
    if(mealsItems.length > 0 && inputsValid) {
        console.log(mealsItems)
        ajaxCallSave(mealsItems)
    }
})