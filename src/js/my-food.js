// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { deleteDoc, getFirestore } from "firebase/firestore";

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

    let servingSize = [document.getElementById("serving-size-input").value,     
    document.querySelector('input[name="serving-size"]:checked').value]
    addNewMealToDb(window.findCookie("username"), macroValues, servingSize);
      // If Public
      if (document.getElementById("make-meal-public-checkbox").checked) {
      addPublicMeal(macroValues);
      }
      document.getElementById("input-macros-form").reset();
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
    document.getElementById("serving-size-input").value = docSnap.data().servingAmount;
}
async function addNewMealToDb(username, selectedMeal, servingSize) {
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
          notes: selectedMeal[5],
          servingAmount: servingSize[0],
          servingUnit: servingSize[1]
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
async function addPublicMeal(mealInfo) {
  const docSnap = await getDoc(doc(db, "users", window.findCookie("username"), "public-meals", mealInfo[4]));
  if (docSnap.exists()) {
    alert("Meal Is Already Public");
  } else {
    await setDoc(doc(db, "users", window.findCookie("username"), "public-meals", mealInfo[4]), {
      mealName: mealInfo[4],
      mealNotes: mealInfo[5],
      calories: mealInfo[0],
      carbs: mealInfo[1],
      fats: mealInfo[2],
      proteins: mealInfo[3],
      author: window.findCookie("username"),
    }
      )
  }
}
