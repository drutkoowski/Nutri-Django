// cards
const searchContainer = document.querySelector('.saved-meals__search')
const adjustableCard = document.querySelector('.saved-meals__added')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')
// buttons
const saveNewMealButton = document.querySelector('.saved-meals__search__save-new__button')
const editButtons = document.querySelectorAll('.edit-saved-meals')
const deleteButtons = document.querySelectorAll('.delete-saved-meals')
const modalCloseEdit = document.querySelector('.modal-edit-search__close-button')
const modalCloseAdd = document.querySelector('.modal-add-search__close-button')

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

searchContainer.style.width = '50%'
searchContainer.style.justifySelf = 'center'


// search
const ajaxCall = (query, searchResponseBox) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/live-search-ingredients`
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
                    button.addEventListener('click', e => {
                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)
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
const ajaxCallEditMeal = (query) => {
     const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/live-search-ingredients`
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
                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)
                        const ingredientObj = JSON.parse(decodeURIComponent(button.dataset.mealobj))
                        let isGram = ingredientObj.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredientObj.serving_grams)} g`
                        const randomId = "Id" + ingredientObj.ingredientId * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                        const mealItemAppend = `
                            <div class="today-meals-saved-edit-inputBox" data-object="${encodeURIComponent(JSON.stringify(ingredientObj))}">
                              <p><b>${ingredientObj.pl_name}</b> (${Math.trunc(ingredientObj.kcal)} kcal / ${ingredientObj.unit_multiplier} ${ingredientObj.unit_name_pl} ${isGram})</p>
                             <input name="${ingredientObj.pl_name}" min="0" max="1000" class='updated-meal-element-input' type="number" placeholder="${ingredientObj.unit_name_pl}">
                             <label for="${ingredientObj.pl_name}">x ${ingredientObj.unit_multiplier} ${ingredientObj.unit_name_pl}</label>
                             <div id="${randomId}" class="edit-remove-item remove-icon filter-red"></div>
                        </div>
                      `
                        const itemsContainer = document.querySelector('.edit-meal-added-items')
                        itemsContainer.insertAdjacentHTML('beforeend', mealItemAppend)
                        const btnRemove = itemsContainer.querySelector(`#${randomId}`)
                        btnRemove.addEventListener('click', e => {
                            const parent = e.target.parentNode
                            const itemsCount = document.querySelector('.edit-meal-added-items').children.length
                            if (itemsCount >= 2) {
                                $(parent).fadeOut(300)
                                parent.remove()
                            }
                        })
                        btnRemove.removeAttribute('id')
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

// create
const createNewMealTemplate = (ingredientsArr,mealName, text) => {
    const langPrefix = window.location.href.split('/')[3];
     const url = window.location.origin + `${langPrefix}/meals/data/save/saved-meal/element`
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
                 modal.classList.toggle('not-visible')
                 const closeModalBtn = document.querySelector('.modal-queued__close-button')
                 closeModalBtn.addEventListener('click', e => {
                     window.location = window.location.href;
                 })
                 setInterval(function () {
                     window.location = window.location.href;
                     }, 2500);

             }
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
            'quantity': inputEl.value / mealObj.unit_multiplier,
        }
        ingredientsArr.push(ingredientObj)
    })
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/save/saved-meal/element`
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
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                closeModalBtn.addEventListener('click', e => {
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                }, 2500);

            }

            },
        error: function (error) {
            console.log(error)
        },
    })
}

// delete
const deleteAndCreateMealTemplate = (mealTemplateId, ingredientsArr, mealName) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/delete/saved-meal/template`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'mealTemplateId': mealTemplateId,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response) {
            createNewMealTemplate(ingredientsArr, mealName, 'Updating your meal template in our database.')
        },
    })
}
const deleteMealTemplate = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/delete/saved-meal/template`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'mealTemplateId': id,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
                const modal = document.querySelector('.modal-queued')
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                const modalHeading = modal.querySelector('.modal-queued--heading')
                modalHeading.innerHTML = `Removing selected meal template from database..`
                closeModalBtn.addEventListener('click', e => {
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                    }, 2500);

             }
             },
    })
}

// edit
const getTemplateElement = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/get/saved-meal/template`
    $.ajax({
        "type": "GET",
        url: url,
        data: {
            "templateId": id,
        },
        success: function (response) {
           const mealObj = JSON.parse(response.mealTemplateObj)
           const mealName = mealObj.meal_name
           const kcal = mealObj.kcal
           const ids_array = mealObj.meal_elements_ids
           getMealTemplateElement(mealObj, mealName, kcal, ids_array)
        },
    })
}
const getMealTemplateElement = (mealObj, mealName, kcal, ids_array) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/get/saved-meal/template/element`
    const contentContainer = document.querySelector('.saved-meals__added--saved__content')
    let contentToAppend = `
        <div class="saved-meals__added--saved__content__item saved-template-edit__heading" id="${mealObj.mealId}">
            <p><b>${mealName}</b> - ${kcal} kcal</p>
        </div
         <div> 
            <div class="add-new-element-box">
                <div class="add-icon filter-green"></div>
                <a class="saved-template-edit__add-new__trigger-search">${gettext('Add new element for your meal')}</a>
            </div>
        </div>
        <div class="edit-meal-added-items"></div>
    `
    let saveButtonAppend = `
       <div class="saved-new-meals-buttons-container">
              <input type="text" placeholder="${mealName}" value="${mealName}" class="meal_name_input">
              <button class="saved-meals__added--saved__content__save save-updated-template-meal btn">${gettext('Save')}</button>
         </div>
        `
    contentContainer.insertAdjacentHTML('beforeend', contentToAppend)
    contentContainer.insertAdjacentHTML('afterend', saveButtonAppend)
    const addNewElementBtn = document.querySelector('.add-new-element-box')
    addNewElementBtn.addEventListener('click', e => {
        const modalAddSearch = document.querySelector('.modal-edit-search')
        modalAddSearch.classList.toggle('not-visible')
    })
    const mealSaveButton = document.querySelector('.save-updated-template-meal')
    mealSaveButton.addEventListener('click', e => {
        const mealItems = document.querySelector('.today-meals-saved-edit-inputBox').children
        const inputNameEl = document.querySelector('.meal_name_input')
        const inputsQuantity = document.querySelectorAll('.updated-meal-element-input')
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
            updateMeal(mealObj)
        }
        else if(!mealItems.length > 0 || !inputNameEl.value || !inputNameEl.value.length > 3) {
            inputNameEl.classList.add('color-error')
            inputNameEl.parentElement.classList.toggle('shake-animation')
            shakeAnimation(inputNameEl.parentElement)
            setTimeout(function () {
                inputNameEl.classList.remove('color-error')
            }, 1500);

        }
    })
    const searchInput = document.querySelector('.new-saved-meal-search')
    searchInput.addEventListener('input', e => {
        const searchValue = e.target.value
        const searchResponseBox = document.querySelector('.saved-meals__added--saved__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCallEditMeal(searchValue)
    })
    ids_array.forEach(id => {
         $.ajax({
             type: 'GET',
             url: url,
             data: {
                'mealElementId': id,
             },
            success: function (response){
                const obj = JSON.parse(response['mealTemplateElement'])
                const objDataSet = JSON.parse(response['ingredientElement'])
                let isGram = obj.unit_name_pl === 'g' ? '' : `lub ${Math.round(obj.serving_grams)} g`
                const randomId = "Id" + obj.mealTemplateElementId * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                let appendItemElement = `
                <div class="today-meals-saved-edit-inputBox" data-object="${encodeURIComponent(JSON.stringify(objDataSet))}">
                    <p><b>${obj.templateElementName_pl}</b> (${Math.trunc(obj.kcal)} kcal / ${obj.unit_multiplier} ${obj.unit_name_pl} ${isGram})</p>
                    <input name="${obj.mealTemplateElementId}" min="0" max="1000" value="${obj.quantity * obj.unit_multiplier}" class='updated-meal-element-input' type="number" placeholder="${obj.quantity}">
                    <label for="${obj.mealTemplateElementId}">x ${obj.unit_name_pl}</label>
                    <div id='${randomId}' class="edit-remove-item remove-icon filter-red"></div>
                </div>
                `
                const itemsContainer = document.querySelector('.edit-meal-added-items')
                itemsContainer.insertAdjacentHTML('beforeend', appendItemElement)
                const btnRemove = itemsContainer.querySelector(`#${randomId}`)
                btnRemove.addEventListener('click', e => {
                    const parent = e.target.parentNode
                    const itemsCount = document.querySelector('.edit-meal-added-items').children.length
                    if (itemsCount >= 2) {
                        $(parent).fadeOut(300)
                        parent.remove()
                    }

                })
                btnRemove.removeAttribute('id')
            },
          })
    })
}
const updateMeal = (mealObj) => {
    const mealName = document.querySelector('.meal_name_input')
    const ingredientsElements = document.querySelectorAll('.today-meals-saved-edit-inputBox')
    let ingredientsArr = []
    ingredientsElements.forEach(item => {
        const mealObj = JSON.parse(decodeURIComponent(item.dataset.object));
        const unit_multiplier = mealObj?.unit_multiplier ? mealObj.unit_multiplier : mealObj.unit_multiplier
        const inputEl = item.querySelector('.updated-meal-element-input')
        const ingredientObj = {
            'ingObj': mealObj,
            'quantity': inputEl.value / unit_multiplier,
        }
        ingredientsArr.push(ingredientObj)
    })
    deleteAndCreateMealTemplate(mealObj.mealId, ingredientsArr, mealName)

}


// buttons listeners
$(searchContainer).addClass('animate-left').on("animationend", function(){
    $(this).removeClass('animate-left');
});

// modal close listeners
modalCloseEdit.addEventListener('click', e => {
    animateDeletingElementByClass('.modal-edit-search', 1200)
})

modalCloseAdd.addEventListener('click', e=> {
    animateDeletingElementByClass('.modal-add-search', 1200)
})


// save
saveNewMealButton.addEventListener('click', e => {
     if (!isCardVisible) {
        searchContainer.style.gridColumn = '1/2'
        searchContainer.style.removeProperty('width')
        searchContainer.style.removeProperty('justify-self')
         $(searchContainer).addClass('animate-left').on("animationend", function(){
            $(this).removeClass('animate-left');
         });
        adjustableCard.classList.toggle('not-visible')
        isCardVisible = true
    }
     $(adjustableCard).addClass('animate').on("animationend", function(){
            $(this).removeClass('animate');
     });
     clearCardContent()
     saveNewMealButton.disabled = true
     headingAdjustableCard.innerHTML = gettext("Create New Meal Template")
     const modalAddMeal = document.querySelector('.modal-add-search')
     modalAddMeal.classList.remove('not-visible')
     const cardContentParent = document.querySelector('.saved-meals__added--saved__content')
     let contentToAppend = `
     
          <div class="info-search-saved ">Search to fill your template with meals.</div>
          <div class="saved-meals__added--saved__content__meal not-visible">
               <h2 class="your-meal-heading">${gettext('Your Meal')}</h2>
               <div class="saved-meals__added--saved__content__meal__items"></div>
          </div>
     `
    let saveButtonAppend = `
     <div class="saved-new-meals-buttons-container not-visible">
        <input type="text" placeholder="${gettext('Meal Name')}" class="meal_name_input input-scale">
        <button class="saved-meals__added--saved__content__save btn">${gettext('Save')}</button>
    </div>
    
    `
    let addButtonMarkup = `
     <div> 
          <div class="add-new-element-box add-meal-template">
               <div class="add-icon filter-green"></div>
               <a class="saved-template-edit__add-new__trigger-search add-meal-template__trigger-search">Dodaj nowy element dla Twojego posiłku</a>
           </div>
     </div>
    `
    cardContentParent.insertAdjacentHTML('afterbegin', addButtonMarkup)
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)
    cardContentParent.insertAdjacentHTML('afterend', saveButtonAppend)
    const addNewElBtn = document.querySelector('.add-meal-template__trigger-search')
    addNewElBtn.addEventListener('click', e => {
        modalAddMeal.classList.remove('not-visible')
    })
    const inputNameElement = document.querySelector('.meal_name_input')
    inputNameElement.addEventListener('input', e => {
        if(e.target.value.length < 3) {
            inputNameElement.classList.add('color-error')
        }
        else {
            inputNameElement.classList.remove('color-error')
        }
    })
    const searchInput = document.querySelector('.modal-add-search__content__search-bar')
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
        const searchResponseBox = document.querySelector('.modal-add-search__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCall(searchValue, searchResponseBox)
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

// manage
editButtons.forEach(button => button.addEventListener('click', e => {
    if (!isCardVisible) {
        searchContainer.style.gridColumn = '1/2'
        searchContainer.style.removeProperty('width')
        searchContainer.style.removeProperty('justify-self')
        $(searchContainer).addClass('animate-left').on("animationend", function(){
            $(this).removeClass('animate-left');
         });
        adjustableCard.classList.remove('not-visible')
        isCardVisible = true
    }
    $(adjustableCard).addClass('animate').on("animationend", function(){
            $(this).removeClass('animate');
    });
    clearCardContent()
    headingAdjustableCard.innerHTML = `Edit Meal`
    const objectToEditId = button.dataset.meal;
    getTemplateElement(objectToEditId)
}))


// delete
deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
        const mealTemplateId = e.target.dataset.meal
        deleteMealTemplate(mealTemplateId)
    })
})

// animations
const animateDeletingElementByClass = (elementClass, duration) => {
    const element = document.querySelector(elementClass)
     if (!element.classList.contains('not-visible')) {
         $(elementClass).animate({
                top: '-15rem',
                opacity: '0',

            }, 300)
             setTimeout(function () {
                 element.classList.add('not-visible')
                 element.style.removeProperty('display')
                 element.style.removeProperty('opacity')
                element.style.removeProperty('top')
             }, duration)
     }
     else {
            element.style.removeProperty('opacity')
            element.style.removeProperty('top')
            element.classList.remove('not-visible')
            element.style.removeProperty('display')
        }
}


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}


