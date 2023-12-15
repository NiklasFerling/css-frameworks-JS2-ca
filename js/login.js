import { API_BASE_URL, registerUrl, loginUrl } from "./constants.js";

const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");
const email_error = document.getElementById("email_error");
const name_error = document.getElementById("name_error");
const password_error = document.getElementById("password_error");
const confirm_password_error = document.getElementById(
  "confirm_password_error"
);
const registration_successful = document.getElementById(
  "registration_successful"
);
const user_exists = document.getElementById("user_exists");
const loginError = document.getElementById("loginError");

/**
 * Function that sends user data to api and directs to feed if valid. If invalid, displays an error message
 * @param {string} url Login API endpoint
 * @param {object} userData
 */
async function loginUser(url, userData) {
  const methodOptions = {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, methodOptions);
  const json = await response.json();
  if (json.accessToken) {
    const { accessToken } = json;
    console.log(accessToken);
    localStorage.setItem("accessToken", accessToken);
    window.location.href = "../";
  } else {
    loginError.innerHTML = `${json.errors[0].message}`;
  }
}

/**
 * Event listener that captures login details and passes it to loginUser() an an object
 */
logInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;
  const loginData = {
    email: loginEmail,
    password: loginPassword,
  };
  loginUser(loginUrl, loginData);
});

/**
 *
 * @param {string} url Register api endpoint
 * @param {object} userData
 */
async function registerUser(url, userData) {
  try {
    console.log(url, userData);
    const methodOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, methodOptions);
    const json = await response.json();
    if (json.errors[0].message.includes("Profile already exists")) {
      user_exists.classList.remove("d-none");
    } else {
      loginUser(loginUrl, userData);
    }
  } catch (error) {}
}

/**
 * Function that sends the form data to registerUser() if valid, and displays an error message if invalid
 * @param {object} userData
 * @param {object} formData
 *
 */
function validateForm({ name, email, password, confirmPassword }, formData) {
  let isValid = true;
  if (password.length < 8) {
    password_error.classList.remove("d-none");
    isValid = false;
  } else {
    password_error.classList.add("d-none");
  }

  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  console.log(email);
  if (!patternMatches) {
    email_error.classList.remove("d-none");
    isValid = false;
  } else {
    email_error.classList.add("d-none");
  }

  if (!email.includes("noroff.no")) {
    email_error.classList.remove("d-none");
    isValid = false;
  } else {
    email_error.classList.add("d-none");
  }

  if (name.length === 0) {
    name_error.classList.remove("d-none");
    isValid = false;
  } else {
    name_error.classList.add("d-none");
  }

  if (confirmPassword != password) {
    confirm_password_error.classList.remove("d-none");
    isValid = false;
  } else {
    confirm_password_error.classList.add("d-none");
  }

  if (isValid) {
    registerUser(registerUrl, formData);
  }
}

/**
 * Event listener that captures form input data and passes it to validateForm() as an object when submitting
 */
signUpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value.replace(/ /g, "");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const formData = {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };
  validateForm(formData, formData);
});
