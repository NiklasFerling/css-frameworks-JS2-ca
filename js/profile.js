import { API_BASE_URL, accessToken, countContainer, loader, profilePicture, profilePictureContainer } from "./constants.js";
import { checkLogin, getPosts, createHTML, getProfile, jwtDecoder } from "./module.mjs";

const countPosts = document.getElementById("countPosts");
const countFollowers = document.getElementById("countFollowers");
const countFollowing = document.getElementById("countFollowing");
const displayName = document.getElementById("displayName");
const noPostsMessage = document.getElementById("noPostsMessage");
const followButton = document.querySelector("#followButton");
const editProfile = document.querySelector("#editProfile");

checkLogin(accessToken);
const profileName = window.location.search.replace("?", "");
const JWT = jwtDecoder(accessToken);
const followUrl = `${API_BASE_URL}/profiles/${profileName}/follow`;
const unfollowUrl = `${API_BASE_URL}/profiles/${profileName}/unfollow`;

/**
 * Fetches who you are following, then runs through with
 * a find() array method to see if the profile you are
 * visiting is in the list to display either "Follow",
 * or "Following"
 */
function checkFollowing() {
  fetch(API_BASE_URL + `/profiles/${JWT.name}/?_following=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => data.json())
    .then((json) => {
      const isFollowing = json.following.find(({ name }) => {
        if (name == profileName) {
          return true;
        }
      });
      if (isFollowing) {
        followButton.textContent = "Following";
        followButton.classList.add("btn-success");
        followButton.setAttribute("data-id", "1");
      } else {
        followButton.textContent = "Follow";
        followButton.classList.add("btn-primary");
        followButton.setAttribute("data-id", "0");
      }
    });
}
checkFollowing();

// Fetches profile you're visiting and uses details to
// display on page
getProfile(API_BASE_URL + "/profiles/", profileName)
  .then((data) => data.json())
  .then((user) => {
    console.log(user);
    countPosts.append(user._count.posts);
    countFollowers.append(user._count.followers);
    countFollowing.append(user._count.following);
    displayName.append(user.name);
    if (JWT.name === displayName.textContent) {
      followButton.classList.add("d-none");
      editProfile.classList.remove("d-none");
    }
    if (user.avatar) {
      profilePicture.setAttribute("src", user.avatar);
    } else {
      profilePictureContainer.classList.add("d-none");
      countContainer.classList.add("mx-auto");
    }
  });

let posts = [];

// Gets the posts from profile and adds edit post icon
// if it is your own page
getPosts(`${API_BASE_URL}/profiles/${profileName}/posts?_author=true&_comments=true&_reactions=true`)
  .then((data) => data.json())
  .then((json) => {
    posts = json;
    loader.classList.add("d-none");
    if (posts.length === 0) {
      noPostsMessage.classList.remove("d-none");
    } else {
      createHTML(posts);
    }
  })
  .then(() => {
    if (JWT.name === displayName.textContent) {
      const gears = document.querySelectorAll(".fa-gear");
      gears.forEach((gear) => {
        gear.classList.remove("d-none");
      });
    }
  });

// When the follow butten is clicked, changes the data-id
// to 0 or 1.
// 0 = not currently following
// 1 = currently following
// Sends fetch with different url depending on data-id
followButton.addEventListener("click", (event) => {
  if (followButton.dataset.id === "1") {
    fetch(unfollowUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((data) => data.json())
      .then((json) => {
        window.location.reload();
      });
  }
  if (followButton.dataset.id === "0") {
  }
  fetch(followUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => data.json())
    .then((json) => {
      window.location.reload();
    });
});

// Directs you to edit posts page when pressing the
// gear icon on a post
document.addEventListener("click", function (event) {
  if (event.target.matches(".fa-gear")) {
    window.location.href = `./edit/post/?id=${event.target.dataset.id}`;
  }
});
