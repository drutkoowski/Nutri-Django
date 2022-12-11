const navbar = document.querySelector('.navbar--dashboard')
navbar.classList.toggle('fix-navbar')
// entry modal
const traditionalBtn = document.querySelector('.modal-enter__content__container__card--traditional')
const barCodeBtn = document.querySelector('.modal-enter__content__container__card--bar-code')
const closeBtn = document.querySelector('.modal-enter__close-button')
// output modal
const inputName = document.querySelector('#name')
const inputKcal = document.querySelector('#kcal')
const inputCarbs = document.querySelector('#carbs')
const inputFats = document.querySelector('#fats')
const inputProtein = document.querySelector('#protein')
const inputServing = document.querySelector('#serving')
const nutriGrade = document.querySelector('#grade')



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
         <p class="modal-enter__content__container__bar-code__error-msg" style="visibility: hidden"></p>
         <div class="modal-enter__content__container__bar-code__search"><input id="bar-code" type="text" placeholder="${gettext('Bar Code')}"/><span><img class="modal-enter__content__container__bar-code__search__icon" src="/static/images/svg/search.svg" alt="Search Icon" /></span></div>
         <p>${gettext('Bar code usually contains 13 letters, fe. "5449000000996" stands for Coca Cola.')}</p>
    </div>
    `
    parent.insertAdjacentHTML('beforeend', appendContent)
    const barCodeSearchIcon = document.querySelector('.modal-enter__content__container__bar-code__search__icon')
    const searchInputBarCode = document.querySelector('#bar-code')
    var reg = /^\d+$/;
    searchInputBarCode.addEventListener('input', () => {
        const searchValue = searchInputBarCode.value
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
                console.log(response)
                if (response.status !== 0){
                    const data = response['product']
                    console.log(data)
                    const productNameEn = data['product_name_en'] ? data['product_name_en'] : data['product_name']
                    const productNamePl = data['product_name_pl'] ? data['product_name_pl'] : data['product_name']
                    const servingGrams = data['nutrition_data_per']
                    const nutriScoreGrade = data['nutriscore_grade']
                    const carbs = data['nutriments']['carbohydrates_value']
                    const kcal = data['nutriments']['energy_value']
                    const fat = data['nutriments']['fat_value']
                    const protein = data['nutriments']['proteins_value']
                    const elementSizeGrams = data['quantity']
                    console.log(productNamePl, productNameEn, servingGrams, nutriScoreGrade, carbs, kcal, fat, protein)
                    inputName.value = langPrefix === 'en' ? productNameEn + ` (${elementSizeGrams})` : productNamePl + ` (${elementSizeGrams})`
                    inputKcal.value = `${kcal} kcal`
                    inputCarbs.value = `${carbs} g`
                    inputFats.value = `${fat} g`
                    inputProtein.value = `${protein} g`
                    inputServing.value = `${servingGrams}`
                    nutriGrade.innerHTML = nutriScoreGrade ? nutriScoreGrade : gettext('Unknown')
                    const modal = document.querySelector('.modal-queued')
                    modal.classList.add('not-visible')
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