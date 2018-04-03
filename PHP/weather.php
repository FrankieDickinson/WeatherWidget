<?php
ini_set('display_errors', '1');
	/**************************
	 * Add your code to connect to your database 
	
  
  */  
    $servername = "mysql.cms.waikato.ac.nz";
    $username = "afd10";
    $password = "my10859566sql";
    $database = "afd10";

    $con = mysqli_connect($servername, $username, $password);

    if (mysqli_connect_error())
    {
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    /*  
    * 
    * Add code here to query the DB for weather information for the given town
    * 
    * Construct a PHP array object containing the weather data 
    * and return as JSON
    * 
    */
    // Select database
    mysqli_select_db($con, $database);

    // Query which provides information on the town
    $query = "SELECT * FROM weather";
    if ($result = mysqli_query($con, $query)) {
        while ($row = mysqli_fetch_row($result)){
          $resultarray[] = $row; 
        }
        echo json_encode($resultarray);
    }    

    mysqli_close($con);
   
?>

