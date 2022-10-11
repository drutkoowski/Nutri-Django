const hamburgerNav = document.getElementById('navi-toggle')
const navigationList = document.getElementsByClassName('navigation__list')[0]
const navigationNavDiv = document.getElementsByClassName('navigation__nav')[0]



hamburgerNav.addEventListener('click', () => {
    console.log(hamburgerNav.checked)

    if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
        console.log('blok wylaczenia')
        navigationList.classList.add('not-visible')
    }
    else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
        console.log('blok wlaczenia')
         navigationList.classList.remove('not-visible')
    }


})


