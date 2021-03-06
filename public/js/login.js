import axios from "axios";
import { showAlert } from "./alerts.js";
export async function login(email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 2000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
export async function logout() {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "success") {
      // console.log("loggedout success");
      location.reload(true);
    }
  } catch (err) {
    // console.log(err.response);
    showAlert("error", "Error logging out. Try again! ");
  }
}
