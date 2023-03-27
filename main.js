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
  child,
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
// const rootRef = ref();

//Overlay
const overlay = document.querySelector(".overlay");

let currentUser;
let userStatus = "user";

const name = document.querySelector("#user-name");
function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // overlay.classList.add("hidden");
      const databaseRef = ref(database, "users/" + user.uid);
      localStorage.setItem("userUID", user.uid);

      get(databaseRef).then((client) => {
        name.textContent = client.val().name;
        localStorage.setItem("userName", client.val().name);

        if (
          localStorage.getItem("userName") === "test" ||
          localStorage.getItem("userName") === "Sean" ||
          localStorage.getItem("userName") === "Morc"
        )
          userStatus = "Admin";

        currentUser = client;
      });
    } else {
      window.location.href = "index.html";
    }
  });
}

const loader = document.querySelector(".preloader");

window.addEventListener("load", function () {
  loader.classList.add("hidden");
  checkAuthState();
});

// window.addEventListener("beforeunload", function () {
//   localStorage.removeItem("lastAnnouncement");
// });

const logOut = document.querySelector("#logout-button");
const logOutLink = document.querySelectorAll(".logout-link");
const exitBtn = document.querySelectorAll(".btn-close");

logOut.addEventListener("click", function () {
  // Calls the signOut() method to log out the user
  localStorage.removeItem("userName");
  localStorage.removeItem("userUID");

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
  document.querySelector(".feedback-container").classList.add("hidden");
  document.querySelector(".survey-container").classList.add("hidden");
  document.querySelector(".collapsed-nav").classList.add("hidden");
}

logOutLink.forEach(function (logout) {
  logout.addEventListener("click", function () {
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".overlay").style.zIndex = 1000;
    document.querySelector(".logout-modal").classList.remove("hidden");
    document.querySelector(".logout-modal").style.zIndex = 1001;
    mobileNav.classList.add("hidden");
  });
});

exitBtn.forEach((btn) => {
  btn.addEventListener("click", toggleModal);
});

document.querySelector(".overlay").addEventListener("click", toggleModal);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".logout-modal").classList.add("hidden");
    document.querySelector(".announce-container").classList.add("hidden");
    document.querySelector(".feedback-container").classList.add("hidden");
  }
});

//Announcement
const announce = document.querySelector("#add-announcement");
const announceError = document.querySelector("#announcement-error");

announce.addEventListener("click", function () {
  announceError.textContent = "";
  document.querySelector(".announce-container").classList.remove("hidden");
  document.querySelector(".announce-container").style.zIndex = 1001;
  document.querySelector(".overlay").classList.toggle("hidden");
  document.querySelector(".overlay").style.zIndex = 1000;
});

//add new announcement
const submitAnnounce = document.querySelector("#submit-btn");
const announceContainer = document.querySelector("#new-announcements");

function announceFunction() {
  const titleValue = document.querySelector("#title");
  const contentValue = document.querySelector("#content");

  if (titleValue.value === "" || contentValue.value === "") {
    announceError.textContent = "Title or Content is not filled.";
    return;
  }
  const announcement = {
    author: currentUser.val().name,
    title: titleValue.value,
    content: contentValue.value,
    announementDate: Date.now(),
  };

  const announcementsRef = ref(database, "announcements/" + Date.now());
  set(announcementsRef, announcement);

  titleValue.value = "";
  contentValue.value = "";
  toggleModal();
  announceError.textContent = "";
}

submitAnnounce.addEventListener("click", announceFunction);

//Anouncements
const announcementsRef = ref(database, "announcements");
let announcementTitles = [];

onValue(announcementsRef, (snapshot) => {
  announcementTitles = []; // clear the announcementTitles array
  snapshot.forEach((childSnapshot) => {
    const announcement = childSnapshot.val();
    const contentValue = announcement.content;
    const titleValue = announcement.title;
    const author = announcement.author;
    const datePosted = announcement.announementDate;

    let titleExists = false;
    if (announcementTitles.includes(titleValue)) {
      return;
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

        // Prevent NaN time or -1
        if (postTime < 0 || postTime === NaN) {
          postTime = 1;
        }

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
const errorMessage = document.querySelector("#post-error");

createPostBtn.addEventListener("click", function () {
  errorMessage.textContent = "";
  subject.value = "";
  content.value = "";
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".overlay").style.zIndex = 1000;
  document.querySelector(".upload-post-container").classList.remove("hidden");
  document.querySelector(".upload-post-container").style.zIndex = 1001;
});

//designs for textarea
content.addEventListener("keyup", function (e) {
  content.style.height = "auto";
  let scrollHeight = e.target.scrollHeight;
  content.style.height = `${scrollHeight}px`;
});

//appending posts
const post = document.querySelector("#post-btn");
const checkBox = document.querySelector("#anonymous");

function postFunction() {
  if (subject.value === "" || content.value === "") {
    errorMessage.textContent = "Subject or Content is not filled.";
    return;
  }

  let postedBy;
  if (checkBox.checked == true) postedBy = "Anonymous";
  else postedBy = `Posted By: ${currentUser.val().name}`;

  const postContent = {
    author: currentUser.val().name,
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
}

post.addEventListener("click", postFunction);

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

      postContentCreate.innerHTML = postContentValue.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1">$1</a>'
      );
      postedByCreate.innerHTML = postedBy;

      let timeString = "";
      if (datePosted !== "") {
        const postTime = Math.floor((new Date() - datePosted) / 1000);

        if (postTime < 0 || postTime === NaN) {
          postTime = 1;
          timeString = postTime + " second ago";
        } else if (postTime < 60) {
          timeString = postTime + " seconds ago";
        } else if (postTime < 120) {
          timeString = Math.trunc(postTime / 60) + " minute ago";
        } else if (postTime < 3600) {
          timeString = Math.trunc(postTime / 60) + " minutes ago";
        } else if (postTime < 7200) {
          timeString = Math.trunc(postTime / 3600) + " hour ago";
        } else if (postTime < 86400) {
          timeString = Math.trunc(postTime / 3600) + " hours ago";
        } else if (postTime < 172800) {
          timeString = Math.trunc(postTime / 86400) + " day ago";
        } else if (postTime < 604800) {
          timeString = Math.trunc(postTime / 86400) + " days ago";
        } else if (postTime < 691200) {
          timeString = Math.trunc(postTime / 604800) + " week ago";
        } else {
          const postedDate = new Date(datePosted);
          const dateString = postedDate.toLocaleDateString();
          timeString = "Posted on " + dateString;
        }
      }
      postedDateCreate.textContent = timeString;

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

//collapsible navbar
const navIcon = document.querySelector(".hamburgur-icon");
const mobileNav = document.getElementById("nav-mobile");

navIcon.addEventListener("click", function () {
  mobileNav.classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
  document.querySelector(".overlay").style.zIndex = 1;
});

// functions for post and announcement in nav
const navPost = document.getElementById("nav-post");
const navAnnounce = document.getElementById("nav-announce");
const mobileNewsFeed = document.getElementById("nf");
const mobileMyPosts = document.querySelector(".mobile-my-posts");
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

mobileMyPosts.addEventListener("click", function () {
  asideContents.forEach((content) => {
    content.style.display = "none";
  });
  document.querySelector("#main").classList.remove("hidden");
  mobileNav.classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
});

async function userMessage() {
  const userUID = localStorage.getItem("userUID");
  const messageRefs = ref(database, `dos-message/${userUID}`);
  const messageParent = document.querySelector("#abt-user");
  try {
    const message = await get(messageRefs);

    if (message.val() !== null) {
      const { messageTitle, messageContent } = message.val();
      if (messageTitle && messageContent) {
        const messageDivCreate = document.createElement("div");
        messageDivCreate.id = "dos-message";
        const messageTitleCreate = document.createElement("h2");
        const messageContentCreate = document.createElement("p");

        messageTitleCreate.textContent = messageTitle;
        messageContentCreate.textContent = messageContent;

        messageDivCreate.appendChild(messageTitleCreate);
        messageDivCreate.appendChild(messageContentCreate);
        messageParent.appendChild(messageDivCreate);
      }
    }
  } catch (error) {
    console.error("Error retrieving message from database:", error);
  }
}

userMessage();

const feedback = document.querySelector("#feedback");
const fbError = document.querySelector("#feedback-error");

feedback.addEventListener("click", function () {
  fbError.textContent = "";
  if (userStatus === "Admin") {
    document.querySelector("#feedback-link").classList.remove("hidden");
  }

  document.querySelector(".feedback-container").classList.toggle("hidden");
  document.querySelector(".feedback-container").style.zIndex = 1001;
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".overlay").style.zIndex = 1000;
});

//FEEDBACKS
const submitFb = document.querySelector("#fb-submit");

function submitFeedbackFunction() {
  const fbTitle = document.querySelector("#fb-title");
  const fbContent = document.querySelector("#fb-content");

  if (fbTitle.value === "" || fbContent.value === "") {
    fbError.textContent = "Feedback Title or Content is not filled.";
    return;
  }

  const feedBack = {
    author: currentUser.val().name,
    title: fbTitle.value,
    content: fbContent.value,
    datePosted: Date.now(),
  };

  const feedbackRefs = ref(database, "feedbacks/" + Date.now());
  set(feedbackRefs, feedBack);
  alert(`Feedback sent! Thank you ${feedBack.author}!`);
  toggleModal();
  fbError.textContent = "";
}

submitFb.addEventListener("click", submitFeedbackFunction);

//Hot Keys
const announceInputForHotkey = document.querySelectorAll(".announce-input");
const postInputForHotkey = document.querySelectorAll(".post-input");
const feedbackInputForHotkey = document.querySelectorAll(".fb-input");

announceInputForHotkey.forEach((announceInput) =>
  announceInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      announceFunction();
    }
  })
);

postInputForHotkey.forEach((postInput) =>
  postInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      postFunction();
    }
  })
);

feedbackInputForHotkey.forEach((fbInput) =>
  fbInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      submitFeedbackFunction();
    }
  })
);

const surveyTest = document.querySelector(".survey-container");

surveyTest.addEventListener("click", function () {
  toggleModal();
});
