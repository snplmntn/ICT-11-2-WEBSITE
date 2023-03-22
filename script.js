"use strict";

// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
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

const firebaseConfig = {
  apiKey: "AIzaSyBrtH6Qajw348Qzv4Urz9OSrrSmr6b84yM",
  authDomain: "dos-auth-26e96.firebaseapp.com",
  projectId: "dos-auth-26e96",
  storageBucket: "dos-auth-26e96.appspot.com",
  messagingSenderId: "1055880695102",
  appId: "1:1055880695102:web:f15713954c3f68b370706f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();


let userName = localStorage.getItem("userName");
const name = document.querySelector("#user-name");
name.textContent = userName;

const logOut = document.querySelector("#logout-button");
const logOutLink = document.querySelector("#logout-link");
const exitBtn = document.querySelectorAll('.btn-close');
const announce = document.querySelector('#add-announcement');
const overlay = document.querySelector(".overlay");

logOut.addEventListener("click", function () {
  // Call the signOut() method to log out the user
  localStorage.removeItem("userName");
  auth
    .signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
    });
});

function toggleModal() {
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.logout-modal').classList.add('hidden');
  document.querySelector('.announce-container').classList.add('hidden');
}

logOutLink.addEventListener('click', function () {
  document.querySelector('.overlay').classList.remove('hidden');
  document.querySelector('.logout-modal').classList.remove('hidden');
});

exitBtn.forEach(btn => {
  btn.addEventListener('click', toggleModal);
});
// exitBtn.addEventListener('click', toggleModal);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelector('.overlay').classList.add('hidden');
    document.querySelector('.logout-modal').classList.add('hidden');
    document.querySelector('.announce-container').classList.add('hidden');
  }
})

announce.addEventListener('click', function () {
  document.querySelector('.announce-container').classList.remove('hidden');
  document.querySelector('.overlay').classList.toggle('hidden');
});


//add new announcement
const submitAnnounce = document.querySelector('#submit-btn');
const announceContainer = document.querySelector('#new-announcements');


submitAnnounce.addEventListener('click', function () {
  //CREATE NEW ELEMENTS
  const divCreate = document.createElement('div');
  const titleCreate = document.createElement('h2');
  const contentCreate = document.createElement('p');

  const titleValue = document.querySelector('#title');
  const contentValue = document.querySelector('#content');
  const titleArrays = [];
  const contentArrays = [];
  let i = 0;
  titleArrays.push(titleValue.value);
  contentArrays.push(contentValue.value);

  titleCreate.innerHTML = titleArrays[i];
  contentCreate.innerHTML = contentArrays[i];
  i++;

  announceContainer.appendChild(divCreate);
  divCreate.appendChild(titleCreate);
  divCreate.appendChild(contentCreate);
  titleValue.value = ''
  contentValue.value = ''
  toggleModal();
});

function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      overlay.classList.add("hidden");
    } else {
      window.location.href = "/index.html";
    }
  });
}

const loader = document.querySelector(".preloader");

window.addEventListener("load", function () {
  loader.classList.add("hidden");
  overlay.classList.add("hidden");
  checkAuthState();
});