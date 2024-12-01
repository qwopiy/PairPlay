<?php
require '../../Signup and Login/verify/functions.php';

$errors = array();

if($_SERVER['REQUEST_METHOD'] == "POST")
{

	$errors = signup($_POST);
	if(count($errors) == 0)
	{
		header("Location: login.php");
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
      <title>Registration</title>
</head>
<body>

<div class="email-container">
        
      <form method="post">
              <a>
                      <a href="login.php">
                              <i class="bi bi-arrow-left fs-3 text-dark"></i>
                        </a>
                        <div class="mb-3">
                                <label for="Inputusername" class="form-label">Username</label>
                                <input type="text" name="username" class="form-control" placeholder="Enter Your Username" maxlength="20">
                        </div>
                        <div class="mb-3">
                                <label for="InputEmail" class="form-label">Email address</label>
                                <input type="email" name="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="xxx.@gmail.com">
                                <div id="emailHelp" class="form-text"></div>
                        </div>
                        <div class="password-container mb-3">
                                <label for="password" class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" id="password" placeholder="Enter Your Password">
                    <button id="show-password">
                            <img src="../../assets/FrontPage/eye_open.svg" alt="show icon">
                    </button>
                </div>
            <div class="password-container mb-3">
                    <label for="password-check" class="form-label">Password Check</label>
                    <input type="password" name="password2" class="form-control" id="password-check" placeholder="Enter Your Password">
                    <button id="show-password-check">
                            <img src="../../assets/FrontPage/eye_open.svg" alt="show icon">
                         </button>
                        </div>
                        <?php if(count($errors) > 0):?>
                                <?php foreach ($errors as $error):?>
                                        <?= $error?> <br>	
                                <?php endforeach;?>
                        <?php endif;?>
                <div type="button" class="text-end">
                        <button type="submit" name="submit" id="btn_submit" class="btn btn btn-sm">Submit</button>
                </div>
        </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="signup.js"></script>
</body>
</html>
