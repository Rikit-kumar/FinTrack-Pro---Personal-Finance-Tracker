let financeChart;

function createChart() {
  let user = getDataFromLS("fintrackUser");

  if (!user) return;

  let transactions = user.transactions || [];

  let income = 0;
  let expense = 0;

  transactions.forEach((item) => {
    if (item.type === "income") {
      income += Number(item.amount);
    } else {
      expense += Number(item.amount);
    }
  });

  const canvas = document.querySelector("#chart");

  if (!canvas) return;

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(canvas, {
    type: "bar",

    data: {
      labels: ["Income", "Expense"],

      datasets: [
        {
          label: "Cash Flow",
          data: [income, expense],
          borderRadius: 10,
          barThickness: 120,
          backgroundColor: ["#16a34a", "#dc2626"],
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return " ₹ " + context.raw.toLocaleString();
            },
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "₹" + value;
            },
          },

          grid: {
            display: false,
          },
        },

        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

createChart();
