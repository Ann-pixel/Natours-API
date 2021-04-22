import { login } from "./login.js";
import "@babel/polyfill";
import { displayMap } from "./mapbox.js";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");
let email, password;
if (mapBox) {
  const tourLocations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  displayMap(tourLocations);
}
if (loginForm) {
  document.querySelector(".form").addEventListener("submit", (evt) => {
    evt.preventDefault();
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    login(email, password);
  });
}
