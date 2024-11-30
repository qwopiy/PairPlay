<?php
    require "functions.php";

    if(isset($_POST)){
        if(isset($_SESSION['USER']->id))
        {
            $id = $_SESSION['USER']->id;

            $data = file_get_contents("php://input");
            $data = json_decode($data, true);

            $level = $data['level'];
            $death = $data['death'];
            $easter_egg = $data['easter_egg'];
            $check = database_run("INSERT INTO game(id_pemain, id_level, death, easter_egg) VALUES ($id, $level, $death, $easter_egg);");
        }
        echo $data['death'];
    }
?>