const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

window.onresize = function(){ location.reload(); }


const mealsAddCard = document.querySelector('.meals__card--add')
mealsAddCard.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/meals/add`
})

const mealsEnterCard = document.querySelector('.meals__card--enter')
mealsEnterCard.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/meals/enter`
})

const mealsSaved = document.querySelector('.meals__card--saved')
mealsSaved.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/meals/saved`
})