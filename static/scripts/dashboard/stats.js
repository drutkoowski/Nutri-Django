// const hamburgerNav = document.getElementById('navi-toggle')
// const navigationList = document.getElementsByClassName('navigation--dashboard__list')[0]
// const hamburgerNavSmall = document.getElementById('navi-toggle-small')
// const navigationListSmall = document.getElementsByClassName('navigation--dashboard--small__list')[0]
//
// hamburgerNav.addEventListener('click', () => {
//
//     if (!navigationList.classList.contains('not-visible') && !hamburgerNav.checked) {
//         navigationList.classList.add('not-visible')
//     }
//     else if (navigationList.classList.contains('not-visible') && hamburgerNav.checked) {
//          navigationList.classList.remove('not-visible')
//     }
// })
// hamburgerNavSmall.addEventListener('click', () => {
//
//     if (!navigationListSmall.classList.contains('not-visible') && !hamburgerNavSmall.checked) {
//         navigationListSmall.classList.add('not-visible')
//     }
//     else if (navigationListSmall.classList.contains('not-visible') && hamburgerNavSmall.checked) {
//          navigationListSmall.classList.remove('not-visible')
//     }
// })

window.onresize = function(){ location.reload(); }
// option values
let durationValue = 'weekly'
let typeValue = 'kcal'
let isDrawn = false
let weekChartBox
// listening chart options
const durationInput= document.querySelector('#duration')
const typeInput = document.querySelector('#type')
durationInput.addEventListener('change', (e) => {
    durationValue = e.target.value
    if (durationValue === 'weekly'){
        getChartFullDataWeekly(typeValue)
    }
    else if (durationValue === 'monthly'){
        getChartFullDataMonthly(typeValue)
    }
})
typeInput.addEventListener('change', (e) => {
    typeValue = e.target.value
    if (durationValue === 'weekly'){
        getChartFullDataWeekly(typeValue)
    }
    else if (durationValue === 'monthly'){
        getChartFullDataMonthly(typeValue)
    }
})

// drawing utils
const getChartFullDataWeekly = (type) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/get-graph-stats-info-weekly`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            const eatenKcal = [...data.eatenKcal]
            const burntKcal = [...data.burntKcal]
            const eatenProteinPercent = [...data.eatenProteinPercent]
            const eatenKcalPercent = [...data.eatenKcalPercent]
            const eatenFatsPercent = [...data.eatenFatsPercent]
            const eatenCarbsPercent = [...data.eatenCarbsPercent]
            const workoutDurations = [...data.workoutDurations]
            let xValuesWeekGraph
            if (langPrefix === 'pl'){
                xValuesWeekGraph = ["Pon","Wt","Śr","Czw","Pt","Sob","Nie"];
            }
            else {
                xValuesWeekGraph = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
            }
            if (isDrawn){
                if (type === 'kcal'){
                      let dataset = [{
                        data: [...eatenKcal],
                        label: `${gettext('Eaten')}`,
                        borderColor: 'rgb(126,238,146)',
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                        backgroundColor: 'rgb(126,238,146)',
                    },{
                        data: [...burntKcal],
                        label: `${gettext('Burnt')}`,
                        borderColor: "rgb(234,68,100)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                        backgroundColor: "rgb(234,68,100)",
                    },]
                    chartDraw(xValuesWeekGraph, dataset, 621,'update', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
                }
                else if (type === 'macros'){
                     let dataset = [{
                        data: [...eatenProteinPercent],
                        label: `${gettext('Protein')} (%)`,
                        borderColor: "rgb(231,210,87)",
                        backgroundColor: "rgb(231,210,87)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },{
                        data: [...eatenKcalPercent],
                        label: `${gettext('Kcal')} (%)`,
                        borderColor: "rgb(126,238,146)",
                        backgroundColor: "rgb(126,238,146)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                     {
                        data: [...eatenFatsPercent],
                        label: `${gettext('Fats')} (%)`,
                        borderColor: "rgb(29,153,234)",
                        backgroundColor: "rgb(29,153,234)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,

                    },
                     {
                        data: [...eatenCarbsPercent],
                        label: `${gettext('Carbs')} (%)`,
                        borderColor: "rgb(144,2,245)",
                        backgroundColor: "rgb(144,2,245)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },]
                    chartDraw(  xValuesWeekGraph, dataset, 321,'update', gettext('Percent'), gettext('Macro Value Chart according to your daily goals (%)'))
                }
                else if (type === 'duration'){
                     let dataset = [{
                        data: [...workoutDurations],
                        label: gettext('Activity Minutes'),
                        borderColor: "rgb(126,238,146)",
                        backgroundColor: "rgb(126,238,146)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    }]
                    chartDraw(xValuesWeekGraph, dataset, 321,'update', gettext('Minutes'), gettext('Time chart of your activities in minutes'))
                }
            }
            else {
                isDrawn = true
                // const averageKcal = weeklyKcalArr.reduce((a, b) => a + b, 0) / weeklyKcalArr.length;
                // average line
                // average line
                let dataset = [{
                    data: [...eatenKcal],
                    label: gettext('Eaten'),
                    borderColor: "rgb(126,238,146)",
                    backgroundColor: "rgb(126,238,146)",
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                },{
                    data: [...burntKcal],
                    label: gettext('Burnt'),
                    borderColor: "rgb(234,68,100)",
                    backgroundColor: "rgb(234,68,100)",
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                },]
                chartDraw(xValuesWeekGraph, dataset, 231, 'draw', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
            }
        }
    })
}
const getChartFullDataMonthly = (type) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/get-graph-stats-info-monthly`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
            const eatenKcal = [...data.eatenKcal]
            const burntKcal = [...data.burntKcal]
            const eatenProteinPercent = [...data.eatenProteinPercent]
            const eatenKcalPercent = [...data.eatenKcalPercent]
            const eatenFatsPercent = [...data.eatenFatsPercent]
            const eatenCarbsPercent = [...data.eatenCarbsPercent]
            const workoutDurations = [...data.workoutDurations]
            let xValuesWeekGraph
            if (langPrefix === 'pl'){
                xValuesWeekGraph = ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];
            }
            else {
                xValuesWeekGraph = ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            }
            if (type === 'kcal'){
                let dataset = [{
                    data: [...eatenKcal],
                    label: `${gettext('Eaten')}`,
                    borderColor: 'rgb(126,238,146)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,238,146)',
                },{
                    data: [...burntKcal],
                    label: `${gettext('Burnt')}`,
                    borderColor: "rgb(234,68,100)",
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: "rgb(234,68,100)",
                },]
                chartDraw(xValuesWeekGraph, dataset, 621,'update', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
                }
            else if (type === 'macros'){
                     let dataset = [{
                        data: [...eatenProteinPercent],
                        label: `${gettext('Protein')} (%)`,
                        borderColor: "rgb(231,210,87)",
                        backgroundColor: "rgb(231,210,87)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },{
                        data: [...eatenKcalPercent],
                        label: `${gettext('Kcal')} (%)`,
                        borderColor: "rgb(126,238,146)",
                        backgroundColor: "rgb(126,238,146)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                     {
                        data: [...eatenFatsPercent],
                        label: `${gettext('Fats')} (%)`,
                        borderColor: "rgb(29,153,234)",
                        backgroundColor: "rgb(29,153,234)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,

                    },
                     {
                        data: [...eatenCarbsPercent],
                        label: `${gettext('Carbs')} (%)`,
                        borderColor: "rgb(144,2,245)",
                        backgroundColor: "rgb(144,2,245)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },]
                    chartDraw(  xValuesWeekGraph, dataset, 321,'update', gettext('Percent'), gettext('Macro Value Chart according to your daily goals (%)'))
                }
             else if (type === 'duration'){
                     let dataset = [{
                        data: [...workoutDurations],
                        label: gettext('Activity Minutes'),
                        borderColor: "rgb(126,238,146)",
                        backgroundColor: "rgb(126,238,146)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    }]
                    chartDraw(xValuesWeekGraph, dataset, 321,'update', gettext('Minutes'), gettext('Time chart of your activities in minutes'))
                }
        }
    })
}
const chartDraw = (labels, datasets, average, type, yLabelText, textAbove) => {
    let weekChart = document.getElementById('summaryGraph').getContext('2d')
    if (type === 'draw'){
          let dataWeekGraph = {
            labels: labels,
            datasets: datasets
        };
        const annotation = {
            type: 'line',
            borderColor: 'rgb(252,218,0)',
            borderWidth: 2,
            label: {
                enabled: true,
                content: (ctx) => 'Average: ' + average,
                position: 'end'
            },
            scaleID: 'y',
            value: (ctx) => average
        };
        weekChartBox = new Chart(weekChart, {
        type: 'line',
        data: dataWeekGraph,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: yLabelText
                    },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgb(116,187,130)'
                    },
                    title: {
                      display: true,
                      text: textAbove,
                    }
                },
                annotation: {
                    annotations: {
                        annotation
                    }
                }
            }
            },
    });
    }
    else if (type === 'update'){
        weekChartBox.data = {
            labels: labels,
            datasets: datasets
        };
        weekChartBox.options.scales.y.title.text = yLabelText
        weekChartBox.options.plugins.legend.title.text = textAbove
        weekChartBox.update();
    }
}

// filling average and aggregate values
const fillStatsInfo = () => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/get-dashboard-stats-info`
    $.ajax({
        type: 'get',
        url: url,
        success: function (response){
            const data = JSON.parse(response.data)
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
// initials
fillStatsInfo()
getChartFullDataWeekly('kcal')

