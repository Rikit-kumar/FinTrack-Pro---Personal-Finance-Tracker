function saveDataLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDataFromLS(key) {
  let data = localStorage.getItem(key);

  return data ? JSON.parse(data) : null;
}

function deleteDataFromLS(key) {
  localStorage.removeItem(key);
}

function clearFinTrackData() {
  deleteDataFromLS("fintrackUser")
  deleteDataFromLS("loggedIn");
}
