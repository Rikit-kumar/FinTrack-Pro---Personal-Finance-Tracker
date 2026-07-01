let loggedIn = getDataFromLS("loggedIn");

if (!loggedIn) {
  window.location.href = "index.html";
}

let user = getDataFromLS("loggedInUser");

if (!user) {
  window.location.href = "index.html";
}

let transactions = user.transactions || [];

const userName = document.querySelector(".userName");
const balance = document.querySelector("#balance");
const totalIncome = document.querySelector("#income");
const totalExpense = document.querySelector("#expense");
const totalTransaction = document.querySelector("#count");
const transactionList = document.querySelector("#transactionList");

const modal = document.querySelector("#transactionModal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");
const modalForm = document.querySelector("#modal-form");

let editId = null;

function updateUserData() {
  saveDataLS("loggedInUser", {
    ...user,
    transactions: transactions,
  });

  let users = getDataFromLS("fintrackUser") || [];

  users = users.map((item) => {
    if (item.id === user.id) {
      return {
        ...user,
        transactions: transactions,
      };
    }

    return item;
  });

  saveDataLS("fintrackUser", users);
}

if (userName) {
  userName.innerText = user.name;
}

let themeBtn = document.querySelector(".theme-icon");
let themeIcon = document.querySelector(".theme-icon i");
let body = document.body;

themeBtn.addEventListener("click", () => {
  let currentTheme = body.dataset.theme;

  if (currentTheme === "light") {
    body.dataset.theme = "dark";
    themeIcon.className = "ri-sun-fill";
  } else {
    body.dataset.theme = "light";
    themeIcon.className = "ri-moon-fill";
  }

  user.theme = body.dataset.theme;
  updateUserData();
});

function loadTheme() {
  if (user.theme) {
    body.dataset.theme = user.theme;

    if (user.theme === "dark") {
      themeIcon.classList = "ri-sun-fill";
    } else {
      themeIcon.className = "ri-moon-fill";
    }
  }
}

openModal.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (evet) => {
  if (evet.target === modal) {
    modal.style.display = "none";
  }
});

modalForm.addEventListener("submit", (evet) => {
  evet.preventDefault();

  let type = document.querySelector("#type").value.toLowerCase();
  let title = document.querySelector("#title").value;
  let amount = document.querySelector("#amount").value;
  let date = document.querySelector("#date").value;
  let category = document.querySelector("#category").value;

  let newTransaction = {
    id: editId ? editId : Date.now(),
    type,
    title,
    amount: Number(amount),
    date: date || new Date().toLocaleDateString(),
    category,
  };

  if (editId) {
    transactions = transactions.map((item) => {
      return item.id === editId ? newTransaction : item;
    });
    editId = null;
  } else {
    transactions.push(newTransaction);
  }

  updateUserData();

  modalForm.reset();
  modal.style.display = "none";

  updateDashBoard();
});

function updateDashBoard() {
  let income = 0;
  let expense = 0;

  transactions.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  let currentBalance = income - expense;

  balance.innerText = formatMoney(currentBalance);
  totalIncome.innerText = formatMoney(income);
  totalExpense.innerText = formatMoney(expense);
  totalTransaction.innerText = transactions.length;

  renderTransactions();
  if (typeof createChart === "function") {
    createChart();
  }
}

function renderTransactions(data = transactions) {
  transactionList.innerHTML = "";

  if (data.length === 0) {
    transactionList.innerHTML = `
        <tr>
        <td colspan="6" style="text-align:center">
        No Transaction Found
        </td>
        </tr>
    `;
    return;
  }

  data.forEach((item) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td class="${item.type}">
        ${item.type}
        </td>

        <td>
        ${formatMoney(item.amount)}
        </td>

        <td>
        <div class="action-btns">
        <button class="transaction-edit-btn" onclick="editTransaction(${item.id})"><i class="ri-pencil-fill"></i></button>
        <button class="transaction-del-btn" onclick="deleteTransaction(${item.id})"><i class="ri-delete-bin-line"></i></button>
        </div>
        </td>

    `;

    transactionList.appendChild(row);
  });
}

function editTransaction(id) {
  let selected = transactions.find((item) => item.id === id);

  if (!selected) return;

  editId = id;

  modal.style.display = "flex";

  let inputs = modalForm.querySelectorAll("input");
  let selects = modalForm.querySelectorAll("select");

  selects[0].value = selected.type;
  inputs[0].value = selected.title;
  inputs[1].value = selected.amount;
  inputs[2].value = selected.date;
  selects[1].value = selected.category;
}

window.editTransaction = editTransaction;

function deleteTransaction(id) {
  transactions = transactions.filter((i) => i.id !== id);

  updateUserData();
  updateDashBoard();
}

window.deleteTransaction = deleteTransaction;

const search = document.querySelector("#search");
const filter = document.querySelector("#filter");

function filterTransactions() {
  let text = search.value.toLowerCase();
  let type = filter.value;
  let result = transactions.filter((i) => {
    let matchText = i.title.toLowerCase().includes(text);
    let matchType = type === "all" || i.type === type;

    return matchText && matchType;
  });

  renderTransactions(result);
}

if (search && filter) {
  search.addEventListener("input", filterTransactions);
  filter.addEventListener("change", filterTransactions);
}

document.querySelector(".logoutBtn").addEventListener("click", () => {
  deleteDataFromLS("loggedIn");
  deleteDataFromLS("loggedInUser");
  window.location.href = "index.html";
});

function formatMoney(val) {
  let currency = user.currency || "INR";

  let symbol = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };

  return symbol[currency] + Number(val).toFixed(2);
}

let resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => {
  let confirmReset = confirm(
    "Are you sure you want to delete all transactions?",
  );

  if (!confirmReset) {
    return;
  }

  transactions = [];

  updateUserData();

  alert("All Transactions Deleted");
  updateDashBoard();
});

let settingsForm = document.querySelector("#settingsForm");
let nameInput = document.querySelector("#settingName");
let currencyInput = document.querySelector("#currency");

if (user) {
  nameInput.value = user.name;
  currencyInput.value = user.currency || "INR";
}

const dashboardBtn = document.querySelector("#dashboardBtn");
const settingsBtn = document.querySelector("#settingsBtn");

const dashboardSection = document.querySelector("#dashboardSection");
const settingsSection = document.querySelector("#settingsSection");

settingsBtn.addEventListener("click", () => {
  dashboardSection.style.display = "none";

  settingsSection.style.display = "block";

  settingsBtn.classList.add("active");
  dashboardBtn.classList.remove("active");
});

dashboardBtn.addEventListener("click", () => {
  settingsSection.style.display = "none";

  dashboardSection.style.display = "grid";

  dashboardBtn.classList.add("active");
  settingsBtn.classList.remove("active");

  setTimeout(() => {
    if (typeof createChart === "function") {
      createChart();
    }
  }, 100);
});

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let updatedUser = {
    ...getDataFromLS("loggedInUser"),
    name: nameInput.value,
    currency: currencyInput.value,
  };

  saveDataLS("loggedInUser", updatedUser);
  alert("Settings Updated Successfully");
  window.location.reload();
});

let resetAccount = document.querySelector("#resetAccount");

resetAccount.addEventListener("click", () => {
  let confirmDelete = confirm("Delete your complete account data?");

  if (!confirmDelete) return;

  deleteDataFromLS("fintrackUser");
  deleteDataFromLS("loggedInUser");
  deleteDataFromLS("loggedIn");

  alert("Account Reset Successfully");

  window.location.href = "index.html";
});

updateDashBoard();
loadTheme();
