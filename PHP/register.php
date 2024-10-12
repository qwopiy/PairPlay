<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="email.css">
    <title>email login</title>
</head>
<body>

<?php
require_once "config.php";

if (isset($_POST["submit"])) {
    $username = $_POST["username"] ?? '';
    $email = $_POST["email"] ?? '';
    $password = $_POST["password"] ?? '';
    $passwordRepeat = $_POST["repeat_password"] ?? '';
    
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $errors = array();
    
    if (empty($username) OR empty($email) OR empty($password) OR empty($passwordRepeat)) {
        array_push($errors,"All fields are required");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        array_push($errors, "Email is not valid");
    }
    if (strlen($password)<8) {
        array_push($errors,"Password must be at least 8 characters long");
    }
    if ($password !== $passwordRepeat) {
        array_push($errors,"Password does not match");
    }

    $sql = "SELECT * FROM pemain WHERE email = $1";
    $result = pg_query_params($conn, $sql, array($email));
    if ($result === false) {
        array_push($errors, "Database query failed: " . pg_last_error($conn));
    } else {
        $rowCount = pg_num_rows($result);
        if ($rowCount > 0) {
            array_push($errors,"Email already exists!");
        }
    }

    if (count($errors) > 0) {
        foreach ($errors as $error) {
            echo "<div class='alert alert-danger'>$error</div>";
        }
    } else {
        $sql = "INSERT INTO pemain (username, email, password) VALUES ($1, $2, $3)";
        $result = pg_query_params($conn, $sql, array($username, $email, $passwordHash));
        if ($result) {
            echo "<div class='alert alert-success'>You are registered successfully.</div>";
        } else {
            die("Something went wrong: " . pg_last_error($conn));
        }
    }
}
?>

    <div class="email-container">
        <form action="register.php" method="post">
            <a href="email.html">
                <i class="bi bi-arrow-left fs-3 text-dark"></i>
            </a>
            <div class="mb-3">
                <label for="InputUsername" class="form-label">Username</label>
                <input type="text" class="form-control" id="InputUsername" name="username" placeholder="Enter Your Username" required>
            </div>
            <div class="mb-3">
                <label for="InputEmail" class="form-label">Email address</label>
                <input type="email" class="form-control" id="InputEmail" name="email" aria-describedby="emailHelp" placeholder="xxx.@gmail.com" required>
                <div id="emailHelp" class="form-text"></div>
            </div>
            <div class="password-container mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" placeholder="Enter Your Password" required>
                <button id="show-password" type="button">
                    <img src="/assets/FrontPage/eye_open.svg" alt="show icon">
                </button>
            </div>
            <div class="password-container mb-3">
                <label for="password-check" class="form-label">Password Check</label>
                <input type="password" class="form-control" id="password-check" name="repeat_password" placeholder="Enter Your Password Again" required>
                <button id="show-password-check" type="button">
                    <img src="/assets/FrontPage/eye_open.svg" alt="show icon">
                </button>
            </div>
            <div class="text-end">
                <button type="submit" name="submit" id="btn_submit" class="btn btn-primary btn-sm">Submit</button>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="email.js"></script>
</body>
</html>
