let myChart = document.getElementById('myChart').getContext('2d')

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
      hoverBackgroundColor: [
        "#2ce04f",
        "#c1e5b7",
      ]
    }]
};


let summaryChart = new Chart(myChart, {
  type: 'doughnut',
  data: data,
  options: {
  	responsive: true,
    maintainAspectRatio: false,
    cutout: 50,
    // borderRadius: 30,
    legend: {
      display: false
    }
  }
});

// summaryChart.canvas.parentNode.style.height = '15rem';
// summaryChart.canvas.parentNode.style.width = '15rem';