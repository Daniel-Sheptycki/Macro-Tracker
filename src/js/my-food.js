// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { getFirestore, doc, getDocs, collection, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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

// let macroObjects = document.getElementsByClassName("macros-input-item-input");
let newMealSelectOption = document.getElementById("select-meal-to-edit");
refreshUserMealsList();

// document.getElementById("add-meal-button").addEventListener("click", () => {
//     addMacrosButtonClicked();
// })
document.getElementById("select-meal-to-edit").addEventListener("change", () => {
    updateMealInfo(newMealSelectOption.value);
  });
// document.getElementById("delete-meal-button").addEventListener("click", () => {
//     deleteMealButtonClicked();
// })
// function addMacrosButtonClicked() {
//     let macroValues = [];
//     // Assign inputs to variables
//     for (let i = 0; i < macroObjects.length; i++) {
//       macroValues[i] = macroObjects[i].value
//       if (macroValues[i] < 0) {
//         macroValues[i] = 0;
//       }
//     }

//     let servingSize = [document.getElementById("serving-size-input").value,     
//     document.querySelector('input[name="serving-size"]:checked').value]
//     addNewMealToDb(window.findCookie("username"), macroValues, servingSize);
//       // If Public
//       if (document.getElementById("make-meal-public-checkbox").checked) {
//       addPublicMeal(macroValues);
//       }
//       document.getElementById("input-macros-form").reset();
//   }
// function deleteMealButtonClicked() {
//     let macroValues = [];
//     // Assign inputs to variables
//     for (let i = 0; i < macroObjects.length; i++) {
//       macroValues[i] = macroObjects[i].value
//       if (macroValues[i] < 0) {
//         macroValues[i] = 0;
//       }
//     }
//     document.getElementById("input-macros-form").reset();
//       deleteMealFromDb(window.findCookie("username"), macroValues);
// }
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
    getIngredients(selectedMeal);
}
async function getIngredients(selectedMeal) {
    const docRef = collection(db, "users", window.findCookie("username"), "meals", selectedMeal, "ingredients");
    const ingredients = await getDocs(docRef);
    let iterator = 0;
    ingredients.forEach(ingredient => {
      ingredient = ingredient.data();
      document.querySelector("#ingredient-list tbody").insertAdjacentHTML("beforeend", `
    <tr class="ingredient"">
      <td id="ingredient-${iterator}">
        <header>
          <p>${ingredient.servingSize} ${ingredient.mealName}:</p>
          <i class="fa-solid fa-angle-up"></i>
        </header>
        <div class="info-view">
          <div class="macros">
            <p>Cals: ${ingredient.calories}</p>
            <p>Carbs: ${ingredient.carbs}</p>
            <p>Fats: ${ingredient.fats}</p>
            <p>Proteins: ${ingredient.proteins}</p>
          </div>
          <div class="buttons">
            <button>Edit</button><button>Remove</button>
          </div>
        </div>
        <div class="info-edit">
          <div class="info-inputs">
            <div>
              <label for="serving-size">Serving Size</label>
              <input type="text" name="serving-size" placeholder="${ingredient.servingSize}"/>
            </div>
            <div>
              <label for="cals">Calories</label>
              <input type="text" name="cals" placeholder="${ingredient.calories}"/>
            </div>
            <div>
              <label for="carbs">Carbohydrates</label>
              <input type="text" name="carbs" placeholder="${ingredient.carbs}"/>
            </div>
            <div>
              <label for="fats">Fats</label>
              <input type="text" name="fats" placeholder="${ingredient.fats}"/>
            </div>
            <div>
              <label for="proteins">Proteins</label>
              <input type="text" name="proteins" placeholder="${ingredient.proteins}"/>
            </div>
          </div>
          <button>Done</button>
        </div>
      </td>
    </tr>`)
    document.querySelector(`#ingredient-${iterator}`).addEventListener("click", (element) => {
      element = element.target;
      let id = element.id.split("-")[1];
      while (id == undefined || id == "") {
        id = element.parentNode.id.split("-")[1];
        element = element.parentNode;
      }
      if (document.querySelector(`#ingredient-${id} header i`).classList == "fa-solid fa-angle-up") {
        //Menu not expanded
        document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-down";
        document.querySelector(`#ingredient-${id} .info-view`).style = "display: block";
      } else {
        //Menu expanded
        document.querySelector(`#ingredient-${id} header i`).classList = "fa-solid fa-angle-up";
        document.querySelector(`#ingredient-${id} .info-view`).style = "display: none";
      }
    })
    iterator++;
    });
    if (iterator == 0) {
      document.querySelector("#ingredient-list tbody").innerHTML = "";
    }
}
// async function addNewMealToDb(username, selectedMeal, servingSize) {
//     const docRef = doc(db, "users", username, "meals", selectedMeal[4]);
//     const docSnap = await getDoc(docRef);
  
//     if (docSnap.exists()) {
//         alert("Meal Already Exists!");
//     } else {
//       await setDoc(docRef, {
//           mealName: selectedMeal[4],
//           calories: selectedMeal[0],
//           carbs: selectedMeal[1],
//           fats: selectedMeal[2],
//           proteins: selectedMeal[3],
//           notes: selectedMeal[5],
//           servingAmount: servingSize[0],
//           servingUnit: servingSize[1]
//       })
//       document.getElementById("meal-added-text").innerHTML = "Meal Added!"
//       refreshUserMealsList();
//     }
//   }
// async function deleteMealFromDb(username, selectedMeal) {
//     const docRef = doc(db, "users", username, "meals", selectedMeal[4]);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//         await deleteDoc(docRef);
//         document.getElementById("meal-added-text").innerHTML = "Meal Deleted!"
//         document.getElementById("meal-added-text").style = "color: red;"
//         refreshUserMealsList();
//     } else {
//         alert("Meal Dosent Exist");
//       }
//     }
async function refreshUserMealsList() {
    const snapshot = await getDocs(collection(db, "users", window.findCookie("username"), "meals"));
    snapshot.docs.forEach((doc) => {
        newMealSelectOption.insertAdjacentHTML(
            "beforeend",
            `<option value="${doc.data().mealName}" class="user-meal">${doc.data().mealName}</option>`
          )
        })
}
// async function addPublicMeal(mealInfo) {
//   const docSnap = await getDoc(doc(db, "users", window.findCookie("username"), "public-meals", mealInfo[4]));
//   if (docSnap.exists()) {
//     alert("Meal Is Already Public");
//   } else {
//     await setDoc(doc(db, "users", window.findCookie("username"), "public-meals", mealInfo[4]), {
//       mealName: mealInfo[4],
//       mealNotes: mealInfo[5],
//       calories: mealInfo[0],
//       carbs: mealInfo[1],
//       fats: mealInfo[2],
//       proteins: mealInfo[3],
//       author: window.findCookie("username"),
//     }
//       )
//   }
// }
