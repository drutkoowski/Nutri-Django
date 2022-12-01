const hamburgerNav = document.getElementById('navi-toggle')
const navigationList = document.getElementsByClassName('navigation--dashboard__list')[0]
const hamburgerNavSmall = document.getElementById('navi-toggle-small')
const navigationListSmall = document.getElementsByClassName('navigation--dashboard--small__list')[0]

hamburgerNav.addEventListener('click', () => {

    if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
        navigationList.classList.add('not-visible')
    }
    else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
         navigationList.classList.remove('not-visible')
    }
})
hamburgerNavSmall.addEventListener('click', () => {

    if (!navigationListSmall.classList.contains('not-visible') && !hamburgerNavSmall.checked) {
        navigationListSmall.classList.add('not-visible')
    }
    else if (navigationListSmall.classList.contains('not-visible') && hamburgerNavSmall.checked) {
         navigationListSmall.classList.remove('not-visible')
    }
})

let weekChart = document.getElementById('summaryGraph').getContext('2d')
const xValuesWeekGraph = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
let dataWeekGraph = {
    labels: xValuesWeekGraph,
    datasets: [{
      data: [2860, 2140, 3060, 2777, 1895, 2345, 2753],
      borderColor: "green",
      label: 'Eaten KCAL'
    }]
};

let weekChartBox = new Chart(weekChart, {
  type: 'line',
  data: dataWeekGraph,
  options: {
  	responsive: true,
    maintainAspectRatio: false,
    plugins: {
            legend: {
                display: true
            },
        }
  }
});

window.onresize = function(){ location.reload(); }

const fillStatsInfo = () => {
     const langPrefix = window.location.href.split('/')[3];
     const url = window.location.origin + `/${langPrefix}/data/get/get-dashboard-stats-info`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            console.log(data)
            const daysOnSpan = document.querySelector('.dashboard-stats__stats__info__days')
            const eatenKcalSpan = document.querySelector('.dashboard-stats__stats__info__eaten-kcal')
            const burntKcalSpan = document.querySelector('.dashboard-stats__stats__info__burnt-kcal')
            const proteinSpan = document.querySelector('.dashboard-stats__stats__info__protein')
            const fatSpan = document.querySelector('.dashboard-stats__stats__info__fat')
            const carbsSpan = document.querySelector('.dashboard-stats__stats__info__carbs')
            daysOnSpan.innerHTML = data.days === 1 ? ` ${data.days} ${gettext('day on Nutri')}` : ` ${data.days} ${gettext('days on Nutri')}`
            eatenKcalSpan.innerHTML = data.sumKcalEaten
            burntKcalSpan.innerHTML = data.sumKcalBurnt
            proteinSpan.innerHTML = data.sumProteinEaten
            fatSpan.innerHTML = data.sumFatEaten
            carbsSpan.innerHTML = data.sumCarbsEaten
            const avgKcalBurntSpan = document.querySelector('.dashboard-stats__stats__averages__kcal-burnt')
            const avgCarbsSpan = document.querySelector('.dashboard-stats__stats__averages__carbs')
            const avgProteinSpan = document.querySelector('.dashboard-stats__stats__averages__protein')
            const avgKcalEaten = document.querySelector('.dashboard-stats__stats__averages__kcal-eaten')
            const avgFatSpan = document.querySelector('.dashboard-stats__stats__averages__fat')
            avgKcalBurntSpan.innerHTML = `${data.sumKcalBurnt / data.days}`
            avgCarbsSpan.innerHTML= `${data.sumCarbsEaten / data.days}`
            avgProteinSpan.innerHTML = `${data.sumProteinEaten / data.days}`
            avgKcalEaten.innerHTML = `${data.sumKcalEaten / data.days}`
            avgFatSpan.innerHTML = `${data.sumFatEaten / data.days}`

        },
    })
}


fillStatsInfo()