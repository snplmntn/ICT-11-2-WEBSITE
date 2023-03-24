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
const name = document.querySelector("#user-name");

function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      overlay.classList.add("hidden");
      const databaseRef = ref(database, "users/" + user.uid);
      // clientUser = auth.currentUser;

      get(databaseRef).then((client) => {
        name.textContent = client.val().name;
        clientUser = client;
        localStorage.setItem("userName", client.val().name);
      });
    } else {
      //When deployed to github
      // window.location.href = "/ICT-11-2-WEBSITE/index.html";
      window.location.href = "index.html";
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
const logOutLink = document.querySelectorAll(".logout-link");
const exitBtn = document.querySelectorAll(".btn-close");
const announce = document.querySelector("#add-announcement");
const overlay = document.querySelector(".overlay");

logOut.addEventListener("click", function () {
  // Calls the signOut() method to log out the user
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

//removes modals
function toggleModal() {
  document.querySelector(".overlay").classList.add("hidden");
  document.querySelector(".logout-modal").classList.add("hidden");
  document.querySelector(".announce-container").classList.add("hidden");
  document.querySelector(".upload-post-container").classList.add("hidden");
}

logOutLink.forEach(function (logout) {
  logout.addEventListener("click", function () {
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".logout-modal").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
    mobileNav.classList.add("hidden");
  });
});

exitBtn.forEach((btn) => {
  btn.addEventListener("click", toggleModal);
});

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
    announementDate: Date.now(),
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
    const author = announcement.author;
    const datePosted = announcement.announementDate;

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
      const postedDateCreate = document.createElement("span");

      announcementTitles.push(titleValue);

      if (datePosted !== "") {
        let postTime = Math.floor((new Date() - datePosted) / 1000);

        if (postTime < 60)
          postedDateCreate.textContent = `${author}: ${postTime} seconds ago`;

        if (postTime >= 60 && postTime < 120) {
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 60
          )} minute ago`;
        } else if (postTime >= 120) {
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 60
          )} minutes ago`;
        }

        if (postTime >= 3600 && postTime < 7200) {
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 3600
          )} hour ago`;
        } else if (postTime >= 7200)
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 3600
          )} hours ago`;

        if (postTime >= 86400 && postTime < 172800)
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 86400
          )} day ago`;
        else if (postTime >= 172800)
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 86400
          )} days ago`;

        if (postTime >= 604800 && postTime < 691200)
          postedDateCreate.textContent = `${author}: ${Math.trunc(
            postTime / 604800
          )} week ago`;
        else if (postTime >= 691200) {
          let postedDate = new Date(datePosted);
          let dateString = postedDate.toLocaleDateString();
          postedDateCreate.textContent = `${author}: ${dateString}`;
        }
      }

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
      divCreate.appendChild(postedDateCreate);
    }
  });
});

// POST FUNCTIONS!!
const createPostBtn = document.querySelector(".create-post");
const subject = document.querySelector("#post-subject");
const content = document.querySelector("#post-content");

createPostBtn.addEventListener("click", function () {
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".upload-post-container").classList.remove("hidden");
});

//designs for textarea
content.addEventListener("keyup", function (e) {
  content.style.height = "auto";
  let scrollHeight = e.target.scrollHeight;
  content.style.height = `${scrollHeight}px`;
});

//appending posts
const post = document.querySelector("#post-btn");
const allPosts = document.querySelector("#dos");
const checkBox = document.querySelector("#anonymous");
const errorMessage = document.querySelector("#post-error");

post.addEventListener("click", function () {
  if (subject.value === "" || content.value === "") {
    errorMessage.textContent = "Subject or Content is not filled.";
    return;
  }

  let postedBy;
  if (checkBox.checked == true) postedBy = "Anonymous";
  else postedBy = `Posted By: ${clientUser.val().name}`;

  const postContent = {
    author: clientUser.val().name,
    subject: subject.value,
    content: content.value,
    postedBy: postedBy,
    datePosted: Date.now(),
  };

  const postRefs = ref(database, "posts/" + Date.now());
  set(postRefs, postContent);

  toggleModal();
  subject.value = "";
  content.value = "";
  checkBox.checked = false;
  errorMessage.textContent = "";
});

const postRefs = ref(database, "posts/");

const loadPosts = function () {
  // Listen for changes in the database and update UI accordingly
  onValue(postRefs, (snapshot) => {
    const allPosts = document.querySelector(".dos-landing-page");
    const newsFeedTitle = allPosts.firstElementChild; // get the first child element (h2)

    if (localStorage.getItem("IsMyPosts") === "true") {
      newsFeedTitle.textContent = "My Posts";
    } else newsFeedTitle.textContent = "Newsfeed";

    allPosts.innerHTML = ""; // remove all other child elements
    allPosts.appendChild(newsFeedTitle); // append the h2 element back to the .dos-landing-page element

    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();

      if (localStorage.getItem("IsMyPosts") === "true") {
        if (post.author !== localStorage.getItem("userName")) {
          return;
        }
      }

      //Database Ref
      let postSubject = post.subject;
      const postContentValue = post.content;
      const postedBy = post.postedBy;
      let datePosted = post.datePosted;

      if (postSubject === undefined) postSubject = "";
      if (datePosted === undefined) datePosted = "";

      //HTML Ref
      const postDivCreate = document.createElement("div");
      postDivCreate.classList.add("post");
      const postSubjectCreate = document.createElement("h2");
      const postContentCreate = document.createElement("p");
      const postedByCreate = document.createElement("p");
      const postedDateCreate = document.createElement("span");

      postSubjectCreate.innerHTML = postSubject;
      postContentCreate.innerHTML = postContentValue;
      postedByCreate.innerHTML = postedBy;
      postedDateCreate.innerHTML = datePosted;

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
            const postedDate = new Date(datePosted);
            const dateString = postedDate.toLocaleDateString();
            timeString = "Posted on " + dateString;
            break;
        }
        postedDateCreate.textContent = timeString;
      }

      if (document.querySelector(".post")) {
        const firstChild = document.querySelector(".post");
        allPosts.insertBefore(postDivCreate, firstChild);
      } else allPosts.appendChild(postDivCreate);

      postDivCreate.appendChild(postSubjectCreate);
      postDivCreate.appendChild(postContentCreate);
      postDivCreate.appendChild(postedByCreate);
      postDivCreate.appendChild(postedDateCreate);
    });
  });
};

document.querySelectorAll(".my-posts").forEach(function (myPost) {
  myPost.addEventListener("click", function () {
    localStorage.setItem("IsMyPosts", "true");
    loadPosts();
  });
});

document.querySelectorAll(".home").forEach(function (myPost) {
  myPost.addEventListener("click", function () {
    localStorage.setItem("IsMyPosts", "false");
    loadPosts();
  });
});

//Loads the posts when u enter the dashboard
loadPosts();

// const postRefs = ref(database, "posts/");
// let postContents = [];

// document.querySelectorAll(".my-posts").forEach(function (myPost) {
//   myPost.addEventListener("click", function () {
//     if (localStorage.getItem("IsMyPosts") === "true") {
//       localStorage.setItem("IsMyPosts", "false");
//     } else {
//       localStorage.setItem("IsMyPosts", "true");
//     }
//     location.reload();
//   });
// });

// onValue(postRefs, (snapshot) => {
//   snapshot.forEach((childSnapshot) => {
//     const post = childSnapshot.val();

//     if (localStorage.getItem("IsMyPosts") === "true") {
//       if (post.author !== localStorage.getItem("userName")) {
//         return;
//       }
//     }

//     //Database Ref
//     let postSubject = post.subject;
//     const postContentValue = post.content;
//     const postedBy = post.postedBy;
//     let datePosted = post.datePosted;

//     if (postSubject === undefined) postSubject = "";
//     if (datePosted === undefined) datePosted = "";

//     //HTML Ref
//     const postDivCreate = document.createElement("div");
//     postDivCreate.classList.add("post");
//     const postSubjectCreate = document.createElement("h2");
//     const postContentCreate = document.createElement("p");
//     const postedByCreate = document.createElement("p");
//     const postedDateCreate = document.createElement("span");

//     postContents.push(post);

//     postSubjectCreate.innerHTML = postSubject;
//     postContentCreate.innerHTML = postContentValue;
//     postedByCreate.innerHTML = postedBy;
//     postedDateCreate.innerHTML = datePosted;

//     if (datePosted !== "") {
//       let postTime = Math.floor((new Date() - datePosted) / 1000);

//       if (postTime < 60)
//         postedDateCreate.textContent = postTime + " seconds ago";

//       if (postTime >= 60 && postTime < 120) {
//         postedDateCreate.textContent = Math.trunc(postTime / 60) + "minute ago";
//       } else if (postTime >= 120) {
//         postedDateCreate.textContent =
//           Math.trunc(postTime / 60) + "minutes ago";
//       }

//       if (postTime >= 3600 && postTime < 7200) {
//         postedDateCreate.textContent = Math.trunc(postTime / 3600) + "hour ago";
//       } else if (postTime >= 7200)
//         postedDateCreate.textContent =
//           Math.trunc(postTime / 3600) + "hours ago";

//       if (postTime >= 86400 && postTime < 172800)
//         postedDateCreate.textContent = Math.trunc(postTime / 86400) + "day ago";
//       else if (postTime >= 172800)
//         postedDateCreate.textContent =
//           Math.trunc(postTime / 86400) + "days ago";

//       if (postTime >= 604800 && postTime < 691200)
//         postedDateCreate.textContent =
//           Math.trunc(postTime / 604800) + "week ago";
//       else if (postTime >= 691200) {
//         let postedDate = new Date(datePosted);
//         let dateString = postedDate.toLocaleDateString();
//         postedDateCreate.textContent = "Posted on " + dateString;
//       }
//     }

//     if (document.querySelector(".post")) {
//       const firstChild = document.querySelector(".post");
//       allPosts.insertBefore(postDivCreate, firstChild);
//     } else allPosts.appendChild(postDivCreate);

//     postDivCreate.appendChild(postSubjectCreate);
//     postDivCreate.appendChild(postContentCreate);
//     postDivCreate.appendChild(postedByCreate);
//     postDivCreate.appendChild(postedDateCreate);
//   });
// });

//collapsible navbar
const navIcon = document.querySelector(".hamburgur-icon");
const mobileNav = document.getElementById("nav-mobile");

navIcon.addEventListener("click", function () {
  mobileNav.classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
});

// functions for post and announcement in nav
const navPost = document.getElementById("nav-post");
const navAnnounce = document.getElementById("nav-announce");
const mobileNewsFeed = document.getElementById("nf");
const asideContents = document.querySelectorAll(".aside-contents");
navPost.addEventListener("click", function () {
  document.querySelector("main").classList.add("hidden");
  document.querySelector(".information-wrapper").style.display = "flex";
  document.querySelector(".announcement-wrapper").style.display = "none";
  document.querySelector(".overlay").classList.toggle("hidden");
  mobileNav.classList.toggle("hidden");
});

navAnnounce.addEventListener("click", function () {
  document.querySelector("main").classList.add("hidden");
  document.querySelector(".announcement-wrapper").style.display = "flex";
  document.querySelector(".information-wrapper").style.display = "none";
  document.querySelector(".overlay").classList.toggle("hidden");
  mobileNav.classList.toggle("hidden");
});

mobileNewsFeed.addEventListener("click", function () {
  asideContents.forEach((content) => {
    content.style.display = "none";
  });
  document.querySelector("#main").classList.remove("hidden");
  mobileNav.classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
});
