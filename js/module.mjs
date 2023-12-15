// Checks if there is an accesToken in local storage
// and directs to login if not found

export function checkLogin(token) {
  if (!token) {
    window.location.href = "/login";
  }
}

import { accessToken, signOut, postsContainer } from "./constants.js";

/**
 * A JWT decoder that takes a token string and splits into header, payload and signature, returns the payload
 * @param {string} token JWT
 * @returns Your JWT payload as an object
 */
export function jwtDecoder(token) {
  if (accessToken) {
    const tokenParts = token.split(".");
    const header = tokenParts[0];
    const payload = tokenParts[1];
    const signature = tokenParts[2];

    const base64UrlPayload = payload;
    const base64Payload = base64UrlPayload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64Payload);

    const payloadObject = JSON.parse(jsonPayload);
    return payloadObject;
  }
}

// Various fetchers

export function getProfile(url, name) {
  return fetch(url + name, {
    headers: {
      method: "GET",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getPosts(url) {
  return fetch(url, {
    headers: {
      method: "GET",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function deletePost(id) {
  return fetch(postUrl + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Takes an array of posts and creates HTML using the properties provided
 * @param {array} posts An array of objects (posts)
 */
export function createHTML(posts) {
  posts.forEach(({ author, body, comments, created, id, media, reactions, tags, title, updated, _count }) => {
    const postWrapper = document.createElement("div");
    postWrapper.classList.add("row", "bg-light", "border", "rounded-4", "py-2", "mb-3", "post-wrapper", "px-2");

    const avatar = document.createElement("a");
    avatar.classList.add("col-auto", "p-0");
    if (author.avatar) {
      avatar.style.width = "42px";
      avatar.style.height = "42px";
      avatar.setAttribute("href", `./profile/?${author.name}`);
      const avatarImg = document.createElement("img");
      avatarImg.setAttribute("src", author.avatar);
      avatarImg.setAttribute("alt", "Prifile picture");
      avatarImg.classList.add("rounded-circle", "w-100", "h-100");
      avatarImg.style.objectFit = "cover";
      avatar.append(avatarImg);
    }

    const postContent = document.createElement("div");
    postContent.classList.add("col", "me-4");

    const infoLine = document.createElement("div");
    infoLine.classList.add("mb-2", "row", "justify-content-between");
    const postTitle = document.createElement("p");
    postTitle.textContent = title;
    postTitle.classList.add("text-break");
    const postBody = document.createElement("p");
    postBody.classList.add("text-break");
    postBody.textContent = body;
    const interactLine = document.createElement("div");
    interactLine.classList.add("row");

    const authorName = document.createElement("a");
    authorName.classList.add("col-auto", "fw-bold", "rounded-3", "text-decoration-none", "text-black");
    authorName.setAttribute("href", `./profile/?${author.name}`);

    const gear = document.createElement("i");
    gear.classList.add("fa-solid", "fa-gear", "d-none", "col-auto", "p-0");
    gear.setAttribute("role", "button");
    gear.setAttribute("data-id", id);

    const reactButton = document.createElement("span");
    const reactIcon = document.createElement("i");
    const commentButton = document.createElement("a");
    const commentIcon = document.createElement("i");
    reactButton.classList.add("col-auto", "reactions", "text-decoration-none", "text-black");
    commentButton.classList.add("col-auto", "text-decoration-none", "text-black");
    reactIcon.classList.add("fa-regular", "fa-heart", "me-1", "text-decoration-none", "text-black");
    commentIcon.classList.add("fa-regular", "fa-comment", "me-1", "text-decoration-none", "text-black");

    postsContainer.appendChild(postWrapper);

    postWrapper.append(avatar, postContent);

    postContent.append(infoLine, postTitle, postBody, interactLine);

    infoLine.append(authorName, gear);

    authorName.append(author.name);

    interactLine.append(reactButton, commentButton);
    reactButton.append(reactIcon, _count.reactions);
    commentButton.append(commentIcon, _count.comments);
  });
}

// Makes the href of the profile button in the nav link to your own profile using search params
if (accessToken) {
  const JWT = jwtDecoder(accessToken);
  const profileButton = document.querySelector("#profileButton");
  profileButton.setAttribute("href", `/profile/?${JWT.name}`);
}

signOut.addEventListener("click", (event) => {
  localStorage.removeItem("accessToken");
  window.location.reload();
});
