let body = document.querySelector("body");
let searchForm = document.querySelector("#search-form");
let resultContainer = document.querySelector(".result-container");
let back = document.querySelector(".back");
let search = document.querySelector(".pencarian");

back.addEventListener("click", () => {
  body.classList.toggle("show-search");
});

searchForm.addEventListener("keyup", () => {
  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(ajax.readyState == 4 && ajax.status == 200){
      resultContainer.innerHTML = ajax.response;
    }
  }

  ajax.open('GET', 'Signup and Login/verify/search.php?keyword='+ searchForm.value, true);
  ajax.send();
})

search.addEventListener("click", () => {
  body.classList.toggle("show-search");
});
  