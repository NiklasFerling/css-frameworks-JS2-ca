// URL's
export const API_BASE_URL = "https://api.noroff.dev/api/v1/social";
export const registerUrl = `${API_BASE_URL}/auth/register`;
export const loginUrl = `${API_BASE_URL}/auth/login`;
export const getPostsUrl = `${API_BASE_URL}/posts?_author=true&_comments=true&_reactions=true`;
export const createPostUrl = `${API_BASE_URL}/posts`;

// HTML Elements
export const loader = document.querySelector(".loader");
export const reactions = document.querySelector(".reactions");
export const comments = document.querySelector(".comments");
export const profilePictureContainer = document.querySelector("#profilePictureContainer");
export const profilePicture = document.querySelector("#profilePicture");
export const countContainer = document.querySelector("#countContainer");
export const signOut = document.querySelector("#signOut");
export const postsContainer = document.getElementById("posts-container");

// Local Storage
export const accessToken = localStorage.getItem("accessToken");
