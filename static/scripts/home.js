const htmlStart = document.querySelector('html')
htmlStart.style.overflow = 'hidden'
document.addEventListener("DOMContentLoaded", function(){

    htmlStart.style.removeProperty('overflow')
    let isFirstScroll = true
    window.onresize = function(){ location.reload(); }
    const allVideos = document.querySelectorAll('.bg-video')
    if (allVideos){
         allVideos.forEach(video => {
            const videoEl = video.getElementsByTagName('video')[0]
            videoEl.playbackRate = 0.75
        })
    }


    const html = document.querySelector('html')
    // html.style.backgroundColor = 'rgba(11,1,1,1)'
    html.classList.add('no-scroll')
    // const lastPos = document.body.getBoundingClientRect().top
    const allSections = Array.from(document.querySelectorAll('.section'))
    const allYArr = []
    allSections.forEach(section => {
      const y = section.getBoundingClientRect().top
      allYArr.push(y)
    })

    let index = 0
    const animationDuration = 50
    let lastTime = 0

    $(window).bind('mousewheel', function(event) {
       const currentTime = new Date().getTime()
       if (currentTime - lastTime < animationDuration && !isFirstScroll){
          return
       }
       else {
         isFirstScroll = false
         if (event.originalEvent.wheelDelta >= 0) {
             console.log('up')
            if (index >= 0){
            index = index - 1
            window.scrollTo({
              top: allYArr[index],
              behavior: 'smooth',
            })
          }
          }
          else {
              if (index < 5){
                   console.log('down')
                index = index + 1
                window.scrollTo({
                  top: allYArr[index],
                  behavior: 'smooth',
                })
              }

          }
          lastTime = currentTime
       }
      // console.clear()
    });
    const arrowUp = document.querySelector('.scroll-up-arrow')
    arrowUp.addEventListener('click', () => {
      index = 0
       window.scrollTo({
         top: allYArr[index],
         behavior: 'smooth',
       })
      // console.clear()
    })

    const startingPos = html.getBoundingClientRect().top
    if (startingPos < 50){
      index = 0
       window.scrollTo({
         top: allYArr[index],
         behavior: 'smooth',
       })
      // console.clear()
    }
});


