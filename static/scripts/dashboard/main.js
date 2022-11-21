let myChart = document.getElementById('summaryChart').getContext('2d')
let weekChart = document.getElementById('summaryWeekly').getContext('2d')
let nutritionDetails = document.getElementById('summaryNutritionDetails').getContext('2d')
const xValuesWeekGraph = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

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
            const percentDiff = 100 - goalPercent
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
            remainingText.innerHTML = `${kcalGoal - eatenKcal}`
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
        }
    })
}


// Initial
    // media query check
    handleTabletChange(mediaQuery)
    // graphs data init
    getDataSummaryChart()
// End Initial


let detailsColors = []
let nutritionDetailsDataset = [60, 40, 30, 20, 90, 83, 63, 33, 3]



let dataWeekGraph = {
    labels: xValuesWeekGraph,
    datasets: [{
      data: [2860, 2140, 3060, 2777, 1895, 2345, 2753],
      borderColor: "green",
    }]
};



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
})


let nutritionDetailsData = {
    labels: [
        "Fiber", "Saturated Fat", "Cholesterol", "Sodium", "Sugar", "Potassium", "Iron", "Calcium", "Magnesium"
    ],
    datasets: [
    {
      data: nutritionDetailsDataset,
      backgroundColor: detailsColors,
    }]
}



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
        }
  }
});

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


window.onresize = function(){ location.reload(); }

const todayDate = new Date().toLocaleDateString()
const graphDate = document.querySelector('.graph-date')
graphDate.textContent = `${gettext('Summary')} ${todayDate}`

const meals = document.querySelector('.dashboard__content__summary__item--meal')
meals.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/meals`
})

const workout = document.querySelector('.dashboard__content__summary__item--workout')
workout.addEventListener('click', e => {
    const langPrefix = window.location.href.split('/')[3];
    location.href = location.origin + `/${langPrefix}/workouts`
})