<?php
    require_once "dbConnector.php";

    $db_connect = new ConnectDatabase();

    $conn = $db_connect->connect();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $str_json = file_get_contents('php://input');
        $json_array = json_decode($str_json);
        $record_line_coordinates = "";
        $record_line_colors = "";
        $record_line_weights = "";

        ////This is an example regarding how to take a data from json_array. 
        ////In this case, we are taking the line color of the first line.
        // echo $json_array->line_data[0]->line_color;

        echo $str_json;

        $current_username = $json_array->username;

        foreach($json_array->line_data as $current_data){
            $record_line_coordinates .= implode(",", $current_data->line_coordinates);
            $record_line_coordinates .= "|";
            $record_line_colors .= $current_data->line_color . "|";
            $record_line_weights .= $current_data->line_weight . "|";
        }
    }
?>