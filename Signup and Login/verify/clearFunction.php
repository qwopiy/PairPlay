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
            $time = $data['time'];
            $easter_egg = $data['easter_egg'];
            $check = database_run("INSERT INTO game(id_pemain, id_level, death, time_spent, easter_egg) VALUES ($id, $level, $death, ($time || ' seconds')::INTERVAL::TIME, $easter_egg);");
            $liderbord = database_run("INSERT INTO leaderboard (id_pemain, id_level, least_death, least_time)
                                        SELECT id_pemain, id_level, MIN(death) AS least_death, MIN(time_spent) AS least_time
                                        FROM game
                                        GROUP BY id_pemain, id_level
                                        ON CONFLICT (id_pemain, id_level) 
                                        DO UPDATE SET 
                                            least_death = LEAST(EXCLUDED.least_death, leaderboard.least_death), 
                                            least_time = LEAST(EXCLUDED.least_time, leaderboard.least_time);");
        }
        echo $data['death'];
    }
?>