const daysTag = document.querySelector(".days")
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const csrfToken = csrf[0].value
currentDate = document.querySelector(".current-date")
prevNextIcon = document.querySelectorAll(".icons span");

function hideModal(modalClass) {
    $("." + modalClass).fadeOut(900, e => {
         const modal = document.querySelector(`.${modalClass}`)
         modal.classList.add('not-visible')
         modal.style.removeProperty('display')
         modal.style.zIndex = '1'
    });
}

let openModal = function (modalClass) {
    // modal close listeners
        const modalCloseBtn = document.querySelector('.modal--calendar__close-button')
        modalCloseBtn.addEventListener('click', () => {
            hideModal('.modal--calendar')
            document.querySelector('.modal--calendar').remove()
        })
        let div = document.querySelector(modalClass);
        div.style.zIndex = '213132121'
        div.classList.remove('not-visible')
        div.classList.add('modal-active')
        // let Mwidth = div.offsetWidth;
        // let Mheight = div.offsetHeight;
        // let Wwidth = window.innerWidth;
        // let Wheight = window.innerHeight;
        // document.querySelector(modalClass).classList.add('modal-active')
        // div.style.position = "absolute";
        // div.style.top = ((Wheight - Mheight ) / 2 +window.pageYOffset ) + "px";
        // div.style.left = ((Wwidth - Mwidth) / 2 +window.pageXOffset ) + "px";
        // $(modalClass).on('scroll touchmove mousewheel', function(e){
        //   e.preventDefault();
        //   e.stopPropagation();
        //   return false;
        // })
};



const modalElement = `
  <div class="modal--calendar not-visible">
    <div class="modal--calendar__content">
        <div class="modal--calendar__close-button">&times;</div>
        <h1 class="modal--calendar--heading">${gettext('Your added activities or meals for ')} <span class="modal--calendar--heading__span"></span></h1>
         <div class="modal--calendar__content-summary">
             <div class="modal--calendar__content-summary__header">
                 <h2>${gettext('Daily Summary Info')}:</h2>
                 <div>
                     <p>${gettext('Kcal')}: <span class="summary-kcal-daily-calendar"></span> kcal</p>
                     <p>${gettext('Burnt')}: <span class="summary-kcal-burnt-daily-calendar"></span> kcal</p>
                     <p>${gettext('Carbs')}: <span class="summary-carbs-daily-calendar"></span> g</p>
                     <p>${gettext('Protein')}: <span class="summary-protein-daily-calendar"></span> g</p>
                     <p>${gettext('Fats')}: <span class="summary-fats-daily-calendar"></span> g</p>
                 </div>
             </div>
         </div>
              <div class="modal--calendar__content__elements">
                      <div class="modal--calendar__content__elements__item"></div>
              </div>
    </div>
</div>
`
// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear()
currMonth = date.getMonth();
const langPrefix = window.location.href.split('/')[3];
let months
// months translations
if (langPrefix === 'pl') {
    months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec",
              "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
}
else {
    months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
}


// modals and listeners

const addEventListeners = () => {
  [...document.querySelectorAll('.isEvent')].forEach(function(item) {
    item.addEventListener('click', function() {
        const date = item.dataset.date
        const langPrefix = window.location.href.split('/')[3];
        const url = window.location.origin + `/${langPrefix}/data/get/activity-list-by-day`
        let options = {
            weekday: "short",
            month: "long",
            day: "numeric"
        };
        let localeDate = new Date(date).toLocaleDateString(langPrefix, options);
        $.ajax({
            type: 'POST',
            data: {
               'date': date,
               'csrfmiddlewaretoken': csrfToken,
            },
            url: url,
            success: function (response){
                const body = document.body
                body.insertAdjacentHTML('beforeend', modalElement)
                openModal('.modal--calendar')
                const exercises = JSON.parse(response.data.exercises)
                const meals = JSON.parse(response.data.meals)
                const kcalSumEaten = response.data.eatenKcalSum
                const proteinSumEaten = response.data.eatenProteinSum
                const carbsSumEaten = response.data.eatenCarbsSum
                const fatsSumEaten = response.data.eatenFatSum
                let kcalBurntSum = 0
                exercises.forEach(exercise => {
                    kcalBurntSum = kcalBurntSum + exercise.kcalBurntSum
                })
                const dateHeading = document.querySelector('.modal--calendar--heading__span')
                dateHeading.innerHTML = `${localeDate}`
                const contentItemBox = document.querySelector('.modal--calendar__content__elements__item')
                const kcalSummarySpan = document.querySelector('.summary-kcal-daily-calendar')
                const kcalBurntSpan = document.querySelector('.summary-kcal-burnt-daily-calendar')
                const carbsSummarySpan = document.querySelector('.summary-carbs-daily-calendar')
                const proteinSummarySpan = document.querySelector('.summary-protein-daily-calendar')
                const fatsSummarySpan = document.querySelector('.summary-fats-daily-calendar')
                kcalSummarySpan.innerHTML = `<b>${kcalSumEaten}</b>`
                kcalBurntSpan.innerHTML = `<b>${kcalBurntSum.toFixed(2)}</b>`
                carbsSummarySpan.innerHTML = `<b>${carbsSumEaten}</b>`
                proteinSummarySpan.innerHTML = `<b>${proteinSumEaten}</b>`
                fatsSummarySpan.innerHTML = `<b>${fatsSumEaten}</b>`
                const mealsItemContainer = `
                   <div class="modal--calendar__content__elements__meals">
                       <h1>${gettext('Meals')}</h1>
                   </div>
                `
                 const activitiesItemContainer = `
                   <div class="modal--calendar__content__elements__workouts">
                       <h1>${gettext('Activities')}</h1>
                   </div>
                 `
                contentItemBox.insertAdjacentHTML('beforeend', activitiesItemContainer)
                contentItemBox.insertAdjacentHTML('beforeend', mealsItemContainer)
                if (meals.length > 0){

                    const elementsMealsBox = document.querySelector('.modal--calendar__content__elements__meals')
                    meals.forEach(meal => {
                        let mealName, unitName
                        if (langPrefix === 'pl'){
                            mealName = meal.ingredientNamePl
                            unitName = meal.unitNamePl
                        }
                        else {
                            mealName = meal.ingredientNameEn
                            unitName = meal.unitNameEn
                        }
                        let watch_media_query = '(max-width: 28.5em)';
                        let matched = window.matchMedia(watch_media_query).matches;
                        let contentToAppend
                        if (!matched) {
                            contentToAppend = `
                            <div>
                                <p><b>${mealName}</b> x ${meal.quantity} ${unitName}</p>
                                <small>Kcal: <b>${meal.kcal}</b>, ${gettext('Protein')}: <b>${meal.protein}</b> g, ${gettext('Fat')}: <b>${meal.fat}</b> g, ${gettext('Carbs')}: <b>${meal.carbs}</b> g</small>
                            </div>
                        `
                        }
                        else {
                            contentToAppend = `
                            <div>
                                <small><b>${mealName}</b> x ${meal.quantity} ${unitName}</small>
                                <small>Kcal: <b>${meal.kcal}</b></small> 
                                <small>${gettext('Protein')}: <b>${meal.protein}</b> g</small>
                                <small>${gettext('Fat')}: <b>${meal.fat}</b> g</small>
                                <small>${gettext('Carbs')}: <b>${meal.carbs}</b> g</small>
                            </div>
                        `
                        }
                        elementsMealsBox.insertAdjacentHTML('beforeend', contentToAppend)
                    })
                }
                else {
                    const elementsMealsBox = document.querySelector('.modal--calendar__content__elements__meals')
                    const infoMessage = `
                        <p class="modal--calendar__info-message">${gettext('You have not added any meals on this day')}.</p>
                    `
                    elementsMealsBox.insertAdjacentHTML('beforeend', infoMessage)

                }
                if (exercises.length > 0){

                    const elementsWorkoutsBox = document.querySelector('.modal--calendar__content__elements__workouts')
                    const ids_arr = []
                    exercises.forEach((exercise, index) => {
                        let randNumb = Math.round(Math.random() * 10 + 10)
                        if (ids_arr.includes(randNumb)){
                            randNumb = Math.round(Math.random() * 30 + 70)
                        }
                        ids_arr.push(randNumb)
                        const contentToAppend = `
                            <div class="workout_activity" id="workout${index + randNumb}"></div>
                        `
                        elementsWorkoutsBox.insertAdjacentHTML('beforeend', contentToAppend)
                        const exerciseElements = elementsWorkoutsBox.querySelector(`#workout${index + randNumb}`)
                        exercise.exerciseElements.forEach(element => {
                            let exerciseName
                            if (langPrefix === 'pl'){
                                 exerciseName = element.exerciseNamePl
                             }
                            else {
                                exerciseName = element.exerciseNameEn
                            }
                             const elementToAppend = `
                                <div>
                                    <p><b>${exerciseName}</b></p>
                                    <small>${gettext('Kcal Burnt')}: <b>${element.kcalBurnt}</b>, ${gettext('Duration')}: 
                                        <b>${element.duration}</b> min</small>
                                </div>
                            `
                            exerciseElements.insertAdjacentHTML('beforeend', elementToAppend)
                        })
                    })
                }
                else {
                    const elementsWorkoutsBox = document.querySelector('.modal--calendar__content__elements__workouts')
                    const infoMessage = `
                        <p class="modal--calendar__info-message">${gettext('You have not added any activities on this day')}.</p>
                    `
                    elementsWorkoutsBox.insertAdjacentHTML('beforeend', infoMessage)
                }
            }
        })
    });
   });
}
addEventListeners()

/// end modal and listeners



const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/profile-activities-date`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const dates = JSON.parse(response.data)
            const eventList = []
            dates.forEach(ev => {
                const date = new Date(ev)
                eventList.push(date)
            })
            let liTag = "";
            for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
                liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
            }
            for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
                // adding active class to li if the current day, month, and year matched
                let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
                let day_num = String(i)
                if (i < 10) {
                    day_num = `0${i}`
                }
                let dayClass = `${currYear}-${currMonth+1}-${day_num}`
                let dayDate = new Date(`${currYear}-${currMonth+1}-${day_num}`)
                const isEvent = eventList.find(date => date.toDateString() === dayDate.toDateString()) ? 'isEvent' : ''
                if (isEvent === 'isEvent'){
                  liTag += `<li data-date='${dayClass}' class="${isToday} ${dayClass} ${isEvent}">${i}<span></span></li>`;
                }
                else {
                    liTag += `<li data-date='${dayClass}' class="${isToday} ${dayClass}">${i}</li>`;
                }

            }
            for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
                liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
            }
            currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
            daysTag.innerHTML = liTag;
            addEventListeners()
        }
    })
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});
let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});
