<?php 

session_start();

function signup($data)
{
	$errors = array();
 
	//validate 
	if(!preg_match('/^[a-zA-Z _]+$/', $data['username'])){
		$errors[] = "Please enter a valid username";
	}

	if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
		$errors[] = "Please enter a valid email";
	}

	if(strlen(trim($data['password'])) < 4){
		$errors[] = "Password must be atleast 4 chars long";
	}

	if($data['password'] != $data['password2']){
		$errors[] = "Passwords must match";
	}

	$check = database_run("select * from pemain where email = :email limit 1",['email'=>$data['email']]);
	if(is_array($check)){
		$errors[] = "That email already exists";
	}
	
	$check = database_run("select * from pemain where username = :username limit 1",['username'=>$data['username']]);
	if(is_array($check)){
		$errors[] = "That username already exists";
	}

	//save
	if(count($errors) == 0){

		$arr['username'] = $data['username'];
		$arr['email'] = $data['email'];
		$arr['password'] = hash('sha256',$data['password']);
		// $arr['date'] = date("Y-m-d H:i:s");

		$query = "insert into pemain (username,email,password) values 
		(:username,:email,:password)";

		database_run($query,$arr);
	}
	return $errors;
}

function login($data)
{
	$errors = array();
 
	//validate 
	if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email";
    }

    if (!isset($data['password']) || strlen(trim($data['password'])) < 4) {
        $errors[] = "Password must be at least 4 chars long";
    }
 
	//check
	if(count($errors) == 0){

		$arr['email'] = $data['email'];
		$password = hash('sha256', $data['password']);

		$query = "select * from pemain where email = :email limit 1";

		$row = database_run($query,$arr);

		if(is_array($row)){
			$row = $row[0];

			if($password === $row->password){
				
				$_SESSION['USER'] = $row;
				$_SESSION['LOGGED_IN'] = true;
			}else{
				$errors[] = "wrong email or password";
			}

		}else{
			$errors[] = "wrong email or password";
		}
	}
	return $errors;
}

function update($data){
	$errors = array();

	if(!preg_match('/^[a-zA-Z _]+$/', $data['username'])){
		$errors[] = "Please enter a valid username";
	}

	$check = database_run("select * from pemain where username = :username limit 1",['username'=>$data['username']]);
	if(is_array($check)){
		$errors[] = "That username already exists";
	}
 
	//check
	if(count($errors) == 0){

		$arr['username'] = $data['username'];
		$id = $_SESSION['USER']->id;
		$arr['bio'] = $data['bio'];

		$query = "update pemain set username = :username, bio = :bio where id ='$id'";
		$row = database_run($query, $arr);

		$query = "select * from pemain where id ='$id'";
		$row = database_run($query);

		if(is_array($row)){
			$row = $row[0];
			$_SESSION['USER'] = $row;
		}
	}
	return $errors;
}

function database_run($query,$vars = array())
{
<<<<<<< Updated upstream
	$string = "pgsql:host=localhost;port=5432;dbname=game;user=postgres;password=eeklalat05;";
=======
	$string = "pgsql:host=localhost;port=5432;dbname=Database_Pemain_PairPlay;user=postgres;password=1Wak_Izul99;";
>>>>>>> Stashed changes
	$con = new PDO($string);

	if(!$con){
		return false;
	}

	$stm = $con->prepare($query);
	$check = $stm->execute($vars);

	if($check){
		
		$data = $stm->fetchAll(PDO::FETCH_OBJ);
		
		if(count($data) > 0){
			return $data;
		}
	}

	return false;
}

function check_login($redirect = true){

	if(isset($_SESSION['USER']) && isset($_SESSION['LOGGED_IN'])){

		return true;
	}

	if($redirect){
		header("Location: login.php");
		die;
	}else{
		return false;
	}
	
}

function check_verified(){

	$id = $_SESSION['USER']->id;
	$query = "select * from pemain where id = '$id' limit 1";
	$row = database_run($query);

	if(is_array($row)){
		$row = $row[0];

		if($row->email == $row->email_verified){

			return true;
		}
	}
 
	return false;
 	
}

function death_count(){
	$id = $_SESSION['USER']->id;
	$query = "select SUM(death) from game where id_pemain = '$id'";
	$row = database_run($query);

	
	if(is_array($row)){
		$row = $row[0];
		$_SESSION['DEATH'] = $row;

		return;
	}
	return;
}

function achievement_count(){
	$_SESSION['ACHIEVEMENT_COUNT'] = 0;
	$id = $_SESSION['USER']->id;

	$query = "select easter_egg from game where id_pemain = '$id' AND easter_egg = 1 LIMIT 1";
	$row = database_run($query);

	if(is_array($row)){
		$row = $row[0];
		$_SESSION['EASTER_EGG'] = $row;
		$_SESSION['ACHIEVEMENT_COUNT'] ++;
	}

	if($_SESSION['USER']->progress == 4){
		$_SESSION['ACHIEVEMENT_COUNT'] ++;
	}

	if(isset($_SESSION['DEATH'])){
		if($_SESSION['DEATH']->sum >= 10) $_SESSION['ACHIEVEMENT_COUNT']++;
		if($_SESSION['DEATH']->sum >= 50) $_SESSION['ACHIEVEMENT_COUNT']++;
		if($_SESSION['DEATH']->sum >= 100) $_SESSION['ACHIEVEMENT_COUNT']++;
	}
	return;
}

function completeGame($id_pemain, $id_level, $death, $time_spent) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO game (id_pemain, id_level, death, time_spent) VALUES (:id_pemain, :id_level, :death, :time_spent)");
    $stmt->execute([
        ':id_pemain' => $id_pemain,
        ':id_level' => $id_level,
        ':death' => $death,
        ':time_spent' => $time_spent
    ]);

    $stmt = $conn->prepare("SELECT * FROM leaderboard WHERE id_pemain = :id_pemain AND id_level = :id_level");
    $stmt->execute([
        ':id_pemain' => $id_pemain,
        ':id_level' => $id_level
    ]);
    
    $leaderboardEntry = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($leaderboardEntry) {
        if ($death < $leaderboardEntry['least_death'] || ($leaderboardEntry['least_death'] == 0 && $death > 0)) {
            $stmt = $conn->prepare("UPDATE leaderboard SET least_death = :least_death, least_time = :least_time WHERE id_pemain = :id_pemain AND id_level = :id_level");
            $stmt->execute([
                ':least_death' => $death,
                ':least_time' => $time_spent,
                ':id_pemain' => $id_pemain,
                ':id_level' => $id_level
            ]);
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO leaderboard (id_pemain, id_level, least_death, least_time) VALUES (:id_pemain, :id_level, :least_death, :least_time)");
        $stmt->execute([
            ':id_pemain' => $id_pemain,
            ':id_level' => $id_level,
            ':least_death' => $death,
            ':least_time' => $time_spent
        ]);
    }
}

function displayLeaderboard($id_level, $orderBy) {
    global $conn;

    $orderColumn = $orderBy === 'death' ? 'least_death' : 'least_time';
    $stmt = $conn->prepare("SELECT p.username, l.least_death, l.least_time 
                             FROM leaderboard l 
                             JOIN pemain p ON l.id_pemain = p.id 
                             WHERE l.id_level = :id_level 
                             ORDER BY l.$orderColumn ASC");
    $stmt->execute([':id_level' => $id_level]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function populateLeaderboardFromGame() {
    global $conn;

    $stmt = $conn->prepare("SELECT id_pemain, id_level, death, time_spent FROM game");
    $stmt->execute();
    $games = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($games as $game) {
        completeGame($game['id_pemain'], $game['id_level'], $game['death'], $game['time_spent']);
    }
}

populateLeaderboardFromGame();

