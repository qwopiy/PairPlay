<?php
class LoginView {
    public static function displayError($errorMessages = []) {
        if (!empty($errorMessages)) {
            echo '<div class="alert alert-danger" role="alert">';
            echo '<ul>';
            foreach ($errorMessages as $errorMessage) {
                echo '<p>' . htmlspecialchars($errorMessage) . '</p>';
            }
            echo '</ul>';
            echo '</div>';
        }
    }
}