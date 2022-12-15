

function hideModal() {
    const activeModals = document.querySelectorAll('.modal-active')
    if (activeModals) {
        activeModals.forEach(modal => {
            modal.classList.add('not-visible')
            modal.classList.remove('modal-active')
        })
    }
}
const flagsIcons = document.querySelectorAll('.navigation__link__icon--flag')
if (flagsIcons){
    flagsIcons.forEach(flag => {
    flag.addEventListener('click', e => {

        const langPrefix = flag.dataset.langprefix
        const currentLoc = window.location.pathname;
        window.location = window.origin + '/' + langPrefix + '/' + currentLoc.split('/').slice(2).join('/')
    })
})
}


if ((location.href !== location.origin + '/pl' || location.href !== location.origin + '/en' || location.href !== location.origin + '/pl/' || location.href !== location.origin + '/en/') && location.href !== location.origin + '/pl/login/' && location.href !== location.origin + '/pl/login' && location.href !== location.origin + '/en/login/' && location.href !== location.origin + '/en/login' && location.href !== location.origin + '/pl/signup/' && location.href !== location.origin + '/pl/signup' && location.href !== location.origin + '/en/signup/' && location.href !== location.origin + '/en/signup') {

    const hamburgerNav = document.getElementById('navi-toggle')
    const navigationList = document.getElementsByClassName('navigation--dashboard__list')[0]

    const hamburgerNavSmall = document.getElementById('navi-toggle-small')
    const navigationListSmall = document.getElementsByClassName('navigation--dashboard--small__list')[0]
    hamburgerNav.addEventListener('click', () => {
        hideModal()
        if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
            navigationList.classList.add('not-visible')
        }
        else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
             navigationList.classList.remove('not-visible')
             const navbar = document.querySelector('.navbar--dashboard')
                $(navbar).on('scroll touchmove mousewheel', function(e){
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
             })
        }
    })
    if (hamburgerNavSmall)
    {
         hamburgerNavSmall.addEventListener('click', () => {
         hideModal()

        if (!navigationListSmall.classList.contains('not-visible') && !hamburgerNavSmall.checked) {
            navigationListSmall.classList.add('not-visible')
        }
        else if (navigationListSmall.classList.contains('not-visible') && hamburgerNavSmall.checked) {
             navigationListSmall.classList.remove('not-visible')
             const navbar = document.querySelector('.navbar--dashboard--small')
                $(navbar).on('scroll touchmove mousewheel', function(e){
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
             })
        }
    })
    }

}
if (location.href !== location.origin + '/pl' || location.href !== location.origin + '/en' || location.href !== location.origin + '/pl/' || location.href !== location.origin + '/en/'){
    const gainsVideo = document.getElementById('gains-video')
    const goalsVideo = document.getElementById('goals-video')
    if (gainsVideo && goalsVideo) {
        gainsVideo.playbackRate = 0.75;
        goalsVideo.playbackRate = 0.75;
    }

    const hamburgerNav = document.querySelector('#navi-toggle')
    const navigationList = document.getElementsByClassName('navigation__list')[0]
     hamburgerNav.addEventListener('click', () => {
        hideModal()
        if(navigationList){
            if (!navigationList.classList?.contains('not-visible') && !hamburgerNav.checked) {
                navigationList.classList.add('not-visible')
             }
            else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
                navigationList.classList.remove('not-visible')
                const navbar = document.querySelector('.navbar')
                    $(navbar).on('scroll touchmove mousewheel', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                })
            }
        }

    })
}
else {
    console.log('eaea')
    const gainsVideo = document.getElementById('gains-video')
    const goalsVideo = document.getElementById('goals-video')
    if (gainsVideo && goalsVideo) {
        gainsVideo.playbackRate = 0.75;
        goalsVideo.playbackRate = 0.75;
    }
    const hamburgerNav = document.querySelector('#navi-toggle')
    const navigationList = document.getElementsByClassName('navigation__list')[0]
     hamburgerNav.addEventListener('click', () => {
         hideModal()
        if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
            navigationList.classList.add('not-visible')
        }
        else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
             navigationList.classList.remove('not-visible')
             const navbar = document.querySelector('.navbar')
                $(navbar).on('scroll touchmove mousewheel', function(e){
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                })
        }
    })
}

if (location.href === location.origin + '/pl/' || location.href === location.origin + '/en/'){
    const dateFooter = document.querySelector('.footer__copyright')
    const todayYear = new Date().getFullYear()
    const appendFooterContent = `
     Copyright &copy; ${todayYear}<span class="header__nutri-dot">.</span> All rights reserved<span class="header__nutri-dot">.</span>
    `
    dateFooter.insertAdjacentHTML('beforeend', appendFooterContent)
}
