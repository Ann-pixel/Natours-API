import { login, logout } from "./login.js";
import { updateData } from "./updateData.js";
import "@babel/polyfill";
import { displayMap } from "./mapbox.js";
import { bookTour } from "./stripe.js";
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const updateForm = document.querySelector(".form-user-data");
const logOutBtn = document.querySelector(".nav__el--logout");
const userPasswordForm = document.querySelector(".form-user-password");
const bookButton = document.getElementById("book-tour");

if (mapBox) {
  const tourLocations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  displayMap(tourLocations);
}
if (loginForm) {
  document.querySelector(".form").addEventListener("submit", (evt) => {
    evt.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // console.log(`from index.js ${password}, ${email}`);
    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (updateForm) {
  updateForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    // console.log(form);
    updateData(form, "data");
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateData(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    // document.querySelector(".btn--save-password").textContent = "Save Password";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
if (bookButton)
  bookButton.addEventListener("click", (evt) => {
    evt.target.textContent = "Processing...";
    const { tourId } = evt.target.dataset;
    // console.log(tourId);
    bookTour(tourId);
  });
