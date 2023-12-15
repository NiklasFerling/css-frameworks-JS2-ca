import { API_BASE_URL, accessToken, comments, reactions } from "./constants.js";
import { checkLogin, getPosts, jwtDecoder } from "./module.mjs";

checkLogin(accessToken);
const JWT = jwtDecoder(accessToken);

const parameterString = window.location.search;
const params = new URLSearchParams(parameterString);
const id = params.get("id");
const singlePostUrl = `https://api.noroff.dev/api/v1/social/posts/${id}?_author=true&_comments=true&_reactions=true`;

const editTitle = document.querySelector("#editTitle");
const editBody = document.querySelector("#editBody");
const postAuthorName = document.querySelector("#postAuthorName");
const editForm = document.querySelector("#editForm");
const deletePost = document.querySelector("#deletePost");

// Fetches a single post using post id and adds content
// as input value
getPosts(singlePostUrl)
  .then((data) => data.json())
  .then((post) => {
    console.log(post);
    editTitle.value = post.title;
    editBody.value = post.body;
    postAuthorName.append(post.author.name);
    comments.append(post._count.comments);
    reactions.append(post._count.reactions);
  });

// Fetches PUT request with value from inputs
// Redirects to profile
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("submit");
  fetch(API_BASE_URL + `/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: editTitle.value,
      body: editBody.value,
    }),
  })
    .then((data) => data.json())
    .then(() => {
      window.location.href = `/profile/?${JWT.name}`;
    });
});

// Sends DELETE request  with the post id
deletePost.addEventListener("click", (event) => {
  fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => data.json())
    .then(() => {
      window.location.href = `/profile/?${JWT.name}`;
    });
});

// Same hidden div that dynamically resizes textarea
const hiddenDiv = document.createElement("div");
hiddenDiv.classList.add("hiddendiv");
document.body.appendChild(hiddenDiv);
const textarea = document.querySelector("textarea");

textarea.addEventListener("input", function () {
  hiddenDiv.textContent = textarea.value + "\n";
  this.style.height = hiddenDiv.offsetHeight + "px";
});
