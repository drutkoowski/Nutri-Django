const hamburgerNav = document.getElementById('navi-toggle')
const navigationList = document.getElementsByClassName('navigation__list')[0]
const navigationNavDiv = document.getElementsByClassName('navigation__nav')[0]



hamburgerNav.addEventListener('click', () => {
    console.log(hamburgerNav.checked)

    if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
        navigationList.classList.add('not-visible')
    }
    else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
         navigationList.classList.remove('not-visible')
    }


})


