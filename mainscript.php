<?php
    require_once "dbConnector.php";

    $db_connect = new ConnectDatabase();

    $conn = $db_connect->connect();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $str_json = file_get_contents('php://input');
        $json_array = json_decode($str_json);

        ////This is an example regarding how to take a data from json_array. 
        ////In this case, we are taking the line color of the first line.
        // echo $json_array->line_data[0]->line_color;
    }
?>