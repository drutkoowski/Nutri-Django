// cards
const searchContainer = document.querySelector('.saved-meals__search')
const adjustableCard = document.querySelector('.saved-meals__added')
const navbar = document.querySelector('.navbar--dashboard')
const staticPath = document.querySelector('#static-path').value
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
let onlyVerifiedEdit = true
let onlyVerifiedAdd = true
const verifiedIconEdit = document.querySelector('#verified-edit')
verifiedIconEdit.addEventListener('click', () => {
    if (verifiedIconEdit.id === 'verified-edit') {
        verifiedIconEdit.id = 'unverified-edit'
        verifiedIconEdit.src = `${staticPath}images/svg/unchecked.svg`
        onlyVerifiedEdit = false
    }
    else {
        verifiedIconEdit.id = 'verified-edit'
        verifiedIconEdit.src = `${staticPath}images/svg/checked.svg`
        onlyVerifiedEdit = true
    }
})

const verifiedIconAdd = document.querySelector('#verified-add')
verifiedIconAdd.addEventListener('click', () => {
    if (verifiedIconAdd.id === 'verified-add') {
        verifiedIconAdd.id = 'unverified-add'
        verifiedIconAdd.src = `${staticPath}images/svg/unchecked.svg`
        onlyVerifiedAdd = false
    }
    else {
        verifiedIconAdd.id = 'verified-add'
        verifiedIconAdd.src = `${staticPath}images/svg/checked.svg`
        onlyVerifiedAdd = true
    }
})

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
}



let watch_media_query = '(max-width:  84.375em)';
let watch_small_media_query = '(max-width: 56.25em)';
let watch_small_phone_media_query = '(max-width: 37.5em';
let matches_small = window.matchMedia(watch_small_media_query).matches
let matches_small_phone = window.matchMedia(watch_small_phone_media_query).matches
let matched = window.matchMedia(watch_media_query).matches;

let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});

if (matched && !isCardVisible && !matches_small && !matches_small_phone) {
    searchContainer.style.width = '65%'
    searchContainer.style.margin = '0 auto'
}
else if (matches_small && !isCardVisible && !matches_small_phone) {
    searchContainer.style.width = '85%'
    searchContainer.style.margin = '0 auto'
}
else if(matches_small_phone && !isCardVisible) {
    searchContainer.style.width = '95%'
    searchContainer.style.margin = '0 auto'
}
 else {
    searchContainer.style.width = '50%'
    searchContainer.style.justifySelf = 'center'
}



// search
const ajaxCall = (query, searchResponseBox) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/live-search-ingredients`
    $.ajax({
        type: "GET",
        url: url,
        data: {
            'query': query,
            'isVerified': onlyVerifiedAdd
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
                   let mealName
                   let unitName
                   let categoryName
                   let isGram
                   if (langPrefix === 'pl') {
                       mealName = ingredient.pl_name
                       unitName = ingredient.unit_name_pl
                       categoryName = ingredient.category_name_pl
                       isGram = ingredient.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredient.serving_grams)} g`
                   }
                   else {
                       mealName = ingredient.en_name
                       unitName = ingredient.unit_name_en
                       categoryName = ingredient.category_name_en
                       isGram = ingredient.unit_name_en === 'g' ? '' : `or ${Math.round(ingredient.serving_grams)} g`
                   }
                   let contentToAppend = `
                    <div class="saved-meals__added--saved__content__search-response__item">
                        <p><b>${mealName}</b> (${Math.trunc(ingredient.kcal)} kcal / ${ingredient.unit_multiplier} ${unitName} ${isGram})</p>
                        <div data-mealObj='${encodeURIComponent(JSON.stringify(ingredient))}' class="new-meal-add-item add-icon filter-green"></div>
                        <small class="search-category-small--saved">${gettext('Category')}: <span class="search-category-small--saved__text">${categoryName}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-meal-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const infoBox = document.querySelector('.info-search-saved')
                        if(!infoBox.classList.contains('not-visible')) {
                            infoBox.classList.add('not-visible')
                        }
                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)
                        const ingredientObj = JSON.parse(decodeURIComponent(button.dataset.mealobj))
                        let mealName
                        let unitName
                        let isGram
                        if (langPrefix === 'pl') {
                           mealName = ingredientObj.pl_name
                           unitName = ingredientObj.unit_name_pl
                           isGram = ingredientObj.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredientObj.serving_grams)} g`
                        }
                        else {
                           mealName = ingredientObj.en_name
                           unitName = ingredientObj.unit_name_en
                           isGram = ingredientObj.unit_name_en === 'g' ? '' : `or ${Math.round(ingredient.serving_grams)} g`
                        }
                        const mealContent = document.querySelector('.saved-meals__added--saved__content__meal')
                        const mealNameSaveContainer = document.querySelector('.saved-new-meals-buttons-container')
                        mealContent.classList.remove('not-visible')
                        mealNameSaveContainer.classList.remove('not-visible')
                        const mealItemAppend = `
                               <div data-ingredientObj='${encodeURIComponent(JSON.stringify(ingredientObj))}' class="saved-meals__added--saved__content__meal__item">
                                   <p><b>${mealName}</b> (${Math.trunc(ingredientObj.kcal)} kcal / ${ingredientObj.unit_multiplier} ${unitName} ${isGram})</p>
                                   <div class="saved-meals__added--saved__content__meal__item--remove remove-icon filter-red"></div>
                                    <div class="today-meals-saved-inputBox">
                                       <input min="1" max="1000" class="new-today-meal-input-quantity" name="${unitName}" type="number" placeholder="${unitName}">
                                       <label for="${mealName}">x ${unitName}</label>
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
                                    if(infoBox.classList.contains('not-visible')) {
                                        infoBox.classList.remove('not-visible')
                                    }
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
            'isVerified': onlyVerifiedEdit
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
                   let mealName
                   let unitName
                   let categoryName
                   let isGram
                   if (langPrefix === 'pl'){
                       mealName = ingredient.pl_name
                       unitName = ingredient.unit_name_pl
                       categoryName = ingredient.category_name_pl
                       isGram = unitName === 'g' ? '' : `lub ${Math.round(ingredient.serving_grams)} g`
                   }
                   else {
                       mealName = ingredient.en_name
                       unitName = ingredient.unit_name_en
                       categoryName = ingredient.category_name_en
                       isGram = unitName === 'g' ? '' : `or ${Math.round(ingredient.serving_grams)} g`
                   }
                   let contentToAppend = `
                    <div class="saved-meals__added--saved__content__search-response__item">
                        <p><b>${mealName}</b> (${Math.trunc(ingredient.kcal)} kcal / ${ingredient.unit_multiplier} ${unitName} ${isGram})</p>
                        <div data-mealObj='${encodeURIComponent(JSON.stringify(ingredient))}' class="new-meal-add-item add-icon filter-green"></div>
                         <small class="search-category-small--saved">${gettext('Category')}: <span class="search-category-small--saved__text">${categoryName}</span></small>
                    </div>
                   `
                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                const addButtons = document.querySelectorAll('.new-meal-add-item')
                addButtons.forEach(button => {
                    button.addEventListener('click', () => {

                        button.parentElement.classList.add('blink-background-green')
                        setTimeout(() => {
                            button.parentElement.classList.remove('blink-background-green')
                        },1000)
                        const responseItems = [...document.querySelectorAll('.saved-meals__added--saved__content__meal__item'), ...document.querySelectorAll('.today-meals-saved-edit-inputBox')]
                        let isAlreadyAdded = false
                        responseItems.forEach(item => {
                           const pk = item.dataset.pk
                           if (pk === item.id) {
                               isAlreadyAdded = true
                           }
                        })
                        if (!isAlreadyAdded) {
                            const ingredientObj = JSON.parse(decodeURIComponent(button.dataset.mealobj))
                            let mealName
                            let unitName
                            let isGram
                            if (langPrefix === 'pl'){
                               mealName = ingredientObj.pl_name
                               unitName = ingredientObj.unit_name_pl
                               isGram = ingredientObj.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredientObj.serving_grams)} g`
                            }
                            else {
                               mealName = ingredientObj.en_name
                               unitName = ingredientObj.unit_name_en
                               isGram = ingredientObj.unit_name_en === 'g' ? '' : `or ${Math.round(ingredientObj.serving_grams)} g`
                            }
                            const randomId = "Id" + ingredientObj.ingredientId * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                            const mealItemAppend = `
                                <div class="today-meals-saved-edit-inputBox" data-object="${encodeURIComponent(JSON.stringify(ingredientObj))}" data-pk="${ingredientObj.id}">
                                   <p><b>${mealName}</b> (${Math.trunc(ingredientObj.kcal)} kcal / ${ingredientObj.unit_multiplier} ${unitName} ${isGram})</p>
                                   <input name="${mealName}" min="0" max="1000" class='updated-meal-element-input' type="number" placeholder="${unitName}">
                                   <label for="${mealName}">x ${unitName}</label>
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
                        }
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
                 modal.style.zIndex = '213123'
                 const closeModalBtn = document.querySelector('.modal-queued__close-button')
                 closeModalBtn.addEventListener('click', () => {
                     window.location = window.location.href;
                     modal.style.removeProperty('zIndex')
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
                modal.style.zIndex = '213123'
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                closeModalBtn.addEventListener('click', () => {
                    modal.style.removeProperty('zIndex')
                    window.location = window.location.href;
                })
                setInterval(function () {
                    window.location = window.location.href;
                }, 2500);

            }

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
            createNewMealTemplate(ingredientsArr, mealName, gettext('Updating your meal template in our database.'))
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
                modal.style.zIndex = '323123'
                modal.classList.toggle('not-visible')
                const closeModalBtn = document.querySelector('.modal-queued__close-button')
                const modalHeading = modal.querySelector('.modal-queued--heading')
                modalHeading.innerHTML = gettext(`Removing selected activity template from database..`)
                closeModalBtn.addEventListener('click', () => {
                    $("." + "modal-queued").fadeOut(900, () => {
                        const modal = document.querySelector(`.modal-queued`)
                        modal.classList.add('not-visible')
                        modal.style.removeProperty('display')
                        modal.style.zIndex = '0'
                    });
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
        type: "GET",
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
    addNewElementBtn.addEventListener('click', () => {
        const modalAddSearch = document.querySelector('.modal-edit-search')
        modalAddSearch.style.zIndex = '44321'
        modalAddSearch.classList.toggle('not-visible')
    })
    const mealSaveButton = document.querySelector('.save-updated-template-meal')
    mealSaveButton.addEventListener('click', () => {
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
                const langPrefix = window.location.href.split('/')[3];
                let templateElementName
                let unitName
                let isGram
                if (langPrefix === 'pl'){
                    templateElementName = obj.templateElementName_pl
                    unitName = obj.unit_name_pl
                    isGram = obj.unit_name_pl === 'g' ? '' : `lub ${Math.round(obj.serving_grams)} g`
                }
                else {
                    templateElementName = obj.templateElementName_en
                    unitName = obj.unit_name_en
                    isGram = obj.unit_name_en === 'g' ? '' : `or ${Math.round(obj.serving_grams)} g`
                }
                const randomId = "Id" + obj.mealTemplateElementId * Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                let appendItemElement = `
                <div class="today-meals-saved-edit-inputBox" data-object="${encodeURIComponent(JSON.stringify(objDataSet))}" data-pk="${objDataSet.id}">
                    <p><b>${templateElementName}</b> (${Math.trunc(obj.kcal)} kcal / ${obj.unit_multiplier} ${unitName} ${isGram})</p>
                    <input name="${obj.mealTemplateElementId}" min="0" max="1000" value="${Number(obj.quantity * obj.unit_multiplier)}" class='updated-meal-element-input' type="number" placeholder="${obj.quantity}">
                    <label for="${obj.mealTemplateElementId}">x ${unitName}</label>
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
modalCloseEdit.addEventListener('click', () => {
    $("." + "modal-edit-search").fadeOut(900, () => {
        const modal = document.querySelector(`.modal-edit-search`)
        modal.classList.add('not-visible')
        modal.style.removeProperty('display')
        modal.style.zIndex = '0'
    });
})

modalCloseAdd.addEventListener('click', () => {
    $("." + "modal-add-search").fadeOut(900, () => {
        const modal = document.querySelector(`.modal-add-search`)
        modal.classList.add('not-visible')
        modal.style.removeProperty('display')
        modal.style.zIndex = '0'
    });
})


// save
saveNewMealButton.addEventListener('click', () => {
     if (!isCardVisible) {
        document.querySelector('.saved-meals-layout-container').classList.remove('not-expanded')
        document.querySelector('.saved-meals-layout-container').classList.add('expanded')
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
     headingAdjustableCard.innerHTML = gettext("Create New Meal Template")
     const modalAddMeal = document.querySelector('.modal-add-search')
     modalAddMeal.style.zIndex = '83281'
     modalAddMeal.classList.remove('not-visible')
     const cardContentParent = document.querySelector('.saved-meals__added--saved__content')
     let contentToAppend = `
     
          <div class="info-search-saved ">${gettext('Search to fill your template with meals.')}</div>
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
               <a class="saved-template-edit__add-new__trigger-search add-meal-template__trigger-search">${gettext('Add new element to your meal')}</a>
           </div>
     </div>
    `
    cardContentParent.insertAdjacentHTML('afterbegin', addButtonMarkup)
    cardContentParent.insertAdjacentHTML('beforeend', contentToAppend)
    cardContentParent.insertAdjacentHTML('afterend', saveButtonAppend)
    const addNewElBtn = document.querySelector('.add-meal-template__trigger-search')
    addNewElBtn.addEventListener('click', () => {
        modalAddMeal.style.zIndex = '83371'
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
        // const addedContent = document.querySelector('.saved-meals__added--saved__content__meal')
        // if (searchValue.length === 0 && addedContent.classList.contains('not-visible')) {
        //     $('.info-search-saved').fadeOut('350', () => {
        //         document.querySelector('.info-search-saved').classList.remove('not-visible')
        //     })
        // }
        if (searchValue.length === 0 && document.querySelectorAll('.saved-meals__added--saved__content__meal__item').length === 0){
            document.querySelector('.info-search-saved').classList.remove('not-visible')
        }
        const searchResponseBox = document.querySelector('.modal-add-search__content__search-response')
        const searchElements = Array.from(searchResponseBox.children)
        searchElements.forEach(el => {
            el.remove()
        })
        ajaxCall(searchValue, searchResponseBox)
    })
    const mealSaveButton = document.querySelector('.saved-meals__added--saved__content__save')
    mealSaveButton.addEventListener('click', () => {
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
editButtons.forEach(button => button.addEventListener('click', () => {
    if (!isCardVisible) {
        document.querySelector('.saved-meals-layout-container').classList.remove('not-expanded')
        document.querySelector('.saved-meals-layout-container').classList.add('expanded')
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
    headingAdjustableCard.innerHTML = gettext(`Edit Meal`)
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


const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}
