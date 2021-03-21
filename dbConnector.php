<?php
    class ConnectDatabase{
        private $conn;

        function __construct(){
            include_once 'constants.php';
        }

        function connect(){
            try{
                $servername = LOC_DBHOST;
                $db_username = LOC_DBUSERNAME;
                $db_name = LOC_DBNAME;
                $db_password = LOC_DBPASSWORD;

                $this->conn = new PDO("mysql:host=$servername;dbname=$db_name", $db_username, $db_password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch(PDOException $e){
                echo "Connection failed: ".$e->getMessage();
            }

            return $this->conn;            
        }
    }
?>