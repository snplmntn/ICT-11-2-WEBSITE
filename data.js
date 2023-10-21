"use strict";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let load = false;
//Checks User's Auth
function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (load) {
      if (user) {
        window.location.href = "main.html";
      }
      load = false;
    }
  });
}
window.addEventListener("load", function () {
  load = true;
  checkAuthState();
});

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrtH6Qajw348Qzv4Urz9OSrrSmr6b84yM",
  authDomain: "dos-auth-26e96.firebaseapp.com",
  projectId: "dos-auth-26e96",
  storageBucket: "dos-auth-26e96.appspot.com",
  messagingSenderId: "1055880695102",
  appId: "1:1055880695102:web:f15713954c3f68b370706f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

//buttons
const signUp_button = document.querySelector("#signup-button");
const logIn_button = document.querySelector("#login-button");

//Error message
let sError = document.getElementById("signup-error");
let lError = document.getElementById("login-error");
const logIn = document.querySelector(".container-login");
const signUp = document.querySelector(".container-signup");
// Signup function
function signup() {
  const email = document.getElementById("signup-email").value;
  const name = document.getElementById("signup-name").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;
  const termsCondition = document.querySelector(
    "#terms-and-conditions-checkbox"
  );

  // Validate input fields
  if (
    email === "" ||
    name === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    sError.textContent = "Please fill up all the needed information.";
    signUp.classList.add("error-animation");
    return;
  }

  if (validate_email(email) == false) {
    sError.textContent = "Email must be valid.";
    signUp.classList.add("error-animation");
    return;
  }

  if (validate_password(password) == false) {
    sError.textContent = "Password must consist of atleast 6 characters.";
    signUp.classList.add("error-animation");
    return;
  }

  if (password !== confirmPassword) {
    sError.textContent = "Password do not match.";
    signUp.classList.add("error-animation");
    return;
  }

  if (!termsCondition.checked) {
    sError.textContent =
      "You must agree to the terms and conditions to continue..";
    signUp.classList.add("error-animation");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      // Sign up successful

      // Declare user variable
      const user = auth.currentUser;
      // Get a reference to the "users" node with the user's UID as the child node
      const databaseRef = ref(database, "users/" + user.uid);

      // Create User data
      const user_data = {
        email: email,
        name: name,
        password: password,
        dateCreated: Date.now(),
      };

      // Push to Firebase Database
      set(databaseRef, user_data).then(function () {
        document.getElementById("signup-correct").innerHTML =
          "Signup successful!";
        sError.textContent = "";

        auth.signOut();
      });
    })
    .catch(function (error) {
      // Sign up failed
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing up:", errorMessage);
      sError.textContent = errorMessage;
      document.getElementById("signup-correct").innerHTML = "";
    });
}

// Login function
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (email === "" || password === "") {
    lError.textContent = "Please fill up all the needed information.";
    logIn.classList.add("error-animation");
  }
  if (validate_email(email) == false) {
    lError.textContent = "Email is not valid.";
    logIn.classList.add("error-animation");
    return;
    // Don't continue running the code
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      // Login successful
      const user = auth.currentUser;
      if (user) {
        // Add this user to Firebase Database
        const databaseRef = ref(database, "users/" + user.uid);
        // Retrieve User data
        get(databaseRef).then((user_data) => {
          window.location.href = "main.html";
        });
        // Update last login time
        update(databaseRef, { last_login: Date.now() });
      }
    })
    .catch(function (error) {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      document.getElementById("login-error").innerHTML = errorMessage;
    });
}

signUp_button.addEventListener("click", signup);
logIn_button.addEventListener("click", login);

signUp.addEventListener("animationend", () => {
  signUp.classList.remove("error-animation");
});

logIn.addEventListener("animationend", () => {
  logIn.classList.remove("error-animation");
});

// Validate Functions
function validate_email(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

//Hot keys
const loginInputForHotkey = document.querySelectorAll(".login-input");
const signUpInputForHotkey = document.querySelectorAll(".signup-input");

signUpInputForHotkey.forEach((signUpInput) =>
  signUpInput.addEventListener("keydown", (event) => {
    if (localStorage.getItem("signUp") === "false")
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        signup();
      }
  })
);

loginInputForHotkey.forEach((loginInput) =>
  loginInput.addEventListener("keydown", (event) => {
    if (localStorage.getItem("logIn") === "false")
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        login();
      }
  })
);
