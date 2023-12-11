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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


