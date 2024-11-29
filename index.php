<?php
require './Signup and Login/verify/functions.php'; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>Pair Play - Login</title>
    <link rel="stylesheet" href="public/registration/index.css">
    <style>
        .advice{
            color: #e0f0ea;
        }
        .btn-logout{
            border: 1px solid black;
            background-color: #95adbe;
            transition: background-color 0.3s ease; 
            box-shadow: 3px 3px 5px black;
        }
        .btn-logout:hover{
            background-color: #728a9d; 
            color: white; 
        }
    </style>
</head>
<body>
    
    <div class="sidebar-content">
    <div class="search-container">
            <form action="search.php" method="GET">
                <div class="input-group">
                    <input type="text" name="keyword" placeholder="input username" class="search-form" required>
                    <button type="submit" class="btn btn-search">Search</button>
                </div>
            </form>
        </div>

        
        <?php if (isset($_GET['keyword'])) : ?>
            <?php 
                $keyword = $_GET['keyword'];
                $keyword = htmlspecialchars($keyword); // Sanitize input
                $arr['username'] = '%' . $keyword . '%';
                $query = "select * from pemain where LOWER(username) LIKE LOWER(:username) ORDER BY username ASC";
                $row = database_run($query, $arr);
                if (is_array($row)) {
                    $row = array_slice($row, 0, 15); // Batasi hasil hingga 15
                }
            ?>
            <div class="result-container">
                <?php if (is_array($row) && count($row) > 0) : ?>
                    <?php foreach ($row as $data) : ?>
                        <div class="result-content">
                            <img src="<?= $data->photo ?>" alt="User Photo">
                            <a href="profile.php?username=<?= $data->username ?>" class="ms-2">
                                <?= $data->username ?>
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <p class="text-danger">Tidak ada hasil ditemukan.</p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
            <button class="back">close</button>
    </div>

    <div class="dark-background"></div>

    
    
    
    


    
    
    
    
    
    

    
    
    
    
<div class="account-container">
    <div class="d-flex justify-content-end">
        <?php if (isset($_SESSION['USER'])): ?>
            <!-- User is logged in -->
            <div class="logged-in-container"> 
                <div class="guest-container d-flex flex-row">
                    <button class="pencarian">
                        <i class="bi bi-search text-light fs-3 m-3"></i>
                    </button>
                    <a href="../public/profilePage/profile.php">
                        <img src="../<?php echo $_SESSION['USER']->photo;?>" alt="User Avatar" class="gambar">
                        <button class="btn btn-guest"><?php echo $_SESSION['USER']->username;?>!</button>
                    </a>
                </div>
            </div>
            <div class="fixed-bottom mb-3 ms-3"> 
                <a href="registration/logout.php" class="btn btn-logout">Logout</a> 
            </div>
            <?php else: ?>
                <div class="guest-container d-flex flex-row">
                    <div class="">
                        <i class="bi bi-search text-light fs-3 m-3 pencarian"></i>
                    </div>
                    <a href="public/registration/login.php">
                        <img src="assets/FrontPage/guest image.svg" alt="User Avatar" class="gambar">
                        <button class="btn btn-guest">Guest</button>
                    </a>
                </div>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="login-container">
            <div class="title">
        <p><strong>Pair Play</strong></p>
    </div>
    
    <?php if (isset($_SESSION["USER"])): ?>
        <!-- Content for logged-in users -->
        <div class="login-form">
            <form action="" method="post">
                
                <div class="d-grid gap-2 col-5 mx-auto mt-2">
                    <a href="selection/selection.html" class="btn btn-login">Play</a>
                </div>
            </form>
        </div>
    <?php else: ?>
        <!-- Content for guests (not logged in) -->
        <div class="text-center">
            <form action="" method="post">
                <div class="d-grid gap-2 col-9 mx-auto">
                    <input type="text" name="username" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Username" minlength="10" value="<?php echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : ''; ?>">
                </div>
                <div class="d-grid gap-2 col-5 mx-auto mt-2">
                    <a href="selection/selection.html" class="btn btn-login">Play</a>
                    <a href="registration/login.php" class="btn btn-login">Login</a>
                    <p class="advice">Save your progress easily by logging in to your account!</p>
                </div>
            </form>
            <!-- <p>You are not logged in. Please <a href="registration/login.php">sign up</a> to play.</p> -->
        </div>
        <?php endif; ?>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="public/registration/index.js"></script>
</body>
</html>
