let dwidth = $(window).width();
$(window).resize(function(){
    let wwidth = $(window).width();
    if(dwidth!==wwidth){
         dwidth = $(window).width();
         location.reload();
    }
});
// option values
let durationValue = 'weekly'
let typeValue = 'kcal'
let isDrawn = false
let weekChartBox
// listening chart options
const durationInput= document.querySelector('#duration')
const typeInput = document.querySelector('#type')
durationInput.addEventListener('change', (e) => {
    const additionalOptions = document.querySelectorAll('.additional-option')
    durationValue = e.target.value
    if (durationValue === 'weekly'){
        getChartFullDataWeekly(typeValue)
        additionalOptions.forEach(option => {
            option.disabled = true
        })
    }
    if (durationValue === 'monthly'){
        getChartFullDataMonthly(typeValue)
         additionalOptions.forEach(option => {
            option.disabled = false
        })
    }
    else if (durationValue === 'yearly'){
        getChartFullDataYearly(typeValue)
         additionalOptions.forEach(option => {
            option.disabled = false
        })

    }
})
typeInput.addEventListener('change', (e) => {
    typeValue = e.target.value
    if (durationValue === 'weekly'){
        getChartFullDataWeekly(typeValue)
    }
    if (durationValue === 'monthly'){
        const weeklyItem = document.querySelector('.weekly')
        weeklyItem.disabled = typeValue !== 'kcal' && typeValue !== 'macros' && typeValue !== 'duration';
        getChartFullDataMonthly(typeValue)
    }
    else if (durationValue === 'yearly'){
        const weeklyItem = document.querySelector('.weekly')
        weeklyItem.disabled = typeValue !== 'kcal' && typeValue !== 'macros' && typeValue !== 'duration';
        getChartFullDataYearly(typeValue)
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
                    chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
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
                    chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Percent'), gettext('Macro Value Chart according to your daily goals (%)'))
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
                    chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Minutes'), gettext('Time chart of your activities in minutes'))
                }
            }
            else {
                isDrawn = true
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
                chartDraw(xValuesWeekGraph, dataset, 'draw', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
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
            if (type === 'chest'){
                const xValuesWeekGraph = data.changesChest.datesArr;
                const changesArr = data.changesChest.valuesArr ? data.changesChest.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Chest')}`,
                    borderColor: 'rgb(126,238,146)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,238,146)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'kcal'){
                const xValuesWeekGraph = data.caloriesEaten.datesArr;
                const kcalEaten = data.caloriesEaten.valuesArr
                const kcalBurnt = data.caloriesBurnt.valuesArr
                let dataset = [{
                    data: [...kcalEaten],
                    label: `${gettext('Eaten')}`,
                    borderColor: 'rgb(126,238,146)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,238,146)',
                },{
                    data: [...kcalBurnt],
                    label: `${gettext('Burnt')}`,
                    borderColor: 'rgb(232,60,125)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(232,60,125)',
                }]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'Kcal', gettext('Chart of kcal consumed and burned'))
            }
            else if (type === 'duration'){
                const xValuesWeekGraph = data.changesDuration.datesArr;
                const durationArray = data.changesDuration.valuesArr
                let dataset = [{
                    data: [...durationArray],
                    label: `${gettext('Duration')}`,
                    borderColor: 'rgb(126,238,146)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,238,146)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update',  gettext('Minutes'), gettext('Time chart of your activities in minutes'))
            }
            else if (type === 'macros'){
                const xValuesWeekGraph = data.caloriesEatenPercent.datesArr;
                const kcalEaten = data.caloriesEatenPercent.valuesArr
                const proteinEaten = data.proteinEatenPercent.valuesArr
                const carbsEaten = data.carbsEatenPercent.valuesArr
                const carbsFats = data.fatsEatenPercent.valuesArr
                let dataset = [{
                    data: [...kcalEaten],
                    label: `${gettext('Kcal Eaten')}`,
                    borderColor: 'rgb(126,238,146)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,238,146)',
                },{
                    data: [...proteinEaten],
                    label: `${gettext('Protein')}`,
                    borderColor: 'rgb(125,91,218)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(125,91,218)',
                },{
                    data: [...carbsEaten],
                    label: `${gettext('Carbs')}`,
                    borderColor: 'rgb(232,200,124)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(232,200,124)',
                },{
                    data: [...carbsFats],
                    label: `${gettext('Fats')}`,
                    borderColor: 'rgb(224,22,22)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(224,22,22)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Percent'), gettext('Macro Value Chart according to your daily goals (%)'))
            }
            else if (type === 'weight'){
                const xValuesWeekGraph = data.changesWeight.datesArr
                const changesArr = data.changesWeight.valuesArr ? data.changesWeight.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Weight')}`,
                    borderColor: 'rgb(236,202,60)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(236,202,60)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'kg', gettext('Graph of changes in your weight (kg)'))
            }
            else if (type === 'biceps'){
                const xValuesWeekGraph = data.changesBiceps.datesArr;
                const changesArr = data.changesBiceps.valuesArr ? data.changesBiceps.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Biceps')}`,
                    borderColor: 'rgb(126,161,238)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(126,161,238)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'waist'){
                const xValuesWeekGraph = data.changesWaist.datesArr;
                const changesArr = data.changesWaist.valuesArr ? data.changesWaist.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Waist')}`,
                    borderColor: 'rgb(236,223,65)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(236,223,65)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'hips'){
                const xValuesWeekGraph = data.changesHips.datesArr;
                const changesArr = data.changesHips.valuesArr ? data.changesHips.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Hips')}`,
                    borderColor: 'rgb(128,64,229)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(128,64,229)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'calves'){
                const xValuesWeekGraph = data.changesCalves.datesArr;
                const changesArr = data.changesCalves.valuesArr ? data.changesCalves.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Calves')}`,
                    borderColor: 'rgb(1,107,80)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(1,107,80)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'thighs'){
                const xValuesWeekGraph = data.changesThighs.datesArr;
                const changesArr = data.changesThighs.valuesArr ? data.changesThighs.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Thighs')}`,
                    borderColor: 'rgb(234,149,170)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(234,149,170)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'neck'){
                const xValuesWeekGraph = data.changesNeck.datesArr;
                const changesArr = data.changesNeck.valuesArr ? data.changesNeck.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Neck')}`,
                    borderColor: 'rgb(128,124,42)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(128,124,42)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'wrists'){
                const xValuesWeekGraph = data.changesWrists.datesArr;
                const changesArr = data.changesWrists.valuesArr ? data.changesWrists.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Wrists')}`,
                    borderColor: 'rgb(199,144,136)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(199,144,136)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'shoulders'){
                const xValuesWeekGraph = data.changesShoulders.datesArr;
                const changesArr = data.changesShoulders.valuesArr ? data.changesShoulders.valuesArr : []
                let dataset = [{
                    data: [...changesArr],
                    label: `${gettext('Shoulders')}`,
                    borderColor: 'rgb(41,199,165)',
                    lineTension: 1,
                    tension: 0.8,
                    pointRadius: 0,
                    borderWidth: 4,
                    pointHoverRadius: 0,
                    backgroundColor: 'rgb(41,199,165)',
                },]
                chartDraw(xValuesWeekGraph, dataset, 'update', 'cm', gettext('Graph of changes in your measurements (cm)'))
            }
        }
    })
}
const getChartFullDataYearly = (type) => {
    const langPrefix = window.location.href.split('/')[3];
    const url = window.location.origin + `/${langPrefix}/data/get/get-graph-stats-info-yearly`
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
            const changes = data.changes
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
                chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Kcal'), gettext('Chart of kcal consumed and burned'))
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
                    chartDraw(  xValuesWeekGraph, dataset,'update', gettext('Percent'), gettext('Macro Value Chart according to your daily goals (%)'))
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
                    chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Minutes'), gettext('Time chart of your activities in minutes'))
             }
            else if (type === 'weight'){
                     let dataset = [{
                        data: changes.changesWeight,
                        label: gettext('Weight'),
                        borderColor: "rgb(126,238,146)",
                        backgroundColor: "rgb(126,238,146)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    }]
                    chartDraw(xValuesWeekGraph, dataset, 'update', gettext('Kilograms'), gettext('Chart of changes in your weight (kg)'))
             }
            else if (type === 'biceps'){
                let dataset = [{
                        data: changes.changesBiceps,
                        label: `${gettext('Biceps')}`,
                        borderColor: "rgb(112,183,181)",
                        backgroundColor: "rgb(112,183,181)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'chest'){
                let dataset = [{
                        data: changes.changesChest,
                        label: `${gettext('Chest')}`,
                        borderColor: "rgb(197,181,95)",
                        backgroundColor: "rgb(197,181,95)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
            else if (type === 'waist'){
                let dataset = [{
                        data: changes.changesWaist,
                        label: `${gettext('Waist')}`,
                        borderColor: "rgb(161,50,192)",
                        backgroundColor: "rgb(161,50,192)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'hips'){
                let dataset = [{
                        data: changes.changesHips,
                        label: `${gettext('Hips')}`,
                        borderColor: "rgb(222,115,71)",
                        backgroundColor: "rgb(222,115,71)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'calves'){
                let dataset = [{
                        data: changes.changesCalves,
                        label: `${gettext('Calves')}`,
                        borderColor: "rgb(40,234,60)",
                        backgroundColor: "rgb(40,234,60)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'thighs'){
                let dataset = [{
                        data: changes.changesThighs,
                        label: `${gettext('Thighs')}`,
                        borderColor: "rgb(68,14,206)",
                        backgroundColor: "rgb(68,14,206)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'neck'){
                let dataset = [{
                        data: changes.changesNeck,
                        label: `${gettext('Neck')}`,
                        borderColor: "rgb(229,223,177)",
                        backgroundColor: "rgb(229,223,177)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'wrists'){
                let dataset = [{
                        data: changes.changesWrists,
                        label: `${gettext('Wrists')}`,
                        borderColor: "rgb(59,151,203)",
                        backgroundColor: "rgb(59,151,203)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
             else if (type === 'shoulders'){
                let dataset = [{
                        data: changes.changesShoulders,
                        label: `${gettext('Shoulders')}`,
                        borderColor: "rgb(236,147,228)",
                        backgroundColor: "rgb(236,147,228)",
                        lineTension: 1,
                        tension: 0.8,
                        pointRadius: 0,
                        borderWidth: 4,
                        pointHoverRadius: 0,
                    },
                ]
                chartDraw(  xValuesWeekGraph, dataset, 'update', gettext('cm'), gettext('Graph of changes in your measurements (cm)'))
            }
        }
    })
}
const chartDraw = (labels, datasets, type, yLabelText, textAbove) => {
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
                            color: 'rgb(0,0,0)'
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
            avgKcalBurntSpan.innerHTML = `${(data.sumKcalBurnt / data.days).toFixed(2)}`
            avgCarbsSpan.innerHTML= `${(data.sumCarbsEaten / data.days).toFixed(2)}`
            avgProteinSpan.innerHTML = `${(data.sumProteinEaten / data.days).toFixed(2)}`
            avgKcalEaten.innerHTML = `${(data.sumKcalEaten / data.days).toFixed(2)}`
            avgFatSpan.innerHTML = `${(data.sumFatEaten / data.days).toFixed(2)}`

        },
    })
}
// initials
fillStatsInfo()
getChartFullDataWeekly('kcal')

