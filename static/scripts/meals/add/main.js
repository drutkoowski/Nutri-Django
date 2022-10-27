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

               let ingredients = [...response.ingredients]
               ingredients.forEach(ingredient => {
                   let contentToAppend = `
                    <div class="add-meals__search__results__container__item">
                        <p>${ingredient.en_name} (${Math.trunc(ingredient.kcal)} kcal / ${ingredient.multiplyValue} ${ingredient.unit_name})</p>
                        <div data-object='${encodeURIComponent(JSON.stringify(ingredient))}' id='${ingredient.id}' class="new-meal-item-add add-icon filter-green"></div>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                //
                const addButtons = document.querySelectorAll('.new-meal-item-add')
                addButtons.forEach(button => {
                    button.addEventListener('click', e =>{
                        const mealContent = document.querySelector('.add-meals__added--added__content')
                        const getMealObject = JSON.parse(decodeURIComponent(e.target.dataset.object));
                        const mealItemAppend = `
                               <div data-object="${e.target.dataset.object}" class="add-meals__added--added__content__item">
                                   <p>${getMealObject.en_name} (${Math.trunc(getMealObject.kcal)} kcal / ${getMealObject.multiplyValue} ${getMealObject.unit_name})</p>
                                  <div class="today-meals-added-remove-btn remove-icon filter-red"></div>
                                  <div class="today-meals-added-inputBox">
                                    <input class="new-today-meal-input-quantity" name="${getMealObject.en_name}" type="number" placeholder="${getMealObject.unit_name}">
                                    <label for="${getMealObject.en_name}">x ${getMealObject.unit_name}</label>
                                  </div>
                        </div>
                      `
                        mealContent.insertAdjacentHTML('beforeend', mealItemAppend)
                        const removeAddedBtn = document.querySelectorAll('.today-meals-added-remove-btn')
                        removeAddedBtn.forEach(button => {
                            button.addEventListener('click', e => {
                                const parentEl = button.parentNode
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
            }

            },
        error: function (error) {
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
                console.log('esasasas')
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
    ajaxCallSearch(searchQuery)
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