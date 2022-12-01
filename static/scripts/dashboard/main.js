let myChart = document.getElementById('summaryChart').getContext('2d')
let weekChart = document.getElementById('summaryWeekly').getContext('2d')
let nutritionDetails = document.getElementById('summaryNutritionDetails').getContext('2d')


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
const getDataSummaryChart = () => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/profile-nutrition-details`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response) {
            // getting data response
            const data = JSON.parse(response.data)
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
            proteinNeedsCard.innerHTML = `${Math.trunc(proteinMultiplier * data.weightGoalKg)}`
            carbsNeedsCard.innerHTML = `${Math.trunc(carbsMultiplier * data.kcalGoal / 4)}`
            fatNeedsCard.innerHTML = `${Math.trunc((kcalGoal * 0.275) / 9)}`
            let dataSummary = {
              labels: [],
              datasets: [
                {
                  data: [goalPercent, percentDiff],
                  backgroundColor: [
                    "#8be085",
                    "#c8e3c8",
                  ],
                  // hoverBackgroundColor: [
                  //   "#2ce04f",
                  //   "#c1e5b7",
                  // ]
                }]
            };
            let summaryChartBox = new Chart(myChart, {
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
                 weeklyKcalArr.push(day.dayKcal)
             })
             const averageKcal = weeklyKcalArr.reduce((a, b) => a + b, 0) / weeklyKcalArr.length;
             let xValuesWeekGraph
             if (langPrefix === 'pl'){
                 xValuesWeekGraph = ["Pon","Wt","Śr","Czw","Pt","Sob","Nie"];
             }
             else {
                 xValuesWeekGraph = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
             }
             // average line
             // average line
             let dataWeekGraph = {
                 labels: xValuesWeekGraph,
                 datasets: [{
                     data: weeklyKcalArr,
                     borderColor: "green",
                     lineTension: 1,
                     tension: 0.8,
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
            let days = 0
            data.forEach(day => {
                days = days + 1
                sumKcal = sumKcal + day.dayKcal
                sumCarbs = sumCarbs + day.dayCarbs
                sumProtein = sumProtein + day.dayProtein
                sumFat = sumFat + day.dayFat
            })
            const avgKcalPercent = (((sumKcal / days) / kcalDemand) * 100).toFixed(2)
            const avgCarbsPercent = (((sumCarbs / days) / carbsDemand) * 100).toFixed(2)
            const avgProteinPercent = (((sumProtein / days) / proteinDemand) * 100).toFixed(2)
            const avgFatPercent = (((sumFat / days) / fatDemand) * 100).toFixed(2)
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
                    "Kcal Goal", "Carbs", "Protein", "Fats",
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
                                text: "Percent (%)",
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
    getDataSummaryChart()
    getDataWeeklyChart()
// End Initial


let detailsColors = []



window.onresize = function(){ location.reload(); }

const todayDate = new Date().toLocaleDateString()
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