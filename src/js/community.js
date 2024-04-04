// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";

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


// getPublicMeals();
getPublicMeals();
async function getPublicMeals() {
  let i = 0;
  // (foreach user, foreach public meal)
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    usersSnapshot.docs.forEach((user) => {
      // For Each User
      addMeal();
      async function addMeal() {
      try {
      const collectionRef = collection(db, "users", user.data().username, "public-meals");
      const collectionSnapshot = await getDocs(collectionRef);
        collectionSnapshot.docs.forEach((meal) => {
          // For Each Public meal
            addPublicMeal(meal.data(), i);
            i++;
        })
      }
      catch {
        console.log(`User-${user.data().username} Did not have any public meals`)
      }
    }
    })
}
async function addPublicMeal(data, iterater) {
    document.getElementById("meal-slot").insertAdjacentHTML("beforeend",  `          
    <article id="public-meal-${iterater}" class="public-meal">
    <header>
      <h3 id="meal-name-${iterater}" class="meal-name">${data.mealName}</h3>
      <div class="header-subtext">
        <p id="meal-author-${iterater}" class="meal-author">${data.author}</p>
        <p id="meal-desc-${iterater}" class="meal-desc">${data.mealNotes}</p>
      </div>
    </header>
    <div id="meal-macros-${iterater}" class="meal-macros">
      <p id="meal-calories-${iterater}">Calories: ${data.calories}</p>
      <p id="meal-carbs-${iterater}">Carbohydrates: ${data.carbs}</p>
      <p id="meal-fats-${iterater}">Fats: ${data.fats}</p>
      <p id="meal-proteins-${iterater}">Proteins: ${data.proteins}</p>
    </div>
    <footer id="meal-footer-${iterater}" class="meal-footer">
      <button id="add-to-my-meals-button-${iterater}">Add To My Meals</button>
    </footer>
  </article>`
  )
  // Add an event listener for the "add to my meals" button
  document.getElementById(`add-to-my-meals-button-${iterater}`).addEventListener("click", (element) => {
      let extractedElement = Number(element.target.id.substring(23 , element.target.id.length));
      let author = document.getElementById(`meal-author-${extractedElement}`).innerHTML;
      let meal = document.getElementById(`meal-name-${extractedElement}`).innerHTML;
      console.log(meal);
      console.log(author);
      uploadMeal(meal, author);
  })
}
async function uploadMeal(meal, author) {
  let username = (window.findCookie("username"));
  const docRef = doc(db, "users", username, "meals", meal);
  const retrieveMealSnap =  await getDoc(doc(db, "users", author, "public-meals", meal));
  console.log(retrieveMealSnap);
    await setDoc(docRef, {
      calories: retrieveMealSnap.data().calories,
      carbs: retrieveMealSnap.data().carbs,
      fats: retrieveMealSnap.data().fats,
      proteins: retrieveMealSnap.data().proteins,
      mealName: retrieveMealSnap.data().mealName,
      notes: retrieveMealSnap.data().mealNotes,
  })
}