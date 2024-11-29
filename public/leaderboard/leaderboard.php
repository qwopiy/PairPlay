<?php 
require "../../Signup and Login/verify/functions.php";
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
                    <?php for ($level = 1; $level <= 4; $level++): ?>
                    <div class="tab-pane fade <?php echo $level === 1 ? 'show active' : ''; ?>" id="level<?php echo $level; ?>" role="tabpanel" aria-labelledby="level<?php echo $level; ?>-tab">
                        <h5>Leaderboard for Level <?php echo $level; ?> (Sorted by Least Time)</h5>
                        <?php
                        $results = displayLeaderboard($level, 'time');
                        foreach ($results as $row) {
                            echo "Username: " . htmlspecialchars($row['username']) . " | Time: " . htmlspecialchars($row['least_time']) . "<br>";
                        }
                        ?>
                    </div>
                    <?php endfor; ?>
                </div>
                    </div>
                    <div class="tab-pane fade " id="pills-death" role="tabpanel" aria-labelledby="pills-death-tab">
                    <ul class="nav nav-pills mb-3 justify-content-center" id="death-level-tab" role="tablist">
                        <?php for ($level = 1; $level <= 4; $level++): ?>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link btn btn-dark <?php echo $level === 1 ? 'active' : ''; ?>" id="death-level<?php echo $level; ?>-tab" data-bs-toggle="pill" data-bs-target="#death-level<?php echo $level; ?>" type="button" role="tab" aria-controls="death-level<?php echo $level; ?>" aria-selected="<?php echo $level === 1 ? 'true' : 'false'; ?>">Level <?php echo $level; ?></button>
                        </li>
                        <?php endfor; ?>
                    </ul>
                <div class="tab-content" id="death-level-tabContent">
                    <?php for ($level = 1; $level <= 4; $level++): ?>
                    <div class="tab-pane fade <?php echo $level === 1 ? 'show active' : ''; ?>" id="death-level<?php echo $level; ?>" role="tabpanel" aria-labelledby="death-level<?php echo $level; ?>-tab">
                        <h5>Leaderboard for Level <?php echo $level; ?> (Sorted by Least Deaths)</h5>
                        <?php
                        $results = displayLeaderboard($level, 'death');
                        foreach ($results as $row) {
                            echo "Username: " . htmlspecialchars($row['username']) . " | Deaths: " . htmlspecialchars($row['least_death']) . "<br>";
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