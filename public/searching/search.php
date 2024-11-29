<!-- <?php require "../../Signup and Login/verify/functions.php"; ?>

<!DOCTYPE html>
<html>
    <head>
        <title>search</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="search.css">
    </head>
    <body>  
       
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

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
</html> -->