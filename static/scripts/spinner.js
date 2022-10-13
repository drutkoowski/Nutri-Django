
window.addEventListener("load", () => {
    const headerUpper = document.getElementById('header-upper')
    const headerLower = document.getElementById('header-lower')
    if (headerUpper && headerLower) {
        headerUpper.classList.add('not-visible')
        headerLower.classList.add('not-visible')
    }
    const loader = document.querySelector('.loader')
    loader.classList.add('loader--hidden')
    loader.addEventListener('transitionend', () => {
        const headerUpper = document.getElementById('header-upper')
        const headerLower = document.getElementById('header-lower')
        if (headerUpper && headerLower) {
            headerUpper.classList.remove('not-visible')
            headerLower.classList.remove('not-visible')
            headerUpper.classList.add('header__quote')
            headerLower.classList.add('header__quote')
        }

    })
})
console.log('asdsa')

