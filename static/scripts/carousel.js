/// CAROUSEL CONTENT APPEND !!!!!
const carouselTrack = document.querySelector('.carousel__track')
const mediaQuery = window.matchMedia('(max-width: 46.875em)')
if (mediaQuery.matches){
    const appendElement = `
    <li class="carousel__slide">
    <div class="carousel__slide__card carousel__slide__card--1">
     <figure class="carousel__slide__card__flex-container story__shape">
            <img class="carousel__slide__card__avatar" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="User Image">
          <figcaption class="story__caption carousel__slide__card__username">John</figcaption>
       </figure>
       <div class="carousel__slide__card__stars">
           <img class="carousel__slide__card__stars__star" src="/static/images/svg/star.svg" alt="Star Icon">
           <img class="carousel__slide__card__stars__star" src="/static/images/svg/star.svg" alt="Star Icon">
           <img class="carousel__slide__card__stars__star" src="/static/images/svg/star.svg" alt="Star Icon">
           <img class="carousel__slide__card__stars__star" src="/static/images/svg/star.svg" alt="Star Icon">
           <img class="carousel__slide__card__stars__star" src="/static/images/svg/star.svg" alt="Star Icon">
       </div>
       <p class="carousel__slide__card__description">${gettext('This application is second to none. Unique in its simplicity.')}</p>
       </div>
    </li>
`
    carouselTrack.insertAdjacentHTML('beforeend', appendElement)
}



const track = document.querySelector('.carousel__track')
const slides = Array.from(track.children)
const nextButton = document.querySelector('.carousel__button--right')
const prevButton = document.querySelector('.carousel__button--left')

const firstSlide = document.getElementById('carousel__slide--first-slide')
const lastSlide = document.getElementById('carousel__slide--last-slide')
const firstDot = document.getElementById('carousel__nav--first-dot')
const lastDot = document.getElementById('carousel__nav--last-dot')

const dotsNav = document.querySelector('.carousel__nav')
const dots = Array.from(dotsNav.children)

const slideWidth = slides[0].getBoundingClientRect().width

const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px'
}

slides.forEach(setSlidePosition)

const moveToSlide = (track, currentSlide, targetSlide) => {
    // console.log('targ', targetSlide)
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')'
    currentSlide.classList.remove('current-slide')
    targetSlide.classList.add('current-slide')

}

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide')
    targetDot.classList.add('current-slide')
}

// const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
//
//      if(targetIndex === 0) {
//         prevButton.classList.add('not-visible')
//         nextButton.classList.remove('not-visible')
//     }
//     else if (targetIndex === slides.length - 1){
//         nextButton.classList.add('not-visible')
//         prevButton.classList.remove('not-visible')
//     }
//     else {
//         prevButton.classList.remove('not-visible')
//         nextButton.classList.remove('not-visible')
//     }
// }

// clicking left = move slide left
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide')
    let prevSlide = currentSlide.previousElementSibling
    if (prevSlide === null) prevSlide = lastSlide

    const currentDot = dotsNav.querySelector('.current-slide')
    let prevDot = currentDot.previousElementSibling
    if (prevDot === null) prevDot = lastDot

    moveToSlide(track, currentSlide, prevSlide)
    updateDots(currentDot, prevDot)
    // hideShowArrows(slides,prevButton, nextButton, prevIndex)
})

// clicking right = move slide right
const goNextSlide = () => {
    const currentSlide = track.querySelector('.current-slide')
    let nextSlide = currentSlide.nextElementSibling
    if (nextSlide === null) nextSlide = firstSlide

    const currentDot = dotsNav.querySelector('.current-slide')
    let nextDot = currentDot.nextElementSibling
    if (nextDot === null) nextDot = firstDot

    moveToSlide(track, currentSlide, nextSlide)
    updateDots(currentDot, nextDot)
}
nextButton.addEventListener('click', e => {
    goNextSlide()
})


// clicking nav indicator, move that slide
dotsNav.addEventListener('click', e => {
    // what was clicked?
    const targetDot = e.target.closest("button") // register clicking only on button not the whole element

    if (!targetDot) return;
    const currentSlide = track.querySelector('.current-slide')
    const currentDot = dotsNav.querySelector('.current-slide')
    const targetIndex = dots.findIndex(dot => dot === targetDot)
    const targetSlide = slides[targetIndex]

    moveToSlide(track,currentSlide, targetSlide)
    updateDots(currentDot, targetDot)

    // hideShowArrows(slides,prevButton, nextButton, targetIndex)
})


const automaticSlideChanger = () => {
    goNextSlide()
}




setInterval(automaticSlideChanger, 5000);
