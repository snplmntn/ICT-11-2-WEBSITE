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

//Send Message
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
    return;
  }

  if (inputTitle === "") {
    errorMessage.textContent = "TItle not filled";
    return;
  }

  if (inputContent === "") {
    errorMessage.textContent = "Content not filled";
    return;
  }

  //Sends the message
  if (inputUID && inputTitle && inputContent) {
    //Database Reference
    const postMessageRefs = ref(database, `dos-message/${inputUID}`);

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
    errorMessage.textContent = "UID not Found";
  }
});

//Delete Message
const deleteMessage = document.querySelector("#delete-button");
const correctMessageD = document.querySelector("#d-message-correct");
const errorMessageD = document.querySelector("#d-message-error");

deleteMessage.addEventListener("click", function () {
  //Inputs
  const inputUID = document.querySelector("#d-input-uid").value;
  const inputTitle = document.querySelector("#d-input-title");
  const inputContent = document.querySelector("#d-input-content");

  //Resets Message
  correctMessageD.textContent = "";
  errorMessageD.textContent = "";

  //Checks if all field are filled
  if (inputUID === "") {
    errorMessageD.textContent = "UID not filled";
    return;
  }

  //Sends the message
  if (inputUID) {
    //Database Reference
    const postMessageRefs = ref(database, `dos-message/${inputUID}`);

    //Message
    get(postMessageRefs)
      .then((message) => {
        if (message.exists()) {
          if (message.val() !== null) {
            const { messageTitle, messageContent } = message.val();
            if (messageTitle && messageContent) {
              inputTitle.textContent = `Title: ${messageTitle}`;
              inputContent.textContent = `Content: ${messageContent}`;

              set(postMessageRefs, null)
                .then(() => {
                  correctMessageD.textContent = "Data removed successfully.";
                })
                .catch((error) => {
                  (errorMessageD.textContent = "Error removing data:"), error;
                });
            }
          } else {
            errorMessageD.textContent = "Message Not Found";
            return;
          }
        } else {
          errorMessageD.textContent = "Message Not Found";
        }
      })
      .catch((error) => {
        errorMessageD.textContent = error.message;
        return;
      });
  } else {
    // An error occured
    errorMessageD.textContent = "UID not Found";
  }
});

const toDeleteButton = document.querySelector(".delete-message-button");
const toSendButton = document.querySelector(".send-message-button");

function toggleMessage() {
  const deleteMessage = document
    .querySelector(".container-login")
    .classList.toggle("hidden");
  const sendMessage = document
    .querySelector(".container-signup")
    .classList.toggle("hidden");
}

toDeleteButton.addEventListener("click", toggleMessage);
toSendButton.addEventListener("click", toggleMessage);
