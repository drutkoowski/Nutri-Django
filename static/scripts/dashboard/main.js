let myChart = document.getElementById('summaryChart').getContext('2d')
let weekChart = document.getElementById('summaryWeekly')

let data = {
  labels: [
  ],
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
const xValues = ["Mon","Tuesday","Wed","Thr","Fri","Sat","Sun"];

let data2 = {
    labels: xValues,
    datasets: [{
      data: [2860, 2140, 3060, 2777, 1895, 2345, 2753],
      borderColor: "green",
    }]
};


let summaryChart = new Chart(myChart, {
  type: 'doughnut',
  data: data,
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
  data: data2,
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

// summaryChart.canvas.parentNode.style.height = '15rem';
// summaryChart.canvas.parentNode.style.width = '15rem';