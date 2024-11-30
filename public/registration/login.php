<?php
require '../../Signup and Login/verify/functions.php';

$errors = array();

if($_SERVER['REQUEST_METHOD'] =="POST")
{

	$errors = login($_POST);

	if(count($errors) == 0)
	{
		header("Location: ../../index.php");
		die;
	}
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
      <link rel="stylesheet" href="login.css">
      <title>Login</title>
</head>
<body>

      <div class="email-container">
            
            
            <form method="POST">
                  <a href="../../index.php">
                        <i class="bi bi-arrow-left fs-3 text-dark"></i>
                  </a>
                  <div class="mb-3">
                        <label for="Email Address" class="form-label">Email</label>
                        <input type="email" class="form-control" id="username" name="email"placeholder="Enter Your Username">
                        <div id="emailHelp" class="form-text"></div>
                  </div>
                  <div class="password-container mb-3" >
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" placeholder="Enter Your Password">
                        <button type="button" id="show-password">
                              <img src="../../assets/FrontPage/eye_open.svg"  alt="show icon">
                        </button>
                  </div>
                  <?php if(count($errors) > 0):?>
                              <?php foreach ($errors as $error):?>
                                    <?= $error?> <br>	
                              <?php endforeach;?>
                        <?php endif;?>
                  <div type="button" class="text-end">
                        <button type="submit" name="submit" class="btn btn btn-sm">Submit</button>
                  </div>
                    <p>Don't have an account? create an account <a href="signup.php">here</a></p>
            </form>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
      <script src="login.js"></script>
</body>
</html>