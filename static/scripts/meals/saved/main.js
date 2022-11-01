// cards
const searchContainer = document.querySelector('.saved-meals__search')
const adjustableCard = document.querySelector('.saved-meals__added')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')
// buttons
const saveNewMealButton = document.querySelector('.saved-meals__search__save-new__button')
const detailsButtons = document.querySelectorAll('.details-saved-meals')
const editButtons = document.querySelectorAll('.edit-saved-meals')
// others
const headingAdjustableCard = document.querySelector('.saved-meals__added--saved__heading--item')

// csrf
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

let isCardVisible = false

const clearCardContent = () => {
    const parentContent = document.querySelector('.saved-meals__added--saved__content')
    const childrenContent = Array.from(parentContent?.children)
    childrenContent.forEach(child => {
        parentContent.removeChild(child)
    })
    const inputEl = document.querySelector('.meal_name_input')
    const saveEl = document.querySelector('.saved-meals__added--saved__content__save')
    if(inputEl && saveEl) {
        inputEl.remove()
        saveEl.remove()
    }
    if (saveNewMealButton.disabled) {
        saveNewMealButton.disabled = false
    }
}

function hideModal(modalClass) {
    $("." + modalClass).fadeOut(900, e => {
         const modal = document.querySelector(`.${modalClass}`)
         modal.classList.add('not-visible')
         modal.style.removeProperty('display')
    });
}


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}

detailsButtons.forEach(button => button.addEventListener('click', e => {
    if (!isCardVisible) {
        searchContainer.style.gridColumn = '1/2'
        adjustableCard.classList.remove('not-visible')
        isCardVisible = true
    }
    clearCardContent()
    headingAdjustableCard.innerHTML = `Meal Details`
    const content = button.dataset.meal
    let contentToAppend = `<div class="saved-meals__added--saved__content__item">
    <p>${content}</p>
    </div`
    const cardContentParent = document.querySelector('.saved-meals__added--saved__content')
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)

}))


saveNewMealButton.addEventListener('click', e => {
     if (!isCardVisible) {
        searchContainer.style.gridColumn = '1/2'
        adjustableCard.classList.toggle('not-visible')
        isCardVisible = true
    }
     clearCardContent()
     saveNewMealButton.disabled = true
     headingAdjustableCard.innerHTML = `Create New Meal Template`
     const cardContentParent = document.querySelector('.saved-meals__added--saved__content')
     let contentToAppend = `
       <div class="saved-meals__added--saved__content__search-bar"><input class="new-saved-meal-search input-scale" type="text" placeholder="Search"/><span><img class="add-meals__search__bar__icon" src="${searchIconPath}" alt="Search Icon" /></span></div>
          <div class="saved-meals__added--saved__content__search-response not-visible">
              <div class="saved-meals__added--saved__content__search-response__item">
              </div>
          </div>
          <div class="info-search-saved">Search results will appear here.</div>
          <div class="saved-meals__added--saved__content__meal not-visible">
               <h2 class="your-meal-heading">Your Meal</h2>
               <div class="saved-meals__added--saved__content__meal__items"></div>
        </div>
     `
    let saveButtonAppend = `
     <div class="saved-new-meals-buttons-container not-visible">
        <input type="text" placeholder="Meal Name" class="meal_name_input input-scale">
        <button class="saved-meals__added--saved__content__save">Save</button>
    </div>
    
    `
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)
    cardContentParent.insertAdjacentHTML('afterend', saveButtonAppend)
    const inputNameElement = document.querySelector('.meal_name_input')
    inputNameElement.addEventListener('input', e => {
        if(e.target.value.length < 3) {
            inputNameElement.classList.add('color-error')
        }
        else {
            inputNameElement.classList.remove('color-error')
        }
    })
    const searchInput = document.querySelector('.new-saved-meal-search')
    searchInput.addEventListener('input', e => {
        const searchValue = e.target.value
        const addedContent = document.querySelector('.saved-meals__added--saved__content__meal')
        if(searchValue.length > 0 && addedContent.classList.contains('not-visible')) {
            document.querySelector('.info-search-saved').classList.add('not-visible')
        }
        else if (searchValue.length === 0 && addedContent.classList.contains('not-visible')) {
            $('.info-search-saved').fadeOut('350', e => {
                document.querySelector('.info-search-saved').classList.remove('not-visible')
            })
        }
        const searchResponseBox = document.querySelector('.saved-meals__added--saved__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCall(searchValue)
    })
    const mealSaveButton = document.querySelector('.saved-meals__added--saved__content__save')
    mealSaveButton.addEventListener('click', e => {
        const mealItems = document.querySelector('.saved-meals__added--saved__content__meal__items').children
        const inputNameEl = document.querySelector('.meal_name_input')
        const inputsQuantity = document.querySelectorAll('.new-today-meal-input-quantity')
        let isValid = true
        inputsQuantity.forEach(inputEl => {
            if(!inputEl.value || inputEl.value.length === 0 || inputEl.value === '') {
                isValid = false
                inputEl.classList.add('color-error')
                inputEl.classList.toggle('shake-animation')
                shakeAnimation(inputEl)
                setTimeout(function () {
                    inputEl.classList.remove('color-error')
                }, 1500);
            }
        })
        if (mealItems.length > 0 && inputNameEl.value && inputNameEl.value.length > 3 && isValid) {
            saveNewMeal()
        }
        else {
            inputNameEl.classList.add('color-error')
            inputNameEl.parentElement.classList.toggle('shake-animation')
            shakeAnimation(inputNameEl.parentElement)
            setTimeout(function () {
                inputNameElement.classList.remove('color-error')
            }, 1500);

        }
    })
})


editButtons.forEach(button => button.addEventListener('click', e => {
    if (!isCardVisible) {
        searchContainer.style.gridColumn = '1/2'
        adjustableCard.classList.remove('not-visible')
        isCardVisible = true
    }
    clearCardContent()
    headingAdjustableCard.innerHTML = `Edit Meal`
    let contentToAppend = `<div class="saved-meals__added--saved__content__item">
    <p>212121</p>
    </div`
    let saveButtonAppend = `
     <div class="saved-new-meals-buttons-container">
        <input type="text" placeholder="Meal Name" class="meal_name_input">
        <button class="saved-meals__added--saved__content__save">Save</button>
    </div>
    `
}))


const ajaxCall = (query) => {
    const url = window.location.origin + '/meals/data/live-search-ingredients'
     const searchResponseBox = document.querySelector('.saved-meals__added--saved__content__search-response')
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
               searchResponseBox.classList.remove('not-visible')
               let ingredients = [...response.ingredients]
               ingredients.forEach(ingredient => {
                   let isGram = ingredient.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredient.serving_grams)} g`
                   let contentToAppend = `
                    <div class="saved-meals__added--saved__content__search-response__item">
                        <p><b>${ingredient.pl_name}</b> (${Math.trunc(ingredient.kcal)} kcal / ${ingredient.unit_multiplier} ${ingredient.unit_name_pl} ${isGram})</p>
                        <div data-mealObj='${encodeURIComponent(JSON.stringify(ingredient))}' class="new-meal-add-item add-icon filter-green"></div>
                         <small class="search-category-small--saved">Kategoria: <span class="search-category-small--saved__text">${ingredient.category_name_pl}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-meal-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', e=>{
                        const ingredientObj = JSON.parse(decodeURIComponent(button.dataset.mealobj))
                        let isGram = ingredientObj.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredientObj.serving_grams)} g`
                        const mealContent = document.querySelector('.saved-meals__added--saved__content__meal')
                        const mealNameSaveContainer = document.querySelector('.saved-new-meals-buttons-container')
                        mealContent.classList.remove('not-visible')
                        mealNameSaveContainer.classList.remove('not-visible')
                        const mealItemAppend = `
                               <div data-ingredientObj='${encodeURIComponent(JSON.stringify(ingredientObj))}' class="saved-meals__added--saved__content__meal__item">
                                   <p><b>${ingredientObj.pl_name}</b> (${Math.trunc(ingredientObj.kcal)} kcal / ${ingredientObj.unit_multiplier} ${ingredientObj.unit_name_pl} ${isGram})</p>
                                   <div class="saved-meals__added--saved__content__meal__item--remove remove-icon filter-red"></div>
                                    <div class="today-meals-saved-inputBox">
                                       <input min="1" max="1000" class="new-today-meal-input-quantity" name="${ingredientObj.pl_name}" type="number" placeholder="${ingredientObj.unit_name_pl}">
                                       <label for="${ingredientObj.pl_name}">x ${ingredientObj.unit_name_pl}</label>
                                   </div>
                               </div>
                      `
                        const mealContentItems = document.querySelector('.saved-meals__added--saved__content__meal__items')
                        mealContentItems.insertAdjacentHTML('beforeend', mealItemAppend)
                        const mealItems = document.querySelectorAll('.saved-meals__added--saved__content__meal__item--remove')
                        mealItems.forEach(mealEl => {
                            mealEl.addEventListener('click', e => {
                                const parent = mealContentItems
                                const removeEl = e.target.parentNode
                                removeEl.remove()
                                const parentChildrenCount = parent.children.length
                                const mealNameSaveContainer = document.querySelector('.saved-new-meals-buttons-container')
                                if (parentChildrenCount === 0) {
                                     mealContent.classList.add('not-visible')
                                     mealNameSaveContainer.classList.add('not-visible')
                                }
                                else {
                                    mealNameSaveContainer.classList.remove('not-visible')
                                }
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
                searchResponseBox.classList.add('not-visible')
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


const saveNewMeal = () => {
    const mealName = document.querySelector('.meal_name_input')
    const ingredientsElements = document.querySelectorAll('.saved-meals__added--saved__content__meal__item')
    let ingredientsArr = []
    ingredientsElements.forEach(item => {
        const mealObj = JSON.parse(decodeURIComponent(item.dataset.ingredientobj));
        const inputEl = item.querySelector('.new-today-meal-input-quantity')
        const ingredientObj = {
            'ingObj': mealObj,
            'quantity': inputEl.value,
        }
        ingredientsArr.push(ingredientObj)
    })
    const url = window.location.origin + '/meals/data/save/saved-meal/element'
    const ingredients = JSON.stringify(ingredientsArr)
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'ingredientsArray': ingredients,
            'mealName': mealName.value,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response){
            const status = response.status
            if (status === 201) {
                const modal = document.querySelector('.modal-queued')
                console.log()
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                closeModalBtn.addEventListener('click', e => {
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                }, 2500);

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

