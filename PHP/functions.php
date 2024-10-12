<?php 
$host = "localhost";
$dbuser = "postgres";
$dbpass = "1Wak_Izul99";
$dbname = "Database_Pemain_PairPlay";


$conn = pg_connect("host=$host dbname=$dbname user=$dbuser password=$dbpass");

if(!$conn){
    echo "Failed to connect to the database";
}
else{
    echo "Connection success";
}
?>