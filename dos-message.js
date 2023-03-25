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

const sendMessage = document.querySelector("#send-button");
const correctMessage = document.querySelector("#message-correct");
const errorMessage = document.querySelector("#message-error");

sendMessage.addEventListener("click", function () {
  //Inputs
  const inputUID = document.querySelector("#input-uid").value;
  const inputTitle = document.querySelector("#input-title").value;
  const inputContent = document.querySelector("#input-content").value;

  //Checks if all field are filled
  if (inputUID === "") {
    errorMessage.textContent = "UID not filled";
    console.log("uid");
    return;
  }

  if (inputTitle === "") {
    errorMessage.textContent = "TItle not filled";
    console.log("TItle");
    return;
  }

  if (inputContent === "") {
    errorMessage.textContent = "Content not filled";
    console.log("Content");
    return;
  }

  //Sends the message
  if (inputUID && inputTitle && inputContent) {
    //Database Reference
    const postMessageRefs = ref(database, `dos-message/"${inputUID}`);

    //Message
    const message = {
      messageTitle: inputTitle,
      messageContent: inputContent,
    };

    //Pushing the message to the database
    set(postMessageRefs, message);
    correctMessage.textContent = "Message sent.";
  } else {
    // An error occured
    errorMessage.textContent = "Error Messaging";
  }
});
