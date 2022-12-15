const allSections = Array.from(document.querySelectorAll('.section'))
const allSectionsY = Array.from(document.querySelectorAll('.section'))
const allYArr = []
allSectionsY.forEach(section => {
  const y = section.getBoundingClientRect().top
  allYArr.push(y)
})

let index = 0
const animationDuration = 500
let lastTime = 0

$(window).bind('mousewheel', function(event) {
  const currentTime = new Date().getTime()
   if (currentTime - lastTime < animationDuration){
      event.preventDefault()
      return
   }
   else {
     if (event.originalEvent.wheelDelta >= 0) {
        console.log('Scroll up');
        if (index >= 0){
        index = index - 1
        console.log(allYArr[index])
        window.scrollTo({
          top: allYArr[index],
          behavior: 'smooth',
        })
      }
      }
      else {
          console.log('Scroll down');
          if (index < 5){
            index = index + 1
            console.log(allYArr[index])
            window.scrollTo({
              top: allYArr[index],
              behavior: 'smooth',
            })
          }
      }
      lastTime = currentTime
   }

});
