<?php
    require_once "dbConnector.php";

    $db_connect = new ConnectDatabase();

    $conn = $db_connect->connect();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $str_json = file_get_contents('php://input');
        $json_array = json_decode($str_json);

        if($json_array->request_type == "save"){
            $record_line_coordinates = "";
            $record_line_colors = "";
            $record_line_weights = "";

            ////This is an example regarding how to take a data from json_array. 
            ////In this case, we are taking the line color of the first line.
            // echo $json_array->line_data[0]->line_color;

            $current_username = $json_array->username;
            $current_record_name = $json_array->recordname;

            $initiate = true;

            foreach($json_array->line_data as $index => $current_data){
                if($index === array_keys($json_array->line_data)[0]){
                    $record_line_coordinates .= implode(",", $current_data->line_coordinates);
                    $record_line_colors .= $current_data->line_color;
                    $record_line_weights .=  $current_data->line_weight;
                }else{
                    $record_line_coordinates .= "|" . implode(",", $current_data->line_coordinates);
                    $record_line_colors .= "|" . $current_data->line_color;
                    $record_line_weights .= "|" . $current_data->line_weight;
                }
            }

            $statement = $conn->prepare("INSERT INTO `user_save_record` (`recordID`, `userName`, `recordName`, `lineCoordinates`, `lineColors`, `lineWeights`) VALUES(NULL, '$current_username', '$current_record_name', '$record_line_coordinates', '$record_line_colors', '$record_line_weights')");
            
            if($statement->execute()){
                echo "Data insertion success";
            }else{
                echo "Data insertion failed";
            }
        }
        else if($json_array->request_type == "load"){
            $str_json = file_get_contents("php://input");
            $json_array = json_decode($str_json);

            $statement = $conn->prepare("SELECT * FROM `user_save_record` WHERE `userName` = '$json_array->requested_username' AND `recordName` = '$json_array->requested_recordname'");
            $statement->execute();

            $fetched_data = $statement->fetchAll();

            $send_data = array();

            $arr_line_coordinates = explode("|", $fetched_data[0]["lineCoordinates"]);
            $arr_line_colors = explode("|", $fetched_data[0]["lineColors"]);
            $arr_line_weights = explode("|", $fetched_data[0]["lineWeights"]);

            for($index=0; $index<count($arr_line_coordinates); $index+=1){
                array_push($send_data, merge_item($arr_line_coordinates[$index], $arr_line_colors[$index], $arr_line_weights[$index]));
            }

            echo json_encode($send_data);
        }
        else if($json_array->request_type == "view"){
            $statement = $conn->prepare("SELECT * FROM `user_save_record`");
            $statement->execute();

            $data_send = array(
                "usernames"=>[],
                "recordnames"=>[],
                "numberOfLines"=>[],
                "numberOfColors"=>[],
                "weightVariant"=>[],
            );
            
            $all_row = $statement->fetchAll();

            foreach($all_row as $row){
                array_push($data_send["usernames"], $row["userName"]);
                array_push($data_send["recordnames"], $row["recordName"]);
                array_push($data_send["numberOfLines"], count(explode("|", $row["lineCoordinates"])));
                array_push($data_send["numberOfColors"], count(array_unique(explode("|", $row["lineColors"]))));
                array_push($data_send["weightVariant"], count(array_unique(explode("|", $row["lineWeights"]))));
            }

            $json_string = json_encode($data_send);
            echo $json_string;
        }


    }

    function merge_item($current_coordinates, $current_color, $current_weight){
        $current_coordinates = array_map('intval', explode(",", $current_coordinates));
        $temp = array(
            "line_coordinates"=>$current_coordinates,
            "line_color"=>$current_color,
            "line_weight"=>(int) $current_weight
        );

        return $temp;
    }
?>