<?php 
require "../../Signup and Login/verify/functions.php";

//buat tampilin leaderboardnya
$level = isset($_GET['level']) ? $_GET['level'] : 1;  
$type = isset($_GET['type']) ? $_GET['type'] : 'time';

function displayLeaderboard($level, $type)
{
    $column = ($type === 'time') ? 'least_time' : 'least_death';
    $query = "SELECT p.username, l.$column
              FROM leaderboard l
              JOIN pemain p ON p.id = l.id_pemain
              WHERE l.id_level = $level
              ORDER BY l.$column ASC";
    $row = database_run($query);
    
    if (is_array($row)) {
        return $row;
    }
    
}


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="leaderboard.css">
</head>
<body>
    <div class="container mt-4">
        <ul class="nav nav-pills mb-4 justify-content-center" id ="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active btn btn-dark" id="pills-time-tab" data-bs-toggle="pill" data-bs-target="#pills-time" type="button" role="tab" aria-controls="pills-time" aria-selected="true">Time</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link btn btn-dark" id="pills-death-tab" data-bs-toggle="pill" data-bs-target="#pills-death" type="button" role="tab" aria-controls="pills-death" aria-selected="false">Death</button>
            </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-time" role="tabpanel" aria-labelledby="pills-time-tab">
                <ul class="nav nav-pills mb-3 justify-content-center" id="time-level-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active btn btn-dark" id="level1-tab" data-bs-toggle="pill" data-bs-target="#level1" type="button" role="tab" aria-controls="level1" aria-selected="true">Level 1</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark" id="level2-tab" data-bs-toggle="pill" data-bs-target="#level2" type="button" role="tab" aria-controls="level2" aria-selected="false">Level 2</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark" id="level3-tab" data-bs-toggle="pill" data-bs-target="#level3" type="button" role="tab" aria-controls="level3" aria-selected="false">Level 3</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark" id="level4-tab" data-bs-toggle="pill" data-bs-target="#level4" type="button" role="tab" aria-controls="level4" aria-selected="false">Level 4</button>
                    </li>
                </ul>
                <div class="tab-content" id="time-level-tabContent">
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                        <div class="tab-pane fade <?php echo $i === $level ? 'show active' : ''; ?>" id="level<?php echo $i; ?>" role="tabpanel" aria-labelledby="level<?php echo $i; ?>-tab">
                            <h5>Leaderboard for Level <?php echo $i; ?> (Sorted by Least Time)</h5>
                            <?php $results = displayLeaderboard( $i, 'time'); ?>
                            <?php if ($results) : ?>
                                <div>
                                    <?php foreach ($results as $row) : ?>
                                        <a href="../profilePage/profileGuest.php?username=<?= $row->username ?>" >
                                            <div class="result-content d-flex flex-row">
                                                <div class="ms-2">
                                                    <?= $row->username ?>
                                                </div>
                                                <div class="ms-2">
                                                    <?= $row->least_time?>
                                                </div>
                                            </div>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            <?php else: ?>
                                <?= "No data available."; ?>
                            <?php endif;?>
                        </div>
                    <?php endfor; ?>
                </div>
            </div>

            <!-- Death Tab -->
            <div class="tab-pane fade <?php echo $type === 'death' ? 'show active' : ''; ?>" id="pills-death" role="tabpanel" aria-labelledby="pills-death-tab">
                <ul class="nav nav-pills mb-3 justify-content-center" id="death-level-tab" role="tablist">
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark <?php echo $i === $level ? 'active' : ''; ?>" id="death-level<?php echo $i; ?>-tab" data-bs-toggle="pill" data-bs-target="#death-level<?php echo $i; ?>" type="button" role="tab" aria-controls="death-level<?php echo $i; ?>" aria-selected="<?php echo $i === $level ? 'true' : 'false'; ?>">Level <?php echo $i; ?></button>
                    </li>
                    <?php endfor; ?>
                </ul>
                <div class="tab-content" id="death-level-tabContent">
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                        <div class="tab-pane fade <?php echo $i === $level ? 'show active' : ''; ?>" id="death-level<?php echo $i; ?>" role="tabpanel" aria-labelledby="death-level<?php echo $i; ?>-tab">
                            <h5>Leaderboard for Level <?php echo $i; ?> (Sorted by Least Deaths)</h5>
                            <?php
                            $results = displayLeaderboard($i, 'death');
                            if ($results) {
                                foreach ($results as $row) {
                                    // var_dump($row);
                                    echo "Username: " . htmlspecialchars($row->username) . " | Deaths: " . htmlspecialchars($row->least_death) . "<br>";
                                }
                            } else {
                                echo "No data available.";
                            }
                            ?>
                        </div>
                    <?php endfor; ?>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
</body>
</html>