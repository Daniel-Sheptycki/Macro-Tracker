// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

import { collection, getDoc, getDocs, getFirestore, query, setDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

import Chart from '../node_modules/chart.js/auto/auto"'

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

let hiddenMacrosOpened = [];

let username = window.findCookie("username");
// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestoreand get a reference to the service
const db = getFirestore(app);

updateTodaysMacros();
updateTodaysMacrosInputs();
getAllInputs();

async function updateTodaysMacros() {
    let username = window.findCookie("username");
    const macroSnap = await getDoc(doc(db, "users", username, "macro-inputs", window.getDate("day")));
    while (!macroSnap.exists()) {
        await setDoc(doc(db, "users", username, "macro-inputs", window.getDate("day")), {
            calories: 0,
            carbs: 0,
            fats: 0,
            proteins: 0,
            date: window.getDate("day"),
        })
    }
    document.getElementById("calories-table-data").innerHTML = String(Math.ceil(macroSnap.data().calories));
    document.getElementById("carbohydrates-table-data").innerHTML = String(Math.ceil(macroSnap.data().carbs)).concat("g");
    document.getElementById("fats-table-data").innerHTML = String(Math.ceil(macroSnap.data().fats)).concat("g");
    document.getElementById("proteins-table-data").innerHTML = String(Math.ceil(macroSnap.data().proteins)).concat("g");
}
async function updateTodaysMacrosInputs() {
    //When creating the html
    console.log(window.getDate("day"));
    const macroRef = collection(db, "users", username, "macro-inputs", window.getDate("day"), "recipts");
    const macroSnap = await getDocs(query(macroRef, orderBy("time", "desc")));
    let i = 0;
    macroSnap.forEach(recipt => {
      let time = recipt.data().time;
        hiddenMacrosOpened[i] = false;
        document.getElementById("macro-inputs-field").insertAdjacentHTML(
            "beforeend",
            `        
            <tr id="recipt-${i}">
            <td>
              <header>
                <p id="meal-name-${i}">${recipt.data().mealName}</p>
                <p id="time-${i}">${time}</p>
                <div id="expand-button-${i}">
                  <i
                    class="fa-solid fa-angle-up"
                    id="macro-input-${i}-expand-button"
                  ></i>
                </div>
              </header>
              <div class="hidden-macros" id="hidden-macros-${i}">
                <div id="todays-macro-input-calories-${i}">
                  <p>Calories:</p>
                  <p id="calories-data-${i}">${recipt.data().calories}</p>
                </div>
                <div id="todays-macro-input-carbs-${i}">
                  <p>Carbs:</p>
                  <p id="carbs-data-${i}">${recipt.data().carbs}</p>
                </div>
                <div id="todays-macro-input-fats-${i}">
                  <p>Fats:</p>
                  <p id="fats-data-${i}">${recipt.data().fats}</p>
                </div>
                <div id="todays-macro-input-proteins-${i}">
                  <p>Proteins:</p>
                  <p id="proteins-data-${i}">${recipt.data().proteins}</p>
                </div>
              </div>
            </td>
          </tr>`
          )
          document.getElementById(`macro-input-${i}-expand-button`).addEventListener("click", (element) => {
            let extractedElement = Number(element.target.id.substring(12, element.target.id.length - 14));
            if (!hiddenMacrosOpened[extractedElement]) {
                document.getElementById(`macro-input-${extractedElement}-expand-button`).classList = "fa-solid fa-angle-down";
                document.getElementById(`hidden-macros-${extractedElement}`).style = "display: flex";
            } else {
                document.getElementById(`hidden-macros-${extractedElement}`).style = "display: none";
                document.getElementById(`macro-input-${extractedElement}-expand-button`).classList = "fa-solid fa-angle-up";
            }
            hiddenMacrosOpened[extractedElement] = !hiddenMacrosOpened[extractedElement];
        })
          i++;
        //Will repeat for each recipt with the current object being named "recipt" in this instance
    });
    //the expand button, add the event listener
}
async function getAllInputs() {
  const macroRef = collection(db, "users", username, "macro-inputs");
  const macroSnap = await getDocs(macroRef);
  const data = {
    calories: {label: "Calories", backgroundColor: "red", borderColor: "red", data: []},
    carbs: {label: "Carbs", backgroundColor: "blue", borderColor: "blue", data: []},
    fats: {label: "Fats", backgroundColor: "green", borderColor: "green", data: []},
    proteins: {label: "Proteins", backgroundColor: "orange", borderColor: "orange", data: []},
    dates: [],
  }
  macroSnap.forEach(input => {
    var inputData = input.data();
    data.calories.data.push(inputData.calories);
    data.carbs.data.push(inputData.carbs);
    data.fats.data.push(inputData.fats);
    data.proteins.data.push(inputData.proteins);
    data.dates.push(inputData.date);
  });
  BuildChart([data.calories, data.carbs, data.fats, data.proteins], data.);
}
function BuildChart(datasets, labels) {
  new Chart("all-time-chart", {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
  });
}
