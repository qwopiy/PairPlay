<?php
    require "functions.php";

    if(isset($_POST)){
        $id = $_SESSION['USER']->id;

        $data = file_get_contents("php://input");
        $data = json_decode($data, true);
        // foreach ($data as &$value) {
        //     $value = str_replace('http://localhost/PairPlay/','', $value);
        // }
        // unset($value);
        // $data = json_encode($data, true);

        $death = $data['death'];
        $check = database_run("update pemain SET progress = $death WHERE id = 5");
        echo $data['death'];
    }
?>