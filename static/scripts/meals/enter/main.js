const navbar = document.querySelector('.navbar--dashboard')
const traditionalBtn = document.querySelector('.modal-enter__content__container__card--traditional')
const barCodeBtn = document.querySelector('.modal-enter__content__container__card--bar-code')

navbar.classList.toggle('fix-navbar')

traditionalBtn.addEventListener('click', () => {
    console.log('eaeae')
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
         <div class="modal-enter__content__container__bar-code__search"><input type="text" placeholder="${gettext('Bar Code')}"/><span><img class="modal-enter__content__container__bar-code__search__icon" src="/static/images/svg/search.svg" alt="Search Icon" /></span></div>
         <p>${gettext('Bar code usually contains 13 letters, fe. "5449000000996" stands for Coca Cola.')}</p>
    </div>
    `
    parent.insertAdjacentHTML('beforeend', appendContent)
})