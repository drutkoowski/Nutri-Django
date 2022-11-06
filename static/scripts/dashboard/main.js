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
    // Then log the following message to the console
    indexAxis = 'x'
  }
}


// Initial check
handleTabletChange(mediaQuery)



let detailsColors = []
let nutritionDetailsDataset = [60, 40, 30, 20, 90, 83, 63, 33, 3]

let dataSummary = {
  labels: [],
  datasets: [
    {
      data: [60, 40],
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