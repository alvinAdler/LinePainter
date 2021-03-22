<?php
    require_once "dbConnector.php";

    $db_connect = new ConnectDatabase();

    $conn = $db_connect->connect();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
    }
?>