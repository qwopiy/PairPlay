<?php
  require "../../Signup and Login/verify/functions.php";
  
  if(check_login(false)){
    

    $pemain["username"] = $_SESSION['USER']->username;
    $pemain["bio"] = $_SESSION['USER']->bio;
    $pemain["photo"] = $_SESSION['USER']->photo;
  }
?>



<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
    <link href="profile.css" rel="stylesheet" />
    <title>Document</title>
  </head>
  <body id="profile">

    <div class="container all p-md-3">
      <div class="row justify-content-between pt-md-2">
        <div class="col-md-4">
          <a class="Back" href="index.html">
            <i class="bi bi-arrow-left fs-2 text-light ms-4"></i>
          </a>
        </div>
        <div class="col-md-4 text-end me-3 mt-2">
          <button id="edit-profile-btn" type="button" class="btn btn-outline-light">Edit profile</button>
        </div>
      </div>
      <section class="jumbotron text-center">
        <img src=" <?= $pemain["photo"]; ?>" id="img-profile" alt="profil" class="rounded-circle pt-2" width="250" height="250" />
        <h1 id="name-profile" class="display-4"> <?= $pemain["username"]; ?> </h1>
        <div>
          <p id="bio-profile" class="lead"> <?= $pemain["bio"];  ?> </p>
        </div>
      </section>

      <section id="death-achievment" class="">
        <div class="row justify-content-evenly mb-3">
          <div class="col-md-4 text-center">
            <img src="../../assets/Frontpage/Death.png" alt="profil" class="" width="150" />
            <p class="mb-1 fs-3">Total Death</p>
            <p class="fs-4"> <?= $pemain[0]["deathCount"]; ?> </p>
          </div>
          <div class="col-md-4 text-center">
            <img src="../../assets/Frontpage/achievement.png" alt="profil" class="" width="150" />
            <p class="mb-1 fs-3">Achievement</p>
            <p class="fs-4"> <?= $pemain[0]["achievementCount"]; ?> </p>
          </div>
        </div>
      </section>

      <section class="container achievment mb-3 p-md-3">
        <div class="ms-md-3 mb-md-2 p-md-2">
          <h2 class="fs-md-2">Achievement</h2>
        </div>
        <div class="container">
          <div class="row text-center">
            <div class="col-md-3">
              <img src="<?= $pemain[0]["achievementProfile"][0]?>" id="achievment-profile1" alt="profil" class="m-sm-2" width="200" />
            </div>
            <div class="col-md-3">
              <img src="<?= $pemain[0]["achievementProfile"][1]?>" id="achievment-profile2" alt="profil" class="m-sm-2" width="200" />
            </div>
            <div class="col-md-3">
              <img src="<?= $pemain[0]["achievementProfile"][2]?>" id="achievment-profile3" alt="profil" class="m-sm-2" width="200" />
            </div>
            <div class="col-md-3">
              <img src="<?= $pemain[0]["achievementProfile"][3]?>" id="achievment-profile4" alt="profil" class="m-sm-2" width="200" />
            </div>
          </div>
        </div>
      </section>

      <section class="container achievment mb-3 p-md-3">
        <div class="ms-md-3 mb-md-2 p-md-2">
          <h2 class="fs-md-2">Progress</h2>
        </div>
        <div class="container">
          <div class="row text-center">
            <div class="col-md-3">
              <img id="progress1" src="../../assets/Frontpage/Progress1.png" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
            </div>
            <div class="col-md-3">
              <img id="progress2" src="../../assets/Frontpage/Progress2.png" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
            </div>
            <div class="col-md-3">
              <img id="progress3" src="../../assets/Frontpage/Progress3.png" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
            </div>
            <div class="col-md-3">
              <img id="progress4" src="../../assets/Frontpage/Progress4.png" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <script src="profile.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>
