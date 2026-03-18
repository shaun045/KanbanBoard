const ctx = document.getElementById('myChart');
const percentageLabels = {
  id: 'percentageLabels',
  afterDatasetsDraw(chart) {
    const { ctx , data } = chart;

    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      const value = data.datasets[0].data[index];
      const percentage = Math.round((value / total) * 100) + '%';

      ctx.save();
      ctx.font = 'bold 13px Poppins';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(percentage, bar.x, bar.y - 10);
      ctx.restore();
    });
  }
};

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['To Do', 'Doing', 'Done'],
      datasets: [{
        label: 'Task Categories Percentage',
        data: [boards[currentBoard].todo.length, boards[currentBoard].doing.length, boards[currentBoard].done.length],
        borderWidth: 1,
        backgroundColor: [
          'rgba(255, 225, 185, 1)',
          'rgba(186, 214, 255, 1)',
          'rgba(231, 208, 255, 1)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            font: { size: 0, family: 'Poppins' },
            color: 'white'
          }
        }
      },

      scales: {
        x: {
          ticks: {
            font: {size: 20, family: 'Poppins'},
            color: [
              'rgba(255, 225, 185, 1)',
              'rgba(186, 214, 255, 1)',
              'rgba(231, 208, 255, 1)'
            ]
          },
          display: true,
          grid: {
            display: false,
            // drawBorder:true,
          },
          border: {
            display: true,
            color: 'white',
            width: 2
          }
        },


        y: {
          beginAtZero: true,
          display: true,
          grid: {
            display: false,
            // drawBorder:true,
          },
          border: {
            display: true,
            color: 'white',
            width: 2
          },
          ticks: {
            font: {size: 12},
            color: '#888'
          },
          grid: {
            // color: 'rgba(255,255,255,0.1)'
          }
        }
      },

      datasets: {
        bar: {
          barThickness: 90,
          borderRadius: 6,
        }
      }
    },
    plugins: [percentageLabels]
  });