let body = document.querySelector("body");
let back = document.querySelector(".back");
let search = document.querySelector(".pencarian");

back.addEventListener("click", () => {
    body.classList.toggle("show-search");
  });
search.addEventListener("click", () => {
  body.classList.toggle("show-search");
});
  