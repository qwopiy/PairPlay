<?php
require_once '../../Signup and Login/config_session.inc.php'; 
require_once '../../Signup and Login/dbh.inc.php';
require_once 'login_contr.inc.php';
require_once 'login_view.inc.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        $pdo = Dbh::connect();
        $username = $_POST['username'];
        $password = $_POST['password'];

        $controller = new LoginContr($pdo, $username, $password);
        $errors = $controller->loginUser();

        if (empty($errors)) {
            session_id($_SESSION['user_id']);
            header("Location: ../index.php"); 
            exit();
        } else {
            $_SESSION['errors'] = $errors;
            header("Location: login.php"); 
            exit();
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        $_SESSION['errors'] = ['An unexpected error occurred. Please try again later.'];
        header("Location: login.php");
        exit();
    }
} else {
    header("Location: login.php"); 
    exit();
}