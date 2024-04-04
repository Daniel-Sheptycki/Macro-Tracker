// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getDoc, doc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAD5cymjy1bLiXeb1KHG2txjtR4KpTn0p0",

  authDomain: "macro-tracker-615bd.firebaseapp.com",

  projectId: "macro-tracker-615bd",

  storageBucket: "macro-tracker-615bd.appspot.com",

  messagingSenderId: "392337084618",

  appId: "1:392337084618:web:71cebe7aae4f2940792433",

  measurementId: "G-7M925H7FL6"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function SwitchInterface(field) {
    document.getElementById(field).style = "display: flex";
    if (field == "sign-in-field") {
        document.getElementById("create-account-field").style = "display: none";
    } else if (field == "create-account-field") {
        document.getElementById("sign-in-field").style = "display: none";
    }
}
document.getElementById("create-account-switch-button").addEventListener("click", () => {
    SwitchInterface('create-account-field');
})
document.getElementById("sign-in-switch-button").addEventListener("click", () => {
    SwitchInterface('sign-in-field');
})

// For the sign in button
let signInButton = document.getElementById("sign-in-button");
signInButton.addEventListener("click", () => {
  let username = document.getElementById("sign-in-user-name").value;
  let password = document.getElementById("sign-in-user-password").value;
  signIn(username, password);
})
async function signIn(username, password) {

  const docRef = doc(db, "users", username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const profileInfo = docSnap.data();
    if (profileInfo.password == password) {
      document.cookie = `signedin=true; path=/`
      document.cookie = `username=${username}; path=/`;
      window.location.assign("../index.html")
    }
  } else {
    alert("Invalid Credientials, Did you mean to make an account?")
  }
}

// For the create account button
let createAccountButton = document.getElementById("create-account-button");

createAccountButton.addEventListener("click", () => {
  let username = document.getElementById("create-account-user-name").value;
  let password = document.getElementById("create-account-user-password").value;
  newDoc(username, password);
})

async function newDoc(username, password) {
  // Add a new document in collection

  const docRef = doc(db, "users", username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    alert("account already exists");
  } else {
    await setDoc(doc(db, "users", username), {
      username: username,
      password: password,
      });
    await setDoc(doc(db, "users", username, "macro-inputs", window.getDate("day")), {
        calories: 0,
        carbs: 0,
        fats: 0,
        proteins: 0,
        date: window.getDate("day"),
    })
    signIn(username, password);
  }
}
