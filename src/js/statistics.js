// Import the functions you need from the SDKs you need

import { initializeApp } from "../../node_modules/firebase/app";

import { collection, getDoc, getDocs, getFirestore, query, setDoc, doc, orderBy } from "../../node_modules/firebase/firestore"

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
// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestoreand get a reference to the service
const db = getFirestore(app);

updateTodaysMacros();
updateTodaysMacrosInputs();

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
    let username = window.findCookie("username");
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
                document.getElementById(`hidden-macros-${extractedElement}`).style = "display: block";
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
let lineChart;
createMap(document.getElementById("graph-macro-choice").value)
async function createMap(timeFilter) {
    const macroInputsRef = collection(db, "users", window.findCookie("username"), "macro-inputs");
    let i = 0;
    let dataCals = [];
    let dataCarbs = [];
    let dataFats = [];
    let dataProteins = [];
    let graphType;
        if (timeFilter == "today") {
            const todaysMacroInputsRef = collection(db, "users", window.findCookie("username"), "macro-inputs", window.getDate("day"), "recipts");
            const macroSnap = await getDocs(query(todaysMacroInputsRef, orderBy("time", "asc")));            
            updateGraphData(macroSnap);
        } else if (timeFilter == "days") {
            const macroSnap = await getDocs(macroInputsRef);
            updateGraphData(macroSnap);
        }
    function updateGraphData(macroSnap) {
     macroSnap.docs.forEach((day) => {
        console.log(day.data().calories);
        let timeSort;
        if (timeFilter == "today") {
            timeSort = day.data().time;
            console.log
            graphType = 'bar';
        } else if (timeFilter == "days") {
            timeSort = day.data().date;
            graphType = 'line';
        }
            dataCals[i] = { year: timeSort, count: day.data().calories};
            dataCarbs[i] = { year: timeSort, count: day.data().carbs};
            dataFats[i] = { year: timeSort, count: day.data().fats};
            dataProteins[i] = { year: timeSort, count: day.data().proteins};
        i++;
    })
}
  
    lineChart = new Chart(
      document.getElementById('all-time-macros-map'),
      {
        type: graphType,
        data: {
          labels: dataCals.map(row => row.year),
          datasets: [
            {
              label: 'Calories',
              data: dataCals.map(row => row.count)
            }, {
                label: 'Carbohydrates',
                data: dataCarbs.map(row => row.count)
            },  {
                label: 'Fats',
                data: dataFats.map(row => row.count)
            },  {
                label: 'Proteins',
                data: dataProteins.map(row => row.count)
            }
            
          ]
        },

      }
    )
  }
  document.getElementById("graph-macro-choice").addEventListener("change", () => {
    createMap(document.getElementById("graph-macro-choice").value)
        lineChart.destroy();
})