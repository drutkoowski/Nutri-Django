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