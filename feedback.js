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
  push,
  onValue,
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
const database = getDatabase();
const overlay = document.querySelector(".overlay");
function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      const databaseRef = ref(database, "users/" + user.uid);
      localStorage.setItem("userUID", user.uid);
      if (
        user.uid === "rdZtMxgvm7bjFEVeCCKoJ41loth2" ||
        user.uid === "o1LjDmMZMAQViYOndIGgOOwwz6h1" ||
        user.uid === "PjhIFNUKXLa0ru3L5W1xoRebWin1"
      ) {
        overlay.classList.add("hidden");
      } else {
        window.location.href = "main.html";
      }
    } else {
      window.location.href = "index.html";
    }
  });
}

window.addEventListener("load", function () {
  checkAuthState();
});

const feedbackRefs = ref(database, "feedbacks/");

onValue(feedbackRefs, (snapshot) => {
  const allFeedback = document.querySelector(".dos-landing-page");
  const feedBackTitle = allFeedback.firstElementChild; // get the first child element (h2)

  allFeedback.innerHTML = ""; // remove all other child elements
  allFeedback.appendChild(feedBackTitle); // append the h2 element back to the .dos-landing-page element

  snapshot.forEach((childSnapshot) => {
    const feedBack = childSnapshot.val();
    //Database Ref
    const feedBackTitle = feedBack.title;
    const feedBackContentValue = feedBack.content;
    const feedBackAuthor = feedBack.author;
    const datePosted = feedBack.datePosted;

    const createFbDiv = document.createElement("div");
    createFbDiv.classList.add("user-feedbacks");
    const createFbTitle = document.createElement("h2");
    const createFbContent = document.createElement("p");
    const createFbAuthor = document.createElement("p");
    const createFbDate = document.createElement("span");

    createFbTitle.innerHTML = feedBackTitle;
    createFbContent.innerHTML = feedBackContentValue;
    createFbAuthor.innerHTML = feedBackAuthor;
    // createFbDate.innerHTML = datePosted;

    if (datePosted !== "") {
      const postTime = Math.floor((new Date() - datePosted) / 1000);

      let timeString = "";
      switch (true) {
        case postTime < 60:
          timeString = postTime + " seconds ago";
          break;
        case postTime < 120:
          timeString = Math.trunc(postTime / 60) + " minute ago";
          break;
        case postTime < 3600:
          timeString = Math.trunc(postTime / 60) + " minutes ago";
          break;
        case postTime < 7200:
          timeString = Math.trunc(postTime / 3600) + " hour ago";
          break;
        case postTime < 86400:
          timeString = Math.trunc(postTime / 3600) + " hours ago";
          break;
        case postTime < 172800:
          timeString = Math.trunc(postTime / 86400) + " day ago";
          break;
        case postTime < 604800:
          timeString = Math.trunc(postTime / 86400) + " days ago";
          break;
        case postTime < 691200:
          timeString = Math.trunc(postTime / 604800) + " week ago";
          break;
        default:
          const fbSentDate = new Date(datePosted);
          const dateString = fbSentDate.toLocaleDateString();
          timeString = "Posted on " + dateString;
          break;
      }
      createFbDate.textContent = timeString;
    }

    if (document.querySelector(".user-feedbacks")) {
      const firstChild = document.querySelector(".user-feedbacks");
      allFeedback.insertBefore(createFbDiv, firstChild);
    } else allFeedback.appendChild(createFbDiv);

    createFbDiv.appendChild(createFbTitle);
    createFbDiv.appendChild(createFbContent);
    createFbDiv.appendChild(createFbAuthor);
    createFbDiv.appendChild(createFbDate);
  });
});
