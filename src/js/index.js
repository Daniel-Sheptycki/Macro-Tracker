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
    returnDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 10}`;
  } else if (returnItem == "minute") {
    returnDate = `${date.getHours()}:${date.getMinutes()}`
  }
  return returnDate;
}
// If Signed In
function SignedIn() {
  try {
    document.getElementById("sign-in-link").innerHTML = "Your Account";
    document.getElementById("sign-in-link").href = "../../../pages/your-account.html";
    document.getElementById("get-started-link").href = "../../../pages/your-account.html";
    document.getElementById("get-started-link").innerHTML = "Resume Tracking";
    document.getElementById("dashboard-link").style = "display: block";
    document.getElementById("main-page-others-food-link").href = "#"
    document.getElementById("main-page-food-link").href = "pages/my-food.html"
    document.getElementById("main-page-track-link").href = "pages/statistics.html"
  }
  catch {
    console.log("certain items didnt exist (SignedIn())")
  }
}
window.findCookie = findCookie;
window.getDate = getDate;