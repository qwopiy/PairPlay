<?php
    require '../../Signup and Login/verify/functions.php'; 
?>

<!DOCTYPE html>
<html lang="en">
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            canvas {
                display: block;
                margin: 0 auto;
                background-color: #000;
                border: 1px solid #000;
            }
        </style>
    </head>
    <body>
        <canvas id="game"></canvas>
        <script>
            let progress = <?php
            if(isset($_SESSION['USER'])) {
                $progress = database_run("SELECT progress FROM pemain WHERE id = {$_SESSION['USER']->id};");
                echo $progress[0]->progress;
            } else {
                echo 0;
            } ?>;
        </script>
        <script type="module" src="../js/singlePlayer.js"></script>
    </body> 
</html>