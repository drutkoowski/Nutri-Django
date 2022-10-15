const hamburgerNav = document.getElementById('navi-toggle')
const navigationList = document.getElementsByClassName('navigation__list')[0]


const gainsVideo = document.getElementById('gains-video')
const goalsVideo = document.getElementById('goals-video')

hamburgerNav.addEventListener('click', () => {

    if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
        navigationList.classList.add('not-visible')
    }
    else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
         navigationList.classList.remove('not-visible')
    }
})

if (gainsVideo && goalsVideo) {
    gainsVideo.playbackRate = 0.75;
    goalsVideo.playbackRate = 0.75;
}
