<?php
require_once '../../Signup and Login/verify/functions.php'; 

$id = $_SESSION['USER']->id;
$query = "DELETE FROM game WHERE id_pemain = $id";
$row = database_run($query);
$query = "DELETE FROM pemain WHERE id = $id";
$row = database_run($query);
session_destroy();

header("Location: ../../index.php");
exit();
?>