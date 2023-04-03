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
  remove,
  query,
  orderByChild,
  equalTo,
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

const correctMessage = document.querySelector("#change-name-correct");
const errorMessage = document.querySelector("#change-name-error");

function getCurrentUserData() {
  // Check if the user is authenticated
  if (!auth.currentUser) {
    errorMessage.textContent = "Please log in first.";
    return;
  }
}

function getPostByAuthor(author, newName) {
  const postRefs = ref(database, "posts/");
  get(postRefs)
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        if (post.author === author) {
          let postedByName = "Anonymous";
          if (post.postedBy !== "Anonymous") {
            postedByName = `Posted By: ${newName}`;
          }

          const updatedPost = {
            author: newName,
            postedBy: postedByName,
          };

          update(childSnapshot.ref, updatedPost);
        }

        correctMessage.textContent = `Name changed from ${author} to ${newName}`;
        window.location.href = "main.html";
      });
    })
    .catch((error) => {
      errorMessage.textContent = "Error GG";
    });
}

// Change name
const changeNameButton = document.querySelector("#change-name-button");

changeNameButton.addEventListener("click", function () {
  // Inputs
  const currentName = document.querySelector("#input-c-name").value;
  const newName = document.querySelector("#input-n-name").value;

  // Resets message
  correctMessage.textContent = "";
  errorMessage.textContent = "";

  // Checks if all fields are filled
  if (currentName === "" || newName === "") {
    errorMessage.textContent = "Please fill up all the needed information.";
    return;
  }

  if (currentName === newName) {
    errorMessage.textContent =
      "Why are you trying to change but still using the same name?";
    return;
  }

  getCurrentUserData();
  // Database reference
  const currentUserID = auth.currentUser.uid;
  const userRef = ref(database, `users/${currentUserID}`);

  get(userRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        errorMessage.textContent = "User not found.";
        return;
      }

      const userData = snapshot.val();

      if (userData.name !== currentName) {
        errorMessage.textContent = "Error: Current Name may not be correct.";
        return;
      }

      if (userData.name === currentName) {
        userData.name = newName;
        update(userRef, userData);

        // Change post author
        getPostByAuthor(currentName, newName);
      }

      // Do something with the user data
    })
    .catch((error) => {
      errorMessage.textContent = `Error getting user: ${error.message}`;
    });
});
