// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
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
    allMeals.push(doc.data());
  }
  return allMeals;
}
//Returns object of categorized arrays
async function getCategorizedMeals() {
  const snapshot = await getDocs(collection(db, "users", username, "meals"));
  const allMeals = snapshot.docs;

  const groups = {}
  let subIterator = 0;
  //Assign all meals to their group
  allMeals.forEach(meal => {
    meal = meal.data();
    //Set the meals position
    meal.position = subIterator++;
    //If it doesent have a group
    if (meal.group == undefined) {
      if (groups.Undefined == undefined) {
        groups.Undefined = [];
      }
      groups.Undefined.push(meal);
    }
    //If its group hasnt been created yet
    else if (groups[meal.group] == undefined) {
      Object.assign(groups, {[meal.group]: [meal]});
    }
    //If its group has
    else {
      groups[meal.group].push(meal);
    }
  });
  return groups;
}
//adds a meal to user database
async function addMeal(meal) {
    const docRef = doc(db, "users", username, "meals", meal.mealName);
    await setDoc(docRef, meal);
}
//remove meal by meal name
async function deleteMeal(mealName) {
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

  export { addMeal, username, verifyValue, getAllMeals, getCategorizedMeals, deleteMeal};