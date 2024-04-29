// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let username = window.findCookie("username");

async function addMeal(meal) {
    const docRef = doc(db, "users", username, "meals", meal.name);
    const docSnap = await getDoc(docRef);
  
    //If the meal doesent exist
    if (!docSnap.exists()) 
    {
      await setDoc(docRef, {
        calories: verifyValue(meal.calories),
        carbs: verifyValue(meal.carbs),
        fats: verifyValue(meal.fats),
        proteins: verifyValue(meal.proteins),
        mealName: meal.name,
        notes: meal.notes
      })
      meal.ingredients.forEach(ingredient => {
        addIngredientToMeal(ingredient, meal.name);
      });
    } 
    else 
    {
      alert("Meal already exists!")
    }
  }
function verifyValue(value) {
    if (value == "" || !value) {
        return 0;
    } else {
        return value;
    }
}
//CHANGED IT TO "INGREDIENT NAME", MAKE ADJUSTEMNTS
async function addIngredientToMeal(ingredient, mealName) {
    const mealRef = doc(db, "users", username, "meals", mealName, "ingredients", ingredient.name);
    await setDoc(mealRef, {
      calories: ingredient.calories,
      carbs: ingredient.carbs,
      fats: ingredient.fats,
      proteins: ingredient.proteins,
      ingredientName: ingredient.name,
      size: ingredient.size,
      unit: ingredient.unit
    })
}

  export { addMeal, username, verifyValue };