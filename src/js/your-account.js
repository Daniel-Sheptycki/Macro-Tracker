// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getDoc, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBBfSN1Zx7tglGAw-XigBKzoUGU8UcjurE",

  authDomain: "testmacrotracker.firebaseapp.com",

  projectId: "testmacrotracker",

  storageBucket: "testmacrotracker.appspot.com",

  messagingSenderId: "232132413454",

  appId: "1:232132413454:web:e44c3d929f88221803d45f",

  measurementId: "G-Q26S7EFCLW"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestoreand get a reference to the service
const db = getFirestore(app);

import { doc } from "firebase/firestore"; 

retrieveDocInfo();

// YOUR ACCOUNT PAGE
let updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", () => {
  retrieveDocInfo();
})
async function retrieveDocInfo() {
  let username = window.findCookie("username");
  const docRef = doc(db, "users", username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    displayDocInfo(docSnap.data().username, "username");
    displayDocInfo(docSnap.data().password, "password" );
  }
}
function displayDocInfo(data, field) {
    document.getElementById(`${String(field)}-field`).innerHTML = `${String(field)}: ` + String(data)
}
document.getElementById("sign-out-button").addEventListener("click", () => {
  //Clear Username and sign in cookies
  document.cookie = `signedin=; path=/`
  document.cookie = `username=; path=/`;
  window.location.assign("../index.html")
})