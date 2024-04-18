// On Page Start Functions
window.addEventListener("online", generalStartup());

function generalStartup() {
  checkCookies();
}
function checkCookies() {
  let signedIn = findCookie('signedin');
  if (String(signedIn) == "true") {
    SignedIn();
  }
} 
function findCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded .split('; ');
  let res;
  cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res;
}
function getDate(returnItem) {
  const date = new Date();
  let returnDate;
  if (returnItem == "day") {
    returnDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 14}`;
  } else if (returnItem == "minute") {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    if (Number(date.getMinutes()) < 9) {
      minutes = "0"+`${Number(date.getMinutes())}`
    } 
    if (Number(date.getHours()) < 9) {
      hours = "0"+`${Number(date.getHours())}`
    }
    returnDate = `${hours}:${minutes}`
  }
  return returnDate;
}
// If Signed In
function SignedIn() {
  try {
    document.getElementById("sign-in-link").innerHTML = "Your Account";
    //If they're on the main page
    if (window.location.href == "https://daniel-sheptycki.github.io/Macro-Tracker/index.html" || window.location.href == "https://daniel-sheptycki.github.io/Macro-Tracker/") {
      document.getElementById("sign-in-link").href = "./pages/your-account.html";
    } else {
      document.getElementById("sign-in-link").href = "./your-account.html";
    }
    document.getElementById("get-started-link").href = "./pages/dashboard.html";
    document.getElementById("get-started-link").innerHTML = "Resume Tracking";
    document.getElementById("dashboard-link").style = "display: block";
    document.getElementById("main-page-others-food-link").href = "#"
    document.getElementById("main-page-food-link").href = "./pages/my-food.html"
    document.getElementById("main-page-track-link").href = "./pages/statistics.html"
    document.getElementById("community-link").style = "display: block";
  }
  catch {
    console.log("certain items didnt exist (SignedIn())")
  }
}
window.findCookie = findCookie;
window.getDate = getDate;