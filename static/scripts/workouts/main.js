const menuWorkoutsVideo = document.getElementById('menu-workouts-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (menuWorkoutsVideo) {
    menuWorkoutsVideo.playbackRate = 0.55;
}

window.onresize = function(){ location.reload(); }

const workoutAddCard = document.querySelector('.workouts__card--add')
workoutAddCard.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts/add`
})

const savedWorkoutsCard = document.querySelector('.workouts__card--saved')
savedWorkoutsCard.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts/saved`
})