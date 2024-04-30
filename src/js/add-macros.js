import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { collection, getDoc, getFirestore, doc, setDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { addMeal, username, verifyValue } from "./firebase.js";
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

// Normal JS (so to speak)

document.getElementById("add-macros-button").addEventListener("click", () => {
    addMacrosButtonClicked();
})
document.getElementById("new-meal-button").addEventListener("click", () => {
    newMealButtonClicked();
})
document.getElementById("choose-from-meals").addEventListener("change", () => {
  updateMacrosInputField(newMealSelectOption.value, "simple")
  if (!servingSizeActive) {
    addServingSizeField();
    servingSizeActive = true;
    mealSelected = true;
  }
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
    name: document.getElementById("input-meal-name").value,
    notes: document.getElementById("input-meal-notes").value,
  }
  Object.assign(inputs, {ingredients: [{    
    name: "Meal",
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
async function updateMacrosInputField(selectedMeal, type) {
    // Recieves the "name" of the meal doc (which makes this hella easy)
    const docRef = doc(db, "users", window.findCookie("username"), "meals", selectedMeal);
    const docSnap = await getDoc(docRef);
    let multiplier = 1;
    if (type == "servingSizeUpdate") {
      //Change the multiplier by the difference of the previous serving size and the new one
      //Find new serving size
      multiplier = Number(document.getElementById("serving-size-input").value) / Number(docSnap.data().servingAmount);
      
    }
    else {
      document.getElementById("serving-size-input").value = docSnap.data().servingAmount;
    }
    document.getElementById("input-calories").value = docSnap.data().calories * multiplier;
    document.getElementById("input-carbs").value = docSnap.data().carbs * multiplier;
    document.getElementById("input-fats").value = docSnap.data().fats * multiplier;
    document.getElementById("input-proteins").value = docSnap.data().proteins * multiplier;
    document.getElementById("input-meal-name").value = docSnap.data().mealName;
    document.getElementById("input-meal-notes").value = docSnap.data().notes;
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
async function addNewMacrosRecipt(info) {
    if (info.name != null) {
    await addDoc(collection(db, "users", username, "macro-inputs", String(window.getDate("day")), "recipts"), {
        mealName: info.name,
        calories: info.calories,
        carbs: info.carbs,
        fats: info.fats,
        proteins: info.proteins,
        time: window.getDate("minute")
    })
    }
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