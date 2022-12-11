const navbar = document.querySelector('.navbar--dashboard')
navbar.classList.toggle('fix-navbar')
// entry modal
const traditionalBtn = document.querySelector('.modal-enter__content__container__card--traditional')
const barCodeBtn = document.querySelector('.modal-enter__content__container__card--bar-code')
const closeBtn = document.querySelector('.modal-enter__close-button')

const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value
// output modal
const inputName = document.querySelector('#name')
const inputKcal = document.querySelector('#kcal')
const inputCarbs = document.querySelector('#carbs')
const inputFats = document.querySelector('#fats')
const inputProtein = document.querySelector('#protein')
const inputServing = document.querySelector('#serving')
const nutriGrade = document.querySelector('#grade')
const categoryInput = document.querySelector('#category')
const allInputs = Array.from(document.querySelectorAll('.meals-enter__input'))
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        var reg = /^\d+$/;
        if (!reg.test(input.value) && input.id !== 'name'){
            input.value = ''
        }
        input.value = input.value.slice(0,3);
        input.dataset.value = input.value
    })
})
categoryInput.addEventListener('change', () => {
    categoryInput.dataset.value = categoryInput.value
})


traditionalBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal-queued')
    modal.classList.add('not-visible')
})

barCodeBtn.addEventListener('click', () => {
    const parent = barCodeBtn.parentElement
    const parentChildren = Array.from(barCodeBtn.parentElement.children)
    parentChildren.forEach(child => {
        child.remove()
    })
    const appendContent = `
    <div class="modal-enter__content__container__bar-code">
         <h3>${gettext('Type BAR Code Below')}</h3>
         <p class="modal-enter__content__container__bar-code__error-msg" style="visibility: hidden; color=va"></p>
         <div class="modal-enter__content__container__bar-code__search"><input id="bar-code" type="text" placeholder="${gettext('Bar Code')}"/><span><img class="modal-enter__content__container__bar-code__search__icon" src="/static/images/svg/search.svg" alt="Search Icon" /></span></div>
         <p>${gettext('Bar code usually contains 13 letters, fe. "5449000000996" stands for Coca Cola.')}</p>
    </div>
    `
    parent.insertAdjacentHTML('beforeend', appendContent)
    const barCodeSearchIcon = document.querySelector('.modal-enter__content__container__bar-code__search__icon')
    const searchInputBarCode = document.querySelector('#bar-code')
    var reg = /^\d+$/;
    searchInputBarCode.addEventListener('input', () => {
        const searchValue = searchInputBarCode.value.trim()
        if(!reg.test(searchValue)){
            searchInputBarCode.value = ''
        }
    })
    barCodeSearchIcon.addEventListener('click', () => {
        const langPrefix = window.location.href.split('/')[3];
        const searchInputBarCode = document.querySelector('#bar-code').value
        $.ajax({
            type: 'get',
            url: `https://${langPrefix}.openfoodfacts.org/api/v0/product/${searchInputBarCode}.json`,
            header: {
                'User-Agent': 'Nutri - Android - Version 1.0'
            },
            success: function (response){
                if (response.status !== 0){
                    const data = response['product']
                    const productNameEn = data['product_name_en'] ? data['product_name_en'] : data['product_name']
                    const productNamePl = data['product_name_pl'] ? data['product_name_pl'] : data['product_name']
                    const servingGrams = data['nutrition_data_per']
                    const nutriScoreGrade = data['nutriscore_grade']
                    const carbs = data['nutriments']['carbohydrates_value']
                    const kcal = data['nutriments']['energy_value']
                    const fat = data['nutriments']['fat_value']
                    const protein = data['nutriments']['proteins_value']
                    const elementSizeGrams = data['quantity'] === undefined || !data['quantity'] ? '' : `(${data['quantity']})`
                    const productName = langPrefix === 'en' ? productNameEn : productNamePl
                    inputName.dataset.value = productName + elementSizeGrams
                    inputName.value = productName + elementSizeGrams
                    inputName.disabled = !(productName)
                    if (kcal !== undefined || kcal){
                        inputKcal.value = `${kcal} kcal`
                        inputKcal.dataset.value = kcal
                    }
                    inputKcal.disabled = !!(kcal || kcal === 0)
                    if (carbs !== undefined || carbs){
                        inputCarbs.value = `${carbs} g`
                        inputCarbs.dataset.value = carbs
                    }

                    inputCarbs.disabled = !!(carbs || carbs === 0)
                    if (fat !== undefined || fat) {
                        inputFats.value = `${fat} g`
                        inputFats.dataset.value = fat
                    }

                    inputFats.disabled = !!(fat || fat === 0)
                    if (protein !== undefined || protein){
                         inputProtein.value = `${protein} g`
                         inputProtein.dataset.value = protein
                    }

                    inputProtein.disabled = !!(protein || protein === 0)
                    if (servingGrams !== undefined || servingGrams){
                        inputServing.value = `${servingGrams}`
                        inputServing.dataset.value = servingGrams.replace(/\D/g, "")
                    }
                    inputServing.disabled = !!(servingGrams || servingGrams === 0)
                    const nutriGradeLabel = document.querySelector('#nutrition-grade')
                    nutriGradeLabel.classList.remove('not-visible')
                    nutriGrade.innerHTML = nutriScoreGrade ? nutriScoreGrade : gettext('Unknown')
                    $("." + "modal-queued").fadeOut(900, () => {
                        document.querySelector('.modal-queued').style.removeProperty('display')
                        document.querySelector('.modal-queued').classList.add('not-visible')
                    });

                }
                else {
                    const errorMsg = document.querySelector('.modal-enter__content__container__bar-code__error-msg')
                    errorMsg.style.removeProperty('visibility')
                    errorMsg.innerHTML = gettext('We could not find any matching element.')
                }
            }
        })
    })
})

closeBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal-queued')
    modal.classList.add('not-visible')
})


// save btn
const saveBtn = document.querySelector('.btn-light')
saveBtn.addEventListener('click', () => {
    let isValid = true
    const allInputs = Array.from(document.querySelectorAll('.meals-enter__input'))
    let elementName, categoryPk, kcal, carbs, fat, protein, servingGrams
    allInputs.forEach(input => {
        const inputVal = input.dataset.value
        if (inputVal) {
            const type = input.id
            if (type === 'name') {
                elementName = inputVal
            }
            else if (type === 'category') {
                categoryPk = inputVal
            }
            else if (type === 'kcal'){
                kcal = inputVal
            }
            else if (type === 'carbs'){
                carbs = inputVal
            }
            else if (type === 'fats'){
                fat = inputVal
            }
            else if (type === 'protein') {
                protein = inputVal
            }
            else if (type === 'serving'){
                servingGrams = inputVal
            }
        }
        else {
            isValid = false
            input.classList.add('color-error')
            input.classList.toggle('shake-animation')
            setTimeout(function () {
                input.classList.remove('color-error')
                input.classList.remove('shake-animation')
            }, 1500);
        }
    })
    if (isValid) {
        const langPrefix = window.location.href.split('/')[3];
        const url = location.origin + `/${langPrefix}/meals/data/save/new-meal-element`
        $.ajax({
            type: 'post',
            url: url,
            data: {
                'csrfmiddlewaretoken': csrfToken,
                'name': elementName,
                'categoryPk': categoryPk,
                'kcal': kcal,
                'carbs': carbs,
                'fat': fat,
                'protein': protein,
                'servingGrams': servingGrams,
                'langCode': langPrefix
            },
            success: function (response) {
                location.reload()
            }
        })
    }

})