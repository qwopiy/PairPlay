let nameEdit = document.getElementById("name-edit");
let bioEdit = document.getElementById("bio-edit");
let btnSave = document.getElementById("btn-save");
let imageEdit = document.getElementById("image-edit");
let profileEdit = document.getElementById("profile-edit");
let achievmentDropdown = [
  document.getElementById("achievment-dropdown1"),
  document.getElementById("achievment-dropdown2"),
  document.getElementById("achievment-dropdown3"),
  document.getElementById("achievment-dropdown4"),
  document.getElementById("achievment-dropdown5"),
];
let achievmentSaveBoolean = ["false", "false", "false", "false"];
let achievmentSave = [document.getElementById("achievment-edit1"), document.getElementById("achievment-edit2"), document.getElementById("achievment-edit3"), document.getElementById("achievment-edit4")];

imageEdit.onchange = function () {
  profileEdit.src = URL.createObjectURL(imageEdit.files[0]);
};

function AchievmentEdit(a, indeks) {
    if(achievmentSaveBoolean[a]==true){
        AchievmentEdit(a+1, indeks);
    }else{
        achievmentSave[a].src=achievmentDropdown[indeks].src;
        achievmentSaveBoolean[a]=true;
        if(a==3){
            achievmentSaveBoolean = ["false", "false", "false", "false"];
        }
    }
};

achievmentDropdown[0].onclick = function() {AchievmentEdit(0, 0)};
achievmentDropdown[1].onclick = function() {AchievmentEdit(0, 1)};
achievmentDropdown[2].onclick = function() {AchievmentEdit(0, 2)};
achievmentDropdown[3].onclick = function() {AchievmentEdit(0, 3)};
achievmentDropdown[4].onclick = function() {AchievmentEdit(0, 4)};

