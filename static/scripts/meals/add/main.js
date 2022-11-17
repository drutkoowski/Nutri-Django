// fix bg - video stretch and nav adjustments
const navBarEl = document.querySelector('.navbar--dashboard')
navBarEl.style.marginTop = '0'
navBarEl.style.paddingTop = '3rem'
///

function hideModal(modalClass) {
    $("." + modalClass).fadeOut(900, e => {
         const modal = document.querySelector(`.${modalClass}`)
         modal.classList.add('not-visible')
         modal.style.removeProperty('display')
    });
}

let openModal = function (modalClass) {
        let div = document.querySelector(modalClass);
        div.classList.remove('not-visible')
        div.classList.add('modal-active')
        // let Mwidth = div.offsetWidth;
        // let Mheight = div.offsetHeight;
        // let Wwidth = window.innerWidth;
        // let Wheight = window.innerHeight;
        // document.querySelector(modalClass).classList.add('modal-active')
        // div.style.position = "absolute";
        // div.style.top = ((Wheight - Mheight ) / 2 +window.pageYOffset ) + "px";
        // div.style.left = ((Wwidth - Mwidth) / 2 +window.pageXOffset ) + "px";
        // $(modalClass).on('scroll touchmove mousewheel', function(e){
        //   e.preventDefault();
        //   e.stopPropagation();
        //   return false;
        // })
};


const mealsVideo = document.getElementById('add-meals-video')
const navbar = document.querySelector('.navbar--dashboard')

const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value

const checkYourMealsBtn = document.querySelector('.check-today-meals')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.5;
}

// animations
const shakeAnimation = (contentBox) => {
    setTimeout(() => {
       contentBox.classList.toggle('shake-animation')
    }, 1000);
}


// save
const saveMeal = (ingredients) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/save/added-meal`
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'ingredientsArray': ingredients,
            'csrfmiddlewaretoken': csrfToken,
        },
    })
}
const ajaxCallSave = (mealItems) => {
    let ingredientsArr = []
    mealItems.forEach(item => {
        if (item.dataset.objecttemplate) {
            const mealObj = JSON.parse(decodeURIComponent(item.dataset.objecttemplate));
            const parent = item.children[2]
            const inputValue = parent.children[0].value
            mealObj.forEach(el => {
                getMealTemplateElement(el, inputValue)
            })
        }
        else if (item.dataset.object) {
            const mealObj = JSON.parse(decodeURIComponent(item.dataset.object));
            const parent = item.children[2]
            const inputValue = parent.children[0].value
            let obj = {
                'ingredientId': mealObj.id,
                'quantity': inputValue,
            }
            ingredientsArr.push(obj)
        }
    })
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/save/added-meal`
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
// search
const ajaxCallSearch = (query) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/live-search-ingredients`
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
                   const langPrefix = window.location.href.split('/')[3];
                   let isGram
                   let categoryName
                   let ingredientName
                   let unit_name
                   if (langPrefix === 'pl'){
                       isGram = ingredient.unit_name_pl === 'g' ? '' : `lub ${Math.round(ingredient.serving_grams)} g`
                       categoryName = ingredient.category_name_pl
                       ingredientName = ingredient.pl_name
                       unit_name = ingredient.unit_name_pl
                   }
                   else {
                       isGram = ingredient.unit_name_en === 'g' ? '' : `or ${Math.round(ingredient.serving_grams)} g`
                       categoryName = ingredient.category_name_en
                       ingredientName = ingredient.en_name
                       unit_name = ingredient.unit_name_en
                   }

                    contentToAppend = `
                    <div class="add-meals__search__results__container__item">
                        <p><b>${ingredientName}</b> (${Math.trunc(ingredient.kcal)} kcal / ${unit_multiplier} ${unit_name} ${isGram})</p>
                        <div data-object='${encodeURIComponent(JSON.stringify(ingredient))}' id='${ingredient.id}' class="new-meal-item-add add-icon filter-green"></div>
                        <small class="search-category-small">${gettext('Category')}: <span class="search-category-small__text">${categoryName}</span></small>
                    </div>
                   `

                   searchResponseBox.insertAdjacentHTML('beforeend', contentToAppend)
               })
                // after clicking + on search
                const addButtons = document.querySelectorAll('.new-meal-item-add')
                addButtons.forEach(button => {
                    button.addEventListener('click', e =>{
                        const mealContent = document.querySelector('.add-meals__added--added__content')
                        const getMealObject = JSON.parse(decodeURIComponent(e.target.dataset.object));
                        const allAddedItems = document.querySelectorAll('.add-meals__added--added__content__item')
                        let isAlreadyAdded = false
                        allAddedItems.forEach(item => {
                            const pk = item.dataset.pk
                            if (parseInt(pk) === getMealObject.id){
                                isAlreadyAdded = true
                            }
                        })
                        if (!isAlreadyAdded){
                            let unit_multiplier = getMealObject.unit_multiplier
                            const langPrefix = window.location.href.split('/')[3];
                            let isGram
                            let mealName
                            let unitName
                            if (langPrefix === 'pl') {
                                isGram = getMealObject.unit_name_pl === 'g' ? '' : `lub ${Math.round(getMealObject.serving_grams)} g`
                                mealName = getMealObject.pl_name
                                unitName = getMealObject.unit_name_pl
                            }
                            else {
                                isGram = getMealObject.unit_name_en === 'g' ? '' : `or ${Math.round(getMealObject.serving_grams)} g`
                                mealName = getMealObject.en_name
                                unitName = getMealObject.unit_name_en
                            }
                            const infoResults = document.querySelector('.saved-results-info')
                            infoResults.classList.add('not-visible')
                            const mealItemAppend = `
                                   <div data-object="${e.target.dataset.object}" data-pk='${getMealObject.id}' class="add-meals__added--added__content__item">
                                       <p><b>${mealName}</b> (${Math.trunc(getMealObject.kcal)} kcal / ${unit_multiplier} ${unitName} ${isGram})</p>
                                      <div class="today-meals-added-remove-btn temporary-meal-today remove-icon filter-red"></div>
                                      <div class="today-meals-added-inputBox">
                                        <input min="1" max="1000" class="new-today-meal-input-quantity" name="${mealName}" type="number" placeholder="${unitName}">
                                        <label for="${mealName}">x ${unitName}</label>
                                      </div>
                            </div>
                          `
                            mealContent.insertAdjacentHTML('beforeend', mealItemAppend)
                            const removeAddedBtn = document.querySelectorAll('.temporary-meal-today')
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
                        }
                    })
                })
            }
            else if (status === 404) {
                const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
                searchResponseBox.innerHTML = `<h3 class="search-results-info">${gettext('No search results.')}</h3>`
            }

            },
        error: function (error) {
            searchResponseBox.innerHTML = `<h3 class="search-results-info">${gettext('No search results.')}</h3>`
            const searchElements = Array.from(searchResponseBox.children)
                searchElements.forEach(el => {
                    el.remove()
                })
        },
    })
}

const getMealTemplateElement = (id, inputValue) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/meals/data/get/saved-meal/template/element`
    $.ajax({
        'type': 'get',
         url: url,
         data: {
            'mealElementId': id,
         },
        success: function (response){
            const ingredients_arr = []
            const obj = JSON.parse(response['mealTemplateElement'])
            const ingredient_id = obj.ingredientId
            const quantity = obj.quantity * inputValue
            let meal_obj = {
                'ingredientId': ingredient_id,
                'quantity': quantity,
            }
            ingredients_arr.push(meal_obj)
            saveMeal(JSON.stringify(ingredients_arr))
        },
        error: function (error){

        }
    })
}
const ajaxCallSearchTemplate = (id) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = `/${langPrefix}/meals/data/get/saved-meal/template`
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
           const infoResults = document.querySelector('.saved-results-info')
           infoResults.classList.add('not-visible')
           const langPrefix = window.location.href.split('/')[3];
           const allAlreadyAddedItems = document.querySelectorAll('.meal-from-template')
           let isAlreadyAdded = false
           allAlreadyAddedItems.forEach(item => {
               const pk = item.dataset.pk
               if (pk === mealObj.mealId){
                    isAlreadyAdded = true
               }
           })
           if(!isAlreadyAdded) {
               let placeholder
               if (langPrefix === 'pl') {
                   placeholder = 'razy'
                }
               else {
                   placeholder = 'times'
               }
               const mealItemAppend = `
                <div data-objectTemplate="${encodeURIComponent(JSON.stringify(mealObj.meal_elements_ids))}" data-pk='${mealObj.mealId}' class="add-meals__added--added__content__item meal-from-template">
                    <p><b>${mealName}</b> (${Math.trunc(kcal)} kcal)</p>
                    <div class="today-meals-added-remove-btn temporary-meal-today remove-icon filter-red"></div>
                    <div class="today-meals-added-inputBox">
                        <input min="1" max="1000" class="new-today-meal-input-quantity" name="${mealName}-${mealObj.mealId}" type="number" placeholder="${placeholder}">
                        <label for="${mealName}-${mealObj.mealId}">x ${placeholder}</label>
                    </div>
                </div>
            `
                const mealContent = document.querySelector('.add-meals__added--added__content')
                mealContent.insertAdjacentHTML('beforeend', mealItemAppend)
                const removeAddedBtn = document.querySelectorAll('.temporary-meal-today')
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
           }
        },
        error: function (error) {

        }
    })
}


// delete
const ajaxCallDelete = (mealId) => {
       const langPrefix = window.location.href.split('/')[3];
       const url = location.origin + `/${langPrefix}/meals/data/delete/added-meal`
       $.ajax({
        type: "POST",
        url: url,
        data: {
            'meal_id': mealId,
            'csrfmiddlewaretoken': csrfToken,
        },
        success: function (response){
            const status = response.status
            if (status === 200) {
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



// listeners
const alreadySavedButtons = document.querySelectorAll('.meal-saved')
alreadySavedButtons?.forEach(button => {

    button.addEventListener('click', e=> {
        const mealId = button.dataset.mealobjid
        openModal('.modal-accept-delete')
        const acceptBtn = document.querySelector('.accept-delete-today-meal')
        const denyBtn = document.querySelector('.deny-delete-today-meal')
        const modalCloseBtn = document.querySelector('.modal-accept-delete-close')
         denyBtn.addEventListener('click', e => {
             hideModal('modal-accept-delete')
        })
         modalCloseBtn.addEventListener('click', e => {
             hideModal('modal-accept-delete')

        })
        acceptBtn.addEventListener('click', e => {
            ajaxCallDelete(mealId)
            const alreadyAddedBox = document.querySelector('.add-meals__already__added')
            const heading = document.querySelector('.meals-on-date')
            const item = button.parentElement
            item.remove()
            hideModal('modal-accept-delete')
            if (alreadyAddedBox.children.length === 0) {
                button.remove()
                heading.remove()
                alreadyAddedBox.remove()
                const infoResults = document.querySelector('.saved-results-info')
                infoResults.classList.remove('not-visible')
            }
        })
    })
})


const searchInput = document.querySelector('.search-meal-add')
searchInput.addEventListener('input', e => {
    const searchQuery = e.target.value
    const searchResponseBox = document.querySelector('.add-meals__search__results__container')
    if (searchQuery !== '' ) {
        ajaxCallSearch(searchQuery)

    }
    else {
        searchResponseBox.innerHTML = `<h3 class="search-results-info" style="text-align: center">${gettext('Try to search meal or ingredients that have you eaten today.')}
                            <br>${gettext('Results will appear here.')}</h3>`
    }
})


const saveMealBtn = document.querySelector('.save-add-today-meals')
saveMealBtn.addEventListener('click', () => {
    const mealsItems = Array.from(document.querySelectorAll('.add-meals__added--added__content__item'))
    const quantityInputs = document.querySelectorAll('.new-today-meal-input-quantity')
    let inputsValid = true
    quantityInputs.forEach(inputEl => {
        if(!inputEl.value || inputEl.value.length === 0 || inputEl.value === '') {
            inputEl.classList.add('color-error')
            inputEl.classList.toggle('shake-animation')
            shakeAnimation(inputEl)
            setTimeout(function () {
                inputEl.classList.remove('color-error')
            }, 1500);
            inputsValid = false
        }
    })
    if(mealsItems.length > 0 && inputsValid) {
        ajaxCallSave(mealsItems)
    }
})


const savedTemplateItems = document.querySelectorAll('.add-meals__added--saved__content__item')
savedTemplateItems.forEach(item => {
    const addSavedButton = item.children[1]
    addSavedButton.addEventListener('click', e => {
        let mealTemplateObjId = item.dataset.objectid
        ajaxCallSearchTemplate(mealTemplateObjId)
    })
})

checkYourMealsBtn.addEventListener('click', e => {
    openModal('.modal-queued__today-meals-list')
})

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

const modalCloseTodayMeals = document.querySelector('.modal-queued__today-meals__close-button')
modalCloseTodayMeals.addEventListener('click', e=> {
    animateDeletingElementByClass('.modal-queued__today-meals-list', 1200)
})

