<?php
require_once '../../Signup and Login/config_session.inc.php';
require_once '../../Signup and Login/dbh.inc.php';
require_once 'signup_contr.inc.php';
require_once 'signup_view.inc.php'; 

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        $pdo = Dbh::connect();
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $repeatPassword = $_POST['repeat_password'];

        $controller = new SignupContr($pdo, $username, $email, $password, $repeatPassword);
        $errors = $controller->signupUser(); 

        if (empty($errors)) { 
            header("Location: ../index.php");
            exit(); 
        } else { 
            $_SESSION['errors'] = $errors; 
        }

        header("Location: signup.php"); 
        exit(); 
    } catch (Exception $e) {
        error_log($e->getMessage());
        $_SESSION['errors'] = ['An unexpected error occurred. Please try again later.'];
        header("Location: signup.php");
        exit();
    }
} else { 
    header("Location: signup.php");  
    exit();
}