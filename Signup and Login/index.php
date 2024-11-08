<?php
require_once 'config_session.inc.php'; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    </head>
<body>
<div class="account-container">
    <div class="d-flex justify-content-end">
        <?php if (isset($_SESSION['user_id'])): ?>
        <!-- User is logged in -->
            <div class="logged-in-container"> 
                <p>Welcome, 
                    <?php 
                        echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : 'User';
                    ?>!
                </p> 
                <a href="logout.php" class="btn btn-light">Logout</a> 
            </div>
        <?php else: ?>
            <div class="guest-container">
                <a href="signup.php">
                    <img src="/assets/FrontPage/guest image.svg" alt="User Avatar" class="gambar">
                    <button class="btn btn-light">Guest</button>
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>

<div class="login-container">
    <div class="title">
        <p><strong>Pair Play</strong></p>
    </div>
    
    <?php if (isset($_SESSION["user_id"])): ?>
        <!-- Content for logged-in users -->
        <div class="login-form">
            <form action="" method="post">
                <div class="d-grid gap-2 col-9 mx-auto">
                    <input type="text" name="username" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Username" minlength="10" value="<?php echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : ''; ?>">
                </div>
                <div class="d-grid gap-2 col-5 mx-auto mt-2">
                    <a href="selection.html" class="btn btn-login">Play</a>
                </div>
            </form>
        </div>
    <?php else: ?>
        <!-- Content for guests (not logged in) -->
        <div class="text-center">
            <p>You are not logged in. Please <a href="login.php">sign up</a> to play.</p>
        </div>
    <?php endif; ?>

</div>

</body>
</html>
