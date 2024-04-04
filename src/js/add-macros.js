import { initializeApp } from "../node_modules/firebase/app/dist/app/index";

import { collection, getDoc, getDocs, getFirestore, setDoc, doc, addDoc } from "../node_modules/firebase/firestore/dist/firestore/index";

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
  let macroValues = [];
  // Assign inputs to variables
  for (let i = 0; i < macroObjects.length; i++) {
    macroValues[i] = macroObjects[i].value
    if (macroValues[i] < 0) {
      macroValues[i] = 0;
    }
  }
  addNewMacrosToDb(window.findCookie("username"), macroValues);
  addNewMacrosRecipt(window.findCookie("username"), macroValues);
  if (newMealMenu) {
    let servingSize = [document.getElementById("serving-size-input").value,     
    document.querySelector('input[name="serving-size"]:checked').value]
    addNewMealToDb(window.findCookie("username"), macroValues, servingSize);
  }
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