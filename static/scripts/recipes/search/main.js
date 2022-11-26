const mealsVideo = document.getElementById('meals-video')
const navbar = document.querySelector('.navbar--dashboard')

navbar.classList.toggle('fix-navbar')

if (mealsVideo) {
    mealsVideo.playbackRate = 0.55;
}

window.onresize = function(){ location.reload(); }


const searchRecipes = (query) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = location.origin + `/${langPrefix}/recipes/live-search-recipes`
    $.ajax({
        type: 'get',
        url: url,
        data: {
            'query': query,
        },
        success: function (response){
            console.log(response)
        }
    })
}

const recipeSearchInput = document.querySelector('.recipe-search-add')
recipeSearchInput.addEventListener('input', (e) => {
    const query = e.target.value
    searchRecipes(query)
})