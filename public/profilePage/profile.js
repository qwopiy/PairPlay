let editProfileBtn = document.getElementById("edit-profile-btn");
let cancelBtn = document.getElementById("btn-cancel");
let saveBtn = document.getElementById("btn-save");

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
];
let achievmentSaveBoolean = ["false", "false", "false", "false"];
let achievmentSave = [document.getElementById("achievment-edit1"), document.getElementById("achievment-edit2"), document.getElementById("achievment-edit3"), document.getElementById("achievment-edit4")];
let achievmentProfile = [document.getElementById("achievment-profile1"), document.getElementById("achievment-profile2"), document.getElementById("achievment-profile3"), document.getElementById("achievment-profile4")];

let darkBackground = document.createElement('div');
darkBackground.classList.add("dark-background");

editProfileBtn.addEventListener("click", () => {

  imageEditPreview.src = imgProfile.src;
  nameEdit.value = nameProfile.innerHTML;
  bioEdit.value = bioProfile.innerHTML;
  body.classList.toggle("show-edit");
  
  imageEdit.onchange = function () {
    imageEditPreview.src = URL.createObjectURL(imageEdit.files[0]);
  };

  function AchievmentEdit(a, indeks) {
    if (achievmentSaveBoolean[a] == true) {
      AchievmentEdit(a + 1, indeks);
    } else {
      achievmentSave[a].src = achievmentDropdown[indeks].src;
      achievmentSaveBoolean[a] = true;
      if (a == 3) {
        achievmentSaveBoolean = ["false", "false", "false", "false"];
      }
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
});
cancelBtn.addEventListener("click", () => {
  body.classList.toggle("show-edit");
});
saveBtn.addEventListener("click", () => {
  body.classList.toggle("show-edit");
  imgProfile.src = imageEditPreview.src;
  nameProfile.innerHTML = nameEdit.value;
  bioProfile.innerHTML = bioEdit.value;
  for(var i=0; i<4; i++){
    achievmentProfile[i].src = achievmentSave[i].src;
  }
});
