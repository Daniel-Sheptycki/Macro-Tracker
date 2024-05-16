import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { collection, getDoc, getFirestore, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { addMeal, getCategorizedMeals, username, verifyValue, getAllMeals } from "./firebase.js";
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

const db = getFirestore(app);


let newMealMenu = false;
let servingSizeActive = false;
let mealSelected = false;
let newMealSelectOption = document.getElementById("choose-from-meals");

let allMeals;
let categorizedMeals;

getAllMeals()
  //When all meals are retrieved
  .then(returnedMeals => {
    allMeals = returnedMeals;
  })
  .catch(error => {
    console.error("Error fetching meals:", error);
  });
getCategorizedMeals()
  .then(returnedMeals => {
    categorizedMeals = returnedMeals;
    refreshUserMealsList();
  })  
  .catch(error => {
    console.error("Error fetching meals:", error);
  });

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
    if (servingSizeActive && !mealSelected) {
      removeServingSizeField();
    servingSizeActive = false;
    }
  } else {
    newMealMenu = true;
    document.getElementById("new-meal-content").style = "display: flex";
    document.getElementById("new-meal-button").classList = "fa-solid fa-circle-minus";
    if (!servingSizeActive) {
      addServingSizeField();
    servingSizeActive = true;
    }
  }
}
function addMacrosButtonClicked() {
  // Get Inputs
  const inputs = {
    calories: verifyValue(document.getElementById("input-calories").value),
    carbs: verifyValue(document.getElementById("input-carbs").value),
    fats: verifyValue(document.getElementById("input-fats").value),
    proteins: verifyValue(document.getElementById("input-proteins").value),
    mealName: document.getElementById("input-meal-name").value,
    notes: document.getElementById("input-meal-notes").value,
  }
  Object.assign(inputs, {ingredients: [{    
    ingredientName: "Meal",
    calories: verifyValue(inputs.calories),
    carbs: verifyValue(inputs.carbs),
    fats: verifyValue(inputs.fats),
    proteins: verifyValue(inputs.proteins),
    size: 1,
    unit: "amount-of-item",}]
  });
  addNewMacrosToDb(inputs);
  addNewMacrosRecipt(inputs);
  if (newMealMenu) addMeal(inputs);
  document.getElementById("add-macros-form").reset();
}
async function updateMacrosInputField(id) {
    const meal = allMeals[id];
    document.getElementById("input-calories").value = meal.calories;
    document.getElementById("input-carbs").value = meal.carbs;
    document.getElementById("input-fats").value = meal.fats;
    document.getElementById("input-proteins").value = meal.proteins;
    document.getElementById("input-meal-name").value = meal.mealName;
    document.getElementById("input-meal-notes").value = meal.notes;
}
async function addNewMacrosToDb(info) {
    const docRef = doc(db, "users", username, "macro-inputs", String(window.getDate("day")));
    const docSnap = await getDoc(docRef);
    //If they havent inputted any macros today set today's values to what they just inputted
    if (!docSnap.exists()) {
      await setDoc(doc(db, "users", username, "macro-inputs", window.getDate("day")), {
          calories: Number(info.calories),
          carbs: Number(info.carbs),
          fats: Number(info.fats),
          proteins: Number(info.proteins),
          date: window.getDate("day"),
      })
    }
    //Otherwise add today's macros with what they inputted, and set that to the new value. 
    else 
    {
      await setDoc(docRef, {
        calories: Number(docSnap.data().calories) + Number(info.calories),
        carbs: Number(docSnap.data().carbs) + Number(info.carbs),
        fats: Number(docSnap.data().fats) + Number(info.fats),
        proteins: Number(docSnap.data().proteins) + Number(info.proteins),
        date: window.getDate("day"),
    })
    }
    document.getElementById("meal-added-text").innerHTML = "Macros Added!"
}
async function refreshUserMealsList() {
  const displayedMeals = [...document.querySelectorAll("#edit-and-view-meal option:not(:first-of-type)")];
    displayedMeals.forEach(element => {
      element.remove();
    });
    let htmlString = "<option value='undefined'>Select A Meal</option>";
    //For each meal group
    for (const object in categorizedMeals) {
      const group = categorizedMeals[object];

      //Add the OptGroup
      htmlString += `<optgroup label="${object}">`;

      //Add the options
      group.forEach(meal => {
        htmlString += `<option value="${meal.position}">${meal.mealName}</option>`
      });
      htmlString += "</optgroup>";
    }
    newMealSelectOption.innerHTML = htmlString;
}
async function addNewMacrosRecipt(info) {
    if (!info.name) {
      info.name == "Undefined";
    }
    await addDoc(collection(db, "users", username, "macro-inputs", String(window.getDate("day")), "recipts"), {
        mealName: info.mealName,
        calories: info.calories,
        carbs: info.carbs,
        fats: info.fats,
        proteins: info.proteins,
        time: window.getDate("minute")
    })
}
function addServingSizeField() {
  document.getElementById("macros-input-field").insertAdjacentHTML("beforeend", `          
  <div class="macros-input-item" id="serving-size">
  <label>Serving Size</label>
  <input type="number" id="serving-size-input" placeholder="Serving Size" required />
  <div id="measurment-input-field">
    <div id="grams-radio-field">
      <label for="grams">Grams (g)</label>
      <input type="radio" id="grams" name="serving-size" value="g" checked/>
    </div>
    <div id="ml-radio-field">
      <label for="ml">Mililiteres (Ml)</label>
      <input type="radio" id="ml" name="serving-size" value="Ml"/>
    </div>
    <div id="item-radio-field">
      <label for="ml">Amount of Item</label>
      <input type="radio" id="item" name="serving-size" value="" />
    </div>
  </div>
</div>`)
document.getElementById("serving-size-input").addEventListener("change", () => {
  updateMacrosInputField(newMealSelectOption.value, "servingSizeUpdate");
})
}
function removeServingSizeField() {
  document.getElementById("serving-size").remove();
}