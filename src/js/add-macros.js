// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { collection, getDoc, getFirestore } from "firebase/firestore";

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

import { doc, setDoc, getDocs, addDoc } from "firebase/firestore"; 

let newMealMenu = false;
let macroObjects = document.getElementsByClassName("macros-input-item-input");
let newMealSelectOption = document.getElementById("choose-from-meals");

// Normal JS (so to speak)

document.getElementById("add-macros-button").addEventListener("click", () => {
    addMacrosButtonClicked();
})
document.getElementById("new-meal-button").addEventListener("click", () => {
    newMealButtonClicked();
})
document.getElementById("choose-from-meals").addEventListener("change", () => {
  updateMacrosInputField(newMealSelectOption.value)
});

refreshUserMealsList();

function newMealButtonClicked() {
  if (newMealMenu) {
    newMealMenu = false;
    document.getElementById("new-meal-content").style = "display: none";
    document.getElementById("new-meal-button").classList = "fa-solid fa-circle-plus";
  } else {
    newMealMenu = true;
    document.getElementById("new-meal-content").style = "display: flex";
    document.getElementById("new-meal-button").classList = "fa-solid fa-circle-minus";
  }
}
function addMacrosButtonClicked() {
  let macroValues = [];
  // Assign inputs to variables
  for (let i = 0; i < macroObjects.length; i++) {
    macroValues[i] = macroObjects[i].value
    if (macroValues[i] < 0) {
      macroValues[i] = 0;
    }
  }
  document.getElementById("add-macros-form").reset();
  addNewMacrosToDb(window.findCookie("username"), macroValues);
  addNewMacrosRecipt(window.findCookie("username"), macroValues);
  if (newMealMenu) {
    addNewMealToDb(window.findCookie("username"), macroValues);
  }
}
async function updateMacrosInputField(selectedMeal) {
    // Recieves the "name" of the meal doc (which makes this hella easy)
    const docRef = doc(db, "users", window.findCookie("username"), "meals", selectedMeal);
    const docSnap = await getDoc(docRef);
    document.getElementById("input-calories").value = docSnap.data().calories;
    document.getElementById("input-carbs").value = docSnap.data().carbs;
    document.getElementById("input-fats").value = docSnap.data().fats;
    document.getElementById("input-proteins").value = docSnap.data().proteins;
    document.getElementById("input-meal-name").value = docSnap.data().mealName;
    document.getElementById("input-meal-notes").value = docSnap.data().notes;
}
async function addNewMealToDb(username, selectedMeal) {
    const docRef = doc(db, "users", username, "meals", selectedMeal[4]);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
        alert("Meal Already Exists!");
    } else {
      await setDoc(docRef, {
          mealName: selectedMeal[4],
          calories: selectedMeal[0],
          carbs: selectedMeal[1],
          fats: selectedMeal[2],
          proteins: selectedMeal[3],
          notes: selectedMeal[5]
      })
      document.getElementById("meal-added-text").innerHTML = "Meal & Macros Added!"
      refreshUserMealsList();
    }
  }
async function addNewMacrosToDb(username, selectedMeal) {
    const docRef = doc(db, "users", username, "macro-inputs", String(window.getDate("day")));
    const docSnap = await getDoc(docRef);
    while (!docSnap.exists()) {
      await setDoc(doc(db, "users", username, "macro-inputs", window.getDate("day")), {
          calories: 0,
          carbs: 0,
          fats: 0,
          proteins: 0,
          date: window.getDate("day"),
      })
  }
    let newCals = Number(docSnap.data().calories) + Number(selectedMeal[0]);
    let newCarbs = Number(docSnap.data().carbs) + Number(selectedMeal[1]);
    let newFats = Number(docSnap.data().fats) + Number(selectedMeal[2]);
    let newProteins = Number(docSnap.data().proteins) + Number(selectedMeal[3]);
          await setDoc(docRef, {
              calories: newCals,
              carbs: newCarbs,
              fats: newFats,
              proteins: newProteins,
              date: window.getDate("day"),
          })
    document.getElementById("meal-added-text").innerHTML = "Macros Added!"
}
async function refreshUserMealsList() {
  const displayedMeals = document.getElementsByClassName("user-meal");
  for (let i = 0; 0 < displayedMeals.length; i++) {
    console.log(displayedMeals)
    console.log(displayedMeals[0])
    displayedMeals[0].remove();
  }
    const snapshot = await getDocs(collection(db, "users", window.findCookie("username"), "meals"));
    snapshot.docs.forEach((doc) => {
        newMealSelectOption.insertAdjacentHTML(
            "beforeend",
            `<option value="${doc.data().mealName}" class="user-meal">${doc.data().mealName}</option>`
          )
        })
}
async function addNewMacrosRecipt(username, selectedMeal) {
    if (selectedMeal[4] != null) {
    await addDoc(collection(db, "users", username, "macro-inputs", String(window.getDate("day")), "recipts"), {
        mealName: selectedMeal[4],
        calories: selectedMeal[0],
        carbs: selectedMeal[1],
        fats: selectedMeal[2],
        proteins: selectedMeal[3],
        time: window.getDate("minute")
    })
    }
}