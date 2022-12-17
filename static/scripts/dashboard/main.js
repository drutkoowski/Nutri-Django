// custom function to get name of the day and return weekday number in format MON - SUN ( not default js function SUN - SAT) and utils
const getWeekDayNumber = (dayName) => {
    dayName = dayName.trim().toLowerCase()
    if (dayName === 'monday' || dayName === 'poniedziałek'){
        return 0
    }
    else if (dayName === 'tuesday' || dayName === 'wtorek'){
        return 1
    }
    else if (dayName === 'wednesday' || dayName === 'środa'){
        return 2
    }
    else if (dayName === 'thursday' || dayName === 'czwartek') {
        return 3
    }
    else if (dayName === 'friday' || dayName === 'piątek'){
        return 4
    }
    else if (dayName === 'saturday' || dayName === 'sobota') {
        return 5
    }
    else if (dayName === 'sunday' || dayName === 'niedziela'){
        return 6
    }
}

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  return previous;
}

function getNextDay(date = new Date()) {
  const next = new Date(date.getTime());
  next.setDate(date.getDate() + 1);
  return next;
}
// chart
let myChart = document.getElementById('summaryChart').getContext('2d')
let weekChart = document.getElementById('summaryWeekly').getContext('2d')
let nutritionDetails = document.getElementById('summaryNutritionDetails').getContext('2d')
let summaryChartBox
// date switcher init
const dateSwitcherDate = document.querySelector('.dashboard__content__welcome-text__day-switcher__date')
const langPrefix = window.location.href.split('/')[3];

const capitalize = (word) => {
    return word.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
}
let date = new Date();
const currentDay = date.toLocaleDateString(langPrefix, {'day': "2-digit"})
const currentMonth = date.toLocaleDateString(langPrefix, {'month': "2-digit"})
const currentYear = date.toLocaleDateString(langPrefix, {'year': "numeric"})
const currentWeekDayNumber = getWeekDayNumber(date.toLocaleDateString(langPrefix, {'weekday': "long"}))
const options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "numeric"
};

dateSwitcherDate.innerHTML =  capitalize(date.toLocaleDateString(langPrefix, options))
// arrows
const leftArrow = document.querySelector('#left-arrow-day')
if (date.getDay() !== 1){
    leftArrow.style.removeProperty('visibility')
}
const rightArrow = document.querySelector('#right-arrow-day')
leftArrow.addEventListener('click', () => {
    date = getPreviousDay(date)
    const prevWeekDayNumber = getWeekDayNumber(date.toLocaleDateString(langPrefix, {'weekday': "long"}))
    if (prevWeekDayNumber < currentWeekDayNumber) {
        dateSwitcherDate.innerHTML = capitalize(date.toLocaleDateString(langPrefix, options))
        rightArrow.style.removeProperty('visibility')
    }
    else {
        leftArrow.style.visibility = 'hidden'
    }
    if (prevWeekDayNumber === 0) {
        leftArrow.style.visibility = 'hidden'
    }
    const day = date.toLocaleDateString(langPrefix, {'day': "2-digit"})
    const month = date.toLocaleDateString(langPrefix, {'month': "2-digit"})
    const year = date.toLocaleDateString(langPrefix, {'year': "numeric"})
    getDataSummaryChart(day, month,year, 'update')
})
rightArrow.addEventListener('click', () => {
    date = getNextDay(date)
    const nextWeekDayNumber = getWeekDayNumber(date.toLocaleDateString(langPrefix, {'weekday': "long"}))
    if (nextWeekDayNumber <= currentWeekDayNumber) {
        dateSwitcherDate.innerHTML = capitalize(date.toLocaleDateString(langPrefix, options))
        leftArrow.style.removeProperty('visibility')
    }
    else {
        rightArrow.style.visibility = 'hidden'
    }
    if (nextWeekDayNumber === currentWeekDayNumber) {
        rightArrow.style.visibility = 'hidden'
    }
    const day = date.toLocaleDateString(langPrefix, {'day': "2-digit"})
    const month = date.toLocaleDateString(langPrefix, {'month': "2-digit"})
    const year = date.toLocaleDateString(langPrefix, {'year': "numeric"})
    getDataSummaryChart(day, month, year, 'update')
})




// watch if media query is true
const mediaQuery = window.matchMedia('(max-width: 62.5em)')
let indexAxis = 'y'

function handleTabletChange(e) {
  // Check if the media query is true
  if (e.matches) {
    indexAxis = 'x'
  }
}


// summary circle chart
const getDataSummaryChart = (day, month, year, type) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/profile-nutrition-details`
    $.ajax({
        type: 'get',
        url: url,
        data: {
            'day': day,
            'month': month,
            'year': year,
        },
        success: function (response) {
            // getting data response
            const data = JSON.parse(response.data)
            const statsInfoDay = date.toLocaleDateString(`${localeDateFormat}`)
            graphDate.textContent = `${gettext('Summary')} ${statsInfoDay}`
            const kcalGoal = data.kcalGoal
            const eatenKcal = data.eatenKcal
            const burntKcal = data.burntKcal
            const eatenCarbs = data.eatenCarbs
            const eatenFats = data.eatenFats
            const eatenProtein = data.eatenProtein
            let proteinMultiplier
            let carbsMultiplier = 0.5
            if (data.activityLevel === 0) {
                proteinMultiplier = 0.9
            }
            else if (data.activityLevel === 1) {
                proteinMultiplier = 1.2
            }
            else if (data.activityLevel === 2) {
                proteinMultiplier = 1.6
            }
            else if (data.activityLevel === 3) {
                proteinMultiplier = 2
            }
            // calculating output
            const goalPercent = ((eatenKcal / kcalGoal) * 100).toFixed(2)
            let percentDiff
            if (goalPercent < 100){
                percentDiff = 100 - goalPercent
            }
            else if (goalPercent >= 100) {
                percentDiff = 0
            }
            // inserting data to chart and info box
            const percentInfo = document.querySelector('.goal-percent-chart')
            const goalText = document.querySelector('.kcal-daily-count')
            const eatenText = document.querySelector('.eaten-daily-count')
            const burntText = document.querySelector('.burnt-daily-count')
            const remainingText = document.querySelector('.remaining-daily-count')
            // 4 cards
            const kcalConsumedCard = document.querySelector('.kcal-daily-card-consumed')
            const kcalNeedsCard = document.querySelector('.kcal-daily-card-needs')
            const carbsConsumedCard = document.querySelector('.carbs-daily-card-consumed')
            const carbsNeedsCard = document.querySelector('.carbs-daily-card-needs')
            const proteinConsumedCard = document.querySelector('.protein-daily-card-consumed')
            const proteinNeedsCard = document.querySelector('.protein-daily-card-needs')
            const fatConsumedCard = document.querySelector('.fat-daily-card-consumed')
            const fatNeedsCard = document.querySelector('.fat-daily-card-needs')
            // eaten card part
            kcalConsumedCard.innerHTML = `${eatenKcal}`
            carbsConsumedCard.innerHTML = `${eatenCarbs}`
            proteinConsumedCard.innerHTML = `${eatenProtein}`
            fatConsumedCard.innerHTML = `${eatenFats}`
            goalText.innerHTML = `${kcalGoal}`
            eatenText.innerHTML = `${eatenKcal}`
            burntText.innerHTML = `${burntKcal}`
            remainingText.innerHTML = `${Math.round(kcalGoal - eatenKcal)}`
            percentInfo.innerHTML = `${goalPercent}%`
            // demand card part
            kcalNeedsCard.innerHTML = `${Math.trunc(kcalGoal)}`
            proteinNeedsCard.innerHTML = `${Math.trunc(proteinMultiplier * data.weightKg)}`
            carbsNeedsCard.innerHTML = `${Math.trunc(carbsMultiplier * data.kcalGoal / 4)}`
            fatNeedsCard.innerHTML = `${Math.trunc((kcalGoal * 0.275) / 9)}`
            if (type === 'create'){
                let dataSummary = {
                labels: [],
                datasets: [{
                    data: [Number(goalPercent), percentDiff],
                    backgroundColor: [
                        "#8be085",
                        "#c8e3c8",
                    ],
                }]
            };
             summaryChartBox = new Chart(myChart, {
                type: 'doughnut',
                data: dataSummary,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: 50,
                    events: [],
                    legend: {
                        display: false,
                    }
                }
            });
             getDataMacroChart(kcalGoal,Math.trunc(proteinMultiplier * data.weightGoalKg),
                 Math.trunc(carbsMultiplier * data.kcalGoal / 4),Math.trunc((kcalGoal * 0.275) / 9))
            }
            else if (type === 'update'){
                summaryChartBox.data = {
                    labels: [],
                    datasets: [{
                    data: [Number(goalPercent), percentDiff],
                    backgroundColor: [
                        "#8be085",
                        "#c8e3c8",
                    ],
                    }]
                };
                summaryChartBox.update()
            }
        },
    })
}

// summary weekly chart
const getDataWeeklyChart = () => {
     const langPrefix = window.location.href.split('/')[3];
     const url = window.location.origin + `/${langPrefix}/data/get/weekly-calories-info`
     $.ajax({
         type: 'get',
         url: url,
         success: function (response) {
             const data = JSON.parse(response.data)
             const weeklyKcalArr = []
             data.forEach(day => {
                 weeklyKcalArr.push(Math.round(day.dayKcal))
             })
             const averageKcal = weeklyKcalArr.reduce((a, b) => a + b, 0) / weeklyKcalArr.length;
             let xValuesWeekGraph
             if (langPrefix === 'pl'){
                 xValuesWeekGraph = ["Pon","Wt","Śr","Czw","Pt","Sob","Nie"];
             }
             else {
                 xValuesWeekGraph = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
             }
             let dataWeekGraph = {
                 labels: [...xValuesWeekGraph],
                 datasets: [
                     {
                     data: [...weeklyKcalArr],
                     borderColor: "green",
                     lineTension: 1,
                     tension: 1,
                     pointRadius: 0,
                     borderWidth: 4,
                     pointHoverRadius: 0,
                     backgroundColor: 'rgb(126,238,146)',
                     fill: true,
                 },]
             };
             const annotation = {
                  type: 'line',
                  borderColor: 'rgb(252,218,0)',
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: (ctx) => 'Average: ' + averageKcal,
                    position: 'end'
                  },
                  scaleID: 'y',
                  value: (ctx) => averageKcal
                };
             let weekChartBox = new Chart(weekChart, {
                 type: 'line',
                 data: dataWeekGraph,
                 options: {
                      scales: {
                        y: {
                            beginAtZero: true,
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        annotation: {
                            annotations: {
                                annotation
                            }
                        }
                    }
                },
            });
             weekChartBox.update()
         },
     })
}

// summary weekly details chart ( 4 macro)
const getDataMacroChart = (kcalDemand, proteinDemand, carbsDemand, fatDemand) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/week-daily-macros`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response) {
            const data = JSON.parse(response.data)
            let detailsColors = []
            let sumKcal = 0
            let sumCarbs = 0
            let sumProtein = 0
            let sumFat = 0
            let dayOfWeek = new Date().getDay();
            if (dayOfWeek === 0 ){
                dayOfWeek = 7
            }
            data.forEach(day => {
                sumKcal = sumKcal + day.dayKcal
                sumCarbs = sumCarbs + day.dayCarbs
                sumProtein = sumProtein + day.dayProtein
                sumFat = sumFat + day.dayFat
            })
            const avgKcalPercent = (((sumKcal / dayOfWeek) / kcalDemand) * 100).toFixed(2)
            const avgCarbsPercent = (((sumCarbs / dayOfWeek) / carbsDemand) * 100).toFixed(2)
            const avgProteinPercent = (((sumProtein / dayOfWeek) / proteinDemand) * 100).toFixed(2)
            const avgFatPercent = (((sumFat / dayOfWeek) / fatDemand) * 100).toFixed(2)
            let nutritionDetailsDataset = [avgKcalPercent, avgCarbsPercent, avgProteinPercent, avgFatPercent]
            $.each(nutritionDetailsDataset, function (index, value) {
                if (value <= 20) {
                    detailsColors[index] = "rgba(199,239,201,0.6)"
                }
                if(value > 20 && value < 40) {
                    detailsColors[index] = "rgba(199,239,201,1)"
                }
                else if(value >= 40 && value < 60) {
                    detailsColors[index] = "rgba(123,241,129, 0.6)"
                }
                else if(value >= 60 && value < 80) {
                    detailsColors[index] = "rgba(123,241,129, 0.8)"
                }
                else if(value >= 80 && value <=100) {
                    detailsColors[index] = "rgba(123,241,129, 1)"
                }
                else if(value >= 101) {
                    detailsColors[index] = "rgb(241,81,81)"
                }
            })
            let nutritionDetailsData = {
                labels: [
                    gettext("Kcal Goal"), gettext("Carbs"), gettext("Protein"), gettext("Fats"),
                ],
                datasets: [
                {
                  data: nutritionDetailsDataset,
                  backgroundColor: detailsColors,
                }]
            }
              let nutritionDetailsChartBox = new Chart(nutritionDetails, {
                type: 'bar',
                data: nutritionDetailsData,
                options: {
                    scales: {
                        x: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            title: {
                                text: gettext("Percent (%)"),
                                display: true,
                            }
                        }
                    },
                    indexAxis: indexAxis,
                    elements: {
                      bar: {
                        borderWidth: 2,
                        borderRadius: 10,
                      }
                    },
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      },
                    },
              }
            })
        },
    })
}
// Initial
    // media query check
    handleTabletChange(mediaQuery)
    // graphs data init
    getDataSummaryChart(currentDay, currentMonth, currentYear, 'create')
    getDataWeeklyChart()
// End Initial


let detailsColors = []



let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});
const localeDateFormat = window.location.href.split('/')[3] === 'pl' ? 'pl-PL' : 'en-US'
const todayDate = new Date().toLocaleDateString(`${localeDateFormat}`)
const graphDate = document.querySelector('.graph-date')
graphDate.textContent = `${gettext('Summary')} ${todayDate}`

const meals = document.querySelector('.dashboard__content__summary__item--meal')
meals.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/meals`
})

const workout = document.querySelector('.dashboard__content__summary__item--workout')
workout.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts`
})

const recipes = document.querySelector('.dashboard__content__summary__item--manage')
recipes.addEventListener('click', () => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/recipes`
})