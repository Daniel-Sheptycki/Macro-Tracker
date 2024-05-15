// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
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

//returns array of all user meals
async function getAllMeals() {
  const snapshot = await getDocs(collection(db, "users", username, "meals"));
  let allMeals = [];

  for (const doc of snapshot.docs) {
    const mealData = doc.data();
    const mealId = doc.id;

    // Fetch ingredients subcollection for the current meal
    const ingredientsSnapshot = await getDocs(collection(db, "users", username, "meals", mealId, "ingredients"));
    const ingredients = [];
    ingredientsSnapshot.forEach(ingredientDoc => {
      ingredients.push(ingredientDoc.data());
    });
    Object.assign(mealData, {ingredients: ingredients});
    // Append the meal with its ingredients to allMeals array
    allMeals.push(mealData);
  }

  return allMeals;
}
//adds a meal to user database
async function addMeal(meal) {
    const docRef = doc(db, "users", username, "meals", meal.mealName);
    const docSnap = await getDoc(docRef);
  
    //If the meal doesent exist
    if (!docSnap.exists()) 
    {
      await setDoc(docRef, {
        calories: verifyValue(meal.calories),
        carbs: verifyValue(meal.carbs),
        fats: verifyValue(meal.fats),
        proteins: verifyValue(meal.proteins),
        mealName: meal.mealName,
        notes: meal.notes
      })
      console.log("meal added")
      meal.ingredients.forEach(ingredient => {
        addIngredientToMeal(ingredient, meal.mealName);
        console.log("ingredient added")
      });
    } 
    else 
    {
      alert("Meal already exists!")
    }
}
//remove meal by meal name
async function deleteMeal(mealName) {
  //Delete the ingredient from the meal first (for some reason, when you delete a document it lingers. and its sub-collections remain in tact. so when it is re-added, the collections remain the same when i would rather they be changed)
  const ingredientsSnapshot = await getDocs(collection(db, "users", username, "meals", mealName, "ingredients"));
  for (const ingredient of ingredientsSnapshot.docs) {
    const docRef = doc(db, "users", username, "meals", mealName, "ingredients", ingredient.id);
    await deleteDoc(docRef);
  }
  //Delete the meal
  const docRef = doc(db, "users", username, "meals", mealName);
  await deleteDoc(docRef);
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
    const mealRef = doc(db, "users", username, "meals", mealName, "ingredients", ingredient.ingredientName);
    await setDoc(mealRef, {
      calories: ingredient.calories,
      carbs: ingredient.carbs,
      fats: ingredient.fats,
      proteins: ingredient.proteins,
      ingredientName: ingredient.ingredientName,
      size: ingredient.size,
      unit: ingredient.unit
    })
}

  export { addMeal, username, verifyValue, getAllMeals, deleteMeal };