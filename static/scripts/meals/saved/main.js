// cards
const searchContainer = document.querySelector('.saved-meals__search')
const adjustableCard = document.querySelector('.saved-meals__added')


// buttons
const saveNewMealButton = document.querySelector('.saved-meals__search__save-new__button')
const detailsButtons = document.querySelectorAll('.details-saved-meals')
const editButtons = document.querySelectorAll('.edit-saved-meals')
// others
const headingAdjustableCard = document.querySelector('.saved-meals__added--saved__heading--item')

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
     headingAdjustableCard.innerHTML = `Save New Meal`
     const cardContentParent = document.querySelector('.saved-meals__added--saved__content')
     let contentToAppend = `
       <div class="saved-meals__added--saved__content__search-bar"><input class="new-saved-meal-search" type="text" placeholder="Search"/><span><img class="add-meals__search__bar__icon" src="${searchIconPath}" alt="Search Icon" /></span></div>
          <div class="saved-meals__added--saved__content__search-response not-visible">
              <div class="saved-meals__added--saved__content__search-response__item">
              </div>
          </div>
          <div class="saved-meals__added--saved__content__meal not-visible">
               <h2 class="your-meal-heading">Your Meal</h2>
               <div class="saved-meals__added--saved__content__meal__items"></div>
        </div>
     `
    let saveButtonAppend = `
     <div class="saved-new-meals-buttons-container">
        <input type="text" placeholder="Meal Name" class="meal_name_input">
        <button class="saved-meals__added--saved__content__save">Save</button>
    </div>
    
    `
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)
    cardContentParent.insertAdjacentHTML('afterend', saveButtonAppend)

    const searchInput = document.querySelector('.new-saved-meal-search')
    searchInput.addEventListener('input', e => {
        const searchValue = e.target.value
        const searchResponseBox = document.querySelector('.saved-meals__added--saved__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCall(searchValue)
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
    const url = window.location.origin + '/data/live-search'
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
               let usernames = [...response.usernames]
               usernames.forEach(username => {
                   let contentToAppend = `
                    <div class="saved-meals__added--saved__content__search-response__item">
                        <p>${username}</p>
                        <button id='${username}' class="new-meal-add-item">+</button>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-meal-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', e=>{
                        const mealContent = document.querySelector('.saved-meals__added--saved__content__meal')
                        mealContent.classList.remove('not-visible')
                        const mealItemAppend = `
                               <div class="saved-meals__added--saved__content__meal__item">
                                   <p>Spaghetti Carbonara</p>
                                   <button class="saved-meals__added--saved__content__meal__item--remove">-</button>
                               </div>
                      `
                        const mealContentItems = document.querySelector('.saved-meals__added--saved__content__meal__items')
                        mealContentItems.insertAdjacentHTML('beforeend', mealItemAppend)
                        const mealItems = document.querySelectorAll('.saved-meals__added--saved__content__meal__item--remove')
                        mealItems.forEach(mealEl => {
                            mealEl.addEventListener('click', e=> {
                                const parent = mealContentItems
                                const removeEl = e.target.parentNode
                                removeEl.remove()
                                const parentChildrenCount = parent.children.length
                                if (parentChildrenCount === 0) {
                                     mealContent.classList.add('not-visible')
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