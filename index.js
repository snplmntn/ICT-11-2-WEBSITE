const to_signup_button = document.querySelector(".to-signup-button");
const to_login_button = document.querySelector(".to-login-button");
const signupContainer = document.querySelector(".container-signup");
const loginContainer = document.querySelector(".container-login");
const signUpMessage = document.querySelector(".signup-message");
const loginMessage = document.querySelector(".login-message");

if (localStorage.getItem("signUp") === "false") {
  signupContainer.classList.remove("hidden");
  signUpMessage.classList.remove("hidden");
  loginMessage.classList.add("hidden");
}

if (localStorage.getItem("logIn") === "true") {
  loginContainer.classList.add("hidden");
}

const login_signup = function () {
  signupContainer.classList.toggle("hidden");
  loginContainer.classList.toggle("hidden");

  if (signupContainer.classList.contains("hidden")) {
    signUpMessage.classList.add("hidden");
    loginMessage.classList.remove("hidden");
  } else {
    signUpMessage.classList.remove("hidden");
    loginMessage.classList.add("hidden");
  }

  localStorage.setItem("signUp", signupContainer.classList.contains("hidden"));
  localStorage.setItem("logIn", loginContainer.classList.contains("hidden"));
};

to_signup_button.addEventListener("click", login_signup);
to_login_button.addEventListener("click", login_signup);

const faEyeL = document.querySelector(".fa-eyeL");
const faEyeSlashL = document.querySelector(".fa-eye-slashL");
const faEyeS = document.querySelector(".fa-eyeS");
const faEyeSlashS = document.querySelector(".fa-eye-slashS");

const toggleLoginPassword = function () {
  let password = document.querySelector("#login-password");
  if (password.type === "password") password.type = "text";
  else password.type = "password";

  faEyeL.classList.toggle("hidden");
  faEyeL.classList.toggle("show");
  faEyeSlashL.classList.toggle("show");
  faEyeSlashL.classList.toggle("hidden");
};

const toggleSignupPassword = function () {
  let password = document.querySelector("#signup-password");
  let confirmPassword = document.querySelector("#signup-confirm-password");
  if (password.type === "password" && confirmPassword.type === "password") {
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
  }

  faEyeS.classList.toggle("hidden");
  faEyeS.classList.toggle("show");
  faEyeSlashS.classList.toggle("show");
  faEyeSlashS.classList.toggle("hidden");
};

faEyeL.addEventListener("click", toggleLoginPassword);
faEyeSlashL.addEventListener("click", toggleLoginPassword);
faEyeS.addEventListener("click", toggleSignupPassword);
faEyeSlashS.addEventListener("click", toggleSignupPassword);
