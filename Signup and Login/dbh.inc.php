<?php
class Dbh {
    private static $host = "localhost";
    private static $dbuser = "postgres";
    private static $dbpass = "anantha06";
    private static $dbname = "pairplay";
    private static $pdo;

    public static function connect() {
        if (!isset(self::$pdo)) {
            try {
                $dsn = "pgsql:host=" . self::$host . ";dbname=" . self::$dbname;
                self::$pdo = new PDO($dsn, self::$dbuser, self::$dbpass);
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}
