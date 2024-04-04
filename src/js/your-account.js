// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getDoc, getFirestore, doc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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

// Initialize Cloud Firestoreand get a reference to the service
const db = getFirestore(app);

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