<?php
// $host = 'localhost'; 
// $dbname = 'Database_Pemain_PairPlay'; 
// $username = 'postgres';
// $password = '1Wak_Izul99';

// try {
//     $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
//     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// } catch (PDOException $e) {
//     die("Could not connect to the database: " . $e->getMessage());
// }

//ini buat ngeupdate leaderboard (ga terlalu dibutuhkan cuma ada aja lah)
// function updateLeaderboard($pdo, $id_pemain, $id_level, $death, $time_spent, $easter_egg = 0)
// {
//     $gameQuery = "INSERT INTO game (id_pemain, id_level, death, time_spent, easter_egg) 
//                   VALUES (:id_pemain, :id_level, :death, :time_spent, :easter_egg)";
//     $stmt = $pdo->prepare($gameQuery);
//     $stmt->execute([ 
//         ':id_pemain' => $id_pemain,
//         ':id_level' => $id_level,
//         ':death' => $death,
//         ':time_spent' => $time_spent,
//         ':easter_egg' => $easter_egg
//     ]);

//     refreshLeaderboard($pdo);
// }

// //tarok di punya bintang sekalian waktu insert data ke game table
// function refreshLeaderboard($pdo)
// {
//     $query = "
//         INSERT INTO leaderboard (id_pemain, id_level, least_death, least_time)
//         SELECT id_pemain, id_level, MIN(death) AS least_death, MIN(time_spent) AS least_time
//         FROM game
//         GROUP BY id_pemain, id_level
//         ON CONFLICT (id_pemain, id_level) 
//         DO UPDATE SET 
//             least_death = LEAST(EXCLUDED.least_death, leaderboard.least_death), 
//             least_time = LEAST(EXCLUDED.least_time, leaderboard.least_time);
//     ";
    
//     $stmt = $pdo->prepare($query);
//     $stmt->execute();
// }

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
    return $row;
    
    // $stmt = $pdo->prepare($query);
    // $stmt->execute([':level' => $level]);
    // return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link btn btn-dark <?php echo $i === $level ? 'active' : ''; ?>" id="level<?php echo $i; ?>-tab" data-bs-toggle="pill" data-bs-target="#level<?php echo $i; ?>" type="button" role="tab" aria-controls="level<?php echo $i; ?>" aria-selected="<?php echo $i === $level ? 'true' : 'false'; ?>">Level <?php echo $i; ?></button>
                    </li>
                    <?php endfor; ?>
                </ul>
                <div class="tab-content" id="time-level-tabContent">
                    <?php for ($i = 1; $i <= 4; $i++): ?>
                        <div class="tab-pane fade <?php echo $i === $level ? 'show active' : ''; ?>" id="level<?php echo $i; ?>" role="tabpanel" aria-labelledby="level<?php echo $i; ?>-tab">
                            <h5>Leaderboard for Level <?php echo $i; ?> (Sorted by Least Time)</h5>
                            <?php
                            $results = displayLeaderboard( $i, 'time');
                            if ($results) {
                                foreach ($results as $row) {
                                    echo "Username: " . htmlspecialchars($row['username']) . " | Time: " . htmlspecialchars($row['least_time']) . "<br>";
                                }
                            } else {
                                echo "No data available.";
                            }
                            ?>
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
                                echo "Username: " . htmlspecialchars($row['username']) . " | Deaths: " . htmlspecialchars($row['least_death']) . "<br>";
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
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>