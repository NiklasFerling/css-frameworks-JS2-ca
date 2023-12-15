import { checkLogin, getProfile, jwtDecoder } from "./module.mjs";
import { profilePicture, API_BASE_URL, accessToken } from "./constants.js";

checkLogin(accessToken);

const editForm = document.querySelector("#editForm");
const newAvatar = document.querySelector("#newAvatar");
const newBanner = document.querySelector("#newBanner");
const discardChanges = document.querySelector("#discardChanges");

const JWT = jwtDecoder(accessToken);
console.log(JWT);

// Checks for avatar, displays it and adds to input value
// Checks for banner and adds to input value
getProfile(API_BASE_URL + "/profiles/", JWT.name)
  .then((data) => data.json())
  .then((json) => {
    console.log(json);
    if (json.avatar !== "") {
      profilePicture.setAttribute("src", JWT.avatar);
    }
    if (json.avatar !== "") {
      console.log("avatar found:", json.avatar);
      newAvatar.value = json.avatar;
    }
    if (json.banner !== "") {
      newBanner.value = json.banner;
    }
  });

// Sends PUT request with url from inputs and
// redirects to profile page
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  fetch(API_BASE_URL + `/profiles/${JWT.name}/media`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      avatar: newAvatar.value,
      banner: newBanner.value,
    }),
  })
    .then((data) => data.json())
    .then((json) => {})
    .then(() => {
      window.location.href = `/profile/?${JWT.name}`;
    });
});

// Sends to profile page without submitting
discardChanges.addEventListener("click", (event) => {
  window.location.href = `/profile/?${JWT.name}`;
});
