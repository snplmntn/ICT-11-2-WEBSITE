let userName = localStorage.getItem("userName");

const name = document.querySelector("#user-name");
name.textContent = userName;

const logOut = document.querySelector("#logout-button");

logOut.addEventListener("click", function () {
  localStorage.removeItem("userName");
});
