// const htmlStart = document.querySelector('html')
// htmlStart.style.overflow = 'hidden'
// document.body.style.overflow = "hidden";
// const animateDown = (index) => {
//     if (index === 1){
//         const meanings = document.querySelector('.about__meanings')
//         const img = document.querySelector('.about__img-phone')
//         meanings.classList.add('animate-bottom')
//         img.classList.add('animate-bottom')
//         img.addEventListener('transitionend', () =>{
//             console.log('eaea')
//             img.classList.remove('animate-bottom')
//         })
//         meanings.addEventListener('transitionend', () =>{
//             console.log('eaea')
//             meanings.classList.remove('animate-bottom')
//         })
//     }
// }
//
// const animateUp = (index) => {
//     if (index === 1){
//         const meanings = document.querySelector('.about__meanings')
//         const img = document.querySelector('.about__img-phone')
//         meanings.classList.add('animate-top')
//         img.classList.add('animate-top')
//         meanings.addEventListener('transitionend', () =>{
//             meanings.classList.remove('animate-top')
//         })
//         img.addEventListener('transitionend', () =>{
//             img.classList.remove('animate-top')
//         })
//     }
// }
//
// document.addEventListener("DOMContentLoaded", function(){
//     let index = 0
//
//     htmlStart.style.removeProperty('overflow')
//     let isFirstScroll = true
//     window.onresize = function(){ location.reload(); }
//     const allVideos = document.querySelectorAll('.bg-video')
//     if (allVideos){
//          allVideos.forEach(video => {
//             const videoEl = video.getElementsByTagName('video')[0]
//             videoEl.playbackRate = 0.75
//         })
//     }
//
//
//     const html = document.querySelector('html')
//     // html.style.backgroundColor = 'rgba(11,1,1,1)'
//     html.classList.add('no-scroll')
//     // const lastPos = document.body.getBoundingClientRect().top
//     const allSections = Array.from(document.querySelectorAll('.section'))
//     const allYArr = []
//     allSections.forEach(section => {
//       const y = section.getBoundingClientRect().top
//       allYArr.push(y)
//     })
//
//
//     const animationDuration = 100
//     let lastTime = 0
//
//     $(window).bind('mousewheel', function(event) {
//        const currentTime = new Date().getTime()
//        if (currentTime - lastTime < animationDuration && !isFirstScroll){
//           return
//        }
//        else {
//          isFirstScroll = false
//          if (event.originalEvent.wheelDelta >= 0) {
//             if (index >= 0){
//                 if (index > 0){
//                     index = index - 1
//                 }
//                 console.log(index)
//                 animateUp(index)
//                 window.scrollTo({
//                   top: allYArr[index],
//                   behavior: 'smooth',
//                 })
//             }
//           }
//           else {
//               if (index < 5 && index >= 0){
//                   index = index + 1
//                   console.log(index)
//                   animateDown(index)
//                   window.scrollTo({
//                       top: allYArr[index],
//                       behavior: 'smooth',
//                   })
//               }
//
//           }
//           lastTime = currentTime
//        }
//       // console.clear()
//     });
//     const arrowUp = document.querySelector('.scroll-up-arrow')
//     arrowUp.addEventListener('click', () => {
//       index = 0
//        window.scrollTo({
//          top: allYArr[index],
//          behavior: 'smooth',
//        })
//       // console.clear()
//     })
//
//     const startingPos = html.getBoundingClientRect().top
//     if (startingPos < 50){
//       index = 0
//        window.scrollTo({
//          top: allYArr[index],
//          behavior: 'smooth',
//        })
//       // console.clear()
//     }
// });
//
//
//
let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});
const navAbout = document.querySelector('#nav-about')
navAbout.addEventListener('click', () => {
    const navi = document.querySelector('#navi-toggle')
    navi.checked = false
})
const navReviews = document.querySelector('#nav-reviews')
navReviews.addEventListener('click', () => {
    const navi = document.querySelector('#navi-toggle')
    navi.checked = false
})
const navContact = document.querySelector('#nav-contact')
navContact.addEventListener('click', () => {
    const navi = document.querySelector('#navi-toggle')
    navi.checked = false
})

const arrowUp = document.querySelector('.scroll-up-arrow')
arrowUp.addEventListener('click', () => {
    const topElement = document.querySelector('.background-photo-container--header')
    window.scrollTo({
        top: topElement.getBoundingClientRect().top,
        behavior: 'smooth',
    })
})