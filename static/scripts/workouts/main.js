const menuWorkoutsVideo = document.getElementById('menu-workouts-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (menuWorkoutsVideo) {
    menuWorkoutsVideo.playbackRate = 0.55;
}

let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});

const workoutAddCard = document.querySelector('.workouts__card--add')
workoutAddCard.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts/add`
})

const workoutEnter = document.querySelector('.workouts__card--enter')
workoutEnter.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts/enter`
})

const savedWorkoutsCard = document.querySelector('.workouts__card--saved')
savedWorkoutsCard.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts/saved`
})