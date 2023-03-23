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

let clientUser;
function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      overlay.classList.add("hidden");
      const databaseRef = ref(database, "users/" + user.uid);
      clientUser = auth.currentUser;
      console.log(clientUser);

      get(databaseRef).then((client) => {
        // console.log("Name:", user_data.val().name);
        const name = document.querySelector("#user-name");
        name.textContent = client.val().name;
        clientUser = client;
      });
    } else {
      window.location.href = "/ICT-11-2-WEBSITE/index.html";
    }
  });
}

const loader = document.querySelector(".preloader");

window.addEventListener("load", function () {
  loader.classList.add("hidden");
  overlay.classList.add("hidden");
  checkAuthState();
});

const logOut = document.querySelector("#logout-button");
const logOutLink = document.querySelector("#logout-link");
const exitBtn = document.querySelectorAll(".btn-close");
const announce = document.querySelector("#add-announcement");
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
  document.querySelector(".overlay").classList.add("hidden");
  document.querySelector(".logout-modal").classList.add("hidden");
  document.querySelector(".announce-container").classList.add("hidden");
  document.querySelector(".upload-post-container").classList.add("hidden");
}

logOutLink.addEventListener("click", function () {
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".logout-modal").classList.remove("hidden");
});

exitBtn.forEach((btn) => {
  btn.addEventListener("click", toggleModal);
});
// exitBtn.addEventListener('click', toggleModal);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".logout-modal").classList.add("hidden");
    document.querySelector(".announce-container").classList.add("hidden");
  }
});

announce.addEventListener("click", function () {
  document.querySelector(".announce-container").classList.remove("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
});

//add new announcement
const submitAnnounce = document.querySelector("#submit-btn");
const announceContainer = document.querySelector("#new-announcements");

submitAnnounce.addEventListener("click", function () {
  const titleValue = document.querySelector("#title");
  const contentValue = document.querySelector("#content");

  const announcement = {
    author: clientUser.val().name,
    title: titleValue.value,
    content: contentValue.value,
  };

  const announcementsRef = ref(database, "announcements/" + Date.now());
  set(announcementsRef, announcement);

  titleValue.value = "";
  contentValue.value = "";
  toggleModal();
});

const announcementsRef = ref(database, "announcements");
let announcementTitles = [];

onValue(announcementsRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const announcement = childSnapshot.val();
    const contentValue = announcement.content;
    const titleValue = announcement.title;

    let titleExists = false;
    for (let i = 0; i < announcementTitles.length; i++) {
      if (announcementTitles[i] === titleValue) {
        titleExists = true;
        break;
      }
    }

    if (!titleExists) {
      const divCreate = document.createElement("div");
      divCreate.classList.add("announcement");
      const titleCreate = document.createElement("h2");
      const contentCreate = document.createElement("p");

      announcementTitles.push(titleValue);

      titleCreate.innerHTML = titleValue;
      contentCreate.innerHTML = contentValue;

      if (document.querySelector(".announcement")) {
        const firstChild = announceContainer.firstChild;
        announceContainer.insertBefore(divCreate, firstChild);
      } else {
        announceContainer.appendChild(divCreate);
      }

      divCreate.appendChild(titleCreate);
      divCreate.appendChild(contentCreate);
    }
  });
});

// POST FUNCTIONS!!
const createPostBtn = document.querySelector(".create-post");
const textArea = document.querySelector("#textarea");

createPostBtn.addEventListener("click", function () {
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".upload-post-container").classList.remove("hidden");
});

//designs for textarea
textArea.addEventListener("keyup", function (e) {
  textArea.style.height = "auto";
  let scrollHeight = e.target.scrollHeight;
  textArea.style.height = `${scrollHeight}px`;
});

//appending posts
const post = document.querySelector("#post-btn");
const allPosts = document.querySelector("#dos");
const postArrays = [];
let j = 0;
post.addEventListener("click", function () {
  //CREATE NEW ELEMENTS
  const postDivCreate = document.createElement("div");
  postDivCreate.classList.add("post");

  const postContent = {
    author: clientUser.val().name,
    content: textArea.value,
    postedBy: `Posted By: ${clientUser.val().name}`,
  };

  const postRefs = ref(database, "posts/" + Date.now());
  set(postRefs, postContent);

  toggleModal();
  textArea.value = "";
});

const postRefs = ref(database, "posts/");
let postContents = [];

onValue(postRefs, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const post = childSnapshot.val();
    const contentValue = post.content;
    const postedBy = post.postedBy;

    let postExists = false;
    for (let i = 0; i < postContents.length; i++) {
      if (postContents[i] === contentValue) {
        postExists = true;
        break;
      }
    }

    if (!postExists) {
      const postDivCreate = document.createElement("div");
      postDivCreate.classList.add("post");
      const postContentCreate = document.createElement("p");
      const postedByCreate = document.createElement("h2");

      postContents.push(contentValue);

      postedByCreate.innerHTML = postedBy;
      postContentCreate.innerHTML = contentValue;

      if (document.querySelector(".post")) {
        const firstChild = document.querySelector(".post");
        allPosts.insertBefore(postDivCreate, firstChild);
      } else allPosts.appendChild(postDivCreate);

      postDivCreate.appendChild(postedByCreate);
      postDivCreate.appendChild(postContentCreate);
    }
  });
});
