let financeChart;

function createChart() {
  let user = getDataFromLS("loggedInUser");

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

  function formatChartMoney(value) {
    let user = getDataFromLS("loggedInUser");

    let currency = user?.currency || "INR";

    let symbol = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    };

    return symbol[currency] + value.toLocaleString();
  }

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
              return formatChartMoney(context.raw);
            },
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatChartMoney(value);
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

window.addEventListener("load",()=>{
    createChart();
});
