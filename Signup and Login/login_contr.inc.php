<?php
require_once 'login_model.inc.php';

class LoginContr {
    private $model;
    private $username;
    private $password;

    public function __construct($pdo, $username, $password) {
        $this->model = new LoginModel($pdo);
        $this->username = $username;
        $this->password = $password;
    }

    public function loginUser() {
        $errors = [];

        if ($this->isInputEmpty()) {
            $errors[] = "Input cannot be empty.";
        }

        echo "\$errors after isInputEmpty: <pre>"; print_r($errors); echo "</pre>";

        if (empty($errors)) { 
            $user = $this->model->getUser($this->username);

            if ($user === false) {
                $errors[] = "Username is wrong.";
            } else if (!password_verify($this->password, $user['password'])) {
                $errors[] = "Password is wrong.";
            } else {
                $_SESSION['user_id'] = $user['id'];
                return []; 
            } 
        }

        return $errors; 
    }

    private function isInputEmpty() {
        return empty($this->username) || empty($this->password);
    }
}