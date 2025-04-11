<?php
    require 'functions.php'; 

    $keyword = $_GET['keyword'];
    $keyword = htmlspecialchars($keyword); // Sanitize input
    $arr['username'] = '%' . $keyword . '%';
    $query = "select * from pemain where LOWER(username) LIKE LOWER(:username) ORDER BY username ASC";
    $row = database_run($query, $arr);
    if (is_array($row)) {
        $row = array_slice($row, 0, 15); // Batasi hasil hingga 15
    }
?>

<?php if (is_array($row) && count($row) > 0) : ?>
    <?php foreach ($row as $data) : ?>
        <a href="public/profilePage/profileGuest.php?username=<?= $data->username ?>" >
            <div class="result-content text-light rounded">
                <img src="<?= $data->photo ?>" alt="User Photo">
                <div class="ms-2">
                    <?= $data->username ?>
                </div>
            </div>
        </a>
     <?php endforeach; ?>
<?php else : ?>
    <!-- <p class="text-danger">Tidak ada hasil ditemukan.</p> -->
<?php endif; ?>