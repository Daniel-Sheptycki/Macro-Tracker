// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getFirestore, doc, getDocs, collection, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

import { addMeal } from "./firebase.js";

const firebaseConfig = {

  apiKey: "AIzaSyAD5cymjy1bLiXeb1KHG2txjtR4KpTn0p0",

  authDomain: "macro-tracker-615bd.firebaseapp.com",

  projectId: "macro-tracker-615bd",

  storageBucket: "macro-tracker-615bd.appspot.com",

  messagingSenderId: "392337084618",

  appId: "1:392337084618:web:71cebe7aae4f2940792433",

  measurementId: "G-7M925H7FL6"

};

const commonIngredients = [
  {
      name: "Apple",
      calories: 95,
      carbs: 25,
      fats: 0.3,
      proteins: 0.5,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Banana",
      calories: 105,
      carbs: 27,
      fats: 0.4,
      proteins: 1.3,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Broccoli",
      calories: 55,
      carbs: 11,
      fats: 0.6,
      proteins: 4.2,
      servingSize: 91, // 1 cup chopped broccoli is approximately 91 grams
      servingUnit: "g"
  },
  {
      name: "Whole Wheat Bread",
      calories: 69,
      carbs: 12,
      fats: 0.9,
      proteins: 3.6,
      servingSize: 32, // Average weight of one slice of whole wheat bread in grams
      servingUnit: "g"
  },
  {
      name: "Egg",
      calories: 72,
      carbs: 0.4,
      fats: 4.8,
      proteins: 6.3,
      servingSize: 50, // Average weight of one large egg in grams
      servingUnit: "g"
  },
  {
      name: "Chicken Breast",
      calories: 165,
      carbs: 0,
      fats: 3.6,
      proteins: 31,
      servingSize: 3.5,
      servingUnit: "oz"
  },
  {
      name: "Spinach",
      calories: 7,
      carbs: 1,
      fats: 0.1,
      proteins: 0.9,
      servingSize: 1,
      servingUnit: "oz"
  },
  {
      name: "Tomato",
      calories: 22,
      carbs: 5,
      fats: 0.2,
      proteins: 1,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Rice (White)",
      calories: 205,
      carbs: 45,
      fats: 0.4,
      proteins: 4.3,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Potato",
      calories: 161,
      carbs: 37,
      fats: 0.2,
      proteins: 4.3,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Avocado",
      calories: 234,
      carbs: 12,
      fats: 21,
      proteins: 3,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Carrot",
      calories: 25,
      carbs: 6,
      fats: 0.1,
      proteins: 0.6,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Salmon (Atlantic)",
      calories: 206,
      carbs: 0,
      fats: 10.9,
      proteins: 22,
      servingSize: 3,
      servingUnit: "oz"
  },
  {
      name: "Lentils",
      calories: 230,
      carbs: 40,
      fats: 0.8,
      proteins: 18,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Milk (Whole)",
      calories: 149,
      carbs: 11.7,
      fats: 7.9,
      proteins: 7.7,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Ground Beef (80% lean)",
      calories: 254,
      carbs: 0,
      fats: 20.3,
      proteins: 17.3,
      servingSize: 3,
      servingUnit: "oz"
  },
  {
      name: "Pasta (Spaghetti)",
      calories: 220,
      carbs: 43,
      fats: 1.3,
      proteins: 8.1,
      servingSize: 2,
      servingUnit: "oz"
  },
  {
      name: "Olive Oil",
      calories: 119,
      carbs: 0,
      fats: 13.5,
      proteins: 0,
      servingSize: 1,
      servingUnit: "oz"
  },
  {
      name: "Yogurt (Plain, Low-fat)",
      calories: 154,
      carbs: 17.4,
      fats: 3.4,
      proteins: 13,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Cheese (Cheddar)",
      calories: 113,
      carbs: 0.4,
      fats: 9.3,
      proteins: 6.7,
      servingSize: 1,
      servingUnit: "oz"
  },
  {
      name: "Orange",
      calories: 62,
      carbs: 15.4,
      fats: 0.2,
      proteins: 1.2,
      servingSize: 1,
      servingUnit: "amount-of-item"
  },
  {
      name: "Grapes",
      calories: 52,
      carbs: 13.8,
      fats: 0.3,
      proteins: 0.6,
      servingSize: 1,
      servingUnit: "cup"
  },
  {
      name: "Almonds",
      calories: 579,
      carbs: 21,
      fats: 49.4,
      proteins: 21,
      servingSize: 1,
      servingUnit: "oz"
  },
  // Add more ingredients as needed
];

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let newMealSelectOption = document.getElementById("select-meal-to-edit");

const mealMenu = document.getElementById("add-by-meal-inputs");

const ingredientMenu = document.getElementById("add-by-ingredient-inputs");

//Will hold the meal that is currently being viewed/edited
let selectedMeal = undefined;

let username = window.findCookie("username");

let mealInProgess = {};

//RESET INFO AFTER COMING BACK FROFM ADDING A INGREDIENT

refreshUserMealsList();

document.getElementById("lone-meal-option").checked = true;
document.getElementById("select-meal-to-edit").addEventListener("change", () => {
    selectedMeal = (newMealSelectOption.value);
    if (selectedMeal == undefined || selectedMeal == "undefined") {
      resetMealInfo();
    } else {
      updateMealInfo(selectedMeal);
    }
  });
document.getElementById("delete-meal-button").addEventListener("click", () => {
    deleteMealButtonClicked();
})
document.getElementById("lone-meal-option").addEventListener("change", function () {
    if (this.checked) {
        mealMenu.style.display = "block";
        ingredientMenu.style.display = "none";
    }
});
// document.getElementById("ingredient-meal-option").addEventListener("change", function () {
//     if (this.checked) {
//         mealMenu.style.display = "none";
//         ingredientMenu.style.display = "block";
//     }
// });
document.getElementById("add-ingredient-menu-button").addEventListener("click", () => {
  document.getElementById("meal-to-be-added-info").style.display = "none";
  document.getElementById("add-ingredient-menu").style.display = "flex";
})
document.getElementById("add-meal-button").addEventListener("click", () => {
  //Get inputs
  const inputs = {
    name: document.getElementById("meal-name-input").value,
    notes: document.getElementById("meal-notes-input").value,
    calories: document.getElementById("meal-calories-input").value,
    carbs: document.getElementById("meal-carbs-input").value,
    fats: document.getElementById("meal-fats-input").value,
    proteins: document.getElementById("meal-protein-input").value,
  }
  Object.assign(inputs, {ingredients: [{    
    name: "Meal",
    calories: inputs.calories,
    carbs: inputs.carbs,
    fats: inputs.fats,
    proteins: inputs.proteins,
    size: 1,
    unit: "amount-of-item",}]
  });
  //Add new meal to DB passing the meal as a solo ingredient
  addMeal(inputs);
})
document.querySelector("#add-by-ingredient-inputs #add-ingredient-menu i").addEventListener("click", () => {
})
document.getElementById("add-ingredient-button").addEventListener("click", () => {
  //Add ingredient button clicked

  //Get inputs
  const inputs = {
  name: document.getElementById("ingredient-name-input").value,
  size: document.getElementById("ingredient-size-input").value,
  unit: document.getElementById("ingredient-unit-input").value,
  calories: document.getElementById("ingredient-calories-input").value,
  carbs: document.getElementById("ingredient-carbs-input").value,
  fats: document.getElementById("ingredient-fats-input").value,
  proteins: document.getElementById("ingredient-protein-input").value,
  }
  document.getElementById("add-meal-forum").reset();
  //Add it to the current meal total
  addIngredientToMealInProgress(inputs);
  //Return to current meal view
  document.getElementById("meal-to-be-added-info").style.display = "block";
  document.getElementById("add-ingredient-menu").style.display = "none";
})
document.getElementById("ingredient-size-input").addEventListener("change", () => {
  scaleIngredient(getChosenIngredient(), document.getElementById("ingredient-size-input").value);
})
addCommonIngredients();
function addIngredientToMealInProgress(ingredient) {
  //Update big numbers
  mealInProgess.calories += ingredient.calories;
  mealInProgess.carbs += ingredient.carbs;
  mealInProgess.fats += ingredient.fats;
  mealInProgess.proteins += ingredient.proteins;
  if (mealInProgess.ingredients == undefined) {
    mealInProgess.ingredients = [];
  }
  //Add the ingredient
  mealInProgess.ingredients.push(ingredient);
}
function getChosenIngredient() {
  return commonIngredients[Number(document.getElementById("select-from-cmn-ingredients").value)];
}
function addCommonIngredients() {
  let iterator = 0;
  commonIngredients.forEach(ingredient => {
    document.getElementById("select-from-cmn-ingredients").insertAdjacentHTML("beforeend", `
      <option value="${iterator}" id="option-ingredient-${iterator++}" >
        ${ingredient.name}
      </option>
    `);
  });
  document.getElementById("select-from-cmn-ingredients").addEventListener("change", () => {
    const chosenIngredient = getChosenIngredient();
    document.getElementById("ingredient-name-input").value = chosenIngredient.name;
    document.getElementById("ingredient-size-input").value = chosenIngredient.servingSize;
    document.getElementById("ingredient-unit-input").value = chosenIngredient.servingUnit;
    document.getElementById("ingredient-calories-input").value = chosenIngredient.calories;
    document.getElementById("ingredient-carbs-input").value = chosenIngredient.carbs;
    document.getElementById("ingredient-fats-input").value = chosenIngredient.fats;
    document.getElementById("ingredient-protein-input").value = chosenIngredient.proteins;
  })
}
function scaleIngredient(chosenIngredient, newSize) {
  const multiplier = newSize/chosenIngredient.servingSize;
  document.getElementById("ingredient-calories-input").value = Math.ceil(chosenIngredient.calories * multiplier);
  document.getElementById("ingredient-carbs-input").value = Math.ceil(chosenIngredient.carbs * multiplier);
  document.getElementById("ingredient-fats-input").value = Math.ceil(chosenIngredient.fats * multiplier);
  document.getElementById("ingredient-protein-input").value = Math.ceil(chosenIngredient.proteins * multiplier);
}
function deleteMealButtonClicked() {
    if (confirm(`Are you sure you want to delete meal '${selectedMeal}'?`)) {
      deleteMealFromDb(selectedMeal);
    }
}
function resetMealInfo() {
  document.getElementById("meal-info-cals").innerHTML = "";
  document.getElementById("meal-info-carbs").innerHTML = "";
  document.getElementById("meal-info-fats").innerHTML = "";
  document.getElementById("meal-info-proteins").innerHTML = "";
  document.getElementById("meal-info-name").innerHTML = "Select A Meal To View Or Edit";
  document.getElementById("meal-info-notes").innerHTML = "";
  document.getElementById("delete-meal-button").style = "display: none";
  document.querySelector("#ingredient-list tbody").innerHTML = "";
}
async function updateMealInfo(selectedMeal) {
    // Recieves the "name" of the meal doc (which makes this hella easy)
    const docRef = doc(db, "users", window.findCookie("username"), "meals", selectedMeal);
    const docSnap = await getDoc(docRef);
    document.getElementById("meal-info-cals").innerHTML = "Calories: "+docSnap.data().calories;
    document.getElementById("meal-info-carbs").innerHTML = "Carbohydrates: "+docSnap.data().carbs;
    document.getElementById("meal-info-fats").innerHTML = "Fats: "+docSnap.data().fats;
    document.getElementById("meal-info-proteins").innerHTML = "Proteins:"+docSnap.data().proteins;
    document.getElementById("meal-info-name").innerHTML = docSnap.data().mealName;
    document.getElementById("meal-info-notes").innerHTML = docSnap.data().notes;
    document.getElementById("delete-meal-button").style = "display: inline";
    getIngredients(selectedMeal);
}
async function getIngredients(selectedMeal) {
    const docRef = collection(db, "users", window.findCookie("username"), "meals", selectedMeal, "ingredients");
    const ingredients = await getDocs(docRef);
    let iterator = 0;
    ingredients.forEach(ingredient => {
      console.log("iterated: "+iterator)
      ingredient = ingredient.data();
      document.querySelector("#ingredient-list tbody").insertAdjacentHTML("beforeend", `
    <tr class="ingredient">
      <td id="ingredient-${iterator}">
        <header>
          <p>${ingredient.size} ${ingredient.ingredientName}:</p>
          <i class="fa-solid fa-angle-up"></i>
        </header>
        <div class="info-view" style="display: none">
          <div class="macros">
            <p>Cals: ${ingredient.calories}</p>
            <p>Carbs: ${ingredient.carbs}</p>
            <p>Fats: ${ingredient.fats}</p>
            <p>Proteins: ${ingredient.proteins}</p>
          </div>
          <div class="buttons">
            <button id="edit-${iterator}">Edit</button><button id="remove-${iterator}">Remove</button>
          </div>
        </div>
        <div class="info-edit" style="display: none">
          <div class="info-inputs">
            <div>
              <label for="serving-size">Serving Size</label>
              <input type="number" name="serving-size" value="${ingredient.size}" id="serving-size-input-${iterator}"/>
            </div>
            <div>
              <label for="serving-unit">Serving Unit</label>
              <input type="text" name="serving-unit" value="${ingredient.unit}" id="serving-unit-input-${iterator}"/>
            </div>
            <div>
              <label for="cals">Calories</label>
              <input type="number" name="cals" value="${ingredient.calories}" id="calories-input-${iterator}"/>
            </div>
            <div>
              <label for="carbs">Carbohydrates</label>
              <input type="number" name="carbs" value="${ingredient.carbs}" id="carbs-input-${iterator}"/>
            </div>
            <div>
              <label for="fats">Fats</label>
              <input type="number" name="fats" value="${ingredient.fats}" id="fats-input-${iterator}"/>
            </div>
            <div>
              <label for="proteins">Proteins</label>
              <input type="numb" name="proteins" value="${ingredient.proteins}" id="proteins-input-${iterator}""/>
            </div>
          </div>
          <button id="done-${iterator}">Done</button>
        </div>
      </td>
    </tr>`)
    document.querySelector(`#ingredient-${iterator}`).addEventListener("click", (element) => {
      element = element.target;
      let id = element.id.split("-")[1];
      //If they clicked the ediit button
      if (element.id == `edit-${id}`) {
        document.querySelector(`#ingredient-${id} .info-view`).style = "display: none";
        document.querySelector(`#ingredient-${id} .info-edit`).style = "display: block";
      } else if (element.id == `remove-${id}`) {//If they clicked the delete button
        //do deleting of ingredients and re-calculating of meals macros here
      } else if (element.id == `done-${id}`) { //If they clicked "done" under the edit menu
        console.log(getEditMealInputs(id));
        document.querySelector(`#ingredient-${id} .info-view`).style = "display: block";
        document.querySelector(`#ingredient-${id} .info-edit`).style = "display: none";
      } else {
        while (id == undefined || id == "") {
          id = element.parentNode.id.split("-")[1];
          element = element.parentNode;
        }
        if (document.querySelector(`#ingredient-${id} .info-view`).style.display == "none") {
          //Menu not expanded
          if (document.querySelector(`#ingredient-${id} .info-edit`).style.display == "none") {
            document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-down";
            document.querySelector(`#ingredient-${id} .info-view`).style = "display: block";
          }
        } else {
          console.log(document.querySelector(`#ingredient-${id} .info-view`).style.display);
          //Menu expanded
          document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-up";
          document.querySelector(`#ingredient-${id} .info-view`).style = "display: none";
          document.querySelector(`#ingredient-${id} .info-edit`).style = "display: none";
        } 
      }
    })
    iterator++;
    });
    if (iterator == 0) {
      document.querySelector("#ingredient-list tbody").innerHTML = "";
    }
}
async function refreshUserMealsList() {
  const displayedMeals = [...document.querySelectorAll("option:not(:first-of-type)")];
    displayedMeals.forEach(element => {
      element.remove();
    });
    const snapshot = await getDocs(collection(db, "users", username, "meals"));
    snapshot.docs.forEach((doc) => {
        newMealSelectOption.insertAdjacentHTML(
            "beforeend",
            `<option value="${doc.data().mealName}" class="user-meal">${doc.data().mealName}</option>`
          )
        })
}
function getEditMealInputs(id) {
  return {
    calories: document.querySelector(`#calories-input-${id}`).value, 
    carbs: document.querySelector(`#carbs-input-${id}`).value,
    fats: document.querySelector(`#fats-input-${id}`).value,
    proteins: document.querySelector(`#proteins-input-${id}`).value,
    servingSize: document.querySelector(`#serving-size-input-${id}`).value,
    servingUnit: document.querySelector(`#serving-unit-input-${id}`).value,
  }
}
async function deleteMealFromDb(meal) {
  const docRef = doc(db, "users", username, "meals", meal);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      await deleteDoc(docRef);
      document.getElementById("select-meal-to-edit").selectedIndex = 0;
      refreshUserMealsList();
      document.querySelector("#edit-and-view-meal .status-text").innerHTML = "Meal Deleted!";
      document.querySelector("#edit-and-view-meal .status-text").style = "color: red";
      newMealSelectOption.dispatchEvent(new Event("change"));
  } else {
      alert("Meal Dosent Exist");
    }
}
//Unfinished!!!!
// async function editIngredientFromDb(info, ingredientName) {
//   const docRef = doc(db, "users", username, "meals", selectedMeal, "ingredients", ingredientName);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     await setDoc(docRef, {
//       calories: info.calories,
//       carbs: info.carbs,
//       fats: info.fats,
//       proteins: info.proteins,
//       servingSize: info.servingSize,
//       servingUnit: info.servingUnit,
//     })
//   } else {
//     alert("meal doesent exist (somehow)");
//   }
// }
