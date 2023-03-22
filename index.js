const to_signup_button = document.querySelector(".to-signup-button");
const to_login_button = document.querySelector(".to-login-button");
const signupContainer = document.querySelector(".container-signup");
const loginContainer = document.querySelector(".container-login");

if (localStorage.getItem("signUp") === "false") {
  signupContainer.classList.remove("hidden");
}

if (localStorage.getItem("logIn") === "true") {
  loginContainer.classList.add("hidden");
}

const login_signup = function () {
  signupContainer.classList.toggle("hidden");
  loginContainer.classList.toggle("hidden");
  localStorage.setItem("signUp", signupContainer.classList.contains("hidden"));
  localStorage.setItem("logIn", loginContainer.classList.contains("hidden"));
};

to_signup_button.addEventListener("click", login_signup);
to_login_button.addEventListener("click", login_signup);

document.querySelector('#toggle-password-signup').addEventListener('click', function () {
  let password = document.querySelector("#signup-password");
  if (password.type === "password")
    password.type = "text"
  else
    password.type = "password";

})

document.querySelector('#toggle-password-login').addEventListener('click', function () {
  let password = document.querySelector("#login-password");
  if (password.type === "password")
    password.type = "text"
  else
    password.type = "password";

})

