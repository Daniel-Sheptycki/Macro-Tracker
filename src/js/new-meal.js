import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { collection, getFirestore, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
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

let currentMeal = [[0, 0, 0, 0]];

let ingredientCount = 1;

document.getElementById("add-ingredient-button").addEventListener("click", () => {
    addIngredient();
})
document.getElementById("add-meal-button").addEventListener("click", () => {
    addMeal();
})
function addIngredient() {
    const currentIngredient = [];
    // Get the inputs from the form thing, turn it into a object and then add it into the big object new meal aswell as the macros
    let elementCount = 0;
    documentIngredientInputField("calories");
    documentIngredientInputField("carbs");
    documentIngredientInputField("fats");
    documentIngredientInputField("proteins");
    documentIngredientInputField("ingredient-name");
    documentIngredientInputField("serving-size");
    document.getElementById("add-ingredient").reset();

    function documentIngredientInputField(inputId) {
        const inputValue = document.getElementById(`input-${inputId}`).value;
        currentIngredient[elementCount] = inputValue;
        if (elementCount < 4) {
            currentMeal[0][elementCount] += Number(inputValue);
            document.getElementById(`active-meal-${inputId}`).innerHTML = String(currentMeal[0][elementCount]) + " " + inputId;
        }
        elementCount ++;
    }
    currentMeal[ingredientCount] = currentIngredient
    ingredientCount ++;
}
async function addMeal() {
    const mealName = document.getElementById("input-meal-name").value;
    const mealDesc = document.getElementById("input-meal-notes").value;
    const docRef = doc(db, "users", window.findCookie("username"), "meals", mealName);
    // Set the meal
    await setDoc(docRef, {
        mealName: mealName,
        calories: currentMeal[0][0],
        carbs: currentMeal[0][1],
        fats: currentMeal[0][2],
        proteins: currentMeal[0][3],
        notes: mealDesc,
        servingAmount: 1,
        servingUnit: "amount-of-item"
    })
    // Put the ingredients in the meal
    currentMeal.forEach((element) => {
        if (currentMeal[0] != element) {
            addIngredientToMeal(element);
        }
    });
    async function addIngredientToMeal(element) {
        await addDoc(collection(db, "users", window.findCookie("username"), "meals", mealName, "ingredients"), {
            mealName: element[4],
            calories: element[0],
            carbs: element[1],
            fats: element[2],
            proteins: element[3],
            servingSize: element[5]
        })
        }
        currentMeal = [[0, 0, 0, 0]];
        document.getElementById("meal-info").reset();
    }