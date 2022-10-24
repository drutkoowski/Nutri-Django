const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

window.onresize = function(){ location.reload(); }


const mealsAddCard = document.querySelector('.meals__card--add')
mealsAddCard.addEventListener('click', e => {
    location.href = location.href + '/add'
})