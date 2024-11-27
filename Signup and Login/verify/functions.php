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
	if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
		$errors[] = "Please enter a valid email";
	}

	if(strlen(trim($data['password'])) < 4){
		$errors[] = "Password must be atleast 4 chars long";
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

	if($_FILES['image-edit']['error'] === 4){
		$photo = $_SESSION['USER']->photo;
	}else{
		$photo = upload();
	}
 
	//check
	if(count($errors) == 0){

		$username = $data['username'];
		$bio = $data['bio'];
		$id = $_SESSION['USER']->id;

		$query = "update pemain set username = '$username', bio = '$bio', photo ='$photo' where id ='$id'";
		$row = database_run($query);

		$query = "select * from pemain where id ='$id'";
		$row = database_run($query);

		if(is_array($row)){
			$row = $row[0];
			$_SESSION['USER'] = $row;
		}
	}
	return $errors;
}

function upload(){
	$errors = array();
	$imageName = $_FILES['image-edit']['name'];
	$imageSize = $_FILES['image-edit']['size'];
	$imageErrors = $_FILES['image-edit']['error'];
	$imageTmpName = $_FILES['image-edit']['tmp_name'];

	if($imageErrors === 4){

	}

	$imageValid = ["jpg", "jpeg", "png"];
	$imageType = explode('.', $imageName);
	$imageType = strtolower(end($imageType));
	if(!in_array($imageType, $imageValid)){
		$errors[] = "caught you";
		return $errors;
	}

	if($imageSize > 10000000){
		$errors[] = "image size is too big";
		return $errors;
	}

	$imageNewName = 'assets/upload/';
	$imageNewName .= uniqid();
	$imageNewName .= '.';
	$imageNewName .= $imageType;

	move_uploaded_file($imageTmpName, '../../'. $imageNewName);
	return $imageNewName;

}

function database_run($query,$vars = array())
{
	$string = "pgsql:host=localhost;port=5432;dbname=pairplay;user=postgres;password=LaboseVirus69;";
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

function death_count($id){
	$query = "SELECT SUM(death) as death FROM game WHERE id_pemain = '$id'";
	$row = database_run($query);

	if(is_array($row)){
		$row = $row[0];
		$_SESSION['DEATH'] = $row;

		return;
	}
	return;
}

function achievement_count($id){
	$_SESSION['ACHIEVEMENT_COUNT'] = 0;

	$query = "SELECT easter_egg FROM game WHERE id_pemain = '$id' AND easter_egg = 1 LIMIT 1";
	$row = database_run($query);

	if(is_array($row)){
		$_SESSION['EASTER_EGG'] = 1;
		$_SESSION['ACHIEVEMENT_COUNT'] ++;
	}

	if(sizeof($_SESSION['progress']) == 4){
		$_SESSION['ACHIEVEMENT_COUNT'] ++;
	}

	if(isset($_SESSION['DEATH'])){
		if($_SESSION['DEATH']->death >= 10) $_SESSION['ACHIEVEMENT_COUNT']++;
		if($_SESSION['DEATH']->death >= 50) $_SESSION['ACHIEVEMENT_COUNT']++;
		if($_SESSION['DEATH']->death >= 100) $_SESSION['ACHIEVEMENT_COUNT']++;
	}
	return;
}

function progress($id){
	$query = "SELECT id_level, min(win_time) as win_time, min(death) as death FROM game WHERE id_pemain = '$id' GROUP BY id_level";
	$row = database_run($query);

	if(is_array($row)){
		$_SESSION['progress'] = $row;
	}else{
		$_SESSION['progress'] = [];
	}
	return;
}

