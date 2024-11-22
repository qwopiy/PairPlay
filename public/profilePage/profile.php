<?php
  require "../../Signup and Login/verify/functions.php";
  check_login();
  death_count();
  achievement_count();

  $pemain= [
    [
      "nama" => "Muhammad Ariiq",
      "bio" => "ngetes doang",
      "photo" => "../../assets/FrontPage/images.png",
      "deathCount" => 100,
      "achievementCount" => 5,
      "achievementProfile" => [
                        "../../assets/Frontpage/transparent.png", 
                        "../../assets/Frontpage/transparent.png", 
                        "../../assets/Frontpage/transparent.png",
                        "../../assets/Frontpage/transparent.png",
                        "../../assets/Frontpage/transparent.png"
                      ],
      "achievement" => [true, true, true, true, true],
      "progress" => 4,
    ]
  ];

  $errors = array();

  if($_SERVER['REQUEST_METHOD'] == "POST")
  {

  	$errors = update($_POST);
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
    <title>profile</title>
  </head>
  <body id="profile">
    <div class="container edit-profile">
      <form method="post">
        <section class="jumbotron text-center">
          <img src="../../assets/FrontPage/images.png" id="profile-edit" alt="profil" class="rounded-circle border border-1 border-black" width="160" height="160" />
          <div class="mt-3">
            <label for="image-edit" type="button" class="btn form-label text-dark btn-outline-dark" style="background-color: #95adbe">Edit Photo</label>
            <input id="image-edit" class="form-control" type="file" accept="image/jpeg, image/png, image/jpg" />
          </div>
        </section>

        <div class="mb-2 ps-2 pe-2">
          <label for="name-edit" class="form-label heading text-dark">Name</label>
          <input id="name-edit" name="username" type="text" class="form-control" placeholder="Username" maxlength="20" aria-label="Username" aria-describedby="basic-addon1" />
          <?php if(count($errors) > 0):?>
				    <?php foreach ($errors as $error):?>
					    <?= $error?> <br>	
				    <?php endforeach;?>
			    <?php endif;?>
        </div>
        <div class="mb-1 ps-2 pe-2">
          <label for="bio-edit" class="form-label heading text-dark">Bio</label>
          <input id="bio-edit" name="bio" type="text" class="form-control" placeholder="Bio" maxlength="200" aria-label="bio" aria-describedby="basic-addon1" />
        </div>

        <div class="row justify-content-between ps-2 pe-2">
        <div class="col-md-4 mt-3 text-dark">
          <h6>Achievement</h6>
        </div>
        <div class="dropdown col-md-4 text-end">
          <button id="dropdown" class="btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #e0f0ea; border: 0px">
            <i class="bi bi-plus-square fs-4 text-dark"></i>
          </button>
          <div class="dropdown-menu" style="background-color: #95adbe">
            <div class="d-md-flex flex-row mb-sm-3">
              <div class="p-2 achievment-dropdown dropdown-item disabled" aria-disabled="true"><img id="achievment-dropdown1" src="../../assets/FrontPage/Death10.png" alt="profil" class="m-sm-2" width="100" style="filter: grayscale(100%);"/></div>
              <div class="p-2 achievment-dropdown dropdown-item disabled" aria-disabled="true"><img id="achievment-dropdown2" src="../../assets/FrontPage/death50.png" alt="profil" class="m-sm-2" width="100" style="filter: grayscale(100%);"/></div>
              <div class="p-2 achievment-dropdown dropdown-item disabled" aria-disabled="true"><img id="achievment-dropdown3" src="../../assets/FrontPage/death100.png" alt="profil" class="m-sm-2" width="100" style="filter: grayscale(100%);"/></div>
              <div class="p-2 achievment-dropdown dropdown-item disabled" aria-disabled="true"><img id="achievment-dropdown4" src="../../assets/FrontPage/end.png" alt="profil" class="m-sm-2" width="100" style="filter: grayscale(100%);"/></div>
            </div>
            <div class="d-md-flex flex-row mb-sm-3">
              <div class="p-2 achievment-dropdown dropdown-item disabled" aria-disabled="true"><img id="achievment-dropdown5" src="../../assets/FrontPage/easteregg.png" alt="profil" class="m-sm-2" width="100" style="filter: grayscale(100%);"/></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container rounded edit_achievment mb-2 ps-2 pe-2" style="width: 97%">
        <div class="row text-center">
          <div class="col-md-3">
            <img src="../../assets/FrontPage/transparent.png" id="achievment-edit1" alt="profil" class="m-sm-2" width="100" />
          </div>
          <div class="col-md-3">
            <img src="../../assets/FrontPage/transparent.png" id="achievment-edit2" alt="profil" class="m-sm-2" width="100" />
          </div>
          <div class="col-md-3">
            <img src="../../assets/FrontPage/transparent.png" id="achievment-edit3" alt="profil" class="m-sm-2" width="100" />
          </div>
          <div class="col-md-3">
            <img src="../../assets/FrontPage/transparent.png" id="achievment-edit4" alt="profil" class="m-sm-2" width="100" />
          </div>
        </div>
      </div>

      <div class="container d-flex justify-content-end mt-4 mb-2 ps-2 pe-2">
        <button type="button" id="btn-cancel" class="btn btn-outline-dark me-2" style="background-color: #95adbe">Cancel</button>
        <button type="submit" id="btn-save" class="btn btn-outline-dark" style="background-color: #95adbe">Save</button>
      </div>

      </form>
    </div>

    <div class="dark-background"></div>

    <div class="container all p-md-3">
      <div class="row justify-content-between pt-md-2">
        <div class="col-md-4">
          <a class="Back" href="../index.html">
            <i class="bi bi-arrow-left fs-2 text-light ms-4"></i>
          </a>
        </div>
        <div class="col-md-4 text-end me-3 mt-2">
          <button id="edit-profile-btn" type="button" class="btn btn-outline-light">Edit profile</button>
        </div>
      </div>
      <section class="jumbotron text-center">
        <img src="../../<?= $_SESSION['USER']->photo; ?>" id="img-profile" alt="profil" class="rounded-circle pt-2" width="250" height="250" />
        <h1 id="name-profile" class="display-4"> <?= $_SESSION['USER']->username; ?> </h1>
        <div>
          <p id="bio-profile" class="lead"> <?= $_SESSION['USER']->bio;  ?> </p>
        </div>
      </section>

      <section id="death-achievment" class="">
        <div class="row justify-content-evenly mb-3">
          <div class="col-md-4 text-center">
            <img src="../../assets/Frontpage/Death.png" alt="profil" class="" width="150" />
            <p class="mb-1 fs-3">Total Death</p>
            <p class="fs-4"> <?= isset($_SESSION['DEATH']->sum) ? $_SESSION['DEATH']->sum : 0; ?> </p>
          </div>
          <div class="col-md-4 text-center">
            <img src="../../assets/Frontpage/achievement.png" alt="profil" class="" width="150" />
            <p class="mb-1 fs-3">Achievement</p>
            <p class="fs-4"> <?= $_SESSION['ACHIEVEMENT_COUNT']; ?> </p>
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
            <?php for($i = 1; $i<=4; $i++): ?>
              <div class="col-md-3">
                <?php if($_SESSION['USER']->progress >= $i):?>
                  <img id="<?= "progress" . $i ?>" src="<?= "../../assets/Frontpage/Progress".$i.".png"?>" alt="profil" class="m-sm-2 rounded" width="200" style="border: 5px solid #00ff08" />
                <?php else: ?>
                  <img id="<?= "progress" . $i ?>" src="<?= "../../assets/Frontpage/Progress".$i.".png"?>" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
                <?php endif; ?>
              </div>
            <?php endfor; ?>
          </div>
        </div>
      </section>
    </div>

    <script src="profile.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>
