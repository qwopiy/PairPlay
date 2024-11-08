<?php
class SignupModel {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function registerUser($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO pemain (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);
    }

    public function isUsernameTaken($username) {
        $sql = "SELECT COUNT(*) FROM pemain WHERE username = :username";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':username' => $username]);
        return $stmt->fetchColumn() > 0;
    }

    public function isEmailRegistered($email) {
        $sql = "SELECT COUNT(*) FROM pemain WHERE email = :email";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetchColumn() > 0;
    }
}
