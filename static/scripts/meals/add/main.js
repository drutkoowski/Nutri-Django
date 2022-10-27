const mealsVideo = document.getElementById('add-meals-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.5;
}

const ajaxCall = (query) => {
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
                    button.addEventListener('click', e=>{
                        const mealContent = document.querySelector('.add-meals__added--added__content')
                        const getMealObject = JSON.parse(decodeURIComponent(e.target.dataset.object));
                        const mealItemAppend = `
                               <div class="add-meals__added--added__content__item">
                                   <p>${getMealObject.en_name} (${Math.trunc(getMealObject.kcal)} kcal / ${getMealObject.multiplyValue} ${getMealObject.unit_name})</p>
                                  <div class="today-meals-added-remove-btn remove-icon filter-red"></div>
                                  <div class="today-meals-added-inputBox">
                                    <input name="${getMealObject.en_name}" type="number" placeholder="${getMealObject.unit_name}">
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

const searchInput = document.querySelector('.search-meal-add')
searchInput.addEventListener('input', e => {
    const searchQuery = e.target.value
    ajaxCall(searchQuery)
})