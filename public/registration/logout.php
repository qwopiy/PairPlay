<?php
require_once '../../Signup and Login/config_session.inc.php'; 

session_destroy();

header("Location: ../index.php");
exit();
?>