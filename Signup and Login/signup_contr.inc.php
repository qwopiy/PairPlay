<?php
require_once 'signup_model.inc.php';

class SignupContr {
    private $model;
    private $username;
    private $email;
    private $password;
    private $repeatPassword;

    public function __construct($pdo, $username, $email, $password, $repeatPassword) {
        $this->model = new SignupModel($pdo);
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->repeatPassword = $repeatPassword;
    }

    public function signupUser() {
        $errors = []; 

        if ($this->isInputEmpty()) {
            $errors[] = "Input cannot be empty."; 
        }
        if (!$this->isEmailValid()) {
            $errors[] = "Invalid email format.";
        }
        if ($this->model->isUsernameTaken($this->username)) {
            $errors[] = "Username is already taken.";
        }
        if ($this->model->isEmailRegistered($this->email)) {
            $errors[] = "Email is already registered.";
        }
        if ($this->password !== $this->repeatPassword) {
            $errors[] = "Passwords do not match.";
        }
        
        if (empty($errors)) {
            $this->model->registerUser($this->username, $this->email, $this->password);
        } 

        return $errors;
    }

    private function isInputEmpty() {
        return empty($this->username) || empty($this->email) || empty($this->password) || empty($this->repeatPassword);
    }

    private function isEmailValid() {
        return filter_var($this->email, FILTER_VALIDATE_EMAIL);
    }
}
