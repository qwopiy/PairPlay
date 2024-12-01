<?php require "leaderboardFunction.php"; ?>

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
        <!-- Tabs for Time and Death -->
        <ul class="nav nav-pills mb-4 justify-content-center" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link <?php echo $type === 'time' ? 'active' : ''; ?> btn btn-dark" id="pills-time-tab" data-bs-toggle="pill" data-bs-target="#pills-time" type="button" role="tab" aria-controls="pills-time" aria-selected="true">Time</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link <?php echo $type === 'death' ? 'active' : ''; ?> btn btn-dark" id="pills-death-tab" data-bs-toggle="pill" data-bs-target="#pills-death" type="button" role="tab" aria-controls="pills-death" aria-selected="false">Death</button>
            </li>
        </ul>

        <div class="tab-content" id="pills-tabContent">
            <!-- Time Tab -->
            <div class="tab-pane fade <?php echo $type === 'time' ? 'show active' : ''; ?>" id="pills-time" role="tabpanel" aria-labelledby="pills-time-tab">
                <ul class="nav nav-pills mb-3 justify-content-center" id="time-level-tab" role="tablist">
                    <?php for ($i = 1; $i <= 6; $i++): ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark <?php echo $i === $level ? 'active' : ''; ?>" id="level<?php echo $i; ?>-tab" data-bs-toggle="pill" data-bs-target="#level<?php echo $i; ?>" type="button" role="tab" aria-controls="level<?php echo $i; ?>" aria-selected="<?php echo $i === $level ? 'true' : 'false'; ?>">Level <?php echo $i; ?></button>
                    </li>
                    <?php endfor; ?>
                </ul>
                <div class="tab-content" id="time-level-tabContent">
                    <?php for ($i = 1; $i <= 6; $i++): ?>
                        <div class="tab-pane fade <?php echo $i === $level ? 'show active' : ''; ?>" id="level<?php echo $i; ?>" role="tabpanel" aria-labelledby="level<?php echo $i; ?>-tab">
                            <h5>Leaderboard for Level <?php echo $i; ?> (Sorted by Least Time)</h5>
                            <?php
                            $results = displayLeaderboard( $i, 'time');
                            ?>
                            <?php if ($results) : ?>
                                <div>
                                    <?php foreach ($results as $row) : ?>
                                        <div class="result-content d-flex flex-row justify-content-center align-items-center leaderboard-container">
                                            <div class="username">
                                                <a href="../profilePage/profileGuest.php?username=<?= $row->username ?>" class="username-link">
                                                    <?= $row->username ?>
                                                </a>
                                            </div>
                                            <div class="record ms-3">
                                                <?= $type === 'time' ? $row->least_time : $row->least_death ?>
                                            </div>
                                        </div>
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
                    <?php for ($i = 1; $i <= 6; $i++): ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark <?php echo $i === $level ? 'active' : ''; ?>" id="death-level<?php echo $i; ?>-tab" data-bs-toggle="pill" data-bs-target="#death-level<?php echo $i; ?>" type="button" role="tab" aria-controls="death-level<?php echo $i; ?>" aria-selected="<?php echo $i === $level ? 'true' : 'false'; ?>">Level <?php echo $i; ?></button>
                    </li>
                    <?php endfor; ?>
                </ul>
                <div class="tab-content" id="death-level-tabContent">
                    <?php for ($i = 1; $i <= 6; $i++): ?>
                    <div class="tab-pane fade <?php echo $i === $level ? 'show active' : ''; ?>" id="death-level<?php echo $i; ?>" role="tabpanel" aria-labelledby="death-level<?php echo $i; ?>-tab">
                        <h5>Leaderboard for Level <?php echo $i; ?> (Sorted by Least Deaths)</h5>
                        <?php
                        $results = displayLeaderboard($i, 'death');
                        ?>
                        <?php if ($results) : ?>
                                <div>
                                    <?php foreach ($results as $row) : ?>
                                        <div class="result-content d-flex flex-row justify-content-center align-items-center leaderboard-container">
                                            <div class="username">
                                                <a href="../profilePage/profileGuest.php?username=<?= $row->username ?>" class="username-link">
                                                    <?= $row->username ?>
                                                </a>
                                            </div>
                                            <div class="record ms-3">
                                                <?= $type === 'time' ? $row->least_death : $row->least_time ?>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                    </div>
                                <?php else: ?>
                                    <?= "No data available."; ?>
                            <?php endif;?>
                        </div>
                    <?php endfor; ?>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>