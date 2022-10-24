const hamburgerNav = document.getElementById('navi-toggle')
const navigationList = document.getElementsByClassName('navigation--dashboard__list')[0]

const hamburgerNavSmall = document.getElementById('navi-toggle-small')
const navigationListSmall = document.getElementsByClassName('navigation--dashboard--small__list')[0]

hamburgerNav.addEventListener('click', () => {

    if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
        navigationList.classList.add('not-visible')
    }
    else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
         navigationList.classList.remove('not-visible')
    }
})

hamburgerNavSmall.addEventListener('click', () => {

    if (!navigationListSmall.classList.contains('not-visible') && !hamburgerNavSmall.checked) {
        navigationListSmall.classList.add('not-visible')
    }
    else if (navigationListSmall.classList.contains('not-visible') && hamburgerNavSmall.checked) {
         navigationListSmall.classList.remove('not-visible')
    }
})

const gainsVideo = document.getElementById('gains-video')
const goalsVideo = document.getElementById('goals-video')
if (gainsVideo && goalsVideo) {
    gainsVideo.playbackRate = 0.75;
    goalsVideo.playbackRate = 0.75;
}

