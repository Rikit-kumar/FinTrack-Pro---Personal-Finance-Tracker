const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (evet) => {
    evet.preventDefault();

    let name = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (name === "" || password === "") {
      alert("Please Fill All Field");
      return;
    }

    let users = getDataFromLS("fintrackUser") || [];

    if (!Array.isArray(users)) {
      users = [users];
    }

    let existUser = users.find((user) => user.name === name);

    if (existUser) {
      alert("User Already Exists");
      return;
    }

    let newUser = {
      id: Date.now(),
      name: name,
      password: password,
      currency: "INR",
      theme: "light",
      transactions: [],
    };

    users.push(newUser);

    saveDataLS("fintrackUser", users);

    alert("Account Created Successfully");
    window.location.href = "index.html";
  });
}

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (evet) => {
    evet.preventDefault();

    let name = document.querySelector("#loginName").value;
    let password = document.querySelector("#loginPassword").value;

    let users = getDataFromLS("fintrackUser") || [];

    if (!Array.isArray(users)) {
      users = [users];
    }

    let user = users.find(
      (item) => item.name === name && item.password === password,
    );

    if (!user) {
      alert("User Not Found Or Wrong Password");
      loginForm.reset();
      return;
    }

    saveDataLS("loggedInUser", user);
    saveDataLS("loggedIn", "true");

    window.location.href = "dashboard.html";
  });
}

const logoutBtn = document.querySelector(".logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    deleteDataFromLS("loggedIn");
    deleteDataFromLS("loggedInUser");
    window.location.href = "index.html";
  });
}
