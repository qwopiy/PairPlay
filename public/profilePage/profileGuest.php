<?php
  require "../../Signup and Login/verify/functions.php";

  if (isset($_GET["username"])){
    $username = htmlspecialchars($_GET["username"]);
    $query = "select * from pemain where username = '$username'";
    $row = database_run($query);

    if(is_array($row)){
      $row = $row[0];
      $_SESSION['GUEST'] = $row;

      death_count($_SESSION['GUEST']->id);
      progress($_SESSION['GUEST']->id);
      achievement_count($_SESSION['GUEST']->id);

      $achievement = json_decode($_SESSION['GUEST']->achievement);
    }else{
      header("Location: ../../index.php");
    }
  }else{
    header("Location: ../../index.php");
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
    <div class="container all p-md-3">
      <div class="row justify-content-between pt-md-2">
        <div class="col-md-4">
          <a class="Back" href="../../index.php">
            <i class="bi bi-arrow-left fs-2 text-light ms-4"></i>
          </a>
        </div>
      </div>
      <section class="jumbotron text-center">
        <img src="../../<?= $_SESSION['GUEST']->photo; ?>" id="img-profile" alt="profil" class="rounded-circle pt-2" width="250" height="250" />
        <h1 id="name-profile" class="display-4"><?= $_SESSION['GUEST']->username; ?></h1>
        <div>
          <p id="bio-profile" class="lead"><?= $_SESSION['GUEST']->bio;  ?></p>
        </div>
      </section>

      <section id="death-achievment" class="">
        <div class="row justify-content-evenly mb-3">
          <div class="col-md-4 text-center">
            <img src="../../assets/Frontpage/Death.png" alt="profil" class="" width="150" />
            <p class="mb-1 fs-3">Total Death</p>
            <p class="fs-4"> <?= isset($_SESSION['DEATH']->death) ? $_SESSION['DEATH']->death : 0; ?> </p>
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
            <?php for($i = 1; $i<=4; $i++): ?>
              <div class="col-md-3">
                <img src="../../<?=$achievement[$i];?>" id="<?='achievment-profile'.$i?>" alt="profil" class="m-sm-2" width="200" />
              </div>
            <?php endfor; ?>
          </div>
        </div>
      </section>

      <section class="container achievment mb-3 p-md-3">
        <div class="ms-md-3 mb-md-2 p-md-2">
          <h2 class="fs-md-2">Progress</h2>
        </div>
        <div class="container">
          <div class="row text-center">
            <?php for($i = 1; $i<=6; $i++): ?>
              <div class="col-md-3">
                <?php if(sizeof($_SESSION['progress']) >= $i):?>
                  <img id="<?= "progress" . $i ?>" src="<?= "../../assets/Frontpage/Progress".$i.".png"?>" alt="profil" class="m-sm-2 rounded" width="200" style="border: 5px solid #00ff08" />
                <?php else: ?>
                  <img id="<?= "progress" . $i ?>" src="<?= "../../assets/Frontpage/Progress".$i.".png"?>" alt="profil" class="m-sm-2 rounded" width="200" style="filter: grayscale(100%); opacity: 60%; border: 0px solid #00ff08" />
                <?php endif; ?>
                <div class="d-flex flex-row mb-3 justify-content-evenly">
                  <div>
                    <img src="../../assets/Frontpage/Death.png" alt="profil" class="" width="50" />
                    <p class="fs-4"><?= isset($_SESSION['progress'][$i-1]->death) ? $_SESSION['progress'][$i-1]->death : 0?></p>
                  </div>
                  <div>
                    <?php
                      if(isset($_SESSION['progress'][$i-1]->win_time)){
                        $arr = $_SESSION['progress'][$i-1]->win_time;
                        $arr = explode(':', $arr);
                        if($arr[0]='00'){
                          $time = $arr[1]. ':'. $arr[2];
                        }else{
                          $time = implode(':', $arr);
                        }
                      }
                    ?>
                    <img src="../../assets/Frontpage/Death.png" alt="profil" class="" width="50" />
                    <p class="fs-4"><?= isset($_SESSION['progress'][$i-1]->win_time) ? $time : '00:00'?></p>
                  </div>
                </div>
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
