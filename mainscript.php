<?php
    require_once "dbConnector.php";

    $db_connect = new ConnectDatabase();

    $conn = $db_connect->connect();

    echo "Hello World";
?>