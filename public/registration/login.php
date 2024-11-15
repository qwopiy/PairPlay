<?php
require_once '../../Signup and Login/config_session.inc.php';  // Include session config first
require_once 'login_view.inc.php';

if (isset($_SESSION['errors'])) {
    LoginView::displayError($_SESSION['errors']);
    unset($_SESSION['errors']); 
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
      <link rel="stylesheet" href="email.css">
      <title>Login</title>
</head>
<body>
      <div class="email-container">
            <form method="POST" action="login.inc.php">
                    <a href="../index.php">
                          <i class="bi bi-arrow-left fs-3 text-dark"></i>
                    </a>
                    <div class="mb-3">
                          <label for="username" class="form-label">Username</label>
                          <input type="text" class="form-control" id="username" name="username"placeholder="ayam">
                          <div id="emailHelp" class="form-text"></div>
                    </div>
                    <div class="password-container mb-3" >
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" id="password" name="password" placeholder="Enter Your Password">
                          <button type="button" id="show-password">
                                <img src="assets/FrontPage/eye_open.svg"  alt="show icon">
                          </button>
                    </div>
                    <div type="button" class="text-end">
                          <button type="submit" name="login" class="btn btn-primary btn-sm">Submit</button>
                    </div>
                    <p>Don't have an account? create an account <a href="signup.php">here</a></p>
            </form>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
      <!-- <script src="email.js"></script> -->
      <script>
            document.getElementById('show-password').addEventListener('click', function (e) {
                  e.preventDefault();
                  var passwordField = document.getElementById('password');
                  if (passwordField.type === 'password') {
                         passwordField.type = 'text';
                  } else {
                         passwordField.type = 'password';
                  }
            });
      </script>
</body>
</html>
