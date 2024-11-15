<?php
class SessionConfig {
    public static function configure() {
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            ini_set('session.cookie_secure', 1); 
        }

        ini_set('session.cookie_httponly', 1); 

        ini_set('session.use_strict_mode', 1);

        ini_set('session.use_only_cookies', 1);

        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache'); 

        $cookieParams = [
            'lifetime' => 1800, 
            'domain' => '',      
            'path' => '/',      
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on', 
            'httponly' => true  
        ];
        session_set_cookie_params($cookieParams);

        session_start();

        if (!isset($_SESSION['last_regenerated']) || time() - $_SESSION['last_regenerated'] > 60 * 15) { 
            session_regenerate_id(true);
            $_SESSION['last_regenerated'] = time();
        }
    }
}

SessionConfig::configure();