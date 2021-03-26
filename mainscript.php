<?php
    require_once "dbConnector.php";
    //We prebuilt the class to connect to the database using PDO method.
    $db_connect = new ConnectDatabase();

    //Creating the connection object.
    $conn = $db_connect->connect();

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        //Get the input from the client.
        $str_json = file_get_contents('php://input');
        $json_array = json_decode($str_json);

        //After decoding them, check the request type. 
        if($json_array->request_type == "save"){
            $record_line_coordinates = "";
            $record_line_colors = "";
            $record_line_weights = "";

            ////This is an example regarding how to take a data from json_array. 
            ////In this case, we are taking the line color of the first line.
            // echo $json_array->line_data[0]->line_color;

            //User definitely submit the user name and the recordname. Grab those elements. 
            $current_username = $json_array->username;
            $current_record_name = $json_array->recordname;

            $initiate = true;

            //Reformating the data. For example, we want the list of lines to be saved as:
            //For the line coordinates: 12,13,20,20|56,77,80,59|70,59,80,80
            //For the line colors: #000000|#ffffff|#2b2b2b
            //For the line weights: 1|5|4
            //The for loop below is used to achieve so. See the formatting. It has to be exactly the same. 
            //See that there is no pipeline operator at the beginning and at the end. All pipeline (which is the current separator)--
            //-- only comes in between.
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

            //Preparing the INSERT query
            $statement = $conn->prepare("INSERT INTO `user_save_record` (`recordID`, `userName`, `recordName`, `lineCoordinates`, `lineColors`, `lineWeights`) VALUES(NULL, '$current_username', '$current_record_name', '$record_line_coordinates', '$record_line_colors', '$record_line_weights')");
            
            //Executing them. If the operation success, tell the user. If not, also tell the user.
            if($statement->execute()){
                echo "Data insertion success";
            }else{
                echo "Data insertion failed";
            }
        }
        else if($json_array->request_type == "load"){
            //Prepare the SELECT query to select the desired record.
            $statement = $conn->prepare("SELECT * FROM `user_save_record` WHERE `userName` = '$json_array->requested_username' AND `recordName` = '$json_array->requested_recordname'");
            $statement->execute();

            if($statement->rowCount() > 0){
                $fetched_data = $statement->fetchAll();

                $send_data = array();

                //After we got the row(there could be only one matching row), we want to format them
                //Break the fetched data into 3 different parts. 
                $arr_line_coordinates = explode("|", $fetched_data[0]["lineCoordinates"]);
                $arr_line_colors = explode("|", $fetched_data[0]["lineColors"]);
                $arr_line_weights = explode("|", $fetched_data[0]["lineWeights"]);

                //Remember, we want to format them as with the format from the client so that it can be drawn in the client side.
                //It needs to be formatted as with the line_data in the client side.
                //We use the pre-build merge_item function to gather up all the data. We merge the data of ONE LINE to become one. 
                //Later on, we will return the array of MERGED LINE DATA.
                for($index=0; $index<count($arr_line_coordinates); $index+=1){
                    array_push($send_data, merge_item($arr_line_coordinates[$index], $arr_line_colors[$index], $arr_line_weights[$index]));
                }

                echo json_encode($send_data);
            }
            else{
                echo "No Data";
            }
        }
        else if($json_array->request_type == "view"){
            //In this case, user wants to see all data. Prepare the SELECT * query.
            $statement = $conn->prepare("SELECT * FROM `user_save_record`");
            $statement->execute();

            //Create a holder for the data.
            $data_send = array(
                "usernames"=>[],
                "recordnames"=>[],
                "numberOfLines"=>[],
                "numberOfColors"=>[],
                "weightVariant"=>[],
            );
            
            $all_row = $statement->fetchAll();

            //For each row, we want to append the respected information to the data holder. 
            foreach($all_row as $row){
                array_push($data_send["usernames"], $row["userName"]);
                array_push($data_send["recordnames"], $row["recordName"]);
                array_push($data_send["numberOfLines"], count(explode("|", $row["lineCoordinates"])));
                array_push($data_send["numberOfColors"], count(array_unique(explode("|", $row["lineColors"]))));
                array_push($data_send["weightVariant"], count(array_unique(explode("|", $row["lineWeights"]))));
            }

            //Encode the data and then send them to the user/client.
            $json_string = json_encode($data_send);
            echo $json_string;
        }


    }

    //The function to merge all ONE LINE's data to become one associative array/hashmap/object
    function merge_item($current_coordinates, $current_color, $current_weight){
        //Currently, all data is in the form of the string. 
        //The coordinates needs to be an array of integer and the line_weight needs to be an integer. 
        //Cast them to their proper form.
        $current_coordinates = array_map('intval', explode(",", $current_coordinates));
        $temp = array(
            "line_coordinates"=>$current_coordinates,
            "line_color"=>$current_color,
            "line_weight"=>(int) $current_weight
        );

        return $temp;
    }
?>