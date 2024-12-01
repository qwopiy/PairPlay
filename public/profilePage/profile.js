let editProfileBtn = document.getElementById("edit-profile-btn");
let cancelBtn = document.getElementById("btn-cancel");
let saveBtn = document.getElementById("btn-save");
let minusBtn = document.getElementById("minus-btn");

let imageEdit = document.getElementById("image-edit");
let imageEditPreview = document.getElementById("profile-edit");
let nameEdit = document.getElementById("name-edit");
let bioEdit = document.getElementById("bio-edit");

let imgProfile = document.getElementById("img-profile");
let nameProfile = document.getElementById("name-profile");
let bioProfile = document.getElementById("bio-profile");

let body = document.querySelector("body");

const achievmentDropdown = [
  document.getElementById("achievment-dropdown1"),
  document.getElementById("achievment-dropdown2"),
  document.getElementById("achievment-dropdown3"),
  document.getElementById("achievment-dropdown4"),
  document.getElementById("achievment-dropdown5"),
]
let achievmentSaveBoolean = [false, false, false, false];
let achievmentSave = [document.getElementById("achievment-edit1"), document.getElementById("achievment-edit2"), document.getElementById("achievment-edit3"), document.getElementById("achievment-edit4")];

let imageSrc;

minusBtn.addEventListener("click", () =>{
  for(var i=3; i>=0; i--){
    if(achievmentSave[i].src != "http://localhost/PairPlay/assets/FrontPage/transparent.png"){
      achievmentSave[i].src = "http://localhost/PairPlay/assets/FrontPage/transparent.png";
      achievmentSaveBoolean[i] = false; 
      break;
    }   
  }
})

function AchievmentEdit(a, indeks) {
  if (achievmentSaveBoolean[a] == true) {
    AchievmentEdit(a + 1, indeks);
  } else {
    console.log(a);
    achievmentSave[a].src = achievmentDropdown[indeks].src;
    achievmentSaveBoolean[a] = true;
  }
}

achievmentDropdown[0].onclick = function () {
  AchievmentEdit(0, 0);
};
achievmentDropdown[1].onclick = function () {
  AchievmentEdit(0, 1);
};
achievmentDropdown[2].onclick = function () {
  AchievmentEdit(0, 2);
};
achievmentDropdown[3].onclick = function () {
  AchievmentEdit(0, 3);
};
achievmentDropdown[4].onclick = function () {
  AchievmentEdit(0, 4);
};

editProfileBtn.addEventListener("click", () => {

  imageEditPreview.src = imgProfile.src;
  nameEdit.value = nameProfile.innerHTML;
  bioEdit.value = bioProfile.innerHTML;
  body.classList.toggle("show-edit");
  
  imageEdit.onchange = function () {
    imageEditPreview.src = URL.createObjectURL(imageEdit.files[0]);
  };
});

cancelBtn.addEventListener("click", () => {
  body.classList.toggle("show-edit");
});

saveBtn.addEventListener("click", () => {
  body.classList.toggle("show-edit");
  
  let imageSrc = [""];
  for(var i=1; i<=4; i++){
    imageSrc.push(achievmentSave[i-1].src);
  }

  fetch("../../Signup and Login/verify/profileFunction.php" ,{
    "method" : "POST",
    "headers" : {
        "Content-type" : "application/json; charset=utf-8"
    },
    "body" : JSON.stringify(imageSrc)
  }).then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
  })
});




