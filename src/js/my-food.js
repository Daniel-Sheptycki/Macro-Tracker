// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { deleteDoc, getFirestore } from "firebase/firestore";

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

import { doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore"; 

let macroObjects = document.getElementsByClassName("macros-input-item-input");
let newMealSelectOption = document.getElementById("choose-from-meals");
refreshUserMealsList();

document.getElementById("add-meal-button").addEventListener("click", () => {
    addMacrosButtonClicked();
})
document.getElementById("choose-from-meals").addEventListener("change", () => {
    updateMacrosInputField(newMealSelectOption.value);
  });
document.getElementById("delete-meal-button").addEventListener("click", () => {
    deleteMealButtonClicked();
})
function addMacrosButtonClicked() {
    let macroValues = [];
    // Assign inputs to variables
    for (let i = 0; i < macroObjects.length; i++) {
      macroValues[i] = macroObjects[i].value
      if (macroValues[i] < 0) {
        macroValues[i] = 0;
      }
    }
    document.getElementById("input-macros-form").reset();
      addNewMealToDb(window.findCookie("username"), macroValues);
  }
function deleteMealButtonClicked() {
    let macroValues = [];
    // Assign inputs to variables
    for (let i = 0; i < macroObjects.length; i++) {
      macroValues[i] = macroObjects[i].value
      if (macroValues[i] < 0) {
        macroValues[i] = 0;
      }
    }
    document.getElementById("input-macros-form").reset();
      deleteMealFromDb(window.findCookie("username"), macroValues);
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
      document.getElementById("meal-added-text").innerHTML = "Meal Added!"
      refreshUserMealsList();
    }
  }
async function deleteMealFromDb(username, selectedMeal) {
    const docRef = doc(db, "users", username, "meals", selectedMeal[4]);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        await deleteDoc(docRef);
        document.getElementById("meal-added-text").innerHTML = "Meal Deleted!"
        document.getElementById("meal-added-text").style = "color: red;"
        refreshUserMealsList();
    } else {
        alert("Meal Dosent Exist");
      }
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
