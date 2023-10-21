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
  orderByChild,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

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
const storage = getStorage();

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
      if (
        user.uid === "rdZtMxgvm7bjFEVeCCKoJ41loth2" ||
        user.uid === "o1LjDmMZMAQViYOndIGgOOwwz6h1" ||
        user.uid === "PjhIFNUKXLa0ru3L5W1xoRebWin1"
      )
        userStatus = "Admin";

      get(databaseRef).then((client) => {
        name.textContent = client.val().name;
        localStorage.setItem("userName", client.val().name);

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

  if (localStorage.getItem("submitted") === "false") {
    this.document.querySelector(".survey-container").classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
});

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

  if (titleValue.value.trim() === "" || contentValue.value.trim() === "") {
    announceError.addEventListener("animationend", () => {
      announceError.classList.remove("error-animation");
    });
    announceError.textContent = "Title or Content is not filled.";
    announceError.classList.add("error-animation");
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

async function LoadAnnouncements() {
  await onValue(announcementsRef, (snapshot) => {
    announceContainer.innerHTML = "";
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

        contentCreate.innerHTML = contentValue.replace(
          /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(shorturl\.at\/[^\s]+)/g,
          function (match) {
            if (match.startsWith("http")) {
              return (
                '<a target = "_blank" href="' + match + '">' + match + "</a>"
              );
            } else {
              return (
                '<a target = "_blank" href="http://' +
                match +
                '">' +
                match +
                "</a>"
              );
            }
          }
        );

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
}

//Load Announcement
LoadAnnouncements();

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

let postRendered = 0;
let postToBeRendered = 10;
let myPost = 0;

const postRefs = ref(database, "posts/");
async function LoadPosts() {
  // Listen for changes in the database and update UI accordingly
  await onValue(postRefs, (snapshot) => {
    const allPosts = document.querySelector(".dos-landing-page");
    const newsFeedTitle = allPosts.firstElementChild; // get the first child element (h2)
    const loadButton = document.querySelector(".load-more");
    const loading = document.querySelector(".loading");

    if (loadButton) loadButton.classList.remove("hidden");

    if (localStorage.getItem("IsMyPosts") === "true") {
      postToBeRendered = null;
      newsFeedTitle.textContent = "My Posts";
    } else newsFeedTitle.textContent = "Newsfeed";

    // allPosts.innerHTML = ""; // remove all other child elements
    document.querySelectorAll(".post").forEach((e) => e.remove());
    // allPosts.appendChild(newsFeedTitle); // append the h2 element back to the .dos-landing-page element

    let postArray = [];
    snapshot.forEach((childSnapshot) => {
      postArray.push(childSnapshot.key);
    });
    postArray.reverse().forEach((key) => {
      const realPostRef = ref(database, `posts/${key}`);
      onValue(realPostRef, (realSnapshot) => {
        const post = realSnapshot.val();

        if (localStorage.getItem("IsMyPosts") === "true") {
          if (post.author !== localStorage.getItem("userName")) {
            return;
          } else {
            myPost++;
          }
        }

        if (postRendered === postToBeRendered) {
          return;
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

        postContentCreate.innerHTML = postContentValue.replace(
          /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(shorturl\.at\/[^\s]+)/g,
          function (match) {
            if (match.startsWith("http")) {
              return (
                '<a target = "_blank" href="' + match + '">' + match + "</a>"
              );
            } else {
              return (
                '<a target = "_blank" href="http://' +
                match +
                '">' +
                match +
                "</a>"
              );
            }
          }
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
        postRendered++;

        if (loading) loading.remove();

        if (postRendered === postArray.length) {
          loadButton.classList.add("hidden");
        } else if (
          loadButton.classList.contains("hidden") &&
          postRendered !== postArray.length
        ) {
          loadButton.classList.remove("hidden");
        }

        if (
          postRendered === myPost &&
          localStorage.getItem("IsMyPosts") === "true"
        ) {
          loadButton.classList.add("hidden");
        }

        allPosts.insertBefore(postDivCreate, loadButton);

        postDivCreate.appendChild(postSubjectCreate);
        postDivCreate.appendChild(postContentCreate);
        postDivCreate.appendChild(postedByCreate);
        postDivCreate.appendChild(postedDateCreate);
      });
    });
  });
}

document.querySelector(".load-more").addEventListener("click", () => {
  postRendered = 0;
  postToBeRendered += 10;
  LoadPosts();
});

document.querySelectorAll(".my-posts").forEach(function (myPost) {
  myPost.addEventListener("click", function () {
    postRendered = 0;
    postToBeRendered = null;
    myPost = 0;
    localStorage.setItem("IsMyPosts", "true");
    LoadPosts();
  });
});

document.querySelectorAll(".home").forEach(function (home) {
  home.addEventListener("click", function () {
    postRendered = 0;
    postToBeRendered = 10;
    localStorage.setItem("IsMyPosts", "false");
    LoadPosts();
  });
});

//Loads the posts when u enter the dashboard
LoadPosts();

//appending posts
const post = document.querySelector("#post-btn");
const checkBox = document.querySelector("#anonymous");

function postFunction() {
  if (subject.value.trim() === "" || content.value.trim() === "") {
    errorMessage.addEventListener("animationend", () => {
      errorMessage.classList.remove("error-animation");
    });
    errorMessage.textContent = "Subject or Content is not filled.";
    errorMessage.classList.add("error-animation");
    return;
  }

  // const fileInput = document.getElementById("post-img");
  // const file = fileInput.files[0];
  // const storageRef = ref(storage).child(`images/${file.name}`);
  // const uploadTask = storageRef.put(file);

  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     // handle progress
  //   },
  //   (error) => {
  //     // handle error
  //   },
  //   async () => {
  //     const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
  //     console.log(downloadURL);
  //   }
  // );

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
  location.reload();
}

post.addEventListener("click", postFunction);

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
        messageContentCreate.innerHTML = messageContent.replace(
          /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(shorturl\.at\/[^\s]+)/g,
          function (match) {
            if (match.startsWith("http")) {
              return (
                '<a target = "_blank" href="' + match + '">' + match + "</a>"
              );
            } else {
              return (
                '<a target = "_blank" href="http://' +
                match +
                '">' +
                match +
                "</a>"
              );
            }
          }
        );

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
    document.querySelector("#message-link").classList.remove("hidden");
    document.querySelector("#change-name-link").classList.remove("hidden");
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
    fbError.addEventListener("animationend", () => {
      fbError.classList.remove("error-animation");
    });
    fbError.textContent = "Feedback Title or Content is not filled.";
    fbError.classList.add("error-animation");
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

const submitButton = document.querySelector("#sv-submit");
const svErr = document.querySelector("#sv-error");

submitButton.addEventListener("click", () => {
  try {
    const answer1 = document.querySelector('input[name="no:1"]:checked').value;
    const answer2 = document.querySelector('input[name="no:2"]:checked').value;
    const answer3 = document.querySelector('input[name="no:3"]:checked').value;
    const answer4 = document.querySelector('input[name="no:4"]:checked').value;
    const answer5 = document.querySelector('input[name="no:5"]:checked').value;
    let submittedBy = `Submited By: ${currentUser.val().name}`;

    if (
      answer1 === "" ||
      answer2 === "" ||
      answer3 === "" ||
      answer4 === "" ||
      answer5 === ""
    ) {
      svErr.textContent = "Feedback Title or Content is not filled.";
      return;
    }

    const surveyAns = {
      author: currentUser.val().name,
      title: "Survey",
      content: `1. ${answer1}
      2. ${answer2}
      3. ${answer3}
      4. ${answer4}
      5. ${answer5}`,
      datePosted: Date.now(),
    };

    const feedbackRefs = ref(database, "feedbacks/" + Date.now());
    set(feedbackRefs, surveyAns);
    alert(`Thank you for helping us make Dos better ${surveyAns.author}!`);

    toggleModal();
    localStorage.setItem("submitted", true);
  } catch (error) {
    svErr.textContent = "Please answer all questions before submitting.";
  }
});

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
