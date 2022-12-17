const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});

const searchRecipeCard = document.querySelector('.recipes__card--search')
searchRecipeCard.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/recipes/search`
})

const addRecipeCard = document.querySelector('.recipes__card--add')
addRecipeCard.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/recipes/add`
})

const recipeIdeasCard = document.querySelector('.recipes__card--ideas')
recipeIdeasCard.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/recipes/ideas`
})