<?php require "../../Signup and Login/verify/functions.php"; ?>

<!DOCTYPE html>
<html>
    <head>
        <title>Pencarian Data</title>
    </head>
    <body>
        <form action="search.php" method="GET">
            <input type="text" name="keyword" placeholder="Masukkan kata kunci">
            <button type="submit">Cari</button>
        </form>
        <div id="result"></div>
        <?php if (isset($_GET['keyword'])) : ?>
            <?php 
             $keyword = $_GET['keyword'];
             $keyword = htmlspecialchars($keyword); // Sanitize input
             $arr['username'] = '%'.$keyword.'%';
         
             $query = "select * from pemain where LOWER(username) LIKE LOWER(:username) ORDER BY username DESC";
             $row = database_run($query, $arr);
            ?>

            <div class='d-flex flex-column'>
                <?php if(is_array($row)) :?>
                 <?php for($i = 0; $i < sizeof($row); $i++) : ?>
                     <?php $data = $row[$i]; ?>
                     <div>
                        <img src="../../<?= $data->photo?>" width="100">
                        <a href="profileGuest.php?username=<?= $data->username?>"><?= $data->username?></a>
                     </div>
                 <?php endfor; ?>
                <?php endif; ?>
            </div>
            
        <?php endif; ?>
</body>
</html>

