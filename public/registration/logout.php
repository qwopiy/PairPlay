<?php
require_once '../../Signup and Login/verify/functions.php'; 

session_destroy();

header("Location: ../../index.php");
exit();
?>