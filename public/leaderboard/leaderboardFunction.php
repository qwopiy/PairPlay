<?php

require "../../Signup and Login/verify/functions.php";

$level = isset($_GET['level']) ? $_GET['level'] : 1;  
$type = isset($_GET['type']) ? $_GET['type'] : 'time';

function displayLeaderboard($level, $type)
{
    $column = ($type === 'time') ? 'least_time' : 'least_death';
    $query = "SELECT p.username, l.$column
              FROM leaderboard l
              JOIN pemain p ON p.id = l.id_pemain
              WHERE l.id_level = $level
              ORDER BY l.$column ASC
              LIMIT 10";
    $row = database_run($query);
    return $row;
}
?>